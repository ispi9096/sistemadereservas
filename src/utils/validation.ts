import { Reservation } from '../types';

export const validateResourceAvailability = (
  resourceId: string,
  date: string,
  slotId: number,
  existingReservations: Reservation[]
): { isAvailable: boolean; conflict?: Reservation } => {
  const conflict = existingReservations.find(
    (res) =>
      res.resourceId === resourceId &&
      res.date === date &&
      res.slotId === slotId
  );

  return {
    isAvailable: !conflict,
    conflict
  };
};

export const getProjectorsAvailabilityCount = (
  date: string,
  slotId: number,
  existingReservations: Reservation[],
  totalProjectors: number = 2
): number => {
  const projectorIds = ['PROY-01', 'PROY-02'];
  
  const reservedProjectorsCount = existingReservations.filter(
    (res) =>
      projectorIds.includes(res.resourceId) &&
      res.date === date &&
      res.slotId === slotId
  ).length;

  return Math.max(0, totalProjectors - reservedProjectorsCount);
};
