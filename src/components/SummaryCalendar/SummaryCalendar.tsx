import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getFormattedDate } from '@/lib/utils';

type PNCalendarProps = {
  onChange: Function;
  range: any;
  isDark?: boolean;
};

export default function SMCalendar({
  range,
  onChange,
  isDark,
}: PNCalendarProps) {
  const [focus, setFocus] = useState<number>(0);
  const handleRangeChange = (newRange: any) => {
    onChange(newRange);
  };
  useEffect(() => {
    if (range.length) setFocus(1);
    else setFocus(0);
  }, [range]);

  const getStyle = () => {
    if (focus) {
      if (isDark) return 'border-white-200 bg-[#fff3]';
      return 'border-black-200';
    }
    if (isDark) return 'border-primary bg-[#fff3]';
    return 'border-primary';
  };

  function formatShortWeekday(date: any) {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayIndex = date.getDay();
    return weekdays[dayIndex];
  }

  let eleMonthLater = new Date();
  eleMonthLater.setMonth(eleMonthLater.getMonth() + 11);

  return (
    <div>
      <div className="flex justify-between mb-5">
        <div
          className={`cursor-pointer w-[calc(50%-7px)] text-center py-2 rounded-md bg-[#fff3]`}
          role="presentation"
          onClick={() => setFocus(0)}
        >
          {range[0] ? getFormattedDate(range[0]) : 'Check In'}
        </div>
        <div
          className={`cursor-pointer w-[calc(50%-7px)] text-center py-2 rounded-md bg-[#fff3]`}
          role="presentation"
          onClick={() => setFocus(1)}
        >
          {range[1] ? getFormattedDate(range[1]) : 'Check Out'}
        </div>
      </div>
      <div className="flex justify-center">
        <Calendar
          selectRange
          calendarType="US"
          className={isDark ? 'dark' : ''}
          formatShortWeekday={(locale, date) => {
            return formatShortWeekday(date).slice(0, 1);
          }}
          value={range}
          onChange={handleRangeChange}
          tileDisabled={({ activeStartDate, date, view }) => {
            return date < new Date() || date > eleMonthLater;
          }}
          minDate={new Date()}
          maxDate={eleMonthLater}
        />
      </div>
    </div>
  );
}
