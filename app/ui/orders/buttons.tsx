'use client'

import { fetchDeliveredOrders, fetchFilteredOrders, fetchNewOrders, fetchOPOrders } from '@/app/lib/data';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

export function AddOrder() {
  return (
    <Link
      href="/dashboard/orders/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Order</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateOrder({ id }: { id: string }) {
    return (
      <Link
      href={`/dashboard/orders/${id}/edit`}
        className="rounded-md border p-2 hover:bg-blue-600"
      >
        <PencilIcon className="w-5" />
      </Link>
    );
  }

  export function AllOrder() {
    // Define state variables for query and currentPage
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const handleClick = async () => {
        try {
            // Fetch orders with the current query and currentPage
            const orders = await fetchFilteredOrders(query, currentPage);
            // Do something with the fetched orders
            console.log(orders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            // Handle error
        }
    };

    return (
        <div className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
             onClick={handleClick}>
            <span className="md:block">All Status</span>
        </div>
    );
}

  export function NewOrder() {
   

    const handleClick = () => {
        // Toggle the visibility state
       
        // Assuming fetchNewOrders is a function that you want to call when the button is clicked
        fetchNewOrders();
    };

    return (
        <div className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
             onClick={handleClick}>
            {/* Conditionally render the "New Order" text based on the state */}
            <span className="md:block">New Order</span>
        </div>
    );
}

export function OPOrder() {
   

  const handleClick = () => {
      // Toggle the visibility state
     
      // Assuming fetchNewOrders is a function that you want to call when the button is clicked
      fetchOPOrders();
  };

  return (
      <div className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
           onClick={handleClick}>
          {/* Conditionally render the "New Order" text based on the state */}
          <span className="md:block">On Progress</span>
      </div>
  );
}

export function DeliveredOrder() {
   

  const handleClick = () => {
      // Toggle the visibility state
     
      // Assuming fetchNewOrders is a function that you want to call when the button is clicked
      fetchDeliveredOrders();
  };

  return (
      <div className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
           onClick={handleClick}>
          {/* Conditionally render the "New Order" text based on the state */}
          <span className="md:block">Delivered</span>
      </div>
  );
}

  export function DeleteOrder({ id }: { id: string }) {
    const deleteOrderWithId = () => DeleteOrder({ id }); 
    return (
      <form onSubmit={deleteOrderWithId}> 
        <>
          <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
            <span className="sr-only">Delete</span>
            <TrashIcon className="w-5" />
          </button>
        </>
      </form>
    );
  }
  