import { db, auth } from "../app/auth/firebase.js";
import { collection, doc, writeBatch } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

const states = [
  { id: "AGS", name: "Aguascalientes" },
  { id: "BC", name: "Baja California" },
  { id: "BCS", name: "Baja California Sur" },
  { id: "CAM", name: "Campeche" },
  { id: "CHIS", name: "Chiapas" },
  { id: "CHIH", name: "Chihuahua" },
  { id: "COAH", name: "Coahuila" },
  { id: "COL", name: "Colima" },
  { id: "CDMX", name: "Ciudad de México" },
  { id: "DUR", name: "Durango" },
  { id: "GTO", name: "Guanajuato" },
  { id: "GRO", name: "Guerrero" },
  { id: "HGO", name: "Hidalgo" },
  { id: "JAL", name: "Jalisco" },
  { id: "MEX", name: "México" },
  { id: "MICH", name: "Michoacán" },
  { id: "MOR", name: "Morelos" },
  { id: "NAY", name: "Nayarit" },
  { id: "NL", name: "Nuevo León" },
  { id: "OAX", name: "Oaxaca" },
  { id: "PUE", name: "Puebla" },
  { id: "QRO", name: "Querétaro" },
  { id: "QROO", name: "Quintana Roo" },
  { id: "SLP", name: "San Luis Potosí" },
  { id: "SIN", name: "Sinaloa" },
  { id: "SON", name: "Sonora" },
  { id: "TAB", name: "Tabasco" },
  { id: "TAMPS", name: "Tamaulipas" },
  { id: "TLAX", name: "Tlaxcala" },
  { id: "VER", name: "Veracruz" },
  { id: "YUC", name: "Yucatán" },
  { id: "ZAC", name: "Zacatecas" },
];

const agregarEstados = async () => {
  const batch = writeBatch(db);
  const statesRef = collection(db, "states");

  states.forEach((state) => {
    const stateDoc = doc(statesRef, state.id); 
    batch.set(stateDoc, { name: state.name });
  });

  await batch.commit();
  console.log("Estados agregados correctamente a Firestore");
};

const autenticarYAgregarEstados = async () => {
    try {
      const email = "correo@ejemplo.com"; // Reemplaza con un usuario válido
      const password = "ejemplo"; // Reemplaza con la contraseña correcta
  
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
      await agregarEstados();
    } catch (error) {
      console.error("❌ Error de autenticación:", error);
    }
  };

autenticarYAgregarEstados();
