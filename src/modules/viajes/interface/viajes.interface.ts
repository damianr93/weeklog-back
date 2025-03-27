import { Destino } from "src/modules/destinos/interface/destino.interface";
import { User } from "src/modules/users/interface/users.interface";

export interface Viajes {
  id: number;
  
  created_by: number; 

  planta:number

  fechaCarga: Date; 

  horaCarga: Date; 

  choferId: number; 

  destinoId: number; 

  kmRealesRecorridos: number; 

  tiempoEstimadoCarga: number; 

  horaDescarga: Date; 

  horaRetorno: Date; 

  observaciones: string; 

  createdAt: Date; 

  createdByUser: User; 

  Destino: Destino; 
}
