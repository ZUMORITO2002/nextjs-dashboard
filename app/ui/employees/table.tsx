'use client';

import Image from 'next/image';
import { AttendanceEmployee, EditEmployee, RemoveEmployee, SalaryEmployee } from '@/app/ui/employees/buttons';
// import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';

import { useEffect, useState } from 'react';
import { Employee } from '@/app/lib/definitions';

export default async function EmployeeTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [employees, setEmployees] = useState<Employee[]>([]);

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
  console.log(employees)
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {employees?.map((employees) => (
              <div
                key={employees.employee_id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                  <div className="mb-2 flex items-center">
                      <p>{employees.employee_id}</p>
                    </div>
                    <div className="mb-2 flex items-center">
                      <p>{employees.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{employees.address}</p>
                  </div>
                  <div className="mb-2 flex items-center">
                      <p>{employees.phone_number}</p>
                    </div>
                  <div className="mb-2 flex items-center">
                    <p>{employees.date_of_joining}</p>
                 </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <SalaryEmployee id={employees.employee_id} name={employees.name}/>
                    <EditEmployee id={employees.employee_id} />
                    <RemoveEmployee id={employees.employee_id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
              <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Employee ID
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Employee
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Address
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Phone Number
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date of Joining
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {employees?.map((employees) => (
                <tr
                  key={employees.employee_id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{employees.employee_id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {employees.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {employees.address}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {employees.phone_number}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(employees.date_of_joining)}
                 </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                    <AttendanceEmployee id={employees.employee_id} name={employees.name} />
                    <SalaryEmployee id={employees.employee_id} name={employees.name} />
                    <EditEmployee id={employees.employee_id} />
                    <RemoveEmployee id={employees.employee_id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
  );
}
