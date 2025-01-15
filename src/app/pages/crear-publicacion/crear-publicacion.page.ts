import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PublicacionesService } from '../../services/publicaciones.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-crear-publicacion',
  templateUrl: './crear-publicacion.page.html',
  styleUrls: ['./crear-publicacion.page.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
})

export class CrearPublicacionPage {
  publicacionForm: FormGroup;
  foto: string | null = null;

  constructor(
    private fb: FormBuilder,
    private publicacionesService: PublicacionesService
  ) {
    this.publicacionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  async capturarFoto() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 100,
      });

      this.foto = image.dataUrl || null;
    } catch (error) {
      console.error('Error al capturar foto:', error);
    }
  }

  async guardarPublicacion() {
    if (this.publicacionForm.invalid) {
      console.error('Formulario inválido');
      return;
    }
  
    const nuevaPublicacion = {
      id: 0,
      titulo: this.publicacionForm.get('titulo')?.value || '',
      descripcion: this.publicacionForm.get('descripcion')?.value || '',
      fecha: new Date().toISOString(),
      foto: this.foto || '', // Asegura que foto nunca sea undefined
    };
  
    try {
      await this.publicacionesService.agregarPublicacion(nuevaPublicacion);
      console.log('Publicación agregada:', nuevaPublicacion);
  
      // Reinicia el formulario
      this.publicacionForm.reset();
      this.foto = null;

    } catch (error) {
      console.error('Error al guardar la publicación:', error);
    }
  }
  
}
