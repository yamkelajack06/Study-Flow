import { createContext, useState, useEffect, useContext, useRef } from 'react';
import * as LocalStrategy from '../persistence/localStrategy';
import { FirebaseStrategy } from '../persistence/firebaseStrategy';
import { useAuth } from './AuthContext';

const PersistenceContext = createContext();

export const usePersistence = () => useContext(PersistenceContext);

export const PersistenceProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  // Keep a ref to the current strategy so async callbacks use the latest one
  const strategyRef = useRef(null);

  // ─── Bootstrap: switch strategy & load entries whenever auth changes ───────
  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);

      if (currentUser) {
        const firebaseStrategy = new FirebaseStrategy(currentUser.uid);
        strategyRef.current = firebaseStrategy;

        // Check if there are local entries to migrate
        const localEntries = await LocalStrategy.getEntries();
        const cloudEntries = await firebaseStrategy.getEntries();

        if (localEntries.length > 0 && cloudEntries.length === 0) {
          // First sign-in: migrate local data to Firestore
          const migrated = await firebaseStrategy.migrateFromLocal(localEntries);
          await LocalStrategy.clearEntries();
          setEntries(migrated);
        } else {
          setEntries(cloudEntries);
        }
      } else {
        // Logged out → use localStorage
        strategyRef.current = null;
        const local = await LocalStrategy.getEntries();
        setEntries(local);
      }

      setLoading(false);
    };

    bootstrap();
  }, [currentUser]);

  // ─── CRUD operations ────────────────────────────────────────────────────────

  const addEntry = async (entry) => {
    if (strategyRef.current) {
      // Firestore
      try {
        const saved = await strategyRef.current.addEntry(entry);
        setEntries((prev) => [...prev, saved]);
        return true;
      } catch {
        return false;
      }
    } else {
      // localStorage
      const updated = await LocalStrategy.addEntry(entries, entry);
      if (updated) {
        setEntries(updated);
        return true;
      }
      return false;
    }
  };

  const updateEntry = async (entry) => {
    if (strategyRef.current) {
      try {
        const updated = await strategyRef.current.updateEntry(entry);
        setEntries((prev) =>
          prev.map((e) =>
            (e.firestoreId || e.id) === (updated.firestoreId || updated.id)
              ? updated
              : e
          )
        );
        return true;
      } catch {
        return false;
      }
    } else {
      const updated = await LocalStrategy.updateEntry(entries, entry);
      if (updated) {
        setEntries(updated);
        return true;
      }
      return false;
    }
  };

  const deleteEntry = async (entryId) => {
    if (strategyRef.current) {
      try {
        await strategyRef.current.deleteEntry(entryId);
        setEntries((prev) =>
          prev.filter((e) => (e.firestoreId || e.id) !== entryId)
        );
        return true;
      } catch {
        return false;
      }
    } else {
      const updated = await LocalStrategy.deleteEntry(entries, entryId);
      if (updated) {
        setEntries(updated);
        return true;
      }
      return false;
    }
  };

  const value = {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    isCloud: !!currentUser,
  };

  return (
    <PersistenceContext.Provider value={value}>
      {children}
    </PersistenceContext.Provider>
  );
};