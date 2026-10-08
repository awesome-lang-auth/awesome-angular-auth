import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Server routes.
 *
 * The demo renders its pages on the client. Its pages are behind `authGuard`, and a server
 * render has no session: the server's call to `/api/auth/me` does not carry the browser's
 * cookies. The guard would then send the visitor to the external login page, which it cannot
 * do on the server, so the render would be cancelled and Express would answer 404.
 *
 * - RenderMode.Server = render on each request (fine for public routes, or with an in-app `loginUrl`)
 * - RenderMode.Prerender = static pre-render at build time (causes timeouts on dynamic sites)
 * - RenderMode.Client = serve the app shell and render in the browser
 */
export const serverRoutes: ServerRoute[] = [
    {
        path: '**',
        renderMode: RenderMode.Client
    }
];
