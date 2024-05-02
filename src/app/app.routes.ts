import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './componentes/chat/chat.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {path: '', redirectTo:'chat', pathMatch:'full'},
    {path:'chat', component:ChatComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }