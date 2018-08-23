import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { AppRoutingModule } from './/app-routing.module';
import { HeaderComponent } from './shared/components/header/header.component';
import { SliderComponent } from './shared/components/slider/slider.component';
import { PlaylistConfigComponent } from './pages/playlist-config/playlist-config.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    HeaderComponent,
    SliderComponent,
    PlaylistConfigComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
