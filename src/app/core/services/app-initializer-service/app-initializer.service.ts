import { Injectable } from '@angular/core';
import { AuthService } from '../auth-service/auth.service';
import { ConfigService } from '../config-service/config.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  constructor(private configService: ConfigService, private authService: AuthService) { }

  /**
   * Synchronizes app initializer factories to load configuration and then load authorization information
   */
  synchronizeAppInitializerFactories() {
    return (this.configService.loadConfig()).then(() => this.authService.loadAuthService())
  }

}
