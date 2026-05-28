"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestoreDb, hasFirebaseConfig } from "@/lib/firebaseClient";
import { initialData } from "@/lib/appData";

const STORAGE_KEY = "fpc-media-command-final-v1";
const FIRESTORE_DOC = ["mediaCommand", "main"];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeData(saved) {
  if (!saved) return clone(initialData);
  return {
    ...clone(initialData),
    ...saved,
    gear: saved.gear || initialData.gear,
    access: saved.access || initialData.access,
    templates: saved.templates || initialData.templates,
    people: saved.people || initialData.people,
    weeklyPosts: saved.weeklyPosts || initialData.weeklyPosts,
    contentCategories: saved.contentCategories || initialData.contentCategories,
    activity: saved.activity || [],
    notes: saved.notes || initialData.notes,
    calendarEvents: saved.calendarEvents || initialData.calendarEvents,
    presets: saved.presets || initialData.presets
  };
}

export function useAppStore(currentUser) {
  const [data, setDataState] = useState(() => clone(initialData));
  const [source, setSource] = useState("Local");
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("Ready");
  const db = useMemo(() => firestoreDb(), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        if (hasFirebaseConfig() && db) {
          const ref = doc(db, ...FIRESTORE_DOC);
          const snap = await getDoc(ref);
          if (cancelled) return;
          if (snap.exists()) {
            setDataState(mergeData(snap.data()));
          } else {
            const fresh = clone(initialData);
            await setDoc(ref, fresh);
            setDataState(fresh);
          }
          setSource("Firebase");
        } else {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          if (!cancelled) {
            setDataState(mergeData(raw ? JSON.parse(raw) : null));
            setSource("Local");
          }
        }
      } catch (error) {
        console.error("App store load failed:", error);
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!cancelled) {
          setDataState(mergeData(raw ? JSON.parse(raw) : null));
          setSource("Local");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [db]);

  async function persist(next) {
    setSaveState("Saving");
    try {
      if (source === "Firebase" && db) {
        await setDoc(doc(db, ...FIRESTORE_DOC), next, { merge: false });
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaveState("Saved");
      setTimeout(() => setSaveState("Ready"), 900);
    } catch (error) {
      console.error("Persist failed:", error);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaveState("Saved locally");
    }
  }

  function setData(updater, activity) {
    setDataState((current) => {
      const next = typeof updater === "function" ? updater(clone(current)) : updater;
      if (activity) {
        next.activity = [
          { id: `log-${Date.now()}`, at: new Date().toISOString(), user: currentUser?.name || "Unknown", action: activity },
          ...(next.activity || [])
        ].slice(0, 100);
      }
      persist(next);
      return next;
    });
  }

  function resetData() {
    const fresh = clone(initialData);
    setData(fresh, "reset app data");
  }

  return { data, setData, resetData, loading, source, saveState };
}
