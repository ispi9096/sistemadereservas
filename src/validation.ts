import { ResourceId, Reservation, FixedSchedule } from '../types';
import { INITIAL_RESOURCES, TIME_SLOTS } from '../data/initialData';

export interface ValidationResult {
  isAvailable: boolean;
  message?: string;
  occupantName?: string;
  course?: string;
  subject?: string;
  isFixed?: boolean;
  assignedResourceId?: ResourceId;
}

export function validateResourceAvailability(
  requestedResourceId: ResourceId | 'any_proyector',
  dateStr: string, // YYYY-MM-DD
  dayOfWeek: number, // 1..5
  timeSlotId: number,
  reservations: Reservation[],
  fixedSchedules: FixedSchedule[]
): ValidationResult {
  // 1. Check Fixed Schedules
  const fixedMatch = fixedSchedules.find(f => {
    if (f.dayOfWeek !== dayOfWeek || f.timeSlotId !== timeSlotId) return false;
    if (requestedResourceId === 'any_proyector') {
      return f.resourceId === 'proyector_1' || f.resourceId === 'proyector_2' || f.resourceId === 'any_proyector';
    }
    return f.resourceId === requestedResourceId;
  });

  if (fixedMatch) {
    return {
      isAvailable: false,
      message: `Ocupado por Horario Fijo Curricular: ${fixedMatch.subject} (${fixedMatch.course})`,
      course: fixedMatch.course,
      subject: fixedMatch.subject,
      isFixed: true,
      assignedResourceId: fixedMatch.resourceId === 'any_proyector' ? 'proyector_1' : fixedMatch.resourceId
    };
  }

  // 2. Handle 'any_proyector' category check
  if (requestedResourceId === 'any_proyector') {
    // Check bookings for proyector_1 and proyector_2 on this date & timeSlot
    const p1Booked = isSpecificResourceBooked('proyector_1', dateStr, dayOfWeek, timeSlotId, reservations, fixedSchedules);
    const p2Booked = isSpecificResourceBooked('proyector_2', dateStr, dayOfWeek, timeSlotId, reservations, fixedSchedules);

    if (!p1Booked.isAvailable && !p2Booked.isAvailable) {
      return {
        isAvailable: false,
        message: `⚠️ Ambos proyectores (Proyector 1 y Proyector 2) se encuentran reservados en este módulo.`,
        isFixed: false
      };
    }

    const availableId: ResourceId = p1Booked.isAvailable ? 'proyector_1' : 'proyector_2';
    return {
      isAvailable: true,
      assignedResourceId: availableId,
      message: `Disponible (${p1Booked.isAvailable && p2Booked.isAvailable ? '2/2 proyectores libres' : '1/2 proyector libre'})`
    };
  }

  // 3. Specific Resource Check
  return isSpecificResourceBooked(requestedResourceId, dateStr, dayOfWeek, timeSlotId, reservations, fixedSchedules);
}

function isSpecificResourceBooked(
  resourceId: ResourceId,
  dateStr: string,
  dayOfWeek: number,
  timeSlotId: number,
  reservations: Reservation[],
  fixedSchedules: FixedSchedule[]
): ValidationResult {
  // Check fixed schedules for this specific resource
  const fixed = fixedSchedules.find(f => f.dayOfWeek === dayOfWeek && f.timeSlotId === timeSlotId && (f.resourceId === resourceId || f.resourceId === 'any_proyector'));
  if (fixed) {
    return {
      isAvailable: false,
      message: `🔒 Horario Fijo Curricular: ${fixed.subject} - ${fixed.course}`,
      course: fixed.course,
      subject: fixed.subject,
      isFixed: true,
      assignedResourceId: resourceId
    };
  }

  // Check user reservations
  const existing = reservations.find(r => r.resourceId === resourceId && r.date === dateStr && r.timeSlotId === timeSlotId);
  if (existing) {
    const resourceName = INITIAL_RESOURCES.find(res => res.id === resourceId)?.name || resourceId;
    return {
      isAvailable: false,
      message: `⚠️ ${resourceName} ya reservado para ${existing.subject} (${existing.course})`,
      course: existing.course,
      subject: existing.subject,
      isFixed: false,
      assignedResourceId: resourceId
    };
  }

  return {
    isAvailable: true,
    assignedResourceId: resourceId,
    message: 'Disponible para reserva'
  };
}

export function getProjectorsAvailabilityCount(
  dateStr: string,
  dayOfWeek: number,
  timeSlotId: number,
  reservations: Reservation[],
  fixedSchedules: FixedSchedule[]
): { total: number; availableCount: number; p1Available: boolean; p2Available: boolean } {
  const p1 = isSpecificResourceBooked('proyector_1', dateStr, dayOfWeek, timeSlotId, reservations, fixedSchedules);
  const p2 = isSpecificResourceBooked('proyector_2', dateStr, dayOfWeek, timeSlotId, reservations, fixedSchedules);

  let availableCount = 0;
  if (p1.isAvailable) availableCount++;
  if (p2.isAvailable) availableCount++;

  return {
    total: 2,
    availableCount,
    p1Available: p1.isAvailable,
    p2Available: p2.isAvailable
  };
}
