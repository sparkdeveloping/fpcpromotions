"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestoreDb, hasFirebaseConfig } from "@/lib/firebaseClient";
import { initialData } from "@/lib/sampleData";

const STORAGE_KEY = "fpc-media-command-data-v1";
const FIRESTORE_PATH = ["mediaCommand", "resources"];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeDefaults(saved) {
  if (!saved) return clone(initialData);
  return {
    ...clone(initialData),
    ...saved,
    meta: { ...initialData.meta, ...(saved.meta || {}) },
  };
}

export function useResourceStore() {
  const [data, setData] = useState(() => clone(initialData));
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("local");
  const [saveState, setSaveState] = useState("idle");

  const db = useMemo(() => firestoreDb(), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        if (hasFirebaseConfig() && db) {
          const ref = doc(db, ...FIRESTORE_PATH);
          const snap = await getDoc(ref);

          if (!cancelled) {
            if (snap.exists()) {
              setData(mergeDefaults(snap.data()));
            } else {
              const fresh = clone(initialData);
              await setDoc(ref, fresh);
              setData(fresh);
            }
            setSource("firebase");
          }
        } else {
          const local = window.localStorage.getItem(STORAGE_KEY);
          if (!cancelled) {
            setData(mergeDefaults(local ? JSON.parse(local) : null));
            setSource("local");
          }
        }
      } catch (error) {
        console.error("Resource load failed:", error);
        const local = window.localStorage.getItem(STORAGE_KEY);
        if (!cancelled) {
          setData(mergeDefaults(local ? JSON.parse(local) : null));
          setSource("local");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [db]);

  async function persist(nextData) {
    setSaveState("saving");

    try {
      if (source === "firebase" && db) {
        await setDoc(doc(db, ...FIRESTORE_PATH), nextData, { merge: false });
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1200);
    } catch (error) {
      console.error("Resource save failed:", error);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
      setSaveState("local-only");
    }
  }

  function updateData(updater) {
    setData((current) => {
      const next = typeof updater === "function" ? updater(clone(current)) : updater;
      persist(next);
      return next;
    });
  }

  function resetData() {
    const fresh = clone(initialData);
    setData(fresh);
    persist(fresh);
  }

  return {
    data,
    setData: updateData,
    resetData,
    loading,
    source,
    saveState,
  };
}
