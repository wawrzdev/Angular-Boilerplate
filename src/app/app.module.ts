import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';

//Root
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Core
import { AppInitializerService } from './core/services/app-initializer-service/app-initializer.service';
import { HeaderBarModule } from './core/components/header-bar/header-bar.module';

import { AuthService } from './core/services/auth-service/auth.service';
import { AuthenticationErrorInterceptor } from './core/interceptors/authentication-error.interceptor';
import { AuthorizationErrorInterceptor } from './core/interceptors/authorization-error.interceptor';
import { JwtHttpInterceptor } from './core/interceptors/jwt-http.interceptor';
import { CrossTabAuthStorageFactory } from './core/services/auth-service/cross-tab-auth-storage.service';
import { CommonModule } from '@angular/common';

//Shared


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    //Library Modules
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    MatTabsModule,
    OAuthModule.forRoot(),
    //Core Modules
    HeaderBarModule
    //Shared Modules
  ],
  providers: [
    AuthService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppInitializerService],
      useFactory: (appInitializer: AppInitializerService) => () => appInitializer.synchronizeAppInitializerFactories()
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: JwtHttpInterceptor
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthenticationErrorInterceptor
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthorizationErrorInterceptor
    },
    {
      provide: OAuthStorage,
      useFactory: CrossTabAuthStorageFactory
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
