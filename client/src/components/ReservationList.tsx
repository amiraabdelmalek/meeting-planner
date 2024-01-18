import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Grid,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import ReservationFormModal from './ReservationFormModal';
import AddIcon from '@mui/icons-material/Add';
import { Reservation } from '../models/Reservation';
import { getReservations } from '../services/apiService';
import { formatBookingTime, formatDate } from '../utils/dateUtils';

const ReservationList = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

  const handleToggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
    setAlertMessage(null);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (error) {
      setAlertType('error');
      if (error instanceof Error) {
        setAlertMessage(error.message);
      } else {
        setAlertMessage("Une erreur inattendue s'est produite.");
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateSuccess = useCallback(() => {
    setIsModalOpen(false);
    setSnackbarOpen(true);
    setAlertMessage('Réservation créé avec succès!');
    setAlertType('success');
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        marginBottom={5}
      >
        <Grid item>
          <Typography variant="h5" fontWeight={'700'}>
            Réservations
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleToggleModal}
          >
            Nouvelle réservation
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Créneau</TableCell>
              <TableCell>Salle</TableCell>
              <TableCell>Type de réunion</TableCell>
              <TableCell>Equipment</TableCell>
              <TableCell>Créer par</TableCell>
              <TableCell>Créer le</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell component="th" scope="row">
                  {reservation.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {formatBookingTime(
                    reservation.startTime,
                    reservation.endTime,
                  )}
                </TableCell>
                <TableCell component="th" scope="row">
                  {reservation.meetingRoom.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {reservation.meetingType.code}
                </TableCell>
                <TableCell component="th" scope="row">
                  {reservation.equipments.length > 0
                    ? reservation.equipments.map((equipment) => {
                        return equipment.name + ', ';
                      })
                    : 'Aucun équipment additionel'}
                </TableCell>
                <TableCell component="th" scope="row">
                  {reservation.createdBy}
                </TableCell>
                <TableCell component="th" scope="row">
                  {formatDate(reservation.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={alertType}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      {isModalOpen && (
        <ReservationFormModal
          isOpen={isModalOpen}
          onClose={handleToggleModal}
          onCreateSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default ReservationList;
