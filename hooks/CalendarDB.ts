import { useState, useEffect } from "react";
import { db, auth } from "../app/auth/firebase";
import { collection, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

const useCalendarEvents = () => {
  const [eventsByDate, setEventsByDate] = useState<{ [date: string]: string[] }>({});
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const userEventsRef = doc(collection(db, "calendarEvents"), user.uid);
    
    const unsubscribe = onSnapshot(userEventsRef, (docSnap) => {
      if (docSnap.exists()) {
        setEventsByDate(docSnap.data() as { [date: string]: string[] });
      } else {
        setEventsByDate({});
      }
    });

    return () => unsubscribe();
  }, [user]);

  const saveEvents = async (newEvents: { [date: string]: string[] }) => {
    if (!user) return;
    
    const userEventsRef = doc(collection(db, "calendarEvents"), user.uid);
    try {
      await setDoc(userEventsRef, newEvents); // Guardar los eventos en Firebase
      setEventsByDate(newEvents);
    } catch (error) {
      console.error("Error guardando eventos: ", error);
    }
  };

  return { eventsByDate, saveEvents };
};

export default useCalendarEvents;
