import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth-service/auth.service";
import { LoggingService } from "../services/logging-service/logging.service";

/**
 * Customize your implementation of the default route guard, you can force redirect to identity provider, or 
 * change the default route based on user role, or do something else entirely...
 */
@Injectable() 
export class DefaultRouteGuard implements CanActivate {
    constructor(private router: Router, private loggingService: LoggingService, private authService: AuthService) {}

    /**
     * Customize your implementation of the default route guard, you can force redirect to identity provider, or 
     * change the default route based on user role, or do something else entirely...
     * @returns Observable<boolean> | Promise<boolean> | boolean
     */
    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        this.router.navigate(['sample']);
        return true;
    }
}