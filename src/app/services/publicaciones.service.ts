import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database.service';

export interface Publicacion {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  foto?: string | null; // Ahora acepta undefined y null
}


@Injectable({
  providedIn: 'root',
})
export class PublicacionesService {
  private publicaciones = new BehaviorSubject<Publicacion[]>([]);
  publicaciones$ = this.publicaciones.asObservable();

  constructor(private dbService: DatabaseService) {}


  async cargarPublicaciones(): Promise<void> {
    try {
      const publicaciones = await this.dbService.obtenerPublicaciones();
      this.publicaciones.next(publicaciones);
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
    }
  }


  async agregarPublicacion(publicacion: Publicacion): Promise<void> {
    try {
      await this.dbService.agregarPublicacion(
        publicacion.titulo,
        publicacion.descripcion,
        publicacion.fecha,
        publicacion.foto ?? '' // Si foto es undefined, usa una cadena vacía
      );
      await this.cargarPublicaciones(); // Actualiza la lista de publicaciones
    } catch (error) {
      console.error('Error al agregar publicación:', error);
    }
  }
  


  async eliminarPublicacion(id: number): Promise<void> {
    try {
      await this.dbService.eliminarPublicacion(id);
      await this.cargarPublicaciones(); // Actualiza la lista de publicaciones
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
    }
  }


  async obtenerPublicacionPorId(id: number): Promise<Publicacion | null> {
    try {
      const publicaciones = await this.dbService.obtenerPublicaciones();
      return publicaciones.find((pub) => pub.id === id) || null;
    } catch (error) {
      console.error('Error al obtener publicación por ID:', error);
      return null;
    }
  }
}
