import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation'; 
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class MapsService {
  private backendUrl = `${environment.backendUrl}/nearby`;
  private backendGeocodeUrl = `${environment.backendUrl}/geocode`;



  constructor(private http: HttpClient) { }

  async solicitarPermisos(): Promise<boolean> {
    const status = await Geolocation.requestPermissions();
    if (status.location === 'granted') {
      console.log('Permiso de ubicación concedido.');
      return true;
    } else {
      console.error('Permiso de ubicación denegado.');
      return false;
    }
  }
  
  
  
  getGeoLocation(address: string): Observable<any> {
    const params = { address }; 
    return this.http.get(this.backendGeocodeUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error al obtener la geolocalización:', error);
        return throwError(() => new Error('No se pudo obtener la geolocalización'));
      })
    );
  }
  
  buscarLugaresCercanos(latitud: number, longitud: number, radio: number, tipo: string): Observable<any> {
    const params = {
      latitud: latitud.toString(),
      longitud: longitud.toString(),
      radio: radio.toString(),
      tipo,
    };
  
    return this.http.get(this.backendUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error al buscar lugares cercanos:', error);
        return throwError(() => new Error('No se pudieron buscar lugares cercanos'));
      })
    );
  }
  
}

