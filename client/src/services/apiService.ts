import { MeetingType } from '@models/MeetingType';
import { Reservation } from '@models/Reservation';
import { ReservationDto } from '@models/Reservation.dto';

const API_BASE_URL = 'http://localhost:3005';

export const getReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservation`);
    if (!response.ok) {
      const errorResponse = await response.json();
      const errorMessage =
        errorResponse.message || "Une erreur s'est produite";
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createReservation = async (
  createReservationDto: ReservationDto,
): Promise<Reservation> => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createReservationDto),
    };

    const response = await fetch(`${API_BASE_URL}/reservation`, requestOptions);
    if (!response.ok) {
      const errorResponse = await response.json();
      const errorMessage =
        errorResponse.message || "Une erreur s'est produite";
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getMeetingTypes = async (): Promise<MeetingType[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/meeting-type`);
    if (!response.ok) {
      const errorResponse = await response.json();
      const errorMessage =
        errorResponse.message || "Une erreur s'est produite";
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
