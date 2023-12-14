// ReservationProvider.js

import React, { createContext, useContext, useState } from 'react';

const ReservationContext = createContext();

export const useReservationContext = () => {
  return useContext(ReservationContext);
};

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState(() => {
    const storedReservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const sessionReservations = JSON.parse(sessionStorage.getItem('reservations')) || [];
    return [...storedReservations, ...sessionReservations];
  });

  const addReservation = async (reservation) => {
    // Save to local storage
    setReservations((prevReservations) => {
      const newReservations = [...prevReservations, reservation];
      localStorage.setItem('reservations', JSON.stringify(newReservations));
      return newReservations;
    });

    // Save to MongoDB on Render
    try {
      const response = await fetch('https://mp-h472.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
      });

      if (!response.ok) {
        console.error('Failed to save reservation to server');
      }
    } catch (error) {
      console.error('Error saving reservation to server:', error);
    }
  };

  return (
    <ReservationContext.Provider value={{ reservations, addReservation }}>
      {children}
    </ReservationContext.Provider>
  );
};
