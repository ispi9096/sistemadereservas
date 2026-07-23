import React, { useState, useEffect } from 'react';
import { 
  Resource, 
  ResourceId, 
  Reservation, 
  FixedSchedule, 
  ViewMode 
} from './types';
import { 
  INITIAL_RESOURCES, 
  INITIAL_FIXED_SCHEDULES, 
  generateSampleReservationsForCurrentWeek,
  getMondayOfCurrentWeek,
  formatDateToYYYYMMDD
} from './data/initialData';

import {
  subscribeToReservations,
  subscribeToFixedSchedules,
  addReservationToDb,
  deleteReservationFromDb,
  addFixedScheduleToDb
} from './lib/firebase';

import { Header } from './components/Header';
import { QuickBookingWizard } from './components/QuickBookingWizard';
import { WeeklyScheduleView } from './components/WeeklyScheduleView';
import { DailyOverviewView } from './components/DailyOverviewView';
import { MyReservationsList } from './components/MyReservationsList';
import { FixedSchedulesModal } from './components/FixedSchedulesModal';
import { ReservationConfirmationModal } from './components/ReservationConfirmationModal';
import { PrintNoticeBoard } from './components/PrintNoticeBoard';
import { Wifi, RefreshCw } from 'lucide-react';

export default function App() {
  // View Mode
  const [activeView, setActiveView] = useState<ViewMode>('wizard');

  // Accessibility States
  const [lightMode, setLightMode] = useState<boolean>(() => {
    return localStorage.getItem('app_light_mode') === 'true' || localStorage.getItem('app_high_contrast') === 'true';
  });

  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>(() => {
    return (localStorage.getItem('app_font_size') as 'normal' | 'large' | 'xlarge') || 'normal';
  });

  // Reservations State (Real-time Firestore)
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [fixedSchedules, setFixedSchedules] = useState<FixedSchedule[]>(INITIAL_FIXED_SCHEDULES);
  const [isLoadingRealtime, setIsLoadingRealtime] = useState<boolean>(true);

  // Preselected slot state for quick grid cell click
  const [preselectedCell, setPreselectedCell] = useState<{
    resourceId: ResourceId;
    dateStr: string;
    slotId: number;
  } | null>(null);

  // Newly Created Confirmation Modal
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  // Print Notice Board Overlay
  const [showPrintOverlay, setShowPrintOverlay] = useState<boolean>(false);

  // Real-time Firestore listeners
  useEffect(() => {
    setIsLoadingRealtime(true);
    
    const unsubscribeReservations = subscribeToReservations((data) => {
      setReservations(data);
      setIsLoadingRealtime(false);
    });

    const unsubscribeFixedSchedules = subscribeToFixedSchedules((data) => {
      setFixedSchedules(data);
    });

    return () => {
      unsubscribeReservations();
      unsubscribeFixedSchedules();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('app_light_mode', String(lightMode));
  }, [lightMode]);

  useEffect(() => {
    localStorage.setItem('app_font_size', fontSize);
  }, [fontSize]);

  // Handlers
  const handleConfirmNewReservation = async (data: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newResId = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date().toISOString();
    
    const newRes: Reservation = {
      ...data,
      id: newResId,
      createdAt
    };

    try {
      await addReservationToDb(newRes);
      setConfirmedReservation(newRes);
      setPreselectedCell(null);
    } catch (err) {
      console.error('Error saving reservation to Firebase:', err);
      alert('Hubo un error al guardar la reserva en la nube. Por favor intenta nuevamente.');
    }
  };

  const handleCancelReservation = async (id: string) => {
    try {
      await deleteReservationFromDb(id);
      if (confirmedReservation?.id === id) {
        setConfirmedReservation(null);
      }
    } catch (err) {
      console.error('Error canceling reservation in Firebase:', err);
      alert('Hubo un error al cancelar la reserva en la nube.');
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('¿Estás seguro de restablecer las reservas a los datos de ejemplo?')) return;
    try {
      // Clear existing reservations
      for (const res of reservations) {
        await deleteReservationFromDb(res.id);
      }
      // Re-seed sample data
      const fresh = generateSampleReservationsForCurrentWeek();
      for (const res of fresh) {
        await addReservationToDb(res);
      }
    } catch (err) {
      console.error('Error resetting reservations:', err);
    }
  };

  const handleCellClickToBook = (resourceId: ResourceId, dateStr: string, slotId: number) => {
    setPreselectedCell({ resourceId, dateStr, slotId });
    setActiveView('wizard');
  };

  // Font Size CSS multiplier
  const fontSizeClass = fontSize === 'xlarge' ? 'text-lg' : fontSize === 'large' ? 'text-base' : 'text-sm';

  return (
    <div className={`min-h-screen font-sans transition-colors ${
      lightMode 
        ? 'bg-slate-100 text-slate-900' 
        : 'bg-slate-950 text-slate-100'
    } ${fontSizeClass}`}>
      {/* App Header & Navigation */}
      <Header
        activeView={activeView}
        onViewChange={(v) => {
          setActiveView(v);
          setPreselectedCell(null);
        }}
        lightMode={lightMode}
        onToggleLightMode={() => setLightMode(!lightMode)}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        totalActiveReservationsCount={reservations.length}
      />

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* VIEW 1: AGILE 3-CLICK WIZARD */}
        {activeView === 'wizard' && (
          <QuickBookingWizard
            key={preselectedCell ? `${preselectedCell.resourceId}-${preselectedCell.dateStr}-${preselectedCell.slotId}` : 'default-wizard'}
            reservations={reservations}
            fixedSchedules={fixedSchedules}
            onConfirmReservation={handleConfirmNewReservation}
            lightMode={lightMode}
            preselectedResourceId={preselectedCell?.resourceId}
            preselectedDate={preselectedCell?.dateStr}
            preselectedTimeSlotId={preselectedCell?.slotId}
          />
        )}

        {/* VIEW 2: WEEKLY SCHEDULE MATRIX */}
        {activeView === 'weekly' && (
          <WeeklyScheduleView
            reservations={reservations}
            fixedSchedules={fixedSchedules}
            onSelectCellToBook={handleCellClickToBook}
            onSelectExistingReservation={(r) => setConfirmedReservation(r)}
            lightMode={lightMode}
            onPrintNoticeBoard={() => setShowPrintOverlay(true)}
          />
        )}

        {/* VIEW 3: DAILY OVERVIEW COMPARISON */}
        {activeView === 'daily' && (
          <DailyOverviewView
            reservations={reservations}
            fixedSchedules={fixedSchedules}
            onSelectCellToBook={handleCellClickToBook}
            lightMode={lightMode}
          />
        )}

        {/* VIEW 4: MY RESERVATIONS MANAGEMENT */}
        {activeView === 'my_reservations' && (
          <MyReservationsList
            reservations={reservations}
            onCancelReservation={handleCancelReservation}
            onResetData={handleResetData}
            onNewReservation={() => {
              setPreselectedCell(null);
              setActiveView('wizard');
            }}
            lightMode={lightMode}
          />
        )}

        {/* VIEW 5: FIXED CURRICULUM SCHEDULES REFERENCE */}
        {activeView === 'fixed_schedules' && (
          <FixedSchedulesModal
            fixedSchedules={fixedSchedules}
            lightMode={lightMode}
          />
        )}
      </main>

      {/* CONFIRMATION TICKET RECEIPT MODAL */}
      {confirmedReservation && (
        <ReservationConfirmationModal
          reservation={confirmedReservation}
          onClose={() => setConfirmedReservation(null)}
          onCancelReservation={handleCancelReservation}
          onNewReservation={() => {
            setConfirmedReservation(null);
            setPreselectedCell(null);
            setActiveView('wizard');
          }}
          lightMode={lightMode}
        />
      )}

      {/* PRINT NOTICE BOARD OVERLAY */}
      {showPrintOverlay && (
        <PrintNoticeBoard
          reservations={reservations}
          fixedSchedules={fixedSchedules}
          onClose={() => setShowPrintOverlay(false)}
        />
      )}
    </div>
  );
}
