import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import {catchError} from 'rxjs/operators';

import { environment } from './../../../../environments/environment';
import { AppConfigModel } from './app-config.model';
import { LogLevel } from '../logging-service/log-level.model';
import { AuthConfigModel } from './auth-config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private appConfig: AppConfigModel | undefined;
  private release = environment.production ? 'production' : 'development';

  constructor(private httpBackend: HttpBackend) { }

  /**
   * Loads the config file from assets based on the environment
   * @throws HTTP Error Message
   * @returns Observable<ConfigModel> | Promise<ConfigModel | void> | ConfigModel
   */
  loadConfig(): Promise<void | AppConfigModel>{
    //Using httpBackend circumvents any http interceptors
    const httpClient = new HttpClient(this.httpBackend);
    return httpClient.get<AppConfigModel>(`/assets/config/app-config.${this.release}.json`)
    .pipe(
      catchError( err => {
        const errorMsg = err.error instanceof ErrorEvent ? err.error.message : err.message;
        console.error('[ConfigService]', errorMsg);
        throw new Error(errorMsg)
      })
    )
    //APP_INITIALIZER Expects a promise to be returned and will wait to bootstrap the rest of the app until it resolves
    .toPromise()
    .then(res => {
      this.appConfig = <AppConfigModel>res;
      if(!environment.production) console.warn('[ConfigService] Config File Loaded Successfully', this.appConfig);
    });
  }
  
  /**
   * Gets the logLevel set by the configuration 
   * @returns LogLevel of the config service, or LogLevel.None if config file does not define log level
   */
  get logLevel(): LogLevel {
    return this.appConfig?.logLevel ?? LogLevel.None; 
  }

  /**
   * Gets the appName set by the configuration
   * @returns AppName of the config service, or empty string if config file does not define an app name
   */
  get appName(): string {
    return this.appConfig?.appName ?? ""; 
  }

  /**
   * Gets the appVersion set by the configuration
   * @returns AppVersion of the config service, or empty string if config file does not define an app version
   */
  get appVersion(): string {
    return this.appConfig?.appVersion ?? "";
  }

  /**
   * Gets the apiUrl set by the configuration
   * @returns ApiUrl/ApiVersion of the config service, or localhost:8080/v1 if configuration does not define an api url or an api version
   */
  get apiUrl(): string {
    return `${this.appConfig?.apiUrl ?? "localhost:8080"}/${this.appConfig?.apiVersion ?? "v1"}`; 
  }

  /**
   * Gets the authorization configuration set by the configuration 
   * @returns AuthConfigModel set by config
   */
  get authConfig(): AuthConfigModel | undefined {
    return this.appConfig?.authConfig ?? undefined;
  }

}
