import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ObservedValueOf } from 'rxjs';
import { NG_AUTH_OPTIONS } from './auth.config';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withXhr()),
                provideHttpClientTesting(),
                { provide: NG_AUTH_OPTIONS, useValue: { apiPrefix: '/api/auth' } },
                AuthService,
            ]
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('setup2fa()', () => {
        // Derived from the public signature, so a change to the result type reaches this spec.
        type Setup2faResult = ObservedValueOf<ReturnType<AuthService['setup2fa']>>;

        const otpauthUrl = 'otpauth://totp/Demo:user%40example.com?secret=JBSWY3DPEHPK3PXP&issuer=Demo';

        const expectSetupRequest = () => {
            const req = httpMock.expectOne('/api/auth/2fa/setup');
            // The request on the wire is unchanged: an empty JSON body, with credentials.
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({});
            expect(req.request.withCredentials).toBe(true);
            return req;
        };

        it('passes otpauthUrl through when the server sends it without qrCode (issue #7)', () => {
            let result: Setup2faResult | undefined;
            service.setup2fa().subscribe(r => (result = r));

            expectSetupRequest().flush({ secret: 'JBSWY3DPEHPK3PXP', otpauthUrl });

            expect(result).toEqual({ success: true, secret: 'JBSWY3DPEHPK3PXP', otpauthUrl, qrCode: undefined });
            // Typed access: the spec stops compiling if otpauthUrl leaves the result type.
            expect(result?.otpauthUrl).toBe(otpauthUrl);
        });

        it('passes secret, otpauthUrl and qrCode through when the server sends all three', () => {
            let result: Setup2faResult | undefined;
            service.setup2fa().subscribe(r => (result = r));

            expectSetupRequest().flush({ secret: 'JBSWY3DPEHPK3PXP', otpauthUrl, qrCode: 'data:image/png;base64,AAAA' });

            expect(result).toEqual({ success: true, secret: 'JBSWY3DPEHPK3PXP', otpauthUrl, qrCode: 'data:image/png;base64,AAAA' });
        });

        it('maps a server error to success: false', () => {
            let result: Setup2faResult | undefined;
            service.setup2fa().subscribe(r => (result = r));

            expectSetupRequest().flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

            expect(result).toEqual({ success: false, error: 'Unauthorized' });
        });
    });
});
