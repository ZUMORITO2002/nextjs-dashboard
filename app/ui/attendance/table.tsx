"use client";

import { useState, useEffect } from 'react';
import { Employee } from '@/app/lib/definitions';
const EmployeeTable = () => {
  // const [employees, setEmployees] = useState([]);
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
      // Handle response as needed
    } catch (error) {
      console.error('Error checking in:', error);
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
      // Handle response as needed
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Check In</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee: { employee_id: string; name: string }) => (
            <tr key={employee.employee_id}>
              <td>{employee.name}</td>
              <td>
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
      <div>
        <button onClick={handleCheckIn}>Check In</button>
        <button onClick={handleCheckOut}>Check Out</button>
      </div>
    </div>
  );
};

export default EmployeeTable;
