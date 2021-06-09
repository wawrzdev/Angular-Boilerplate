import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, NullValidationHandler, OAuthErrorEvent, OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, combineLatest, identity, Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ConfigService } from '../config-service/config.service';
import { LoggingService } from '../logging-service/logging.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authConfig: AuthConfig = {
    issuer: this.configService.authConfig?.issuer,
    clientId: this.configService.authConfig?.clientId,
    resource: this.configService.authConfig?.resource,
    responseType: 'code',
    scope: 'openid profile',
    redirectUri: window.location.origin + window.location.pathname,
    postLogoutRedirectUri: this.configService.authConfig?.postLogoutUri ?? window.location.origin
  }; 
  private _enabled = this.configService.authConfig?.enabled;
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  private isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
  private userCommonNameSubject$ = new Subject<string>();
  private usernameSubject$ = new Subject<string>();
  private userRoleSubject$ = new Subject<string[]>();

  /**ReadOnly Observable tracking whether or not valid user is authenticated */
  get isAuthenticated$(): Observable<boolean> { return this.isAuthenticatedSubject$.asObservable(); }
  
  /**ReadOnly Observable tracking whether or not login flow has been completed */
  get isDoneLoading$(): Observable<boolean> { return this.isDoneLoadingSubject$.asObservable(); }

  /**ReadOnly Observable tracking whether login flow has been completed and a valid user is authenticated */
  get canActivateProtectedRoute$(): Observable<boolean> { 
    return combineLatest([this.isAuthenticated$, this.isDoneLoading$]).pipe(
      map((values: boolean[]) => values.every(b=>b))
    );
  }

  /**ReadOnly Observable containing the currently authenticated users common name */
  get userCommonName$(): Observable<string> { return this.userCommonNameSubject$.asObservable(); }

  /**ReadOnly Observable containing the currently authenticated users username */
  get username$(): Observable<string> { return this.usernameSubject$.asObservable(); }
  
  /**ReadOnly Observable containing the currently authenticated users roles, sorted and concatonated */
  get userRoles$(): Observable<string> { 
    return this.userRoleSubject$.asObservable().pipe(
      map((roles:string[]) => {
        roles.sort();
        return roles.join(', ');
      })
    );
  }

  /**ReadOnly string array containing the configured urls that will have jwt attached */
  get allowedUrls(): string[] | undefined { return this.configService.authConfig?.allowedUrls; }

  get enabled(): boolean { return this._enabled ?? false };


  constructor(private oauthService: OAuthService, 
              private configService: ConfigService,
              private logger: LoggingService,
              private router: Router) { 
    if(this.enabled) {
      this.configureAndLogin();
    } else {
      this.logger.logWarning('Authentication and Authorization is disabled', 'Auth Service');
    }
  }

  private configureAndLogin(): void {
    //Subscribe to OAuth Library Error Events
    this.oauthService.events.pipe(
      filter(event => event instanceof OAuthErrorEvent) 
    ).subscribe(event => {
      this.logger.logError(`OAuthErrorEvent: ${(event as OAuthErrorEvent).reason}`, 'Auth Service', event)
    });

    //Subsciribe to events and check for access token
    this.oauthService.events.subscribe((event: OAuthEvent) => {
      this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());
    })

    //Subscribe to token received events and set identity information
    this.oauthService.events.pipe(
      filter(event => ['token_received'].includes(event.type))
    ).subscribe(event => {
      this.getAndSetIdentityClaims();
    })

    //Subscribe to session termination or error events
    this.oauthService.events.pipe(
      filter(event => ['session_terminated', 'session_error'].includes(event.type))
    ).subscribe(event => {
      this.logger.logError('OAuthError: Session Error', 'Auth Service', event);
    })

    //Configuration
    this.oauthService.configure(this.authConfig);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.setupAutomaticSilentRefresh();

    //Begin Login Flow
    this.oauthService.loadDiscoveryDocumentAndTryLogin()
    .then(() => {
      if(!this.oauthService.hasValidAccessToken()) {
        //Remove this if you do not want to automatically login users
        this.oauthService.initLoginFlow();
      } else {
        this.getAndSetIdentityClaims();
      }
    })
    .then(() => this.isDoneLoadingSubject$.next(true));

  }

  /**
   * Add your correct object keys defined by your identity provider here
   */
  private getAndSetIdentityClaims() {
    const identityClaims: object = this.oauthService.getIdentityClaims();
    // this.userRoleSubject$.next(identityClaims?['realm_access']?['roles']?? undefined);
    // this.userCommonNameSubject$.next(identityClaims?['name'] ?? undefined);
    // this.usernameSubject$.next(identityClaims?['preferred_username'] ?? undefined);
  }

  /**
   * An optional factory function for Auth Service to be loaded with the app initializer
   */
  public loadAuthService(): Observable<any> | Promise<void|any> | any {
    if(this.enabled) {
      this.configureAndLogin();
    } else {
      this.logger.logWarning('Authentication and Authorization is disabled', 'Auth Service');
    }
    return null;
  }

  /**
   * Initiates OAuth2.0/OIDC PCKE flow configured with config file
   * @param targetUrl Optional Url state to pass into login flow, defaults to current router url
   */
  login(targetUrl?: string): void {
    if(this.enabled) {
      this.oauthService.initLoginFlow(targetUrl || this.router.url);
    } else {
      this.logger.logWarning('Authentication and Authorization is disabled', 'Auth Service');
    }
  }

  /**
   * Initiates OAuth2.0/OIDC Logout
   */
  logout(): void {
    if(this.enabled) {
      this.oauthService.logOut();
    } else {
      this.logger.logWarning('Authentication and Authorization is disabled', 'Auth Service');
    }
  }

  /**
   * Initiates OAuth2.0/OIDC Silent Refresh manually
   */
  refresh(): void {
    if(this.enabled) {
      this.oauthService.silentRefresh()
      .then(info => this.logger.logVerbose('Auth Service Token Refreshed', 'Auth Service', info))
      .catch(error => this.logger.logError('Auth Service Token Refresh Error', 'Auth Service', error));
    } else {
      this.logger.logWarning('Authentication and Authorization is disabled', 'Auth Service');
    }
  }

  /**
   * Add your permission logic for RBAC controls here, else if not using RBAC, 
   * implement your controls elsewhere in the Auth Service
   * @returns boolean
   */
  hasPermission(): boolean {
    /*Add your permission logic for RBAC controls here, else if not using RBAC Controls, 
    **implement your scope based controls elsewhere
    */
    return true;
  }

}
