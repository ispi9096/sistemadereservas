import { Resource, TimeSlot, FixedSchedule, Reservation } from '../types';

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'proyector_1',
    category: 'proyector',
    name: 'Proyector 1 (Portátil)',
    code: 'PROY-01',
    description: 'Proyector con entrada VGA y adaptador HDMI (normal).',
    location: 'Gabinete Técnico (Pedir en Biblioteca)',
    capacity: 1,
    icon: 'Projector',
    features: ['HDMI/VGA', 'Altavoces integrados', 'Maletín de transporte']
  },
  {
    id: 'proyector_2',
    category: 'proyector',
    name: 'Proyector 2 (Móvil con Parlante)',
    code: 'PROY-02',
    description: 'Proyector con entrada VGA y adaptador HDMI (normal).',
    location: 'Gabinete Técnico (Pedir en Biblioteca)',
    capacity: 1,
    icon: 'Projector',
    features: ['HDMI/VGA', 'Altavoces integrados', 'Maletín de transporte']
  },
  {
    id: 'sala_robotica',
    category: 'sala',
    name: 'Sala de Robótica',
    code: 'SALA-ROB',
    description: 'Espacio equipado con mesas de trabajo y TV',
    location: 'Planta Baja - Ala Este',
    capacity: 30,
    icon: 'Bot',
    features: ['Kits Lego/Arduino', 'Pizarra Interactiva', '30 puestos de trabajo']
  },
  {
    id: 'sala_computacion',
    category: 'sala',
    name: 'Sala de Computación',
    code: 'SALA-COMP',
    description: 'Laboratorio de Informática con PCs conectadas a Internet',
    location: 'Planta Baja - Ala Este',
    capacity: 25,
    icon: 'Monitor',
    features: ['25 PCs i5 16GB', 'Internet 500Mbps', 'Acondicionador de aire', 'Proyector fijo']
  }
];

export const TIME_SLOTS: TimeSlot[] = [
  // TURNO MAÑANA
  { id: 1, label: 'Módulo 1', startTime: '07:30', endTime: '08:10' },
  { id: 2, label: 'Módulo 2', startTime: '08:10', endTime: '08:40' },
  { id: 3, label: 'Módulo 3', startTime: '09:00', endTime: '09:35' },
  { id: 4, label: 'Módulo 4', startTime: '09:35', endTime: '10:20' },
  { id: 5, label: 'Módulo 5', startTime: '10:35', endTime: '11:15' },
  { id: 6, label: 'Módulo 6', startTime: '11:15', endTime: '11:55' },
  { id: 7, label: 'Módulo 7', startTime: '11:55', endTime: '12:35' },
  { id: 8, label: 'Módulo 8', startTime: '12:35', endTime: '13:10' },

  // TURNO TARDE
  { id: 9, label: 'Módulo 9', startTime: '13:15', endTime: '13:55' },
  { id: 10, label: 'Módulo 10', startTime: '13:55', endTime: '14:35' },
  { id: 11, label: 'Módulo 11', startTime: '14:45', endTime: '15:25' },
  { id: 12, label: 'Módulo 12', startTime: '15:25', endTime: '16:05' },
  { id: 13, label: 'Módulo 13', startTime: '16:15', endTime: '16:55' },
  { id: 14, label: 'Módulo 14', startTime: '16:55', endTime: '17:35' },
  { id: 15, label: 'Módulo 15', startTime: '17:40', endTime: '18:20' },
  { id: 16, label: 'Módulo 16', startTime: '18:20', endTime: '19:00' }
];

export const INSTITUTIONAL_COURSES = [
  '1º Año A (Secundario)',
  '1º Año B (Secundario)',
  '2º Año A (Secundario)',
  '2º Año B (Secundario)',
  '3º Año Nat (Secundario)',
  '3º Año Soc (Secundario)',
  '4º Año Nat (Secundario)',
  '4º Año Soc (Secundario)',
  '5º Año Nat (Secundario)',
  '5º Año Soc (Secundario)',
  '1º Grado (Primario)',
  '2º Grado (Primario)',
  '3º Grado (Primario)',
  '4º Grado (Primario)',
  '5º Grado (Primario)',
  '6º Grado (Primario)',
  '7º Grado (Primario)',
  'Sala de 3 Años (Inicial)',
  'Sala de 4 Años (Inicial)',
  'Sala de 5 Años (Inicial)'
];

export interface SubjectLevelGroup {
  level: string;
  subjects: string[];
}

export const OFFICIAL_SUBJECTS_BY_LEVEL: SubjectLevelGroup[] = [
  {
    level: 'NIVEL SECUNDARIO',
    subjects: [
      'ARTES VISUALES',
      'BIOLOGÍA',
      'CIUD. E IDENTIDAD',
      'CIUDAD. Y PART',
      'CONST. CIUD. Y DER',
      'CS DE LA COMUN',
      'CS. DE LA TIERRA',
      'CS. POLÍTICAS',
      'ECONOMIA',
      'ED.TECNOLOG.',
      'ESP. IDEARIO',
      'F. ETICA',
      'FEyC',
      'FILOSOFÍA',
      'FÍSICA',
      'FÍSICO-QUÍMICA',
      'GEOGRAFÍA',
      'HISTORIA',
      'IDEARIO',
      'INFORMÁTICA',
      'INGLÉS',
      'LENGUA',
      'LENGUA Y LITE',
      'MATEMÁTICA',
      'MÚSICA',
      'OCL',
      'PLASTICA',
      'PSICOLOGÍA',
      'QUÍMICA',
      'SALUD',
      'SEMINARIO',
      'SOCIOLOGÍA',
      'T.E.A.',
      'TALLER LENGUA',
      'TUTORÍA'
    ]
  },
  {
    level: 'NIVEL PRIMARIO',
    subjects: [
      'Ciencias Naturales',
      'Ciencias Sociales',
      'Educación Tecnológica',
      'Lengua y Literatura',
      'Matemática',
      'Saberes, Vidas y Mundos'
    ]
  },
  {
    level: 'NIVEL INICIAL',
    subjects: [
      'Espacio Curricular'
    ]
  }
];

