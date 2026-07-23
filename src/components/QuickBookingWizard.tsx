import React, { useState, useMemo } from 'react';
import { 
  Projector, 
  Bot, 
  Monitor, 
  Calendar as CalendarIcon, 
  Clock, 
  GraduationCap, 
  CheckCircle2, 
  AlertOctagon, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Info,
  ShieldAlert,
  Search,
  BookOpen,
  CheckSquare,
  Square,
  ListChecks
} from 'lucide-react';
import { Resource, ResourceId, Reservation, FixedSchedule } from '../types';
import { INITIAL_RESOURCES, TIME_SLOTS, INSTITUTIONAL_COURSES, OFFICIAL_SUBJECTS_BY_LEVEL, getMondayOfCurrentWeek, formatDateToYYYYMMDD } from '../data/initialData';
import { getWeekDays, formatFriendlyDate } from '../utils/dateUtils';
import { validateResourceAvailability, getProjectorsAvailabilityCount } from '../utils/validation';

interface QuickBookingWizardProps {
  reservations: Reservation[];
  fixedSchedules: FixedSchedule[];
  onConfirmReservation: (newReservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  lightMode?: boolean;
  highContrast?: boolean;
  preselectedResourceId?: ResourceId;
  preselectedDate?: string;
  preselectedTimeSlotId?: number;
}

export const QuickBookingWizard: React.FC<QuickBookingWizardProps> = ({
  reservations,
  fixedSchedules,
  onConfirmReservation,
  lightMode = false,
  highContrast = false,
  preselectedResourceId,
  preselectedDate,
  preselectedTimeSlotId
}) => {
  const isLight = lightMode;
  // Step State (1: Recurso, 2: Día y Módulo, 3: Confirmar)
  const [step, setStep] = useState<1 | 2 | 3>(preselectedResourceId && preselectedDate && preselectedTimeSlotId ? 3 : 1);

  // Selected Data
  const [selectedResourceId, setSelectedResourceId] = useState<ResourceId>(preselectedResourceId || 'proyector_1');
  
  // Week setup
  const mondayDate = useMemo(() => getMondayOfCurrentWeek(), []);
  const weekDays = useMemo(() => getWeekDays(mondayDate), [mondayDate]);
  
  const [selectedDateStr, setSelectedDateStr] = useState<string>(preselectedDate || weekDays[0].dateStr);
  
  // Multi-selection of time slots (e.g. [1, 2, 3])
  const [selectedTimeSlotIds, setSelectedTimeSlotIds] = useState<number[]>(
    preselectedTimeSlotId ? [preselectedTimeSlotId] : [1]
  );

  // Toggle single time slot selection
  const toggleTimeSlot = (slotId: number) => {
    setSelectedTimeSlotIds((prev) => {
      if (prev.includes(slotId)) {
        return prev.filter((id) => id !== slotId);
      } else {
        return [...prev, slotId];
      }
    });
  };

  // Quick select helper: All morning available slots
  const selectAllAvailableMorning = () => {
    const morningAvailable = TIME_SLOTS.filter(s => s.id <= 8 && validateResourceAvailability(
      selectedResourceId,
      selectedDateStr,
      selectedDayInfo.dayOfWeek,
      s.id,
      reservations,
      fixedSchedules
    ).isAvailable).map(s => s.id);
    setSelectedTimeSlotIds(morningAvailable);
  };

  // Quick select helper: All afternoon available slots
  const selectAllAvailableAfternoon = () => {
    const afternoonAvailable = TIME_SLOTS.filter(s => s.id >= 9 && validateResourceAvailability(
      selectedResourceId,
      selectedDateStr,
      selectedDayInfo.dayOfWeek,
      s.id,
      reservations,
      fixedSchedules
    ).isAvailable).map(s => s.id);
    setSelectedTimeSlotIds(afternoonAvailable);
  };

  // Clear all selected slots
  const clearSlotSelection = () => {
    setSelectedTimeSlotIds([]);
  };

  // Form Fields
  const [course, setCourse] = useState<string>(INSTITUTIONAL_COURSES[0]);
  const [subject, setSubject] = useState<string>(OFFICIAL_SUBJECTS_BY_LEVEL[0].subjects[0]);
  const [subjectSearch, setSubjectSearch] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Level Detection Helper
  const detectLevelFromCourse = (courseName: string): string => {
    const normalized = courseName.toLowerCase();
    if (normalized.includes('secundario') || normalized.includes('año')) {
      return 'NIVEL SECUNDARIO';
    }
    if (normalized.includes('primario') || normalized.includes('grado')) {
      return 'NIVEL PRIMARIO';
    }
    if (normalized.includes('inicial') || normalized.includes('sala')) {
      return 'NIVEL INICIAL';
    }
    return 'NIVEL SECUNDARIO';
  };

  const currentLevel = useMemo(() => detectLevelFromCourse(course), [course]);

  // Handle Course Change with Auto-Reset for Subject
  const handleCourseChange = (newCourse: string) => {
    setCourse(newCourse);
    const newLevel = detectLevelFromCourse(newCourse);
    const newLevelGroup = OFFICIAL_SUBJECTS_BY_LEVEL.find(g => g.level === newLevel);
    if (newLevelGroup) {
      const isSubjectInNewLevel = newLevelGroup.subjects.includes(subject);
      if (!isSubjectInNewLevel) {
        setSubject(newLevelGroup.subjects[0] || '');
      }
    }
  };

  // Group Subject List with Primary Level First
  const sortedSubjectGroups = useMemo(() => {
    const primaryGroup = OFFICIAL_SUBJECTS_BY_LEVEL.find(g => g.level === currentLevel);
    const otherGroups = OFFICIAL_SUBJECTS_BY_LEVEL.filter(g => g.level !== currentLevel);
    return [
      ...(primaryGroup ? [primaryGroup] : []),
      ...otherGroups
    ];
  }, [currentLevel]);

  // Selected Day of Week (1 = Mon ... 5 = Fri)
  const selectedDayInfo = useMemo(() => {
    return weekDays.find(d => d.dateStr === selectedDateStr) || weekDays[0];
  }, [weekDays, selectedDateStr]);

  // Live Validation for all selected time slots
  const selectedSlotValidations = useMemo(() => {
    const sortedIds = [...selectedTimeSlotIds].sort((a, b) => a - b);
    return sortedIds.map((slotId) => {
      const slot = TIME_SLOTS.find((s) => s.id === slotId);
      const status = validateResourceAvailability(
        selectedResourceId,
        selectedDateStr,
        selectedDayInfo.dayOfWeek,
        slotId,
        reservations,
        fixedSchedules
      );
      return {
        slotId,
        slot,
        status
      };
    });
  }, [selectedResourceId, selectedDateStr, selectedDayInfo.dayOfWeek, selectedTimeSlotIds, reservations, fixedSchedules]);

  const isSelectionValid = useMemo(() => {
    if (selectedTimeSlotIds.length === 0) return false;
    return selectedSlotValidations.every((item) => item.status.isAvailable);
  }, [selectedTimeSlotIds, selectedSlotValidations]);

  const invalidSelectedSlots = useMemo(() => {
    return selectedSlotValidations.filter((item) => !item.status.isAvailable);
  }, [selectedSlotValidations]);

  // Selected Resource Detail
  const selectedResource = useMemo(() => {
    return INITIAL_RESOURCES.find(r => r.id === selectedResourceId) || INITIAL_RESOURCES[0];
  }, [selectedResourceId]);

  // Handle Submit (Create reservation for each selected time slot)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSelectionValid) return;

    const sortedValidations = [...selectedSlotValidations].sort((a, b) => a.slotId - b.slotId);

    sortedValidations.forEach((item) => {
      onConfirmReservation({
        resourceId: item.status.assignedResourceId || selectedResourceId,
        date: selectedDateStr,
        dayOfWeek: selectedDayInfo.dayOfWeek,
        timeSlotId: item.slotId,
        course,
        subject: subject.trim() || 'Clase especial',
        notes: notes.trim()
      });
    });
  };

