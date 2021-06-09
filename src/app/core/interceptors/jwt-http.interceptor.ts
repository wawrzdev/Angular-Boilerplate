import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OAuthStorage } from "angular-oauth2-oidc";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth-service/auth.service";

/**
 * HTTPInterceptor that attaches jwt from authStorage onto outgoing http requests
 */
@Injectable()
export class JwtHttpInterceptor implements HttpInterceptor {
    constructor(private authStorage: OAuthStorage, private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = request.url.toLowerCase();
        if(!this.authService.enabled) return next.handle(request);
        if(!this.checkUrl(url)) return next.handle(request);
        const accessToken = this.authStorage.getItem('access_token');
        if(accessToken) {
            const authorizationHeader = `Bearer ${accessToken}`;
            const headers = request.headers.set('Authorization', authorizationHeader)
            request = request.clone({headers});
        }
        return next.handle(request);
    }

    /**
     * Checks whether the outgoing req url is contained in the allowed urls for auth config
     * @param url 
     */
    private checkUrl(url: string): boolean {
        return this.authService.allowedUrls?.includes(url) ?? false;
    }
}