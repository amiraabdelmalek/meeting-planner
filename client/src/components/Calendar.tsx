import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendar.css';
import { getReservations } from '../services/apiService';
import 'moment/locale/fr';
const localizer = momentLocalizer(moment);

const CalendarComp = () => {
  const [events, setEvents] = useState<
    {
      start: Date;
      end: Date;
      title: any;
    }[]
  >([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const messages = useMemo(
    () => ({
      allDay: 'Toute la journée',
      previous: 'Précédent',
      next: 'Suivant',
      today: "Aujourd'hui",
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
      agenda: 'Agenda',
      date: 'Date',
      time: 'Heure',
      event: 'Réservation',
    }),
    [],
  );

  const fetchData = useCallback(async () => {
    try {
      const data = await getReservations();
      const dataCalendar = data.map((item) => ({
        start: new Date(item.startTime),
        end: new Date(item.endTime),
        title:
          item.name +
          ' (' +
          item.meetingType.code +
          ') créer par ' +
          item.createdBy,
      }));
      setEvents(dataCalendar);
    } catch (error) {
      setSnackbarOpen(true);

      if (error instanceof Error) {
        setAlertMessage(error.message);
      } else {
        setAlertMessage("Une erreur inattendue s'est produite.");
      }
    }
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
    setAlertMessage(null);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={{ height: '100vh' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100vh' }}
        messages={messages}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CalendarComp;
