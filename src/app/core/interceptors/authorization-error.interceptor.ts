import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ConfigService } from "../services/config-service/config.service";
import { LoggingService } from "../services/logging-service/logging.service";

/**
 * HTTPInterceptor that attaches jwt from authStorage onto outgoing http requests
 */
@Injectable()
export class AuthorizationErrorInterceptor implements HttpInterceptor {
    constructor(private configService: ConfigService, private logger: LoggingService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = request.url;
        if(url === this.configService.authConfig?.issuer) return next.handle(request);
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if([404].indexOf(error.status) !== -1) {
                    const errorMessage = error.error.message || error.statusText;
                    this.logger.logError('Authorization Error', 'AuthorizationErrorInterceptor', errorMessage);
                    //Customize handling of authorization errors here
                }
                return throwError(error);
            })
        );
    }
}