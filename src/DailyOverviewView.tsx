import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, Projector, Bot, Monitor, Plus, CheckCircle2, AlertOctagon, ChevronLeft, ChevronRight } from 'lucide-react';
import { ResourceId, Reservation, FixedSchedule } from '../types';
import { INITIAL_RESOURCES, TIME_SLOTS, getMondayOfCurrentWeek } from '../data/initialData';
import { getWeekDays, formatFriendlyDate } from '../utils/dateUtils';
import { validateResourceAvailability } from '../utils/validation';

interface DailyOverviewViewProps {
  reservations: Reservation[];
  fixedSchedules: FixedSchedule[];
  onSelectCellToBook: (resourceId: ResourceId, dateStr: string, slotId: number) => void;
  lightMode?: boolean;
  highContrast?: boolean;
}

export const DailyOverviewView: React.FC<DailyOverviewViewProps> = ({
  reservations,
  fixedSchedules,
  onSelectCellToBook,
  lightMode = false,
  highContrast = false
}) => {
  const isLight = lightMode;
  const mondayDate = useMemo(() => getMondayOfCurrentWeek(), []);
  const weekDays = useMemo(() => getWeekDays(mondayDate), [mondayDate]);

  const [selectedDateStr, setSelectedDateStr] = useState<string>(weekDays[0].dateStr);

  const selectedDayInfo = useMemo(() => {
    return weekDays.find(d => d.dateStr === selectedDateStr) || weekDays[0];
  }, [weekDays, selectedDateStr]);

  return (
    <div className={`space-y-6 ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
      {/* Date Selector Header */}
      <div className={`p-5 rounded-3xl border shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isLight ? 'bg-white border-slate-200 shadow-slate-200/50' : 'bg-slate-900 border-slate-800'
      }`}>
        <div>
          <h2 className="text-xl font-black flex items-center gap-2">
            <CalendarIcon className={`w-6 h-6 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
            Vista por Día — Comparativa de Recursos
          </h2>
          <p className={`text-xs sm:text-sm font-medium mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Visualiza los 4 recursos institucionales en paralelo para una fecha específica.
          </p>
        </div>

        {/* Day Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {weekDays.map((day) => {
            const isSelected = selectedDateStr === day.dateStr;
            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDateStr(day.dateStr)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md font-black'
                    : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <div>{day.name}</div>
                <div className="text-sm font-extrabold">{day.formattedDay}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Title Banner */}
      <div className="text-center py-2">
        <h3 className={`text-2xl font-black ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
          {formatFriendlyDate(selectedDateStr)}
        </h3>
      </div>

      {/* Resource Columns Matrix */}
      <div className={`overflow-x-auto rounded-3xl border shadow-xl ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className={`border-b ${isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-100'}`}>
              <th className={`p-4 text-xs font-black uppercase text-center w-28 border-r ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                Módulo
              </th>
              {INITIAL_RESOURCES.map((r) => (
                <th key={r.id} className={`p-3.5 border-r last:border-r-0 text-center ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                  <div className="flex items-center justify-center gap-2">
                    {r.category === 'proyector' && <Projector className={`w-5 h-5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />}
                    {r.id === 'sala_robotica' && <Bot className={`w-5 h-5 ${isLight ? 'text-sky-600' : 'text-sky-400'}`} />}
                    {r.id === 'sala_computacion' && <Monitor className={`w-5 h-5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />}
                    <div>
                      <div className="text-sm font-black">{r.name}</div>
                      <div className={`text-[11px] font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{r.location}</div>
                    </div>
                  </div>
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
                    <td colSpan={INITIAL_RESOURCES.length + 1} className="py-2.5 px-4 text-center font-black text-xs uppercase tracking-widest">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className={`w-4 h-4 ${isLight ? 'text-amber-800' : 'text-amber-300'}`} />
                        <span>☀️ TURNO TARDE (Módulos 9 al 16) ☀️</span>
                      </div>
                    </td>
                  </tr>
                )}
                <tr className={`border-b ${isLight ? 'border-slate-200 hover:bg-slate-50' : 'border-slate-800/80 hover:bg-slate-800/30'}`}>
                  <td className={`p-3 border-r text-center ${isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800 bg-slate-950/50'}`}>
                    <div className={`text-xs font-black ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>{slot.label}</div>
                    <div className={`text-[11px] font-semibold whitespace-nowrap ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </td>

                  {INITIAL_RESOURCES.map((res) => {
                    const status = validateResourceAvailability(
                      res.id,
                      selectedDateStr,
                      selectedDayInfo.dayOfWeek,
                      slot.id,
                      reservations,
                      fixedSchedules
                    );

                    return (
                      <td key={res.id} className={`p-2.5 border-r last:border-r-0 align-top ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
                        {status.isAvailable ? (
                          <button
                            onClick={() => onSelectCellToBook(res.id, selectedDateStr, slot.id)}
                            className={`w-full p-2.5 rounded-xl border transition-all flex items-center justify-between group ${
                              isLight
                                ? 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 shadow-sm'
                                : 'border-emerald-700/60 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200'
                            }`}
                          >
                            <span className="text-xs font-bold">🟢 Disponible</span>
                            <Plus className={`w-4 h-4 group-hover:scale-110 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                          </button>
                        ) : (
                          <div className={`p-2.5 rounded-xl border text-xs ${
                            status.isFixed
                              ? isLight ? 'bg-rose-100 border-rose-300 text-rose-950' : 'bg-rose-950/80 border-rose-700 text-rose-100'
                              : isLight ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-rose-950/50 border-rose-900/80 text-rose-200'
                          }`}>
                            <div className="font-extrabold flex items-center justify-between">
                              <span>{status.isFixed ? '🔒 Curricular' : '🔴 Ocupado'}</span>
                            </div>
                            <div className={`font-black mt-1 truncate ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                              {status.subject || 'Clase'} {status.course ? `(${status.course})` : ''}
                            </div>
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
