'use client';

import Image from 'next/image';
import { UpdateOrder } from '@/app/ui/orders/buttons';
import OrderStatus from '@/app/ui/orders/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchOrders } from '@/app/lib/actions';
import { useEffect, useState } from 'react';
import { Orders } from '@/app/lib/definitions';

export default async function Order({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
})
{
  const [orderType, setOrderType] = useState('all');
  const [orders, setOrders] = useState<Orders[] | undefined>(undefined);

  useEffect(() => {
     const fetchData = async () => {
       try {
         const response = await fetch('http://127.0.0.1:8000/list_orders');
         if (!response.ok) {
           console.error('Network response was not ok');
           return;
         }
         const data: Orders[] = await response.json();
         console.log('Fetched data:', data); // Debugging line
         setOrders(data);
       } catch (error) {
         console.error('There was a problem with your fetch operation:', error);
       }
     };
 
     fetchData();
  }, []); // Empty dependency array means this effect runs once on component mount

  return (
    <div className="mt-6 flow-root">
      <div className="mb-5 flex gap-2">
        <div
          className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            orderType === 'all'
              ? 'bg-green-600 hover:bg-green-500'
              : 'bg-blue-600 hover:bg-green-500'
          }`}
          onClick={() => setOrderType('all')}
        >
          <span className="md:block">All Status</span>
        </div>
        <div
          className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            orderType === 'new'
              ? 'bg-green-600 hover:bg-green-500'
              : 'bg-blue-600 hover:bg-green-500'
          }`}
          onClick={() => setOrderType('new')}
        >
          <span className="md:block">New Order</span>
        </div>
        <div
          className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            orderType === 'IP'
              ? 'bg-green-600 hover:bg-green-500'
              : 'bg-blue-600 hover:bg-green-500'
          }`}
          onClick={() => setOrderType('IP')}
        >
          <span className="md:block">In Progress</span>
        </div>
        <div
          className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            orderType === 'Finished'
              ? 'bg-green-600 hover:bg-green-500'
              : 'bg-blue-600 hover:bg-green-500'
          }`}
          onClick={() => setOrderType('Finished')}
        >
          <span className="md:block">Finished</span>
        </div>
      </div>
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {orders?.map((order) => (
              <div
                key={order.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-500">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{order.order_name}</p>
                  </div>
                  <div className="mb-2 flex items-center">
                      <p>{order.customer}</p>
                    </div>
                    <div className="mb-2 flex items-center">
                      <p>{order.date}</p>
                    </div>
                  <OrderStatus status={order.order_status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <UpdateOrder id={order.id} />
                    {/* <DeleteOrder id={order.id} /> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
              <th scope="col" className="px-3 py-5 font-medium">
                  Order ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Order Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Customer Name
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
              {orders?.map((order) => (
                <tr
                  key={order.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">                  
                  <div className="flex items-center gap-3">
                      <p>{order.order_id}</p>
                    </div>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">  
                    <div className="flex items-center gap-3">
                      <p>{order.order_name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {order.customer}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {order.date}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <OrderStatus status={order.order_status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateOrder id={order.id} />
                      {/* <DeleteOrder id={order.id} /> */}
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
