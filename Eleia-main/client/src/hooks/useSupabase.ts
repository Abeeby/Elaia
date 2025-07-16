import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, ClassSession, Booking } from '../lib/supabase';

// Hook pour récupérer l'utilisateur actuel
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Décoder le JWT pour obtenir l'ID utilisateur
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', payload.id)
          .single();

        if (!error && data) {
          setUser(data);
        }
      } catch (error) {
        console.error('Erreur récupération utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
}

// Hook pour récupérer le planning des cours
export function useClassSchedule() {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('class_sessions')
        .select(`
          *,
          class_types (*)
        `)
        .gte('start_time', new Date().toISOString())
        .order('start_time');

      if (error) throw error;
      setClasses(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return { classes, loading, error, refetch: fetchClasses };
}

// Hook pour gérer les réservations
export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useCurrentUser();

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            class_sessions (
              *,
              class_types (*)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setBookings(data);
        }
      } catch (error) {
        console.error('Erreur récupération réservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const createBooking = async (classSessionId: string) => {
    if (!user) throw new Error('Utilisateur non connecté');

    const response = await fetch('http://localhost:5001/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ class_session_id: classSessionId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la réservation');
    }

    const result = await response.json();
    
    // Rafraîchir les réservations
    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        class_sessions (
          *,
          class_types (*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setBookings(data);
    
    return result;
  };

  const cancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (error) throw error;

    // Rafraîchir les réservations
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
    );
  };

  return { bookings, loading, createBooking, cancelBooking };
}

// Hook pour les abonnements temps réel
export function useRealtimeClasses() {
  const [classes, setClasses] = useState<ClassSession[]>([]);

  useEffect(() => {
    // Récupérer les données initiales
    const fetchInitial = async () => {
      const { data } = await supabase
        .from('class_sessions')
        .select(`
          *,
          class_types (*)
        `)
        .gte('start_time', new Date().toISOString())
        .order('start_time');

      if (data) setClasses(data);
    };

    fetchInitial();

    // S'abonner aux changements
    const subscription = supabase
      .channel('class_sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'class_sessions'
        },
        (payload) => {
          console.log('Changement détecté:', payload);
          fetchInitial(); // Recharger les données
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return classes;
} 