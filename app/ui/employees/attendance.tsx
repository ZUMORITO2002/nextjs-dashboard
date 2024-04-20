"use client"
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface AttendanceData {
  employee_name: string;
  check_in: string;
  check_in_time: string;
  check_out_time: string;
}

interface YourComponentProps {
    employeeId: string;
  }

const EmployeeAttendancePage: React.FC <YourComponentProps>= ({ employeeId }) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/get_attendance/${employeeId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
        }
        const data: AttendanceData[] = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchAttendanceData();
  }, []);

  const handleDateChange = (value: Date | Date[] | null) => {
    setSelectedDate(value instanceof Date ? value : (value ? value[0] : null));
  };

  const getAttendanceForSelectedDate = (): AttendanceData[] => {
    return attendanceData.filter(item => {
      return new Date(item.check_in).toDateString() === (selectedDate?.toDateString() ?? '');
    });
  };

  return (
    <div>
      <h1>Attendance</h1>
      <div className="calendar-container">
        <Calendar onChange={handleDateChange} value={selectedDate} />
        {selectedDate && (
          <div className="attendance-table">
            <h2>Attendance for {selectedDate.toDateString()}</h2>
            <table className="bg-white">
              <thead  className="px-3 py-5 font-medium">
                <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                  <th>Check-in</th>
                  <th>Check-out</th>
                </tr>
              </thead>
              <tbody>
                {getAttendanceForSelectedDate().map((attendance, index) => (
                  <tr key={index} className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">{attendance.check_in_time}</td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">{attendance.check_out_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAttendancePage;
