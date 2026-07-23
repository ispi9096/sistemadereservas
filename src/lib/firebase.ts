import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query
} from 'firebase/firestore';
import firebaseConfigJson from '../firebase-applet-config.json';

// Configuración de prueba / producción
const firebaseConfig = firebaseConfigJson || {
  apiKey: "AIzaSyDummyKeyForNetlifyBuild",
  authDomain: "gen-lang-client-0846084867.firebaseapp.com",
  projectId: "gen-lang-client-0846084867",
  storageBucket: "gen-lang-client-0846084867.appspot.com",
  messagingSenderId: "100000000000",
  appId: "1:100000000000:web:abcdef0123456789"
};

let app: any = null;
let db: any = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
} catch (e) {
  console.warn("Error al inicializar Firebase, ejecutando en modo local:", e);
}

export { db };

const RESERVATIONS_COLLECTION = 'reservations';
const FIXED_SCHEDULES_COLLECTION = 'fixedSchedules';

export const subscribeToReservations = (callback: (reservations: any[]) => void) => {
  if (!db) {
    callback([]);
    return () => {};
  }
  try {
    const q = query(collection(db, RESERVATIONS_COLLECTION));
    return onSnapshot(q, (snapshot) => {
      const reservations = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(reservations);
    }, (err) => {
      console.warn("Error en listener de reservas:", err);
      callback([]);
    });
  } catch (e) {
    console.warn("Error al suscribir reservas:", e);
    callback([]);
    return () => {};
  }
};

export const subscribeToFixedSchedules = (callback: (schedules: any[]) => void) => {
  if (!db) {
    callback([]);
    return () => {};
  }
  try {
    const q = query(collection(db, FIXED_SCHEDULES_COLLECTION));
    return onSnapshot(q, (snapshot) => {
      const schedules = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(schedules);
    }, (err) => {
      console.warn("Error en listener de horarios fijos:", err);
      callback([]);
    });
  } catch (e) {
    console.warn("Error al suscribir horarios fijos:", e);
    callback([]);
    return () => {};
  }
};

export const addReservationToDb = async (reservation: any) => {
  if (!db) return Date.now().toString();
  return (await addDoc(collection(db, RESERVATIONS_COLLECTION), reservation)).id;
};

export const deleteReservationFromDb = async (id: string) => {
  if (!db) return;
  await deleteDoc(doc(db, RESERVATIONS_COLLECTION, id));
};

export const saveFixedScheduleToDb = async (schedule: any) => {
  if (!db) return;
  if (schedule.id) {
    await setDoc(doc(db, FIXED_SCHEDULES_COLLECTION, schedule.id), schedule);
  } else {
    await addDoc(collection(db, FIXED_SCHEDULES_COLLECTION), schedule);
  }
};

export const deleteFixedScheduleFromDb = async (id: string) => {
  if (!db) return;
  await deleteDoc(doc(db, FIXED_SCHEDULES_COLLECTION, id));
};

export default app;
