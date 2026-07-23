import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  Sun, 
  Moon, 
  ZoomIn, 
  ZoomOut, 
  PlusCircle, 
  CalendarDays, 
  Grid, 
  FileText, 
  Info,
  Building2,
  ShieldAlert
} from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  lightMode: boolean;
  onToggleLightMode: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  totalActiveReservationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onViewChange,
  lightMode,
  onToggleLightMode,
  fontSize,
  onChangeFontSize,
  totalActiveReservationsCount
}) => {
  const [showAccessibilityInfo, setShowAccessibilityInfo] = useState(false);

  return (
    <header 
      className={`border-b sticky top-0 z-40 transition-colors shadow-sm ${
        lightMode 
          ? 'bg-white text-slate-900 border-slate-200 shadow-slate-200/50' 
          : 'bg-slate-900 text-white border-slate-800'
      }`}
    >
      {/* Top Banner: Institutional Identity & Accessibility Bar */}
      <div className={`px-4 py-2 border-b text-xs sm:text-sm flex flex-wrap items-center justify-between gap-2 ${
        lightMode ? 'border-slate-200 bg-slate-100 text-slate-800' : 'border-slate-800 bg-slate-950/60'
      }`}>
        <div className="flex items-center gap-2 font-medium flex-wrap">
          <Building2 className={`w-4 h-4 ${lightMode ? 'text-emerald-700' : 'text-emerald-400'}`} />
          <span>Instituto Ntra. Sra. de la Misericordia — Sistema de Recursos</span>
          <span className={`hidden md:inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            lightMode ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            Reserva Ágil por Materia
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
            lightMode ? 'bg-sky-100 text-sky-900 border border-sky-300' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Nube En Vivo
          </span>
        </div>

        {/* Accessibility Tools: Font size & Light mode toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAccessibilityInfo(!showAccessibilityInfo)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${
              lightMode ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Ver ayuda de accesibilidad"
          >
            <Info className={`w-3.5 h-3.5 ${lightMode ? 'text-sky-600' : 'text-sky-400'}`} />
            <span className="hidden sm:inline">Accesibilidad</span>
          </button>

          <div className={`flex items-center rounded border p-0.5 ${
            lightMode ? 'bg-slate-200/80 border-slate-300' : 'bg-slate-800/80 border-slate-700'
          }`}>
            <span className={`px-1.5 text-xs font-medium ${lightMode ? 'text-slate-600' : 'text-slate-400'}`}>Texto:</span>
            <button
              onClick={() => onChangeFontSize('normal')}
              className={`px-1.5 py-0.5 text-xs font-bold rounded ${fontSize === 'normal' ? 'bg-emerald-600 text-white' : lightMode ? 'text-slate-700 hover:bg-slate-300' : 'text-slate-300 hover:bg-slate-700'}`}
              title="Tamaño Estándar"
            >
              A
            </button>
            <button
              onClick={() => onChangeFontSize('large')}
              className={`px-1.5 py-0.5 text-sm font-bold rounded ${fontSize === 'large' ? 'bg-emerald-600 text-white' : lightMode ? 'text-slate-700 hover:bg-slate-300' : 'text-slate-300 hover:bg-slate-700'}`}
              title="Tamaño Grande (+20%)"
            >
              A+
            </button>
            <button
              onClick={() => onChangeFontSize('xlarge')}
              className={`px-1.5 py-0.5 text-base font-bold rounded ${fontSize === 'xlarge' ? 'bg-emerald-600 text-white' : lightMode ? 'text-slate-700 hover:bg-slate-300' : 'text-slate-300 hover:bg-slate-700'}`}
              title="Tamaño Extra Grande (+40%)"
            >
              A++
            </button>
          </div>

          <button
            onClick={onToggleLightMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all border ${
              lightMode 
                ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200' 
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/40'
            }`}
            title="Alternar entre Vista Oscura y Vista Clara"
          >
            {lightMode ? <Sun className="w-3.5 h-3.5 text-amber-600" /> : <Moon className="w-3.5 h-3.5 text-amber-300" />}
            <span>{lightMode ? 'Vista Clara ON' : 'Vista Clara'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* App Title & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md flex items-center justify-center font-black">
            <Sparkles className="w-6 h-6 text-yellow-200 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              Reserva de Recursos
            </h1>
            <p className={`text-xs sm:text-sm font-medium ${lightMode ? 'text-slate-600' : 'text-slate-300'}`}>
              Proyectores • Sala de Robótica • Sala de Computación
            </p>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className={`px-4 border-t ${lightMode ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-900/90'}`}>
        <div className="max-w-7xl mx-auto flex items-center overflow-x-auto no-scrollbar gap-2 py-2">
          {/* Quick Wizard Button */}
          <button
            onClick={() => onViewChange('wizard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border shadow-sm ${
              activeView === 'wizard'
                ? lightMode
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 ring-2 ring-emerald-500/30'
                : lightMode
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <PlusCircle className={`w-4 h-4 ${activeView === 'wizard' ? 'text-white' : 'text-emerald-500'}`} />
            <span>Nueva Reserva (3 Clics)</span>
          </button>

          {/* Weekly Grid Button - Emojis removed to prevent duplicate iconography */}
          <button
            onClick={() => onViewChange('weekly')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
              activeView === 'weekly'
                ? lightMode
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow'
                  : 'bg-emerald-600 text-white border-emerald-500'
                : lightMode
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-slate-800/60 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <CalendarDays className={`w-4 h-4 ${activeView === 'weekly' ? 'text-white' : 'text-emerald-500'}`} />
            <span>Vista Semanal</span>
          </button>

          {/* Daily Overview Button - Emojis removed to prevent duplicate iconography */}
          <button
            onClick={() => onViewChange('daily')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
              activeView === 'daily'
                ? lightMode
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow'
                  : 'bg-emerald-600 text-white border-emerald-500'
                : lightMode
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-slate-800/60 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Grid className={`w-4 h-4 ${activeView === 'daily' ? 'text-white' : 'text-sky-500'}`} />
            <span>Vista por Día</span>
          </button>

          {/* My Reservations Button */}
          <button
            onClick={() => onViewChange('my_reservations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
              activeView === 'my_reservations'
                ? lightMode
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow'
                  : 'bg-emerald-600 text-white border-emerald-500'
                : lightMode
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-slate-800/60 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <FileText className={`w-4 h-4 ${activeView === 'my_reservations' ? 'text-white' : 'text-amber-500'}`} />
            <span>Mis Reservas</span>
            {totalActiveReservationsCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-amber-500 text-slate-950 font-black">
                {totalActiveReservationsCount}
              </span>
            )}
          </button>

          {/* Fixed Curriculum Schedule Reference Button */}
          <button
            onClick={() => onViewChange('fixed_schedules')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
              activeView === 'fixed_schedules'
                ? lightMode
                  ? 'bg-rose-600 text-white border-rose-700 shadow'
                  : 'bg-rose-600 text-white border-rose-500'
                : lightMode
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-slate-800/60 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <ShieldAlert className={`w-4 h-4 ${activeView === 'fixed_schedules' ? 'text-white' : 'text-rose-500'}`} />
            <span>Horarios Fijos (Curriculares)</span>
          </button>
        </div>
      </div>

      {/* Accessibility Help Banner Modal */}
      {showAccessibilityInfo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 max-w-lg w-full shadow-2xl ${
            lightMode ? 'bg-white text-slate-800 border-slate-200' : 'bg-slate-900 text-slate-100 border-slate-700'
          }`}>
            <h3 className="text-xl font-black text-emerald-600 mb-3 flex items-center gap-2">
              <Sun className="w-6 h-6" />
              Características de Accesibilidad y Apariencia
            </h3>
            <ul className={`space-y-3 text-sm ${lightMode ? 'text-slate-600' : 'text-slate-300'}`}>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">1.</span>
                <span><strong>Vista Clara / Oscura:</strong> Haz clic en el botón "Vista Clara" en el encabezado para alternar entre la apariencia de tema claro u oscuro según tus preferencias visuales.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">2.</span>
                <span><strong>Aumento de Fuente:</strong> Usa los botones A, A+ y A++ para aumentar el tamaño del texto hasta un 40% adicional.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">3.</span>
                <span><strong>Controles Táctiles Amplios:</strong> Todos los botones tienen un área táctil superior a 44px para facilitar el toque en smartphones y tablets.</span>
              </li>
            </ul>
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowAccessibilityInfo(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-sm"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
