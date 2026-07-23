import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  ShieldAlert, 
  Plus, 
  Filter, 
  CheckCircle2, 
  Info, 
  Projector, 
  Bot, 
  Monitor,
  Printer
} from 'lucide-react';
import { Resource, ResourceId, Reservation, FixedSchedule } from '../types';
import { INITIAL_RESOURCES, TIME_SLOTS, getMondayOfCurrentWeek } from '../data/initialData';
import { getWeekDays, formatFriendlyDate } from '../utils/dateUtils';
import { validateResourceAvailability, getProjectorsAvailabilityCount } from '../utils/validation';

interface WeeklyScheduleViewProps {
  reservations: Reservation[];
  fixedSchedules: FixedSchedule[];
  onSelectCellToBook: (resourceId: ResourceId, dateStr: string, slotId: number) => void;
  onSelectExistingReservation: (reservation: Reservation) => void;
  lightMode?: boolean;
  highContrast?: boolean;
  onPrintNoticeBoard: () => void;
}

export const WeeklyScheduleView: React.FC<WeeklyScheduleViewProps> = ({
  reservations,
  fixedSchedules,
  onSelectCellToBook,
  onSelectExistingReservation,
  lightMode = false,
  highContrast = false,
  onPrintNoticeBoard
}) => {
  const isLight = lightMode;
  // Filter by Resource
  const [selectedResourceId, setSelectedResourceId] = useState<ResourceId | 'all_projectors'>('proyector_1');

  // Week Date State
  const [currentMonday, setCurrentMonday] = useState<Date>(() => getMondayOfCurrentWeek());

  const weekDays = useMemo(() => getWeekDays(currentMonday), [currentMonday]);

  // Navigate Weeks
  const handlePrevWeek = () => {
    const prev = new Date(currentMonday);
    prev.setDate(prev.getDate() - 7);
    setCurrentMonday(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentMonday);
    next.setDate(next.getDate() + 7);
    setCurrentMonday(next);
  };

  const handleTodayWeek = () => {
    setCurrentMonday(getMondayOfCurrentWeek());
  };

  return (
    <div className={`space-y-6 ${highContrast ? 'text-yellow-300' : 'text-slate-100'}`}>
      {/* Top Controls Bar */}
      <div className={`p-4 sm:p-5 rounded-3xl border shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isLight ? 'bg-white border-slate-200' : highContrast ? 'bg-black border-yellow-400' : 'bg-slate-900 border-slate-800'
      }`}>
        {/* Resource Selector Tabs */}
        <div>
          <label className={`block text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            <Filter className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
            Selecciona Recurso a Visualizar:
          </label>
          <div className="flex flex-wrap gap-2">
            {INITIAL_RESOURCES.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedResourceId(r.id)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2 ${
                  selectedResourceId === r.id
                    ? highContrast
                      ? 'bg-yellow-400 text-black border-yellow-300 ring-2 ring-yellow-400'
                      : 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                    : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                {r.category === 'proyector' && <Projector className={`w-4 h-4 ${isLight ? 'text-amber-600' : 'text-amber-300'}`} />}
                {r.id === 'sala_robotica' && <Bot className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-sky-300'}`} />}
                {r.id === 'sala_computacion' && <Monitor className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-300'}`} />}
                <span>{r.name}</span>
              </button>
            ))}

            <button
              onClick={() => setSelectedResourceId('all_projectors')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2 ${
                selectedResourceId === 'all_projectors'
                  ? highContrast
                    ? 'bg-yellow-400 text-black border-yellow-300'
                    : 'bg-amber-600 text-white border-amber-400 shadow-md'
                  : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Projector className={`w-4 h-4 ${isLight ? 'text-amber-600' : 'text-yellow-300'}`} />
              <span>Ambos Proyectores (2 un.)</span>
            </button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center gap-2 self-start md:self-end">
          <button
            onClick={handlePrevWeek}
            className={`p-2.5 rounded-xl border ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Semana anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleTodayWeek}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            Semana Actual
          </button>

          <button
            onClick={handleNextWeek}
            className={`p-2.5 rounded-xl border ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Semana siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={onPrintNoticeBoard}
            className={`ml-2 px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
              isLight ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300' : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
            }`}
            title="Imprimir o Exportar Horario para Sala de Profesores"
          >
            <Printer className={`w-4 h-4 ${isLight ? 'text-amber-800' : 'text-amber-400'}`} />
            <span className="hidden sm:inline">Imprimir Horario</span>
          </button>
        </div>
      </div>

      {/* Color Legend Bar */}
      <div className={`p-3.5 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs font-bold ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900/80 border-slate-800 text-slate-200'
      }`}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-300" />
            <span>🟢 Verde = Disponible (Haz clic para reservar)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-600 border border-rose-300" />
            <span>🔴 Rojo = Ocupado / Reserva Fija</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-400 border border-slate-300" />
            <span>🔘 Gris = No disponible</span>
          </div>
        </div>

        <div className={isLight ? 'text-slate-500 font-medium' : 'text-slate-400 font-medium'}>
          Semana del {weekDays[0].formattedDay} al {weekDays[4].formattedDay}
        </div>
      </div>

      {/* WEEKLY GRID MATRIX */}
      <div className={`overflow-x-auto rounded-3xl border shadow-xl ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className={`border-b ${isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'}`}>
              <th className={`p-3.5 text-xs font-black uppercase text-center w-28 border-r ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                Módulo / Hora
              </th>
              {weekDays.map((day) => (
                <th key={day.dateStr} className={`p-3 text-center border-r last:border-r-0 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                  <div className={`text-xs uppercase font-extrabold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{day.name}</div>
                  <div className={`text-sm font-black ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>{day.formattedDay}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot) => (
              <React.Fragment key={slot.id}>
                {slot.id === 9 && (
                  <tr className={`border-y-2 ${
                    isLight ? 'bg-amber-100/90 border-amber-300 text-amber-950' : 'bg-amber-950/80 border-amber-600/80 text-amber-200'
                  }`}>
                    <td colSpan={weekDays.length + 1} className="py-2.5 px-4 text-center font-black text-xs uppercase tracking-widest">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className={`w-4 h-4 ${isLight ? 'text-amber-800' : 'text-amber-300'}`} />
                        <span>☀️ TURNO TARDE (Módulos 9 al 16) ☀️</span>
                      </div>
                    </td>
                  </tr>
                )}
                <tr className={`border-b ${isLight ? 'border-slate-200 hover:bg-slate-50' : 'border-slate-800/80 hover:bg-slate-800/30'}`}>
                  {/* Slot Label Header */}
                <td className={`p-3 border-r text-center ${isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800 bg-slate-950/50'}`}>
                  <div className={`text-xs font-black ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>{slot.label}</div>
                  <div className={`text-[11px] font-semibold whitespace-nowrap ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {slot.startTime} - {slot.endTime}
                  </div>
                </td>

                {/* Day Columns */}
                {weekDays.map((day) => {
                  const targetResId: ResourceId = selectedResourceId === 'all_projectors' ? 'proyector_1' : selectedResourceId;

                  const status = validateResourceAvailability(
                    selectedResourceId === 'all_projectors' ? 'any_proyector' : selectedResourceId,
                    day.dateStr,
                    day.dayOfWeek,
                    slot.id,
                    reservations,
                    fixedSchedules
                  );

                  // Check if user has an active reservation here
                  const existingUserReservation = reservations.find(
                    r => (selectedResourceId === 'all_projectors' ? (r.resourceId === 'proyector_1' || r.resourceId === 'proyector_2') : r.resourceId === selectedResourceId)
                         && r.date === day.dateStr 
                         && r.timeSlotId === slot.id
                  );

                  return (
                    <td 
                      key={`${day.dateStr}-${slot.id}`}
                      className={`p-2 border-r last:border-r-0 align-top h-24 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}
                    >
                      {status.isAvailable ? (
                        /* AVAILABLE GREEN CELL */
                        <button
                          onClick={() => onSelectCellToBook(targetResId, day.dateStr, slot.id)}
                          className={`w-full h-full min-h-[70px] p-2.5 rounded-xl border-2 transition-all flex flex-col justify-between items-start text-left group ${
                            isLight
                              ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900 hover:border-emerald-500 shadow-sm'
                              : 'bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-700/60 text-emerald-200 hover:border-emerald-400 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                              isLight 
                                ? 'bg-emerald-200 text-emerald-900 border-emerald-400' 
                                : 'bg-emerald-900/80 text-emerald-300 border-emerald-700/50'
                            }`}>
                              🟢 Libre
                            </span>
                            <Plus className={`w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                          </div>
                          <div className="text-xs font-bold mt-1 group-hover:underline">
                            Clic para Reservar
                          </div>
                        </button>
                      ) : (
                        /* OCCUPIED RED OR LOCKED CELL */
                        <div
                          onClick={() => {
                            if (existingUserReservation) {
                              onSelectExistingReservation(existingUserReservation);
                            }
                          }}
                          className={`w-full h-full min-h-[70px] p-2.5 rounded-xl border-2 flex flex-col justify-between text-left ${
                            existingUserReservation ? 'cursor-pointer hover:ring-2 hover:ring-amber-400' : ''
                          } ${
                            status.isFixed
                              ? isLight ? 'bg-rose-100 border-rose-300 text-rose-950' : 'bg-rose-950/80 border-rose-700 text-rose-100'
                              : isLight ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-rose-950/50 border-rose-800/80 text-rose-200'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border flex items-center gap-1 ${
                              isLight ? 'bg-rose-200 text-rose-900 border-rose-300' : 'bg-rose-900 text-rose-200 border-rose-700'
                            }`}>
                              {status.isFixed && <ShieldAlert className="w-3 h-3 text-amber-600" />}
                              {status.isFixed ? '🔒 Reserva Fija' : '🔴 Ocupado'}
                            </span>
                          </div>

                          <div className="mt-1">
                            {/* Primary Identifier: Materia + Curso */}
                            <div className={`text-xs font-black truncate leading-tight ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                              {status.subject || 'Clase'} {status.course ? `(${status.course})` : ''}
                            </div>
                          </div>

                          {existingUserReservation && (
                            <div className={`text-[10px] font-extrabold underline mt-1 ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                              Ver/Cancelar Reserva
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            </React.Fragment>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
