import { useState, useEffect } from 'react';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import { isNearUser } from '@/utils/randomUtils';
import { useSelector } from 'react-redux';
import { selectUserLocation } from '@/slices/userLocationSlice';

export function useAnecdotes(): Anecdote[] | undefined {
  console.log('🪝 useAnecdotes');

  const dbService = useDatabaseService();
  const userLocation = useSelector(selectUserLocation);

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
