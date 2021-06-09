import { Component, Input, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { ConfigService } from 'src/app/core/services/config-service/config.service';

type ThemeOptions = 'Dark' | 'Light';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {

  title?: string;
  theme: ThemeOptions = 'Light';
  userCommonName$?: Observable<string>;
  userRoles$?: Observable<string>;

  constructor(private configService: ConfigService, private authService: AuthService, private overlay: OverlayContainer) { }

  ngOnInit(): void {
    this.title = this.configService.appName;
    this.userCommonName$ = this.authService.userCommonName$;
    this.userRoles$ = this.authService.userRoles$;
  }

  /**
   * Toggles the theme between dark and light versions
   */
  toggleTheme(): void {
    this.theme = this.theme === 'Dark' ? 'Light': 'Dark';
    if (this.overlay.getContainerElement().classList.contains("custom-theme")) {
      this.overlay.getContainerElement().classList.remove("custom-theme");
      this.overlay.getContainerElement().classList.add("light-custom-theme");
    } else if (this.overlay.getContainerElement().classList.contains("light-custom-theme")) {
      this.overlay.getContainerElement().classList.remove("light-custom-theme");
      this.overlay.getContainerElement().classList.add("custom-theme");
    } else {
      this.overlay.getContainerElement().classList.add("light-custom-theme");
    }
    if (document.body.classList.contains("custom-theme")) {
      document.body.classList.remove("custom-theme");
      document.body.classList.add("light-custom-theme");
    } else if (document.body.classList.contains("light-custom-theme")) {
      document.body.classList.remove("light-custom-theme");
      document.body.classList.add("custom-theme");
    } else {
      document.body.classList.add("light-custom-theme");
    }
  }

}