// Horarios fijos institucionales recurrentes (módulos semanales obligatorios)
// 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes
export const INITIAL_FIXED_SCHEDULES: FixedSchedule[] = [
  // Tecnología — 1º Año A: Jueves (4), Módulos 3 y 4 (Sala de Computación y Sala de Robótica)
  { id: 'fix-1', resourceId: 'sala_computacion', dayOfWeek: 4, timeSlotId: 3, subject: 'Tecnología', course: '1º Año A', notes: 'Clase curricular semanal fija' },
  { id: 'fix-2', resourceId: 'sala_robotica', dayOfWeek: 4, timeSlotId: 3, subject: 'Tecnología', course: '1º Año A', notes: 'Clase curricular semanal fija' },
  { id: 'fix-3', resourceId: 'sala_computacion', dayOfWeek: 4, timeSlotId: 4, subject: 'Tecnología', course: '1º Año A', notes: 'Clase curricular semanal fija' },
  { id: 'fix-4', resourceId: 'sala_robotica', dayOfWeek: 4, timeSlotId: 4, subject: 'Tecnología', course: '1º Año A', notes: 'Clase curricular semanal fija' },

  // Tecnología — 2º Año A: Miércoles (3), Módulos 3 y 4 (Sala de Computación y Sala de Robótica)
  { id: 'fix-5', resourceId: 'sala_computacion', dayOfWeek: 3, timeSlotId: 3, subject: 'Tecnología', course: '2º Año A', notes: 'Clase curricular semanal fija' },
  { id: 'fix-6', resourceId: 'sala_robotica', dayOfWeek: 3, timeSlotId: 3, subject: 'Tecnología', course: '2º Año A', notes: 'Clase curricular semanal fija' },
  { id: 'fix-7', resourceId: 'sala_computacion', dayOfWeek: 3, timeSlotId: 4, subject: 'Tecnología', course: '2º Año A', notes: 'Clase curricular semanal fija' },
  { id: 'fix-8', resourceId: 'sala_robotica', dayOfWeek: 3, timeSlotId: 4, subject: 'Tecnología', course: '2º Año A', notes: 'Clase curricular semanal fija' },

  // Tecnología — 2º Año B: Jueves (4), Módulos 1 y 2 (Sala de Computación y Sala de Robótica)
  { id: 'fix-9', resourceId: 'sala_computacion', dayOfWeek: 4, timeSlotId: 1, subject: 'Tecnología', course: '2º Año B', notes: 'Clase curricular semanal fija' },
  { id: 'fix-10', resourceId: 'sala_robotica', dayOfWeek: 4, timeSlotId: 1, subject: 'Tecnología', course: '2º Año B', notes: 'Clase curricular semanal fija' },
  { id: 'fix-11', resourceId: 'sala_computacion', dayOfWeek: 4, timeSlotId: 2, subject: 'Tecnología', course: '2º Año B', notes: 'Clase curricular semanal fija' },
  { id: 'fix-12', resourceId: 'sala_robotica', dayOfWeek: 4, timeSlotId: 2, subject: 'Tecnología', course: '2º Año B', notes: 'Clase curricular semanal fija' },
];

// Helper to get current week's Monday in YYYY-MM-DD
export function getMondayOfCurrentWeek(d = new Date()): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.setDate(diff));
}

export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateSampleReservationsForCurrentWeek(): Reservation[] {
  const monday = getMondayOfCurrentWeek();

  // Helper to add days to Monday
  const getDateStr = (addDays: number) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + addDays);
    return formatDateToYYYYMMDD(d);
  };

  return [
    {
      id: 'res-101',
      resourceId: 'proyector_2',
      date: getDateStr(1), // Martes
      dayOfWeek: 2,
      timeSlotId: 1,
      course: '5º Año Nat',
      subject: 'Biología Celular',
      createdAt: new Date().toISOString(),
      notes: 'Presentación de diapositivas sobre genética'
    },
    {
      id: 'res-102',
      resourceId: 'sala_computacion',
      date: getDateStr(2), // Miércoles
      dayOfWeek: 3,
      timeSlotId: 5,
      course: '3º Año Soc',
      subject: 'Matemática con GeoGebra',
      createdAt: new Date().toISOString(),
      notes: 'Modelado gráfico de funciones'
    },
    {
      id: 'res-103',
      resourceId: 'proyector_1',
      date: getDateStr(3), // Jueves
      dayOfWeek: 4,
      timeSlotId: 3,
      course: '2º Año A',
      subject: 'Lengua y Literatura',
      createdAt: new Date().toISOString(),
      notes: 'Proyección de obra de teatro clasicista'
    }
  ];
}
