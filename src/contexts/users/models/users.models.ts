export interface User {
  id: string; // UUID para identificar cada usuario
  channelId: string; // ID único del canal de streaming
  createdAt?: string; // Fecha de registro del usuario
  updatedAt?: string; // Última actualización de datos
}
