import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { ChatComponent } from './componentes/chat/chat.component';
import { AppRoutingModule } from './app.routes';

@NgModule({
  declarations: [
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,    
    AppRoutingModule
  ],
  providers: [],
})
export class AppModule { }
