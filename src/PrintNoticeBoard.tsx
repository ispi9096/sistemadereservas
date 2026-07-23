import React from 'react';
import { Reservation, FixedSchedule } from '../types';
import { INITIAL_RESOURCES, TIME_SLOTS, getMondayOfCurrentWeek } from '../data/initialData';
import { getWeekDays, formatFriendlyDate } from '../utils/dateUtils';
import { validateResourceAvailability } from '../utils/validation';
import { Printer, X } from 'lucide-react';

interface PrintNoticeBoardProps {
  reservations: Reservation[];
  fixedSchedules: FixedSchedule[];
  onClose: () => void;
}

export const PrintNoticeBoard: React.FC<PrintNoticeBoardProps> = ({
  reservations,
  fixedSchedules,
  onClose
}) => {
  const monday = getMondayOfCurrentWeek();
  const weekDays = getWeekDays(monday);

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-5xl mx-auto bg-white text-slate-900 rounded-3xl p-8 shadow-2xl print:p-0 print:shadow-none print:m-0">
        {/* Top Controls for Web View */}
        <div className="flex items-center justify-between pb-6 border-b mb-6 print:hidden">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Planilla Semanal para Cartelera
            </h2>
            <p className="text-xs text-slate-600">
              Formato de impresión optimizado para Sala de Profesores y Preceptoría.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-2 shadow"
            >
              <Printer className="w-4 h-4 text-yellow-300" />
              <span>Imprimir Planilla</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
            Instituto Ntra. Sra. de la Misericordia
          </h1>
          <h2 className="text-lg font-bold text-emerald-800 mt-1">
            Planilla Semanal de Uso de Recursos Tecnológicos
          </h2>
          <p className="text-xs text-slate-600 font-semibold mt-1">
            Semana del {weekDays[0].formattedDay} al {weekDays[4].formattedDay}
          </p>
        </div>

        {/* PRINTABLE TABLES PER RESOURCE */}
        <div className="space-y-8">
          {INITIAL_RESOURCES.map((resource) => (
            <div key={resource.id} className="border border-slate-300 rounded-xl p-4 page-break-inside-avoid">
              <div className="flex items-center justify-between border-b border-slate-300 pb-2 mb-3">
                <h3 className="text-base font-black text-slate-900 uppercase">
                  📌 {resource.name} ({resource.code})
                </h3>
                <span className="text-xs text-slate-600 font-semibold">
                  Ubicación: {resource.location}
                </span>
              </div>

              <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    <th className="p-2 font-bold border-r border-slate-300 w-24">Módulo</th>
                    {weekDays.map((d) => (
                      <th key={d.dateStr} className="p-2 font-bold border-r border-slate-300 text-center last:border-r-0">
                        {d.name} {d.formattedDay}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((slot) => (
                    <React.Fragment key={slot.id}>
                      {slot.id === 9 && (
                        <tr className="bg-amber-100 border-y-2 border-amber-400 font-black text-[11px] text-amber-950 uppercase text-center">
                          <td colSpan={weekDays.length + 1} className="p-1.5 tracking-wider">
                            ☀️ TURNO TARDE (Módulos 9 al 16) ☀️
                          </td>
                        </tr>
                      )}
                      <tr className="border-b border-slate-200">
                        <td className="p-1.5 font-bold border-r border-slate-300 bg-slate-50">
                          {slot.label} <span className="block text-[10px] font-normal">{slot.startTime}</span>
                        </td>

                        {weekDays.map((d) => {
                          const status = validateResourceAvailability(
                            resource.id,
                            d.dateStr,
                            d.dayOfWeek,
                            slot.id,
                            reservations,
                            fixedSchedules
                          );

                          return (
                            <td key={d.dateStr} className="p-1.5 border-r border-slate-200 text-center last:border-r-0">
                              {status.isAvailable ? (
                                <span className="text-emerald-700 font-bold text-[10px]">LIBRE</span>
                              ) : (
                                <div className="text-[10px] font-black text-slate-900 leading-tight">
                                  {status.subject || 'Clase'} ({status.course})
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
          ))}
        </div>

        {/* PRINT FOOTER */}
        <div className="mt-8 pt-4 border-t border-slate-300 text-center text-xs text-slate-500 font-medium">
          Impreso desde la App de Reserva de Recursos Tecnológicos • Instituto Ntra. Sra. de la Misericordia
        </div>
      </div>
    </div>
  );
};
