export const DAYS_SPANISH = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes'
];

export const getMondayOfCurrentWeek = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export const getWeekDays = (baseDate: Date = new Date()): { date: string; dayName: string; formattedDate: string }[] => {
  const monday = getMondayOfCurrentWeek(baseDate);
  const days = [];

  for (let i = 0; i < 5; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    days.push({
      date: dateStr,
      dayName: DAYS_SPANISH[i],
      formattedDate: `${current.getDate()}/${current.getMonth() + 1}`
    });
  }

  return days;
};

export const formatFriendlyDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  return `${dayNames[date.getDay()]} ${day} de ${monthNames[date.getMonth()]}`;
};
