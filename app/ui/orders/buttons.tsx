'use client'

import { fetchDeliveredOrders, fetchFilteredOrders, fetchNewOrders, fetchOPOrders, fetchOrders } from '@/app/lib/data';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';

export function AddOrder() {
  return (
    <Link
      href="/dashboard/Orders/create"
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

  export function DeleteOrder({ id }: { id: string }) {
    const deleteOrderWithId = async () =>{
      const response = await fetch(`http://localhost:8000/delete_order/${id}/`,{
        method: 'DELETE',
        // headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
    } 
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
  