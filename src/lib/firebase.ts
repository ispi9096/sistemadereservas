import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Reservation, FixedSchedule } from '../types';
import { INITIAL_FIXED_SCHEDULES, generateSampleReservationsForCurrentWeek } from '../data/initialData';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const RESERVATIONS_COLLECTION = 'reservations';
const FIXED_SCHEDULES_COLLECTION = 'fixed_schedules';

/**
 * Subscribe to reservations in real-time from Firestore.
 * Automatically seeds sample reservations if collection is completely empty on first run.
 */
export function subscribeToReservations(callback: (reservations: Reservation[]) => void) {
  const colRef = collection(db, RESERVATIONS_COLLECTION);
  
  return onSnapshot(colRef, async (snapshot) => {
    if (snapshot.empty) {
      // Seed default sample reservations if database is empty
      const initialReservations = generateSampleReservationsForCurrentWeek();
      const batch = writeBatch(db);
      initialReservations.forEach((res) => {
        const docRef = doc(db, RESERVATIONS_COLLECTION, res.id);
        batch.set(docRef, res);
      });
      try {
        await batch.commit();
      } catch (err) {
        console.error('Error seeding initial reservations:', err);
      }
      return;
    }

    const reservationsList: Reservation[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      reservationsList.push({
        id: docSnap.id,
        resourceId: data.resourceId,
        date: data.date,
        dayOfWeek: Number(data.dayOfWeek),
        timeSlotId: Number(data.timeSlotId),
        subject: data.subject || 'Clase',
        course: data.course || '',
        createdAt: data.createdAt || new Date().toISOString(),
        notes: data.notes || '',
        isFixed: !!data.isFixed
      });
    });

    callback(reservationsList);
  }, (error) => {
    console.error('Real-time reservations listener error:', error);
  });
}

/**
 * Subscribe to fixed schedules in real-time from Firestore.
 * Automatically seeds initial fixed schedules if collection is empty.
 */
export function subscribeToFixedSchedules(callback: (schedules: FixedSchedule[]) => void) {
  const colRef = collection(db, FIXED_SCHEDULES_COLLECTION);

  return onSnapshot(colRef, async (snapshot) => {
    if (snapshot.empty) {
      // Seed default fixed schedules if empty
      const batch = writeBatch(db);
      INITIAL_FIXED_SCHEDULES.forEach((sched) => {
        const docRef = doc(db, FIXED_SCHEDULES_COLLECTION, sched.id);
        batch.set(docRef, sched);
      });
      try {
        await batch.commit();
      } catch (err) {
        console.error('Error seeding initial fixed schedules:', err);
      }
      return;
    }

    const schedulesList: FixedSchedule[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      schedulesList.push({
        id: docSnap.id,
        resourceId: data.resourceId,
        dayOfWeek: Number(data.dayOfWeek),
        timeSlotId: Number(data.timeSlotId),
        subject: data.subject || '',
        course: data.course || '',
        notes: data.notes || ''
      });
    });

    callback(schedulesList);
  }, (error) => {
    console.error('Real-time fixed schedules listener error:', error);
  });
}

/**
 * Add a new reservation to Firestore
 */
export async function addReservationToDb(reservation: Omit<Reservation, 'id'> & { id?: string }): Promise<string> {
  const id = reservation.id || `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const docRef = doc(db, RESERVATIONS_COLLECTION, id);
  const dataToSave: Reservation = {
    ...reservation,
    id,
    createdAt: reservation.createdAt || new Date().toISOString()
  };
  await setDoc(docRef, dataToSave);
  return id;
}

/**
 * Update an existing reservation in Firestore
 */
export async function updateReservationInDb(id: string, updates: Partial<Reservation>): Promise<void> {
  const docRef = doc(db, RESERVATIONS_COLLECTION, id);
  await updateDoc(docRef, updates);
}

/**
 * Delete a reservation from Firestore
 */
export async function deleteReservationFromDb(id: string): Promise<void> {
  const docRef = doc(db, RESERVATIONS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Add a fixed schedule to Firestore
 */
export async function addFixedScheduleToDb(schedule: Omit<FixedSchedule, 'id'> & { id?: string }): Promise<string> {
  const id = schedule.id || `fix-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const docRef = doc(db, FIXED_SCHEDULES_COLLECTION, id);
  const dataToSave: FixedSchedule = {
    ...schedule,
    id
  };
  await setDoc(docRef, dataToSave);
  return id;
}

/**
 * Update a fixed schedule in Firestore
 */
export async function updateFixedScheduleInDb(id: string, updates: Partial<FixedSchedule>): Promise<void> {
  const docRef = doc(db, FIXED_SCHEDULES_COLLECTION, id);
  await updateDoc(docRef, updates);
}

/**
 * Delete a fixed schedule from Firestore
 */
export async function deleteFixedScheduleFromDb(id: string): Promise<void> {
  const docRef = doc(db, FIXED_SCHEDULES_COLLECTION, id);
  await deleteDoc(docRef);
}
