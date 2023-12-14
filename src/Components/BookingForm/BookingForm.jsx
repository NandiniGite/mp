import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useReservationContext } from '../../ReservationContext';
import './BookingForm.css';

const LabReservation = () => {
  const { reservations, addReservation } = useReservationContext();
  const [reservationDetails, setReservationDetails] = useState({
    name: '',
    email: '',
    startTime: '',
    endTime: '',
    labId: '',
    date: '', // Added date to reservationDetails
  });
  const [existingReservations, setExistingReservations] = useState([]);
  const [labs] = useState([
    { id: 1, name: 'Computer Lab 1' },
    { id: 2, name: 'Computer Lab 2' },
    { id: 3, name: 'Computer Lab 3' },
    // Add more labs as needed
  ]);

  const handleInputChange = (e) => {
    setReservationDetails({
      ...reservationDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();

    const startTime = parseInt(reservationDetails.startTime.replace(':', ''), 10);
    const endTime = parseInt(reservationDetails.endTime.replace(':', ''), 10);

    // Check for overlapping reservations on the selected date
    const overlappingReservation = existingReservations.find((reservation) => {
      const existingStartTime = parseInt(reservation.startTime.replace(':', ''), 10);
      const existingEndTime = parseInt(reservation.endTime.replace(':', ''), 10);

      // Check if the time slot overlaps, it's the same lab, and the same date
      return (
        reservationDetails.labId === reservation.labId &&
        reservationDetails.date === reservation.date &&
        ((startTime >= existingStartTime && startTime < existingEndTime) ||
          (endTime > existingStartTime && endTime <= existingEndTime) ||
          (startTime <= existingStartTime && endTime >= existingEndTime))
      );
    });

    if (overlappingReservation) {
      // Display toast with information about the existing reservation
      toast.error(
        `This lab is already booked during the selected time and date by ${overlappingReservation.name}. Please choose a different time or lab.`
      );
    } else {
      try {
        // Save reservation to context
        addReservation({
          labId: reservationDetails.labId,
          name: reservationDetails.name,
          email: reservationDetails.email,
          startTime: reservationDetails.startTime,
          endTime: reservationDetails.endTime,
          date: reservationDetails.date,
        });

        // Display toast with user name, date, start time, and end time
        toast.success(
          `Reservation saved successfully! Booked by ${reservationDetails.name} on ${reservationDetails.date} from ${reservationDetails.startTime} to ${reservationDetails.endTime}`
        );

        // Clear form fields
        setReservationDetails({
          name: '',
          email: '',
          startTime: '',
          endTime: '',
          labId: '',
          date: '',
        });
      } catch (error) {
        console.error('Error saving reservation:', error);
        toast.error('Error saving reservation');
      }
    }
  };

  const fetchReservations = () => {
    const storedReservations = JSON.parse(localStorage.getItem('reservations')) || [];
    setExistingReservations(storedReservations);
  };

  useEffect(() => {
    // Fetch existing reservations on component mount
    fetchReservations();
  }, [reservations]); // Trigger the effect whenever reservations change

  return (
    <div>
      <h2 style={{textAlign:"center"}}>Lab Reservation</h2>
      <form onSubmit={handleReservationSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={reservationDetails.name} onChange={handleInputChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={reservationDetails.email} onChange={handleInputChange} />
        </label>
        <label>
          Select Lab:
          <select
            value={reservationDetails.labId}
            onChange={(e) => setReservationDetails({ ...reservationDetails, labId: e.target.value })}
          >
            <option value="" disabled>
              Select a lab
            </option>
            {labs.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date:
          <input type="date" name="date" value={reservationDetails.date} onChange={handleInputChange} />
        </label>
        <label>
          Start Time:
          <input type="time" name="startTime" value={reservationDetails.startTime} onChange={handleInputChange} />
        </label>
        <label>
          End Time:
          <input type="time" name="endTime" value={reservationDetails.endTime} onChange={handleInputChange} />
        </label>
        <button type="submit" style={{justifyContent:"center"}}>Submit Reservation</button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default LabReservation;
