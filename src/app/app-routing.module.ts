import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DefaultRouteGuard } from './core/guards/default-route.guard';

const routes: Routes = [
  { path: '', component: AppComponent, canActivate: [DefaultRouteGuard]},
  { path: 'sample', loadChildren: () => import('./features/sample-feature/sample-feature.module').then(m => m.SampleFeatureModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    DefaultRouteGuard
  ]
})
export class AppRoutingModule { }
