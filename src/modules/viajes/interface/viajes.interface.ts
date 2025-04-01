import { Destino } from "src/modules/destinos/interface/destino.interface";
import { User } from "src/modules/users/interface/users.interface";

export interface Viajes {
  id: number;
  createdByUserId: number; 
  plantaId: number;
  horarioRetiroId:number
  choferId: number; 
  destinoId: number; 
  kmRealesRecorridos?: number; 
  tiempoEstimadoCarga?: number; 
  horaDescarga?: string; 
  horaRetorno?: string; 
  observaciones?: string; 
  createdAt: Date; 
  createdByUser: User; 
  destino: Destino; 
}