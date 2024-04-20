'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  UpdateInvoice,
  DeleteInvoice,
} from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchInvoices } from '@/app/lib/data';
import { Invoice } from '@/app/lib/definitions';
import {DocumentArrowDownIcon } from '@heroicons/react/24/outline';
export default function Invoices({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  function DownloadInvoice({
    id,
    order_name,
  }: {
    id: string;
    order_name: string;
  }) {
    const [isLoading, setIsLoading] = useState(false);

    const downloadInvoiceWithId = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/download-invoice/${id}/`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/pdf' },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to download invoice');
        }

        // Convert response to blob
        const blob = await response.blob();

        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([blob]));

        // Create a temporary <a> element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${order_name}.pdf`;
        document.body.appendChild(a);
        a.click();

        // Clean up: remove the temporary <a> element and revoke the URL
        window.URL.revokeObjectURL(url);
        a.remove();

        // Show success feedback to the user
        alert('Invoice downloaded successfully!');
      } catch (error) {
        console.error('Error downloading invoice:', error);
        // Show error feedback to the user
        alert('Failed to download invoice. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <button
        onClick={downloadInvoiceWithId}
        disabled={isLoading}
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        {isLoading ? (
          <>
            <span className="sr-only">Loading...</span>
            <svg
              className="h-5 w-5 animate-spin text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </>
        ) : (
          <>
            <span className="sr-only">Download</span>
            <DocumentArrowDownIcon className="w-5" />
          </>
        )}
      </button>
    );
  }

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
                key={invoice.order_id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{invoice.order_id}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {invoice.invoice_amount}
                    </p>
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
                <InvoiceStatus status={invoice.invoice_status} />
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <DownloadInvoice
                      id={invoice.order_id}
                      order_name={invoice.order_name}
                    />
                    <UpdateInvoice id={invoice.order_id} />
                    <DeleteInvoice id={invoice.order_id} />
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
                  key={invoice.order_id}
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
                    <InvoiceStatus status={invoice.invoice_status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <DownloadInvoice
                        id={invoice.order_id}
                        order_name={invoice.order_name}
                      />
                      <UpdateInvoice id={invoice.order_id} />
                      <DeleteInvoice id={invoice.order_id} />
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
