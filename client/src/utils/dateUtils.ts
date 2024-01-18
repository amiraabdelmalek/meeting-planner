import moment from 'moment';

export const formatBookingTime = (startTime: string, endTime: string) => {
  const format = 'DD/MM/YYYY, HH:mm';

  const formattedStartTime = moment(startTime).format(format);
  const formattedEndTime = moment(endTime).format('HH:mm');

  return `${formattedStartTime} - ${formattedEndTime}`;
};

export const formatDate = (date: string) => {
  const format = 'DD/MM/YYYY';

  const formattedDate = moment(date).format(format);

  return `${formattedDate}`;
};
