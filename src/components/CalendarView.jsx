import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // базовые стили, мы их переопределим

const CalendarView = ({ foodEntries, onDateSelect }) => {
  // Получаем даты, в которые есть записи
  const entryDates = foodEntries.map(entry => new Date(entry.date).toDateString());
  const uniqueDates = [...new Set(entryDates)];

  // Функция для добавления класса дням с записями
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toDateString();
      if (uniqueDates.includes(dateString)) {
        return 'has-entry';
      }
    }
    return null;
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        tileClassName={tileClassName}
        onClickDay={(date) => onDateSelect && onDateSelect(date)}
        calendarType="gregory"
        locale="ru-RU"
      />
    </div>
  );
};

export default CalendarView;