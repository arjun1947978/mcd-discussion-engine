import React from 'react';
import { formatDateSeparator } from '../../utils/dateUtils';

export const DateSeparator = ({ date }) => {
  const label = formatDateSeparator(date);

  return (
    <div className="wa-date-separator-container">
      <div className="wa-date-pill">
        <span>{label}</span>
      </div>
    </div>
  );
};

export default DateSeparator;

