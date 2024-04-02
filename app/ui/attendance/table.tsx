'use client';

import Image from 'next/image';
import { CheckIn, CheckOut } from '@/app/ui/attendance/buttons';
// import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';

import { MouseEvent, useEffect, useState } from 'react';
import { Employee } from '@/app/lib/definitions';
import { Checkbox } from '@/components/ui/checkbox';

export default async function EmployeeTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/list_employees');
        if (!response.ok) {
          console.error('Network response was not ok');
          return;
        }
        const data: Employee[] = await response.json();
        console.log('Fetched data:', data); // Debugging line
        setEmployees(data);
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      }
    };

    fetchData();
  }, []);

  function handleCheckboxChange(event: MouseEvent<HTMLInputElement, MouseEvent>, employeeId: string): void {
    const isChecked = event.currentTarget.checked;
    if (isChecked) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    } else {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    }
  }

  const handleCheckIn = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/mark_attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeIds: selectedEmployees, "action": "check_in" }),
      });
      if (!response.ok) {
        console.error('Failed to check in employees');
        return;
      }
      console.log('Employees checked in successfully');
    } catch (error) {
      console.error('Error checking in employees:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/mark_attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeIds: selectedEmployees, "action": "check_out" }),
      });
      if (!response.ok) {
        console.error('Failed to check out employees');
        return;
      }
      console.log('Employees checked out successfully');
    } catch (error) {
      console.error('Error checking out employees:', error);
    }
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Employee ID
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Employee
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {employees?.map((employee) => (
                <tr
                  key={employee.employee_id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{employee.employee_id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {employee.name}
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`employee-${employee.employee_id}`}
                        checked={selectedEmployees.includes(employee.employee_id)}
                        onChange={(event) => handleCheckboxChange(event, employee.employee_id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className='flex items-end w-full flex-row-reverse'>
        <button
          className="m-2 flex h-10 w-32 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onClick={handleCheckOut}
        >
          <span className="hidden md:block">Check Out</span>{' '}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            className="h-5 md:ml-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            ></path>
          </svg>
        </button>

        <button
          className="m-2 flex h-10 w-32 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onClick={handleCheckIn}
        >
          <span className="hidden md:block">Check In</span>{' '}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            className="h-5 md:ml-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
