import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { NgModule } from '@angular/core';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
    {path: '', redirectTo:'chat', pathMatch:'full'},
    {path:'chat', component:ChatComponent},
    {path: 'about', component:AboutComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }