import { Plantas, User } from "@prisma/client";

export interface Chofer {
  id: number;
  createdByUserId: number;
  name: string;
  lastName: string;
  celular: number;
  createdAt: Date;
  plantaHabitualId?: number | null;
  plantaHabitual?: Plantas | null;
  createdByUser: User;
}