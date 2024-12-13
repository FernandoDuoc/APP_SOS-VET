import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MapsService } from './maps.service';

describe('MapsService', () => {
  let servicioMaps: MapsService;
  let controladorHttp: HttpTestingController;

  // Variables de prueba
  const latitud = -33.47880675;
  const longitud = -70.65400975;
  const radioBusqueda = 1000;
  const tipoLugar = 'veterinary_care';
  const direccion = 'Santiago';

  const backendUrl = 'https://maps-backend-ckfe.onrender.com';

  // Inicializar el servicio y el controlador antes de cada prueba
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MapsService],
    });

    servicioMaps = TestBed.inject(MapsService);
    controladorHttp = TestBed.inject(HttpTestingController);
  });

  // Limpiar el controlador después de cada prueba
  afterEach(() => {
    controladorHttp.verify();
  });

  // Verificar que el servicio se haya creado correctamente
  it('debería crear el servicio correctamente', () => {
    expect(servicioMaps).toBeTruthy();
  });

  // Prueba para buscar lugares cercanos
  it('debería realizar una solicitud para buscar lugares cercanos', () => {
    servicioMaps.buscarLugaresCercanos(latitud, longitud, radioBusqueda, tipoLugar).subscribe((respuesta) => {
      expect(respuesta).toBeTruthy();
    });

    const expectedUrl = `${backendUrl}/nearby?latitud=${latitud}&longitud=${longitud}&radio=${radioBusqueda}&tipo=${tipoLugar}`;
    const solicitud = controladorHttp.expectOne(expectedUrl);

    expect(solicitud.request.method).toBe('GET');
    solicitud.flush({ status: 'OK', results: [] });
  });

  // Prueba para manejar errores al buscar lugares cercanos
  it('debería manejar errores al buscar lugares cercanos', () => {
    servicioMaps.buscarLugaresCercanos(latitud, longitud, radioBusqueda, tipoLugar).subscribe({
      next: () => fail('Fallo al manejar el error'),
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toContain('No se pudieron buscar lugares cercanos');
      },
    });

    const expectedUrl = `${backendUrl}/nearby?latitud=${latitud}&longitud=${longitud}&radio=${radioBusqueda}&tipo=${tipoLugar}`;
    const solicitud = controladorHttp.expectOne(expectedUrl);

    expect(solicitud.request.method).toBe('GET');
    solicitud.error(new ErrorEvent('Error del servidor'), { status: 500, statusText: 'Internal Server Error' });
  });

  // Prueba para obtener geolocalización
  it('debería realizar una solicitud para obtener geolocalización', () => {
    servicioMaps.getGeoLocation(direccion).subscribe((respuesta) => {
      expect(respuesta).toBeTruthy();
    });

    const expectedUrl = `${backendUrl}/geocode?address=${encodeURIComponent(direccion)}`;
    const solicitud = controladorHttp.expectOne(expectedUrl);

    expect(solicitud.request.method).toBe('GET');
    solicitud.flush({ status: 'OK', results: [] });
  });

  // Prueba para manejar errores al obtener geolocalización
  it('debería manejar errores al obtener geolocalización', () => {
    servicioMaps.getGeoLocation(direccion).subscribe({
      next: () => fail('Fallo al manejar el error'),
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toContain('No se pudo obtener la geolocalización');
      },
    });

    const expectedUrl = `${backendUrl}/geocode?address=${encodeURIComponent(direccion)}`;
    const solicitud = controladorHttp.expectOne(expectedUrl);

    expect(solicitud.request.method).toBe('GET');
    solicitud.error(new ErrorEvent('Error del servidor'), { status: 500, statusText: 'Internal Server Error' });
  });
});
