import React, { useState } from 'react';
import { 
  FileText, 
  Trash2, 
  Search, 
  Projector, 
  Bot, 
  Monitor, 
  RotateCcw,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { Reservation } from '../types';
import { INITIAL_RESOURCES, TIME_SLOTS } from '../data/initialData';
import { formatFriendlyDate } from '../utils/dateUtils';

interface MyReservationsListProps {
  reservations: Reservation[];
  onCancelReservation: (id: string) => void;
  onResetData: () => void;
  onNewReservation: () => void;
  lightMode?: boolean;
  highContrast?: boolean;
}

export const MyReservationsList: React.FC<MyReservationsListProps> = ({
  reservations,
  onCancelReservation,
  onResetData,
  onNewReservation,
  lightMode = false,
  highContrast = false
}) => {
  const isLight = lightMode;
  const [searchQuery, setSearchQuery] = useState('');
  const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Filter logic: Search by subject, course, date, resource
  const filtered = reservations.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.course.toLowerCase().includes(q) ||
      (r.subject && r.subject.toLowerCase().includes(q)) ||
      r.date.includes(q)
    );
  });

  return (
    <div className={`space-y-6 ${highContrast ? 'text-yellow-300' : 'text-slate-100'}`}>
      {/* Header Controls */}
      <div className={`p-5 rounded-3xl border shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800'
          : highContrast ? 'bg-black border-yellow-400' : 'bg-slate-900 border-slate-800'
      }`}>
        <div>
          <h2 className={`text-xl font-black flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            <FileText className={`w-6 h-6 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
            Gestión y Listado de Reservas
          </h2>
          <p className={`text-xs sm:text-sm font-medium mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Consulta, filtra o cancela las reservas por materia, curso o fecha.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onNewReservation}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nueva Reserva</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className={`p-2.5 rounded-xl border transition-colors ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
            }`}
            title="Restablecer datos de ejemplo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className={`w-5 h-5 absolute left-3.5 top-3.5 ${isLight ? 'text-slate-400' : 'text-slate-400'}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por materia, curso o fecha..."
          className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500'
          }`}
        />
      </div>

      {/* List Grid */}
      {filtered.length === 0 ? (
        <div className={`p-10 rounded-3xl border text-center space-y-3 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <AlertCircle className={`w-12 h-12 mx-auto ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          <h3 className={`text-lg font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            No se encontraron reservas
          </h3>
          <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            No hay reservas registradas que coincidan con la búsqueda.
          </p>
          <button
            onClick={onNewReservation}
            className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Crear nueva reserva en 3 clics
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => {
            const res = INITIAL_RESOURCES.find(item => item.id === r.resourceId) || INITIAL_RESOURCES[0];
            const slot = TIME_SLOTS.find(item => item.id === r.timeSlotId) || TIME_SLOTS[0];

            return (
              <div
                key={r.id}
                className={`p-5 rounded-2xl border shadow-md flex flex-col justify-between gap-3 transition-colors ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-slate-300'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className={`flex items-start justify-between gap-2 border-b pb-3 ${
                    isLight ? 'border-slate-200' : 'border-slate-800'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2.5 rounded-xl border ${
                        isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700'
                      }`}>
                        {res.category === 'proyector' && <Projector className={`w-5 h-5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />}
                        {res.id === 'sala_robotica' && <Bot className={`w-5 h-5 ${isLight ? 'text-sky-600' : 'text-sky-400'}`} />}
                        {res.id === 'sala_computacion' && <Monitor className={`w-5 h-5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />}
                      </div>
                      <div>
                        <span className={`text-[10px] uppercase font-black ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{res.code}</span>
                        <h4 className={`text-base font-black leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{res.name}</h4>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      isLight
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}>
                      Confirmada
                    </span>
                  </div>

                  {/* Primary Identification: Materia y Curso */}
                  <div className={`mt-3 p-2.5 rounded-xl border flex items-center justify-between ${
                    isLight
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-emerald-950/40 border-emerald-800/60'
                  }`}>
                    <div>
                      <span className={`text-[10px] font-extrabold uppercase block ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>Materia / Asignatura:</span>
                      <strong className={`text-sm font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{r.subject || 'Clase Especial'}</strong>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-extrabold uppercase block ${isLight ? 'text-sky-800' : 'text-sky-400'}`}>Curso / Año:</span>
                      <strong className={`text-sm font-black ${isLight ? 'text-sky-900' : 'text-sky-300'}`}>{r.course}</strong>
                    </div>
                  </div>

                  <div className={`grid grid-cols-2 gap-2 mt-3 text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <div>
                      <span className={`text-[10px] font-bold uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Fecha:</span>
                      <strong className={isLight ? 'text-slate-900' : 'text-white'}>{formatFriendlyDate(r.date)}</strong>
                    </div>

                    <div>
                      <span className={`text-[10px] font-bold uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Módulo:</span>
                      <strong className={isLight ? 'text-amber-800' : 'text-amber-300'}>{slot.label} ({slot.startTime} hs)</strong>
                    </div>
                  </div>
                </div>

                <div className={`pt-3 border-t flex items-center justify-between text-xs ${
                  isLight ? 'border-slate-200' : 'border-slate-800'
                }`}>
                  <span className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>ID: #{r.id}</span>
                  <button
                    onClick={() => setReservationToCancel(r)}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors border ${
                      isLight
                        ? 'bg-rose-100 hover:bg-rose-200 text-rose-900 border-rose-300'
                        : 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border-rose-700/80'
                    }`}
                  >
                    <Trash2 className={`w-3.5 h-3.5 ${isLight ? 'text-rose-700' : 'text-rose-400'}`} />
                    <span>Cancelar Reserva</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CUSTOM CONFIRMATION DIALOG MODAL FOR CANCELING A RESERVATION */}
      {reservationToCancel && (() => {
        const targetRes = INITIAL_RESOURCES.find(item => item.id === reservationToCancel.resourceId) || INITIAL_RESOURCES[0];
        const targetSlot = TIME_SLOTS.find(item => item.id === reservationToCancel.timeSlotId) || TIME_SLOTS[0];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-5 ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${isLight ? 'bg-rose-100 text-rose-700' : 'bg-rose-950/80 text-rose-400 border border-rose-800'}`}>
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    ¿Cancelar esta reserva?
                  </h3>
                  <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    El módulo quedará libre para otros docentes.
                  </p>
                </div>
              </div>

              {/* Reservation summary details */}
              <div className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={isLight ? 'text-slate-500 font-bold' : 'text-slate-400 font-bold'}>Recurso:</span>
                  <span className={`font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{targetRes.name} ({targetRes.code})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isLight ? 'text-slate-500 font-bold' : 'text-slate-400 font-bold'}>Materia:</span>
                  <span className={`font-black ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>{reservationToCancel.subject || 'Clase Especial'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isLight ? 'text-slate-500 font-bold' : 'text-slate-400 font-bold'}>Curso / Año:</span>
                  <span className={`font-black ${isLight ? 'text-sky-700' : 'text-sky-300'}`}>{reservationToCancel.course}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isLight ? 'text-slate-500 font-bold' : 'text-slate-400 font-bold'}>Fecha:</span>
                  <span className={`font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{formatFriendlyDate(reservationToCancel.date)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isLight ? 'text-slate-500 font-bold' : 'text-slate-400 font-bold'}>Módulo Horario:</span>
                  <span className={`font-black ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>{targetSlot.label} ({targetSlot.startTime} hs)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setReservationToCancel(null)}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs border transition-colors ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  No, Mantener
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onCancelReservation(reservationToCancel.id);
                    setReservationToCancel(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-black text-xs bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-1.5 shadow-lg shadow-rose-900/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Sí, Cancelar Reserva</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* CUSTOM CONFIRMATION DIALOG MODAL FOR RESETTING DATA */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-4 ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${isLight ? 'bg-amber-100 text-amber-700' : 'bg-amber-950/80 text-amber-400 border border-amber-800'}`}>
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  ¿Restablecer reservas de ejemplo?
                </h3>
                <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Se restaurará el listado de reservas iniciales para esta semana.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs border ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              >
                Sí, Restablecer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
