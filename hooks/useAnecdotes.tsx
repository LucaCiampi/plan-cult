import { useEffect, useState } from 'react';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import { isNearUser } from '@/utils/distanceUtils';
import { useSelector } from 'react-redux';
import { selectUserLocation } from '@/slices/userLocationSlice';
import { schedulePushNotification } from '@/utils/notificationsUtils';

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

  useEffect(() => {
    if (userLocation === null || anecdotes === undefined) return;

    const nearbyAnecdotes = anecdotes.filter((anecdote) =>
      isNearUser(userLocation, anecdote.coordinates)
    );

    nearbyAnecdotes.forEach((anecdote) => {
      void schedulePushNotification(
        `Anecdote : ${anecdote.title}`,
        anecdote.description ?? '',
        anecdote,
        5
      );
    });
  }, [userLocation, anecdotes]);

  return anecdotes?.filter(
    (anecdote) =>
      userLocation !== null && isNearUser(userLocation, anecdote.coordinates)
  );
}
