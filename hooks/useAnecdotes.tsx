import { useState, useEffect } from 'react';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import { isNearUser } from '@/utils/randomUtils';

export function useAnecdotes(): Anecdote[] | undefined {
  console.log('🪝 useAnecdotes');

  const dbService = useDatabaseService();
  const { location: userLocation } = useUserLocation();

  const [anecdotes, setAnecdotes] = useState<Anecdote[]>();

  useEffect(() => {
    const fetchAllAnecdotes = async () => {
      const allAnecdotes = await dbService.getAllAnecdotes();
      setAnecdotes(allAnecdotes);
    };

    void fetchAllAnecdotes();
  }, [dbService]);

  const nearbyAnecdotes = anecdotes?.filter((anecdote) => {
    if (userLocation === null) return false;
    return isNearUser(userLocation, anecdote.coordinates);
  });

  return nearbyAnecdotes;
}
