export interface SolicitudResponseDto {
    idSolicitud: number;
    fecha: string;
    archivo: string;
    comentarios: string;
    curriculum: string;
    estado: number; // 0 o 1
    vacanteId: number;
    vacanteNombre: string;
    emailUsuario: string;
    nombreUsuario: string;
    nombreVacante: string;
    nombreEmpresa: string;
  }