import { createContext, useState, useEffect, useContext } from 'react';
import { LocalStrategy } from '../persistence/localStrategy';
import { FirebaseStrategy } from '../persistence/firebaseStrategy';
import { useAuth } from './AuthContext';

const PersistenceContext = createContext();

export const usePersistence = () => {
    return useContext(PersistenceContext);
};

export const PersistenceProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [strategy, setStrategy] = useState(() => LocalStrategy);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const newStrategy = currentUser ? new FirebaseStrategy(currentUser.uid) : new LocalStrategy();
        setStrategy(newStrategy);
    }, [currentUser]);

    useEffect(() => {
        const loadEntries = async () => {
            setLoading(true);
            const loadedEntries = await strategy.getEntries();
            setEntries(loadedEntries);
            setLoading(false);
        };
        loadEntries();
    }, [strategy]);

    const addEntry = async (entry) => {
        await strategy.addEntry(entry);
        const loadedEntries = await strategy.getEntries();
        setEntries(loadedEntries);
    };

    const updateEntry = async (entry) => {
        await strategy.updateEntry(entry);
        const loadedEntries = await strategy.getEntries();
        setEntries(loadedEntries);
    };

    const deleteEntry = async (entryId) => {
        await strategy.deleteEntry(entryId);
        const loadedEntries = await strategy.getEntries();
        setEntries(loadedEntries);
    };

    const value = {
        entries,
        loading,
        addEntry,
        updateEntry,
        deleteEntry,
    };

    return (
        <PersistenceContext.Provider value={value}>
            {children}
        </PersistenceContext.Provider>
    );
};