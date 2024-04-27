"use client"

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { fetchLatestInvoices } from '@/app/lib/data';


import { useState, useEffect } from 'react';

interface Invoice {
  customer_name: string;
  amount: string;
  customer_id: string;
  order_id: string;
}

export default function LatestInvoices() {
  const [latestInvoices, setLatestInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    async function fetchLatestInvoices() {
      try {
        const response = await fetch('http://127.0.0.1:8000/top_5_latest_invoices');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: Invoice[] = await response.json();
        setLatestInvoices(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchLatestInvoices();
  }, []); // Empty dependency array to fetch data only once on component mount

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Unpaid Invoices
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestInvoices.map((invoice, i) => {
            // /dashboard/invoices/1/edit
            const invoiceUrl = `/dashboard/invoices/${invoice.order_id}/edit`;
            return (
              <a key={invoice.order_id} href={invoiceUrl} className="block">
                <div
                  className={clsx(
                    'flex flex-row items-center justify-between py-4',
                    {
                      'border-t': i !== 0,
                    },
                  )}
                >
                  <div className="flex items-center">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold md:text-base">
                        {invoice.customer_name}
                      </p>
                      <p className="hidden text-sm text-gray-500 sm:block">
                        OrderId: {invoice.order_id}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                  >
                    {invoice.amount}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}









// export default async function LatestInvoices() { // Remove props
//   const latestInvoices = await fetchLatestInvoices();
//   return (
//     <div className="flex w-full flex-col md:col-span-4">
//       <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
//         Latest Invoices
//       </h2>
//       <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
//         {/* NOTE: comment in this code when you get to this point in the course */}

//         <div className="bg-white px-6">
//           {latestInvoices.map((invoice, i) => {
//             return (
//               <div
//                 key={invoice.id}
//                 className={clsx(
//                   'flex flex-row items-center justify-between py-4',
//                   {
//                     'border-t': i !== 0,
//                   },
//                 )}
//               >
//                 <div className="flex items-center">
//                   {/* <Image
//                     src={invoice.image_url}
//                     alt={`${invoice.name}'s profile picture`}
//                     className="mr-4 rounded-full"
//                     width={32}
//                     height={32}
//                   /> */}
//                   <div className="min-w-0">
//                     <p className="truncate text-sm font-semibold md:text-base">
//                       {invoice.name}
//                     </p>
//                     <p className="hidden text-sm text-gray-500 sm:block">
//                       {invoice.email}
//                     </p>
//                   </div>
//                 </div>
//                 <p
//                   className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
//                 >
//                   {invoice.amount}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//         <div className="flex items-center pb-2 pt-6">
//           <ArrowPathIcon className="h-5 w-5 text-gray-500" />
//           <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
//         </div>
//       </div>
//     </div>
//   );
// }
