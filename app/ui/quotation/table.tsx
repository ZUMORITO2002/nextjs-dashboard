'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { UpdateQuotation, RemoveQuotation } from '@/app/ui/quotation/buttons';
import QuotationStatus from '@/app/ui/quotation/status';
import { fetchInvoices } from '@/app/lib/data';
import { Quotation } from '@/app/lib/definitions';
import { formatDateToLocal } from '@/app/lib/utils';

export default function Quotation({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/list_quotations');
        if (!response.ok) {
          console.error('Network response was not ok');
          return;
        }
        const data: Quotation[] = await response.json();
        console.log('Fetched data:', data); // Debugging line
        setQuotations(data);
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
            {quotations.map((quotations) => (
              <div
                key={quotations.qoutation_id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="mb-2 flex items-center">
                    <p>{quotations.qoutation_id}</p>
                  </div>
                  <div className="mb-2 flex items-center">
                    <p>{quotations.quotation_name}</p>
                  </div>
                  <div className="mb-2 flex items-center">
                    <p>{quotations.supplier_name}</p>
                  </div>
                  <div className="mb-2 flex items-center">
                    <p>{quotations.date}</p>
                  </div>
                </div>
                <QuotationStatus status={quotations.quotation_status} />
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <UpdateQuotation id={quotations.id} />
                    <RemoveQuotation id={quotations.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Quotation ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Quotation Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Supplier Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
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
              {quotations.map((quotations) => (
                <tr
                  key={quotations.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{quotations.qoutation_id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {quotations.quotation_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {quotations.supplier_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(quotations.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <QuotationStatus status={quotations.quotation_status} />
                  </td>

                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateQuotation id={quotations.id} />
                      <RemoveQuotation id={quotations.id} />
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
