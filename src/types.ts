export type ResourceId = 'proyector_1' | 'proyector_2' | 'sala_robotica' | 'sala_computacion';

export type ResourceCategory = 'proyector' | 'sala';

export interface Resource {
  id: ResourceId;
  category: ResourceCategory;
  name: string;
  code: string;
  description: string;
  location: string;
  capacity: number;
  icon: string;
  features: string[];
}

export interface TimeSlot {
  id: number;
  label: string; // e.g. "Módulo 1"
  startTime: string; // "07:30"
  endTime: string; // "08:10"
  isBreak?: boolean;
}

export interface FixedSchedule {
  id: string;
  resourceId: ResourceId | 'any_proyector';
  dayOfWeek: number; // 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes
  timeSlotId: number;
  subject: string; // e.g. "Tecnología"
  course: string; // e.g. "1º Año A"
  notes?: string;
}

export interface Reservation {
  id: string;
  resourceId: ResourceId;
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 1..5
  timeSlotId: number;
  subject: string; // Primary identifier: e.g., "Tecnología", "Robótica", "Matemática"
  course: string; // Primary identifier: e.g., "1º Año A", "3º Año"
  createdAt: string;
  notes?: string;
  isFixed?: boolean;
}

export type ViewMode = 'wizard' | 'weekly' | 'daily' | 'my_reservations' | 'fixed_schedules';