  return (
    <div className={`max-w-4xl mx-auto rounded-3xl border shadow-xl p-4 sm:p-7 ${
      isLight
        ? 'bg-white text-slate-800 border-slate-200 shadow-slate-200/50'
        : 'bg-slate-900 border-slate-800 text-slate-100'
    }`}>
      {/* Step Indicator Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              Asistente de Reserva Rápida
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Reserva de recursos tecnológicos en 3 simples pasos.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Paso {step} de 3
          </span>
        </div>

        {/* Visual Progress Steps */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setStep(1)}
            className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-3 ${
              step === 1
                ? highContrast ? 'bg-yellow-400 text-black border-yellow-300 font-bold' : 'bg-emerald-600 text-white border-emerald-400 font-bold'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
              step === 1 ? 'bg-slate-950 text-white' : 'bg-slate-700 text-slate-200'
            }`}>
              1
            </div>
            <div className="hidden sm:block">
              <div className="text-xs uppercase tracking-wider font-extrabold opacity-75">Paso 1</div>
              <div className="text-sm font-black truncate">Elegir Recurso</div>
            </div>
          </button>

          <button
            onClick={() => setStep(2)}
            className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-3 ${
              step === 2
                ? highContrast ? 'bg-yellow-400 text-black border-yellow-300 font-bold' : 'bg-emerald-600 text-white border-emerald-400 font-bold'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
              step === 2 ? 'bg-slate-950 text-white' : 'bg-slate-700 text-slate-200'
            }`}>
              2
            </div>
            <div className="hidden sm:block">
              <div className="text-xs uppercase tracking-wider font-extrabold opacity-75">Paso 2</div>
              <div className="text-sm font-black truncate">Día y Módulo</div>
            </div>
          </button>

