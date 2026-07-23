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

// Configuración de Firebase
let firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForNetlifyBuild",
  authDomain: "gen-lang-client-0846084867.firebaseapp.com",
  projectId: "gen-lang-client-0846084867",
  storageBucket: "gen-lang-client-0846084867.appspot.com",
  messagingSenderId: "100000000000",
  appId: "1:100000000000:web:abcdef0123456789"
};

try {
  const configReq = import.meta.glob('../firebase-applet-config.json', { eager: true });
  const configModule = Object.values(configReq)[0] as any;
  if (configModule && configModule.default) {
    firebaseConfig = configModule.default;
  }
} catch (e) {
  console.warn("Usando configuración de respaldo para Firebase");
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Colecciones
const RESERVATIONS_COLLECTION = 'reservations';
const FIXED_SCHEDULES_COLLECTION = 'fixedSchedules';

// Suscripción a reservas en tiempo real
export const subscribeToReservations = (callback: (reservations: any[]) => void) => {
  const q = query(collection(db, RESERVATIONS_COLLECTION));
  return onSnapshot(q, (snapshot) => {
    const reservations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(reservations);
  }, (error) => {
    console.error("Error suscribiéndose a reservas:", error);
  });
};

// Suscripción a horarios fijos en tiempo real
export const subscribeToFixedSchedules = (callback: (schedules: any[]) => void) => {
  const q = query(collection(db, FIXED_SCHEDULES_COLLECTION));
  return onSnapshot(q, (snapshot) => {
    const schedules = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(schedules);
  }, (error) => {
    console.error("Error suscribiéndose a horarios fijos:", error);
  });
};

// Agregar reserva
export const addReservationToDb = async (reservation: any) => {
  try {
    const docRef = await addDoc(collection(db, RESERVATIONS_COLLECTION), reservation);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar reserva:", error);
    throw error;
  }
};

// Eliminar reserva
export const deleteReservationFromDb = async (id: string) => {
  try {
    await deleteDoc(doc(db, RESERVATIONS_COLLECTION, id));
  } catch (error) {
    console.error("Error al eliminar reserva:", error);
    throw error;
  }
};

// Agregar o actualizar horario fijo
export const saveFixedScheduleToDb = async (schedule: any) => {
  try {
    if (schedule.id) {
      await setDoc(doc(db, FIXED_SCHEDULES_COLLECTION, schedule.id), schedule);
    } else {
      await addDoc(collection(db, FIXED_SCHEDULES_COLLECTION), schedule);
    }
  } catch (error) {
    console.error("Error al guardar horario fijo:", error);
    throw error;
  }
};

// Eliminar horario fijo
export const deleteFixedScheduleFromDb = async (id: string) => {
  try {
    await deleteDoc(doc(db, FIXED_SCHEDULES_COLLECTION, id));
  } catch (error) {
    console.error("Error al eliminar horario fijo:", error);
    throw error;
  }
};

export default app;
