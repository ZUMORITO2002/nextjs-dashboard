'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchInvoices } from '@/app/lib/data'; 
import { Invoice } from '@/app/lib/definitions';

export default function Invoices({
 query,
 currentPage,
}: {
 query: string;
 currentPage: number;
}) {
 const [invoices, setInvoices] = useState<Invoice[]>([]);

 useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/list_invoices');
        if (!response.ok) {
          console.error('Network response was not ok');
          return;
        }
        const data: Invoice[] = await response.json();
        console.log('Fetched data:', data); // Debugging line
        setInvoices(data);
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      }
    };

    fetchData();
 }, []); // Empty dependency array means this effect runs once on component mount

 return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                 <div>
                    <div className="mb-2 flex items-center">
                      <p>{invoice.order_id}</p>
                    </div>
                    <p className="text-sm text-gray-500">{invoice.invoice_amount}</p>
                 </div>
                 <div className="mb-2 flex items-center">
                    <p>{invoice.address}</p>
                 </div>
                 <div className="mb-2 flex items-center">
                    <p>{invoice.date}</p>
                 </div>
                 <div className="mb-2 flex items-center">
                    <p>{invoice.customer_name}</p>
                 </div>
                </div>
                  <InvoiceStatus status={invoice.order_status} />
                <div className="flex w-full items-center justify-between pt-4">
                 <div className="flex justify-end gap-2">
                    <UpdateInvoice id={invoice.id} />
                    <DeleteInvoice id={invoice.id} />
                 </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                 Order ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                 Customer Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                 Address
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                 Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                 Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                 Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                 <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices.map((invoice) => (
                <tr
                 key={invoice.id}
                 className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                 <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{invoice.order_id}</p>
                    </div>
                 </td>
                 <td className="whitespace-nowrap px-3 py-3">
                    {invoice.customer_name}
                 </td>
                 <td className="whitespace-nowrap px-3 py-3">
                    {invoice.address}
                 </td>
                 <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(invoice.date)}
                 </td>
                 <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(invoice.invoice_amount)}
                 </td>
                 <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={invoice.order_status} />
                 </td>
                 <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
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

    






