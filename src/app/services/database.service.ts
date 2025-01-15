import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private isReady = new BehaviorSubject(false);

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async iniciarPlugin(): Promise<void> {
    try {
      const isAvailable = await this.sqlite.isConnection('comunidadApp', false);
      if (!isAvailable) {
        throw new Error('SQLite no está disponible en esta plataforma.');
      }

      // Crear conexión con la base de datos
      this.db = await this.sqlite.createConnection('comunidadApp', false, 'no-encryption', 1, false);
      if (this.db) {
        // Abrir la base de datos y crear las tablas necesarias
        await this.db.open();
        await this.crearTablas();
        this.isReady.next(true);
      }
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }


  private async crearTablas() {
    const query = `
      CREATE TABLE IF NOT EXISTS publicaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        fecha TEXT NOT NULL,
        foto TEXT
      );
    `;

    try {
      if (this.db) {
        await this.db.execute(query);
      }
    } catch (error) {
      console.error('Error al crear tablas:', error);
    }
  }


  async agregarPublicacion(titulo: string, descripcion: string, fecha: string, foto: string | null) {
    const query = `
      INSERT INTO publicaciones (titulo, descripcion, fecha, foto) VALUES (?, ?, ?, ?);
    `;
    const values = [titulo, descripcion, fecha, foto || ''];

    try {
      if (this.db) {
        await this.db.run(query, values);
      }
    } catch (error) {
      console.error('Error al agregar publicación:', error);
    }
  }


  async obtenerPublicaciones(): Promise<any[]> {
    const query = `
      SELECT * FROM publicaciones ORDER BY fecha DESC;
    `;

    try {
      if (this.db) {
        const res = await this.db.query(query);
        return res.values || [];
      }
      return [];
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
      return [];
    }
  }

  
  async eliminarPublicacion(id: number) {
    const query = `
      DELETE FROM publicaciones WHERE id = ?;
    `;

    try {
      if (this.db) {
        await this.db.run(query, [id]);
      }
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
    }
  }

  async cerrarConexion() {
    try {
      if (this.db) {
        await this.sqlite.closeConnection('comunidadApp', false);
        this.db = null;
      }
    } catch (error) {
      console.error('Error al cerrar la conexión:', error);
    }
  }
}
