export const isSameDay = (d1, d2) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isToday = (date) => {
  return isSameDay(date, new Date());
};

export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
};

export const formatDateSeparator = (dateInput) => {
  const d = new Date(dateInput);
  if (isToday(d)) return 'TODAY';
  if (isYesterday(d)) return 'YESTERDAY';

  const day = d.getDate();
  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
};

export const formatTime = (dateInput) => {
  const d = new Date(dateInput);
  let hours = d.getHours();
  let minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const strMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${strMinutes} ${ampm}`;
};

