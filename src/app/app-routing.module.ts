import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PublicacionesPage } from './pages/publicaciones/publicaciones.page';
import { CrearPublicacionPage } from './pages/crear-publicacion/crear-publicacion.page';

const routes: Routes = [
  { path: '', redirectTo: 'publicaciones', pathMatch: 'full' },
  { path: 'publicaciones', component: PublicacionesPage },
  { path: 'crear-publicacion', component: CrearPublicacionPage },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
