import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase con respaldo seguro
let firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForNetlifyBuild",
  authDomain: "gen-lang-client-0846084867.firebaseapp.com",
  projectId: "gen-lang-client-0846084867",
  storageBucket: "gen-lang-client-0846084867.appspot.com",
  messagingSenderId: "100000000000",
  appId: "1:100000000000:web:abcdef0123456789"
};

try {
  // Intentamos cargar el archivo local si existe
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
export default app;