          <button
            onClick={() => setStep(3)}
            className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-3 ${
              step === 3
                ? highContrast ? 'bg-yellow-400 text-black border-yellow-300 font-bold' : 'bg-emerald-600 text-white border-emerald-400 font-bold'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
              step === 3 ? 'bg-slate-950 text-white' : 'bg-slate-700 text-slate-200'
            }`}>
              3
            </div>
            <div className="hidden sm:block">
              <div className="text-xs uppercase tracking-wider font-extrabold opacity-75">Paso 3</div>
              <div className="text-sm font-black truncate">Confirmar</div>
            </div>
          </button>
        </div>
      </div>

      {/* STEP 1: SELECT RESOURCE */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black flex items-center justify-center">1</span>
              Selecciona el Recurso que deseas reservar:
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              4 Recursos Institucionales
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_RESOURCES.map((resource) => {
              const isSelected = selectedResourceId === resource.id;
              
              // Get live availability for selected date & first selected slot
              const status = validateResourceAvailability(
                resource.id,
                selectedDateStr,
                selectedDayInfo.dayOfWeek,
                selectedTimeSlotIds[0] || 1,
                reservations,
                fixedSchedules
              );

              return (
                <div
                  key={resource.id}
                  onClick={() => setSelectedResourceId(resource.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? isLight
                        ? 'bg-emerald-50 border-emerald-600 ring-4 ring-emerald-500/20 text-slate-900 shadow-md font-bold'
                        : highContrast
                          ? 'bg-yellow-400 text-black border-yellow-300 ring-4 ring-yellow-400 font-bold'
                          : 'bg-slate-800 border-emerald-500 ring-4 ring-emerald-500/30'
                      : isLight
                        ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl border ${
                        isLight
                          ? isSelected ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 border-slate-200'
                          : 'bg-slate-900 border-slate-700'
                      }`}>
                        {resource.category === 'proyector' && <Projector className={`w-7 h-7 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />}
                        {resource.id === 'sala_robotica' && <Bot className={`w-7 h-7 ${isLight ? 'text-sky-600' : 'text-sky-400'}`} />}
                        {resource.id === 'sala_computacion' && <Monitor className={`w-7 h-7 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />}
                      </div>
                      <div>
                        <span className={`text-[11px] font-black uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {resource.code}
                        </span>
                        <h4 className={`text-base font-black leading-snug ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                          {resource.name}
                        </h4>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className={`w-6 h-6 shrink-0 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />}
                  </div>

                  <p className={`text-xs mt-3 font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {resource.description}
                  </p>

                  <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold ${
                    isLight ? 'border-slate-200' : 'border-slate-700/60'
                  }`}>
                    <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Ubicación: {resource.location}</span>
                    <span className={`px-2.5 py-1 rounded-lg border font-extrabold ${
                      status.isAvailable
                        ? isLight ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : isLight ? 'bg-rose-100 text-rose-900 border-rose-300' : 'bg-rose-950 text-rose-300 border-rose-700'
                    }`}>
                      {status.isAvailable ? '🟢 Libre' : '🔴 Ocupado'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-transform active:scale-95"
            >
              <span>Siguiente: Seleccionar Día y Módulos</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT DAY & TIME SLOTS (MULTI-SELECTION) */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
              <span className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'
              }`}>2</span>
              Selecciona el Día y los Módulos Horarios:
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                Recurso: {selectedResource.name}
              </span>
              <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                selectedTimeSlotIds.length > 0
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {selectedTimeSlotIds.length} Módulo(s) marcado(s)
              </span>
            </div>
          </div>

          {/* 1. Day Selection Tabs */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Día de la Semana:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {weekDays.map((day) => {
                const isSelected = selectedDateStr === day.dateStr;
                return (
                  <button
                    key={day.dateStr}
                    onClick={() => setSelectedDateStr(day.dateStr)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? isLight
                          ? 'bg-emerald-600 text-white border-emerald-500 font-black shadow-md'
                          : highContrast
                            ? 'bg-yellow-400 text-black border-yellow-300 font-black'
                            : 'bg-emerald-600 text-white border-emerald-400 font-black shadow-md'
                        : isLight
                          ? 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                          : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <div className="text-xs uppercase font-extrabold">{day.name}</div>
                    <div className="text-base font-black mt-0.5">{day.formattedDay}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Selection Helpers Toolbar */}
          <div className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-2 text-xs ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700'
          }`}>
            <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <ListChecks className="w-4 h-4 text-emerald-500" />
              Haz clic en varios módulos para hacer una reserva múltiple:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={selectAllAvailableMorning}
                className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] transition-colors ${
                  isLight ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100' : 'bg-emerald-950/50 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                }`}
              >
                + Mañana Disponible
              </button>
              <button
                type="button"
                onClick={selectAllAvailableAfternoon}
                className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] transition-colors ${
                  isLight ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100' : 'bg-amber-950/50 text-amber-300 border-amber-800 hover:bg-amber-900/60'
                }`}
              >
                + Tarde Disponible
              </button>
              {selectedTimeSlotIds.length > 0 && (
                <button
                  type="button"
                  onClick={clearSlotSelection}
                  className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] transition-colors ${
                    isLight ? 'bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Desmarcar Todos
                </button>
              )}
            </div>
          </div>

          {/* 2. Time Slot Selector Grid */}
          <div className="space-y-4">
            {/* TURNO MAÑANA */}
            <div>
              <label className={`block text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                isLight ? 'text-amber-800' : 'text-amber-400'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>Turno Mañana (Módulos 1 al 8)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {TIME_SLOTS.filter(s => s.id <= 8).map((slot) => {
                  const isSlotSelected = selectedTimeSlotIds.includes(slot.id);
                  
                  // Live status check for this specific slot
                  const slotStatus = validateResourceAvailability(
                    selectedResourceId,
                    selectedDateStr,
                    selectedDayInfo.dayOfWeek,
                    slot.id,
                    reservations,
                    fixedSchedules
                  );

                  return (
                    <button
                      type="button"
                      key={slot.id}
                      onClick={() => toggleTimeSlot(slot.id)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                        isSlotSelected
                          ? isLight
                            ? 'bg-emerald-100/90 border-emerald-600 ring-2 ring-emerald-500/40 text-slate-900 font-bold shadow-md'
                            : highContrast
                              ? 'bg-yellow-400 text-black border-yellow-300 ring-2 ring-yellow-400 font-bold'
                              : 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/40 text-white shadow-md'
                          : slotStatus.isAvailable
                            ? isLight
                              ? 'bg-emerald-50/50 hover:bg-emerald-100/70 border-emerald-200 text-slate-800'
                              : 'bg-emerald-950/30 hover:bg-emerald-900/40 border-emerald-800/60 text-slate-100'
                            : isLight
                              ? 'bg-rose-50 hover:bg-rose-100/60 border-rose-200 text-slate-800'
                              : 'bg-rose-950/30 border-rose-900/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black uppercase ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                          {slot.label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            slotStatus.isAvailable ? 'bg-emerald-500 shadow-sm shadow-emerald-400' : 'bg-rose-500'
                          }`} />
                          {isSlotSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400/80" />
                          )}
                        </div>
                      </div>

                      <div className="text-sm font-black mt-1">
                        {slot.startTime} - {slot.endTime} hs
                      </div>

                      <div className="mt-2 text-[11px] font-semibold truncate flex items-center justify-between">
                        {isSlotSelected ? (
                          <span className={`font-black flex items-center gap-1 ${
                            isLight ? 'text-emerald-800' : 'text-emerald-300'
                          }`}>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Marcado
                          </span>
                        ) : slotStatus.isAvailable ? (
                          <span className={isLight ? 'text-emerald-700' : 'text-emerald-400'}>🟢 Disponible</span>
                        ) : (
                          <span className={`font-bold ${isLight ? 'text-rose-700' : 'text-rose-400'}`}>
                            {slotStatus.isFixed ? '🔒 Curricular' : '🔴 Ocupado'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TURNO TARDE DIVIDER HEADER & GRID */}
            <div className="pt-2">
              <div className={`p-3 rounded-2xl border mb-3 flex items-center justify-between shadow-sm ${
                isLight ? 'bg-amber-100/90 border-amber-300 text-amber-950' : 'bg-amber-950/80 border-amber-700/80 text-amber-200'
              }`}>
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                  <Clock className={`w-4 h-4 ${isLight ? 'text-amber-800' : 'text-amber-300'}`} />
                  <span>☀️ TURNO TARDE (Módulos 9 al 16) ☀️</span>
                </div>
                <span className="text-[11px] font-bold opacity-90 hidden sm:inline">13:15 a 19:00 hs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {TIME_SLOTS.filter(s => s.id >= 9).map((slot) => {
                  const isSlotSelected = selectedTimeSlotIds.includes(slot.id);
                  
                  // Live status check for this specific slot
                  const slotStatus = validateResourceAvailability(
                    selectedResourceId,
                    selectedDateStr,
                    selectedDayInfo.dayOfWeek,
                    slot.id,
                    reservations,
                    fixedSchedules
                  );

                  return (
                    <button
                      type="button"
                      key={slot.id}
                      onClick={() => toggleTimeSlot(slot.id)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                        isSlotSelected
                          ? isLight
                            ? 'bg-emerald-100/90 border-emerald-600 ring-2 ring-emerald-500/40 text-slate-900 font-bold shadow-md'
                            : highContrast
                              ? 'bg-yellow-400 text-black border-yellow-300 ring-2 ring-yellow-400 font-bold'
                              : 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/40 text-white shadow-md'
                          : slotStatus.isAvailable
                            ? isLight
                              ? 'bg-emerald-50/50 hover:bg-emerald-100/70 border-emerald-200 text-slate-800'
                              : 'bg-emerald-950/30 hover:bg-emerald-900/40 border-emerald-800/60 text-slate-100'
                            : isLight
                              ? 'bg-rose-50 hover:bg-rose-100/60 border-rose-200 text-slate-800'
                              : 'bg-rose-950/30 border-rose-900/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black uppercase ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                          {slot.label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            slotStatus.isAvailable ? 'bg-emerald-500 shadow-sm shadow-emerald-400' : 'bg-rose-500'
                          }`} />
                          {isSlotSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400/80" />
                          )}
                        </div>
                      </div>

                      <div className="text-sm font-black mt-1">
                        {slot.startTime} - {slot.endTime} hs
                      </div>

                      <div className="mt-2 text-[11px] font-semibold truncate flex items-center justify-between">
                        {isSlotSelected ? (
                          <span className={`font-black flex items-center gap-1 ${
                            isLight ? 'text-emerald-800' : 'text-emerald-300'
                          }`}>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Marcado
                          </span>
                        ) : slotStatus.isAvailable ? (
                          <span className={isLight ? 'text-emerald-700' : 'text-emerald-400'}>🟢 Disponible</span>
                        ) : (
                          <span className={`font-bold ${isLight ? 'text-rose-700' : 'text-rose-400'}`}>
                            {slotStatus.isFixed ? '🔒 Curricular' : '🔴 Ocupado'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Real-time Multi-selection Status Alert Bar */}
          {selectedTimeSlotIds.length === 0 ? (
            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
              isLight ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-amber-950/60 border-amber-700 text-amber-200'
            }`}>
              <Info className="w-5 h-5 shrink-0 text-amber-500" />
              <div className="text-xs font-semibold">
                <strong>Por favor selecciona al menos un módulo horario</strong> haciendo clic en las casillas correspondientes.
              </div>
            </div>
          ) : invalidSelectedSlots.length > 0 ? (
            <div className={`p-4 rounded-2xl border-2 space-y-2 shadow-lg ${
              isLight ? 'bg-rose-100 border-rose-300 text-rose-950' : 'bg-rose-950/80 border-rose-600 text-rose-200'
            }`}>
              <div className="flex items-start gap-3">
                <AlertOctagon className={`w-6 h-6 shrink-0 mt-0.5 ${isLight ? 'text-rose-700' : 'text-rose-400'}`} />
                <div>
                  <h4 className={`text-sm font-black ${isLight ? 'text-rose-950' : 'text-white'}`}>
                    ⚠️ Hay {invalidSelectedSlots.length} Módulo(s) Ocupado(s) Seleccionado(s)
                  </h4>
                  <div className="text-xs mt-1.5 space-y-1 font-medium">
                    {invalidSelectedSlots.map(inv => (
                      <div key={inv.slotId}>
                        • <strong>{inv.slot?.label} ({inv.slot?.startTime} - {inv.slot?.endTime} hs):</strong> {inv.status.message}
                        {inv.status.occupantName && ` — Reservado por ${inv.status.occupantName} (${inv.status.course || 'Curricular'})`}
                      </div>
                    ))}
                  </div>
                  <p className={`text-xs mt-2 ${isLight ? 'text-rose-800' : 'text-rose-300/80'}`}>
                    Desmarca los módulos ocupados para poder avanzar al siguiente paso.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
              isLight ? 'bg-emerald-100 border-emerald-300 text-emerald-950' : 'bg-emerald-950/60 border-emerald-700/60 text-emerald-200'
            }`}>
              <CheckCircle2 className={`w-5 h-5 shrink-0 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
              <div className="text-xs font-semibold">
                <strong>¡{selectedTimeSlotIds.length} Módulo(s) Disponible(s)!</strong> {selectedResource.name} está totalmente libre para {formatFriendlyDate(selectedDateStr)} en los módulos marcados ({selectedSlotValidations.map(v => v.slot?.label).join(', ')}).
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between gap-3">
            <button
              onClick={() => setStep(1)}
              className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 border ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>

            <button
              onClick={() => setStep(3)}
              disabled={!isSelectionValid}
              className={`px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all ${
                isSelectionValid
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30'
                  : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-60'
              }`}
            >
              <span>Siguiente: Datos de Confirmación ({selectedTimeSlotIds.length})</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRMATION FORM */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
              <span className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'
              }`}>3</span>
              Confirmar Datos de la Reserva:
            </h3>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Último paso
            </span>
          </div>

          {/* Reservation Summary Card */}
          <div className={`p-4 rounded-2xl border grid grid-cols-1 md:grid-cols-3 gap-4 ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-800/90 border-slate-700 text-slate-100'
          }`}>
            <div>
              <span className={`text-[11px] font-extrabold uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Recurso:</span>
              <div className={`text-sm font-black ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>{selectedResource.name}</div>
              <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{selectedResource.location}</div>
            </div>

            <div>
              <span className={`text-[11px] font-extrabold uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Fecha y Día:</span>
              <div className={`text-sm font-black ${isLight ? 'text-sky-800' : 'text-sky-300'}`}>{formatFriendlyDate(selectedDateStr)}</div>
              <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Semana institucional</div>
            </div>

            <div>
              <span className={`text-[11px] font-extrabold uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Módulos Seleccionados ({selectedTimeSlotIds.length}):
              </span>
              <div className={`text-xs font-black mt-1 space-y-0.5 ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                {selectedSlotValidations.map(val => (
                  <div key={val.slotId} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{val.slot?.label} ({val.slot?.startTime} - {val.slot?.endTime} hs)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Course Selector (Campo Obligatorio) */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-sky-500 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-sky-500" />
                  1. Curso / Año:
                </span>
                <span className="text-[10px] text-sky-600 font-extrabold bg-sky-100 px-2 py-0.5 rounded border border-sky-300">Obligatorio</span>
              </label>
              <select
                value={course}
                onChange={(e) => handleCourseChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 font-bold text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  isLight ? 'bg-white border-sky-500 text-slate-900' : 'bg-slate-800 border-sky-500/80 text-slate-100'
                }`}
              >
                {INSTITUTIONAL_COURSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Subject / Materia (Selector Obligatorio por Nivel) */}
            <div className="space-y-1.5">
              <label className={`block text-xs font-black uppercase tracking-wider flex items-center justify-between ${
                isLight ? 'text-emerald-700' : 'text-emerald-400'
              }`}>
                <span className="flex items-center gap-1.5">
                  <BookOpen className={`w-4 h-4 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                  2. Materia / Asignatura:
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                  isLight ? 'text-emerald-800 bg-emerald-100 border-emerald-300' : 'text-emerald-300 bg-emerald-950/80 border-emerald-800'
                }`}>{currentLevel.replace('NIVEL ', '')}</span>
              </label>

              {/* Quick Filter Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar o filtrar materia..."
                  value={subjectSearch}
                  onChange={(e) => setSubjectSearch(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-500 border ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-200'
                  }`}
                />
              </div>

              {/* Grouped Select Dropdown (Prioritized by Level) */}
              <select
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 font-black text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                  isLight ? 'bg-white border-emerald-500 text-slate-900' : 'bg-slate-800 border-emerald-500/80 text-slate-100'
                }`}
              >
                {sortedSubjectGroups.map((group) => {
                  const isPrimary = group.level === currentLevel;
                  const filteredSubjects = group.subjects.filter(s =>
                    !subjectSearch || s.toLowerCase().includes(subjectSearch.toLowerCase())
                  );
                  if (filteredSubjects.length === 0) return null;
                  return (
                    <optgroup
                      key={group.level}
                      label={isPrimary ? `★ ${group.level} (Selección Sugerida)` : `— ${group.level} —`}
                    >
                      {filteredSubjects.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>

              {/* Matching Result Tag Chips */}
              {subjectSearch && (
                <div className={`flex flex-wrap gap-1 mt-1.5 max-h-24 overflow-y-auto p-1.5 rounded-xl border ${
                  isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/90 border-slate-800'
                }`}>
                  {sortedSubjectGroups.flatMap(g => g.subjects.map(s => ({ subject: s, level: g.level })))
                    .filter(item => item.subject.toLowerCase().includes(subjectSearch.toLowerCase()))
                    .map(item => (
                      <button
                        key={item.subject}
                        type="button"
                        onClick={() => {
                          setSubject(item.subject);
                          setSubjectSearch('');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          subject === item.subject 
                            ? 'bg-emerald-500 text-slate-950 font-black shadow' 
                            : isLight
                              ? 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-300'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        <span>{item.subject}</span>
                        <span className="text-[9px] opacity-75 uppercase">({item.level.replace('NIVEL ', '')})</span>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Observaciones */}
            <div className="md:col-span-2">
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Observaciones o Necesidades Especiales <span className="text-[10px] font-normal text-slate-500">(Opcional)</span>:
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Requiere parlantes extra / Adaptador HDMI"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-400 font-medium text-sm ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500'
                }`}
              />
            </div>
          </div>

          <div className={`pt-4 flex items-center justify-between gap-3 border-t ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <button
              type="button"
              onClick={() => setStep(2)}
              className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 border ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>

            <button
              type="submit"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-base flex items-center gap-3 shadow-xl shadow-emerald-900/50 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-6 h-6 text-yellow-300" />
              <span>
                {selectedTimeSlotIds.length > 1 
                  ? `Confirmar las ${selectedTimeSlotIds.length} Reservas` 
                  : 'Confirmar y Guardar Reserva'}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
