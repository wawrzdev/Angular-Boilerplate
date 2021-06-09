import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth-service/auth.service";
import { ConfigService } from "../services/config-service/config.service";
import { LoggingService } from "../services/logging-service/logging.service";

/**
 * HTTPInterceptor that attaches jwt from authStorage onto outgoing http requests
 */
@Injectable()
export class AuthenticationErrorInterceptor implements HttpInterceptor {
    constructor(private injector: Injector, private configService: ConfigService, private logger: LoggingService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = request.url;
        if(url === this.configService.authConfig?.issuer) return next.handle(request);
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if([401].indexOf(error.status) !== -1) {
                    const authService = this.injector.get(AuthService);
                    const errorMessage = error.error.message || error.statusText;
                    this.logger.logError('Authentication Error', 'AuthenticationErrorInterceptor', errorMessage);
                    authService.logout();
                }
                return throwError(error);
            })
        );
    }
}