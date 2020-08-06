import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloD3Component } from './hello-d3/hello-d3.component';
import { ChinaD3Component } from './china-d3/china-d3.component';

@NgModule({
  declarations: [AppComponent, HelloD3Component, ChinaD3Component],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
