import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'',
    redirectTo: 'start',
    pathMatch: 'full'
  },
  {
      path: 'start',
      loadComponent: ()=> import('./components/start-screen/start-screen.component').then(
        m => m.StartScreenComponent
      )
  },
  {
    path: 'main',
    loadComponent: ()=> import('./components/main-screen/main-screen.component').then(
      m => m.MainScreenComponent
    )
},

];
