import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSpinner, IonList, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { MapsService } from '../services/maps.service';
import { CommonModule } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonIcon, IonList, IonSpinner, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule],
})
export class Tab1Page implements OnInit {

  cargando = false; 
  veterinariasCercanas: any[] = []; 
  latitud: number = 0;
  longitud: number = 0;
  radio = 2000; 
  tipo = 'veterinary_care';


  constructor(private mapsService: MapsService) {}

  async obtenerUbicacionActual() {
    this.cargando = true;
    try {
      const permisoConcedido = await this.mapsService.solicitarPermisos();
      if (!permisoConcedido) {
        console.error('Permiso de ubicación denegado.');
        this.cargando = false;
        return;
      }
      const coordenadas = await Geolocation.getCurrentPosition();
      this.latitud = coordenadas.coords.latitude;
      this.longitud = coordenadas.coords.longitude;
      console.log('Ubicación actual:', this.latitud, this.longitud);
      this.buscarVeterinariasCercanas();
    } catch (error) {
      console.error('Error al obtener la ubicación actual:', error);
      this.cargando = false;
    }
  }
  

  buscarVeterinariasCercanas() {
    console.log('Buscando veterinarias cercanas con coordenadas:', this.latitud, this.longitud);
    this.mapsService.buscarLugaresCercanos(this.latitud, this.longitud, this.radio, this.tipo).subscribe(
      (respuesta) => {
        if (respuesta.status === 'OK') {
          this.veterinariasCercanas = respuesta.results.map((veterinaria: any) => {
            const distancia = this.calcularDistancia(
              this.latitud,
              this.longitud,
              veterinaria.geometry.location.lat,
              veterinaria.geometry.location.lng
            );
            console.log(`Distancia calculada para ${veterinaria.name}: ${distancia}`);
            return { ...veterinaria, distancia };
          });
        } else {
          console.error('La API devolvió un estado inesperado:', respuesta.status, respuesta.error_message);
        }
        this.cargando = false;
      },
      (error) => {
        console.error('Error al buscar veterinarias cercanas:', error);
        this.cargando = false;
      }
    );
  }
  

  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): string {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.gradosARadianes(lat2 - lat1);
    const dLon = this.gradosARadianes(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.gradosARadianes(lat1)) * Math.cos(this.gradosARadianes(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanciaKm = R * c; // Distancia en kilómetros
    const distanciaMetros = distanciaKm * 1000; // Convertir a metros
  
    // Mostrar en metros si la distancia es menor a 1 km
    if (distanciaMetros < 1000) {
      return distanciaMetros.toFixed(0) + ' m'; // Redondea a metros enteros
    } else {
      return distanciaKm.toFixed(2) + ' km'; // Redondea a 2 decimales
    }
  }
  

  gradosARadianes(grados: number): number {
    return (grados * Math.PI) / 180;
  }
  

  abrirGoogleMaps(lat: number, lng: number): void {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank'); 
  }

  ngOnInit(): void {
    console.log('Componente inicializado. Listo para buscar ubicaciones.');
    this.obtenerUbicacionActual();
  }
}
