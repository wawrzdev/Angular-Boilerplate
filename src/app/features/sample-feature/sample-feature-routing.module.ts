import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SampleFeatureComponent } from './sample-feature.component';

const routes: Routes = [{ path: '', component: SampleFeatureComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleFeatureRoutingModule { }
