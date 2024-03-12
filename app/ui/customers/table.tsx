'use client';

import Image from 'next/image';
import { EditCustomer, RemoveCustomer } from '@/app/ui/customers/buttons';
// import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';

import { useEffect, useState } from 'react';
import { Customer } from '@/app/lib/definitions';

export default async function CustomerTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
     const fetchData = async () => {
       try {
         const response = await fetch('http://127.0.0.1:8000/list_customers');
         if (!response.ok) {
           console.error('Network response was not ok');
           return;
         }
         const data: Customer[] = await response.json();
         console.log('Fetched data:', data); // Debugging line
         setCustomers(data);
       } catch (error) {
         console.error('There was a problem with your fetch operation:', error);
       }
     };
 
     fetchData();
  }, []);
  console.log(customers)
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {customers?.map((customers) => (
              <div
                key={customers.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{customers.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{customers.email}</p>
                  </div>
                  <div className="mb-2 flex items-center">
                      <p>{customers.phone_number}</p>
                    </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <EditCustomer id={customers.id} />
                    <RemoveCustomer id={customers.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Phone Number
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {customers?.map((customers) => (
                <tr
                  key={customers.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{customers.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {customers.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {customers.phone_number}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <EditCustomer id={customers.id} />
                      <RemoveCustomer id={customers.id} />
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
