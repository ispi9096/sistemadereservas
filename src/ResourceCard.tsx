import React from 'react';
import { Projector, Bot, Monitor, CheckCircle2, AlertCircle, ShieldAlert, MapPin, Sparkles } from 'lucide-react';
import { Resource, ResourceId } from '../types';

interface ResourceCardProps {
  resource: Resource;
  isSelected: boolean;
  onSelect: () => void;
  availableBadge?: string;
  isAvailableForSelectedSlot?: boolean;
  occupantMessage?: string;
  lightMode?: boolean;
  highContrast?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  isSelected,
  onSelect,
  availableBadge,
  isAvailableForSelectedSlot = true,
  occupantMessage,
  lightMode = false,
  highContrast = false
}) => {
  const renderIcon = () => {
    switch (resource.category) {
      case 'proyector':
        return <Projector className={`w-8 h-8 ${lightMode ? 'text-amber-600' : 'text-amber-400'}`} />;
      case 'sala':
        if (resource.id === 'sala_robotica') {
          return <Bot className={`w-8 h-8 ${lightMode ? 'text-sky-600' : 'text-sky-400'}`} />;
        }
        return <Monitor className={`w-8 h-8 ${lightMode ? 'text-emerald-600' : 'text-emerald-400'}`} />;
      default:
        return <Sparkles className={`w-8 h-8 ${lightMode ? 'text-indigo-600' : 'text-indigo-400'}`} />;
    }
  };

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-500 min-h-[160px] flex flex-col justify-between ${
        lightMode
          ? isSelected
            ? 'bg-emerald-50 border-emerald-600 ring-4 ring-emerald-500/20 text-slate-900 scale-[1.02] shadow-lg'
            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
          : isSelected
            ? 'bg-slate-800 border-emerald-500 ring-4 ring-emerald-500/30 text-white scale-[1.02] shadow-xl'
            : 'bg-slate-900/90 hover:bg-slate-800/80 border-slate-700 text-slate-100 hover:border-slate-500'
      }`}
    >
      {/* Selection Checkmark */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${
            lightMode
              ? isSelected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 border border-slate-200'
              : 'bg-slate-800 border border-slate-700'
          }`}>
            {renderIcon()}
          </div>
          <div>
            <div className={`text-xs font-black uppercase tracking-wider ${lightMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {resource.code}
            </div>
            <h3 className={`text-lg font-black leading-tight ${lightMode ? 'text-slate-900' : 'text-slate-100'}`}>
              {resource.name}
            </h3>
          </div>
        </div>

        <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-transform ${
          isSelected
            ? 'bg-emerald-500 text-white border-emerald-400 scale-110'
            : lightMode ? 'border-slate-300 bg-slate-100' : 'border-slate-600 bg-slate-800'
        }`}>
          {isSelected && <CheckCircle2 className="w-5 h-5 stroke-[3]" />}
        </div>
      </div>

      {/* Description & Location */}
      <p className={`text-xs sm:text-sm font-medium mt-3 line-clamp-2 ${lightMode ? 'text-slate-600' : 'text-slate-300'}`}>
        {resource.description}
      </p>

      {/* Location Badge */}
      <div className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${lightMode ? 'text-slate-600' : 'text-slate-400'}`}>
        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="truncate">{resource.location}</span>
      </div>

      {/* Features tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {resource.features.map((feat, idx) => (
          <span
            key={idx}
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
              lightMode
                ? 'bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-slate-800/80 text-slate-300 border border-slate-700'
            }`}
          >
            {feat}
          </span>
        ))}
      </div>

      {/* Availability Status Badge */}
      {availableBadge && (
        <div className={`mt-4 pt-3 border-t flex items-center justify-between ${lightMode ? 'border-slate-200' : 'border-slate-800/80'}`}>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
            isAvailableForSelectedSlot
              ? lightMode
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
              : lightMode
                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                : 'bg-rose-950 text-rose-300 border border-rose-700/50'
          }`}>
            {isAvailableForSelectedSlot ? (
              <CheckCircle2 className={`w-3.5 h-3.5 ${lightMode ? 'text-emerald-700' : 'text-emerald-400'}`} />
            ) : (
              <AlertCircle className={`w-3.5 h-3.5 ${lightMode ? 'text-rose-700' : 'text-rose-400'}`} />
            )}
            {availableBadge}
          </span>

          {occupantMessage && (
            <span className={`text-[11px] font-semibold truncate max-w-[180px] ${lightMode ? 'text-rose-800' : 'text-rose-300'}`} title={occupantMessage}>
              {occupantMessage}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
