import { TIME_SLOTS } from '../data/initialData';

export const DAYS_SPANISH = [
  { dayOfWeek: 1, name: 'Lunes', short: 'Lun' },
  { dayOfWeek: 2, name: 'Martes', short: 'Mar' },
  { dayOfWeek: 3, name: 'Miércoles', short: 'Mié' },
  { dayOfWeek: 4, name: 'Jueves', short: 'Jue' },
  { dayOfWeek: 5, name: 'Viernes', short: 'Vie' },
];

export function getWeekDays(mondayDate: Date) {
  return DAYS_SPANISH.map((dayInfo, index) => {
    const d = new Date(mondayDate);
    d.setDate(d.getDate() + index);
    const dateStr = d.toISOString().split('T')[0];
    const formattedDay = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    return {
      ...dayInfo,
      date: d,
      dateStr, // YYYY-MM-DD
      formattedDay // DD/MM
    };
  });
}

export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const dayIndex = dateObj.getDay(); // 0 is Sun, 1 is Mon
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return `${dayNames[dayIndex]} ${day}/${month}/${year}`;
}

export function getTimeSlotLabel(slotId: number): string {
  const slot = TIME_SLOTS.find(s => s.id === slotId);
  if (!slot) return `Módulo ${slotId}`;
  return `${slot.label} (${slot.startTime} - ${slot.endTime})`;
}

export function isPastDate(dateStr: string, slotId: number): boolean {
  const today = new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  const slot = TIME_SLOTS.find(s => s.id === slotId);
  const slotEndHour = slot ? parseInt(slot.endTime.split(':')[0]) : 13;
  const slotEndMin = slot ? parseInt(slot.endTime.split(':')[1]) : 10;
  
  const slotDate = new Date(year, month - 1, day, slotEndHour, slotEndMin);
  return slotDate < today;
}
