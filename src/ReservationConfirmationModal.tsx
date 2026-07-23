import React from 'react';
import { 
  CheckCircle2, 
  Printer, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  GraduationCap, 
  MapPin, 
  X,
  Share2,
  Sparkles
} from 'lucide-react';
import { Reservation, Resource } from '../types';
import { INITIAL_RESOURCES, TIME_SLOTS } from '../data/initialData';
import { formatFriendlyDate } from '../utils/dateUtils';

interface ReservationConfirmationModalProps {
  reservation: Reservation;
  onClose: () => void;
  onCancelReservation: (id: string) => void;
  onNewReservation: () => void;
  lightMode?: boolean;
  highContrast?: boolean;
}

export const ReservationConfirmationModal: React.FC<ReservationConfirmationModalProps> = ({
  reservation,
  onClose,
  onCancelReservation,
  onNewReservation,
  lightMode = false,
  highContrast = false
}) => {
  const isLight = lightMode;
  const [showConfirmCancel, setShowConfirmCancel] = React.useState(false);
  const resource = INITIAL_RESOURCES.find(r => r.id === reservation.resourceId) || INITIAL_RESOURCES[0];
  const slot = TIME_SLOTS.find(s => s.id === reservation.timeSlotId) || TIME_SLOTS[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className={`relative max-w-lg w-full rounded-3xl border-2 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 ${
        isLight
          ? 'bg-white text-slate-800 border-slate-200 shadow-xl'
          : 'bg-slate-900 text-slate-100 border-emerald-500/80'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Visual Confirmation Banner */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-600 border-2 border-emerald-500 flex items-center justify-center mb-3 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            ¡Reserva Confirmada Exitosamente!
          </span>
          <h2 className={`text-2xl font-black mt-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Comprobante de Reserva
          </h2>
          <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Código de Verificación: <strong className={isLight ? 'text-amber-700' : 'text-amber-400'}>#{reservation.id.toUpperCase()}</strong>
          </p>
        </div>

        {/* Printable Ticket Receipt Card */}
        <div className={`p-5 rounded-2xl border space-y-4 text-sm font-medium ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/90 border-slate-700'
        }`}>
          {/* Resource Name */}
          <div className={`flex items-start justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-700'}`}>
            <div>
              <span className={`text-[10px] uppercase font-black tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Recurso Reservado:</span>
              <h3 className={`text-lg font-black leading-tight ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
                {resource.name}
              </h3>
            </div>
            <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${
              isLight ? 'bg-white border-slate-200 text-amber-800' : 'bg-slate-900 border-slate-700 text-amber-300'
            }`}>
              {resource.code}
            </span>
          </div>

          {/* Date & Time */}
          <div className={`grid grid-cols-2 gap-3 border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-700'}`}>
            <div>
              <span className={`text-[10px] uppercase font-black flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Fecha:
              </span>
              <div className={`text-sm font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {formatFriendlyDate(reservation.date)}
              </div>
            </div>

            <div>
              <span className={`text-[10px] uppercase font-black flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                Módulo Horario:
              </span>
              <div className={`text-sm font-bold mt-0.5 ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                {slot.label} ({slot.startTime} - {slot.endTime} hs)
              </div>
            </div>
          </div>

          {/* Primary Identifier: Materia & Course */}
          <div className={`grid grid-cols-2 gap-3 border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-700'}`}>
            <div>
              <span className="text-[10px] uppercase font-black text-emerald-700 flex items-center gap-1">
                Materia / Asignatura:
              </span>
              <div className={`text-sm font-black mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {reservation.subject || 'Clase Especial'}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-black text-sky-700 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                Curso / Año:
              </span>
              <div className={`text-sm font-black mt-0.5 ${isLight ? 'text-sky-800' : 'text-sky-300'}`}>
                {reservation.course}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className={`flex items-center gap-2 text-xs pt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Retirar / Utilizar en: <strong>{resource.location}</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2">
          {showConfirmCancel ? (
            <div className={`p-4 rounded-2xl border space-y-3 animate-in fade-in duration-150 ${
              isLight ? 'bg-rose-50 border-rose-200' : 'bg-rose-950/60 border-rose-800'
            }`}>
              <p className={`text-xs font-bold text-center ${isLight ? 'text-rose-900' : 'text-rose-200'}`}>
                ¿Confirmas que deseas cancelar esta reserva?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmCancel(false)}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs border ${
                    isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  No, Mantener
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onCancelReservation(reservation.id);
                    onClose();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl font-black text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-md"
                >
                  Sí, Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className={`px-4 py-3 rounded-xl font-bold text-xs border flex items-center justify-center gap-2 transition-colors ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Printer className={`w-4 h-4 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
                <span>Imprimir Ficha</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmCancel(true)}
                className={`px-4 py-3 rounded-xl font-bold text-xs border flex items-center justify-center gap-2 transition-colors ${
                  isLight
                    ? 'bg-rose-100 hover:bg-rose-200 text-rose-900 border-rose-300'
                    : 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border-rose-700'
                }`}
              >
                <Trash2 className={`w-4 h-4 ${isLight ? 'text-rose-700' : 'text-rose-400'}`} />
                <span>Cancelar Reserva</span>
              </button>
            </div>
          )}

          <button
            onClick={() => {
              onClose();
              onNewReservation();
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-black text-sm text-white shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span>Realizar Otra Reserva Rápida</span>
          </button>
        </div>
      </div>
    </div>
  );
};
