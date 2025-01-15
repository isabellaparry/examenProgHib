import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { PublicacionesService, Publicacion } from '../../services/publicaciones.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.page.html',
  styleUrls: ['./publicaciones.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})

export class PublicacionesPage implements OnInit {
  publicaciones$ = this.publicacionesService.publicaciones$;

  constructor(
    private publicacionesService: PublicacionesService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.publicacionesService.cargarPublicaciones();
  }

  async confirmarEliminacion(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta publicación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.publicacionesService.eliminarPublicacion(id);
          },
        },
      ],
    });

    await alert.present();
  }
}
