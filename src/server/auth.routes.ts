import { Router } from 'express';
import {
  createAuthMiddleware,
  AuthEventBus,
  AuthTools,
  createToolsRouter,
  SseManager,
  WebhookSender,
} from 'awesome-node-auth';
import {
  authConfigurator,
  authConfig,
  userStore,
  settingsStore,
  rbacStore,
  metadataStore,
  sessionStore,
  apiKeyStore,
  webhookStore,
  telemetryStore,
  linkedAccountsStore,
  googleStrategy,
  uploadDir,
} from './auth.config';

const router = Router();



// ---- 1. Event system setup ----
const bus = new AuthEventBus();

// ---- 2. Tools (SSE, Webhooks, Telemetry, Notifications) ----
const authTools = new AuthTools(bus, {
  telemetryStore,
  webhookStore,
  sse: true,
  sseOptions: {
    heartbeatIntervalMs: 30000,
    deduplicate: true,
  },
  userStore,
  emailConfig: authConfig.email?.mailer,
});

// Note: AuthTools doesn't have a listen() method in this version.
// It process events when track() is called.
// If your library version had listen(), it's likely removed or replaced by constructor logic.

// ---- 3. Middleware for validating auth tokens ----
const authMiddleware = createAuthMiddleware(authConfig);

// ---- 4. Mount the main auth router ----
// This exposes: /login, /register, /logout, /refresh, /reset-password, /verify-email, etc.
// Now includes session and RBAC stores.
router.use(
  '/',
  authConfigurator.router({
    settingsStore,
    rbacStore,
    metadataStore,
    sessionStore,
    linkedAccountsStore,
    googleStrategy,
    uploadDir,
    // Router events (login, logout, registration, 2FA, password and email changes, ...)
    // are published on the demo's event bus. Nothing subscribes to them yet: attach a
    // listener with bus.onEvent('*', ...) to act on them. Do not call authTools.track()
    // from a '*' listener: track() publishes on this same bus and would loop.
    eventBus: bus,
    // Built-in POST /register (awesome-node-auth >= 1.10): it requires email and password,
    // answers 409 for a taken email, hashes the password and stores only email, the hash,
    // firstName and lastName. Any other field of the request body is dropped.
    defaultRegister: true,
  }),
);

// ---- 5. Mount the tools router at /tools (relative to /api/auth) ----
// Exposes: POST /tools/track/:event, GET /tools/telemetry, GET /tools/stream (SSE), etc.
router.use(
  '/tools',
  createToolsRouter(authTools, {
    authMiddleware,
    telemetryStore, // Required for GET /tools/telemetry
  }),
);

// ---- Custom endpoint: PATCH /profile ----
// Update user metadata (name, metadata, etc.)
router.patch('/profile', authMiddleware, async (req: any, res) => {
  try {
    const { firstName, lastName } = req.body;
    const userId = req.user.sub;

    const user = await userStore.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Update user fields (implement as needed)
    if (firstName) (user as any).firstName = firstName;
    if (lastName) (user as any).lastName = lastName;

    res.json({ success: true, user });
  } catch (err) {
    console.error('[AUTH] Profile update failed:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
