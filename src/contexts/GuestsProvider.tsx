import {
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { randomId } from '@/lib/utils';
import type { Guest } from '@/lib/types';

interface GuestProviderProps {
  children: React.ReactNode;
}

type GuestsContextType = {
  guests: Guest[];
  setGuests: (value: SetStateAction<Guest[]>) => void;
  addGuest: () => void;
};

const defaultValue = [{ tempid: randomId() }] as Guest[];

const GuestsContext = createContext<GuestsContextType>({
  guests: defaultValue,
  setGuests: () => {},
  addGuest: () => {},
});

export function useGuests() {
  const context = useContext(GuestsContext);
  if (!context) {
    throw new Error('useGuests must be used within a GuestsProvider');
  }
  return context;
}

export default function GuestsProvider({ children }: GuestProviderProps) {
  const [guests, setGuests] = useState<Guest[]>(defaultValue);

  const addGuest = useCallback(
    () => setGuests((prevGuests) => [...prevGuests, { tempid: randomId() }]),
    [setGuests],
  );

  const data = useMemo(
    () => ({ guests, setGuests, addGuest }),
    [guests, setGuests, addGuest],
  );

  return (
    <GuestsContext.Provider value={data}>{children}</GuestsContext.Provider>
  );
}
