import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'',
    redirectTo: 'start',
    pathMatch: 'full'
  },
  {
      path: 'start',
      loadChildren: ()=> import('./components/start-screen/start-screen.module').then(
        m => m.StartScreenModule
      )
  },
  {
    path: 'main',
    loadChildren: ()=> import('./components/main-screen/main-screen.module').then(
      m => m.MainScreenModule
    )
},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
