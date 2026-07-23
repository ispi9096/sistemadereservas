import React from 'react';
import { ShieldAlert, Calendar, Clock, Lock, BookOpen, GraduationCap, MapPin } from 'lucide-react';
import { FixedSchedule } from '../types';
import { INITIAL_RESOURCES, TIME_SLOTS } from '../data/initialData';
import { DAYS_SPANISH } from '../utils/dateUtils';

interface FixedSchedulesModalProps {
  fixedSchedules: FixedSchedule[];
  lightMode?: boolean;
  highContrast?: boolean;
}

export const FixedSchedulesModal: React.FC<FixedSchedulesModalProps> = ({
  fixedSchedules,
  lightMode = false,
  highContrast = false
}) => {
  const isLight = lightMode;

  return (
    <div className={`space-y-6 ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
      {/* Header */}
      <div className={`p-5 rounded-3xl border shadow-lg ${
        isLight ? 'bg-white border-slate-200 shadow-slate-200/50' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-100 border border-rose-300 text-rose-700">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black flex items-center gap-2">
              Horarios Fijos y Recurrentes Curriculares
            </h2>
            <p className={`text-xs sm:text-sm font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Horas de materia bloqueadas institucionalmente (por ej. Tecnología de 1º y 2º año).
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Fixed Schedules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fixedSchedules.map((fix) => {
          const res = INITIAL_RESOURCES.find(r => r.id === fix.resourceId) || INITIAL_RESOURCES[0];
          const dayInfo = DAYS_SPANISH.find(d => d.dayOfWeek === fix.dayOfWeek) || DAYS_SPANISH[0];
          const slot = TIME_SLOTS.find(s => s.id === fix.timeSlotId) || TIME_SLOTS[0];

          return (
            <div
              key={fix.id}
              className={`p-5 rounded-2xl border-2 shadow-md flex flex-col justify-between gap-3 ${
                isLight ? 'bg-white border-rose-200 text-slate-800' : 'bg-slate-900 border-rose-900/80 text-slate-100'
              }`}
            >
              <div>
                <div className={`flex items-center justify-between border-b pb-2 ${isLight ? 'border-rose-100' : 'border-rose-900/60'}`}>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border flex items-center gap-1 ${
                    isLight ? 'bg-rose-100 text-rose-900 border-rose-300' : 'bg-rose-950 text-rose-300 border-rose-700'
                  }`}>
                    <Lock className="w-3 h-3" />
                    🔒 Reserva Fija Institucional
                  </span>
                  <span className={`text-xs font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{res.name}</span>
                </div>

                <h3 className={`text-lg font-black mt-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {fix.subject} — {fix.course}
                </h3>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Día: <strong>{dayInfo.name}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Módulo: <strong>{slot.label} ({slot.startTime} hs)</strong></span>
                  </div>
                </div>

                {fix.notes && (
                  <p className="mt-2 text-xs text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    💡 {fix.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
