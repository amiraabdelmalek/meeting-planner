import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  FormControl,
  Typography,
  Box,
} from '@mui/material';
import { ReservationDto } from '@models/Reservation.dto';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import fr from 'date-fns/locale/fr';
import { useForm, Controller } from 'react-hook-form';
import { MeetingType } from '../models/MeetingType';
import { createReservation, getMeetingTypes } from '../services/apiService';
import { ReservationFormData } from '../models/Reservation';

interface ReservationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess: () => void;
}

const ReservationFormModal: React.FC<ReservationFormModalProps> = ({
  isOpen,
  onClose,
  onCreateSuccess,
}) => {
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<ReservationFormData>({
    mode: 'onChange',
  });

  const onSubmit = async (data: ReservationFormData) => {
    try {
      const reservationDto: ReservationDto = {
        ...data,
        capacity: Number(data.capacity),
        startTime: data.startTime.toISOString(),
        endTime: data.endTime?.toISOString() || '',
      };
      await createReservation(reservationDto);
      onCreateSuccess();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Une erreur inattendue s'est produite.");
      }
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const data = await getMeetingTypes();
      setMeetingTypes(data);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Une erreur inattendue s'est produite.");
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Nouvelle réservation</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={1} marginBottom={1}>
            <Grid item xs={6}>
              <Controller
                name="createdBy"
                control={control}
                rules={{ required: 'Organisateur est obligatoire' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Organisateur *"
                    error={!!errors.createdBy}
                    helperText={errors.createdBy?.message}
                    fullWidth
                    margin="dense"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="capacity"
                control={control}
                rules={{
                  required: 'Participants est obligatoire',
                  min: { value: 2, message: 'Minimum 2 Participants' },
                  validate: (value) =>
                    value > 0 || 'Seuls les nombres positifs sont autorisés',
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Nombre de participants *"
                    error={!!errors.capacity}
                    helperText={errors.capacity?.message}
                    fullWidth
                    margin="dense"
                    InputProps={{
                      inputProps: {
                        min: 2,
                        max: 23,
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
            <Grid container spacing={1} marginBottom={1}>
              <Grid item xs={6}>
                <Controller
                  name="startTime"
                  control={control}
                  rules={{ required: 'Début de la réunion est obligatoire' }}
                  render={({ field }) => (
                    <DateTimePicker
                      label="Début de la réunion"
                      value={field.value}
                      onChange={(newValue) => {
                        if (newValue) {
                          field.onChange(newValue);
                          const endTime = new Date(newValue);
                          endTime.setHours(endTime.getHours() + 1);

                          setValue('endTime', endTime);
                        } else {
                          setValue('endTime', null);
                        }
                      }}
                      ampm={false}
                      views={['year', 'month', 'day', 'hours']}
                      minTime={new Date(0, 0, 0, 8)}
                      maxTime={new Date(0, 0, 0, 20)}
                      shouldDisableDate={(date: Date) => {
                        return date.getDay() < 1 || date.getDay() > 5;
                      }}
                      slotProps={{
                        textField: {
                          error: !!errors.startTime,
                          helperText: errors.startTime?.message,
                          variant: 'outlined',
                          fullWidth: true,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="endTime"
                  control={control}
                  rules={{ required: 'Fin de la réunion est obligatoire' }}
                  render={({ field }) => (
                    <DateTimePicker
                      label="Fin de la réunion"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={true}
                      ampm={false}
                      views={['year', 'month', 'day', 'hours']}
                      minTime={new Date(0, 0, 0, 8)}
                      maxTime={new Date(0, 0, 0, 20)}
                      shouldDisableDate={(date: Date) => {
                        return date.getDay() < 1 || date.getDay() > 5;
                      }}
                      slotProps={{
                        textField: {
                          error: !!errors.endTime,
                          helperText: errors.endTime?.message,
                          variant: 'outlined',
                          fullWidth: true,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="meetingTypeId"
                control={control}
                rules={{ required: 'Type de réunion est obligatoire' }}
                render={({ field }) => (
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="meeting-type-label">
                      Type de réunion *
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="meeting-type-label"
                      label="Type de réunion *"
                      error={!!errors.meetingTypeId}
                    >
                      {meetingTypes.map((meetingType) => (
                        <MenuItem value={meetingType.id} key={meetingType.id}>
                          {meetingType.name + ' (' + meetingType.code + ')'}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.meetingTypeId && (
                      <p style={{ color: 'red' }}>
                        {errors.meetingTypeId.message}
                      </p>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        {errorMessage && (
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Typography variant="body1" color="error">
              {errorMessage}
            </Typography>
          </Box>
        )}
        <DialogActions>
          <Button variant="outlined" onClick={onClose} color="primary">
            Annuler
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={!isValid}
          >
            Confirmer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ReservationFormModal;
