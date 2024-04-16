"use client";

import { useState, useEffect } from 'react';
import { Employee } from '@/app/lib/definitions';
import { Dialog, DialogContent } from '@/components/ui/dialog';
const AttendanceTable = () => {
  // const [employees, setEmployees] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  // const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);


  // Fetch employees from the API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/list_employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  // Handle checkbox toggle
  const handleCheckboxChange = (employeeId: string) => {
    setSelectedEmployees(prevSelected => {
      if (prevSelected.includes(employeeId)) {
        return prevSelected.filter(id => id !== employeeId);
      } else {
        return [...prevSelected, employeeId];
      }
    });
  };

  // Handle check in/out
  const handleCheckIn = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/mark_attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employee_ids: selectedEmployees,
          action: 'check_in'

        })
      });
      if (response.ok) {
        setDialogMessage('Check in successful!');
      } else {
        setDialogMessage('Check in failed. Please try again later.');
      }

      setDialogVisible(true);
    } catch (error) {
      setDialogMessage('Check in failed. Please try again later.');
      setDialogVisible(true);
    }
  };

  const handleCheckOut = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/mark_attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employee_ids: selectedEmployees,
          action: 'check_out'

        })
      });
      if (response.ok) {
        setDialogMessage('Check out successful!');
      } else {
        setDialogMessage('Check out failed. Please try again later.');
      }

      setDialogVisible(true);
    } catch (error) {
      setDialogMessage('Check out failed. Please try again later.');
      setDialogVisible(true);
    }
  };

  return (
    <div className="mt-6 flow-root">
      <Dialog open={dialogVisible} onOpenChange={(open) => setDialogVisible(open)}>
        <DialogContent>
          <p>{dialogMessage}</p>
        </DialogContent>
      </Dialog>
      <table className="hidden rounded-lg min-w-full text-gray-900 bg-white border-b md:table">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr>
            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
              Employee
            </th>
            <th scope="col" className="px-3 py-5 font-medium">

            </th>
          </tr>
        </thead>
        <tbody className="bg-white border-b rounded-lg">
          {employees.map((employee: { employee_id: string; name: string }) => (
            <tr key={employee.employee_id} className="rounded-lg w-full border-b py-3 text-sm last-of-type:border-none">
              <td className="whitespace-nowrap px-4 py-3">
                {employee.name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedEmployees.includes(employee.employee_id)}
                  onChange={() => handleCheckboxChange(employee.employee_id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between pt-4">
        <div>
          <button onClick={handleCheckIn} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 gap-2 rounded">
            Check In
          </button>
          <button onClick={handleCheckOut} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 gap-2 rounded">
            Check Out
          </button>
        </div>
      </div>
    </div>

  );
};

export default AttendanceTable;
