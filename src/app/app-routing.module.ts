import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelloD3Component } from './hello-d3/hello-d3.component';
import { ChinaD3Component } from './china-d3/china-d3.component';
import { SliderComponent } from './slider/slider.component';

const routes: Routes = [
  {
    path: 'hello',
    component: HelloD3Component,
  },
  {
    path: 'map',
    component: ChinaD3Component,
  },
  {
    path: 'slider',
    component: SliderComponent,
  },
  {
    path: '',
    redirectTo: '/hello',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
