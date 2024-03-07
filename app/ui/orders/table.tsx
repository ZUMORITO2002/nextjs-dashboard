'use client';

import Image from 'next/image';
import { UpdateOrder } from '@/app/ui/orders/buttons';
import OrderStatus from '@/app/ui/orders/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchOrders } from '@/app/lib/actions';
import { useEffect, useState } from 'react';

export default async function OrdersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  type Order = {
    id: string;
    customer_id: string;
    name: string;
    location: string;
    date: string;
    amount: number;
    status: 'pending' | 'delivered';
  };

  const [orderType, setOrderType] = useState('all');
  const [orders, setOrders] = useState<Order[] | undefined>(undefined);

  // Function to handle fetching orders based on the current order type
  const fetchCurrentOrders = async () => {
    const orders = await fetchOrders(orderType, query, currentPage);
    console.log(orders);
    // Assuming you want to set the fetched orders to a state variable
    setOrders(orders);
  };

  // Call fetchCurrentOrders when the component mounts or when orderType changes
  useEffect(() => {
    fetchCurrentOrders();
  }, [orderType, query, currentPage]);

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
            orderType === 'op'
              ? 'bg-green-600 hover:bg-green-500'
              : 'bg-blue-600 hover:bg-green-500'
          }`}
          onClick={() => setOrderType('op')}
        >
          <span className="md:block">In Progress</span>
        </div>
        <div
          className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            orderType === 'delivered'
              ? 'bg-green-600 hover:bg-green-500'
              : 'bg-blue-600 hover:bg-green-500'
          }`}
          onClick={() => setOrderType('delivered')}
        >
          <span className="md:block">Delivered</span>
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
                    <div className="mb-2 flex items-center">
                      <p>{order.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{order.location}</p>
                  </div>
                  <OrderStatus status={order.status} />
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
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Order ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Order Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Customer Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Location
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
              {orders?.map((order) => (
                <tr
                  key={order.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{order.id}</p>
                    </div>
                  </td>{' '}
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{order.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {order.customer_id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {order.location}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{order.date}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {order.amount}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <OrderStatus status={order.status} />
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
