'use client';

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFormState } from 'react-dom';
import { useForm } from "react-hook-form"
import { Orders } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice } from '@/app/lib/actions';
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import DocumentTextIcon from "@heroicons/react/20/solid/DocumentTextIcon";

const InvoiceFormSchema = z.object({
  order_name: z
    .string(),

  invoice_amount: z
    .string(),

  address: z
    .string(),

  invoice_status: z
    .string(),
})

type InvoiceFormValues = z.infer<typeof InvoiceFormSchema>



export default function InvoiceForm({ orders }: { orders: Orders[] }) {
  // const initialState = { message: null, errors: {} };
  // const [state, dispatch] = useFormState(createInvoice, initialState);
  const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(InvoiceFormSchema),
    mode: "onChange",
    defaultValues: {
      order_name: "",
      invoice_amount: "",
      address: "",
      invoice_status: ""
    }
  });

  
  const handleOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const orderId = event.target.value;
    const selectedOrder = orders.find(order => order.id === orderId) || null;
    setSelectedOrder(selectedOrder);

    // Update the form state with the selected customer's details
    form.setValue('order_name', selectedOrder?.order_name || '');
    // Optionally, update the status field based on the customer's selection
    // form.setValue('status', 'pending'); // Example: Set status to 'pending'
  };

  // const [selectedStatus, setSelectedStatus] = useState<{ value: string; id: string }>({ value: '', id: '' });

  // Function to handle status selection
  // const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSelectedStatus({ value: event.target.value, id: event.target.id });
  // };




  ///
  function onSubmit() {
    const order_name = (document.getElementById('order_name') as HTMLSelectElement)?.value;
    const invoice_amount = (document.getElementById('amount') as HTMLInputElement)?.value;
    const address = (document.getElementById('address') as HTMLInputElement)?.value;
    const statusRadios = document.getElementsByName('status');
    let status = '';
    for (let i = 0; i < statusRadios.length; i++) {
      if ((statusRadios[i] as HTMLInputElement).checked) {
        status = (statusRadios[i] as HTMLInputElement).value;
        break;
      }
    }

    console.log("Order name:", order_name);
    console.log("Invoice amount:", invoice_amount);
    console.log("Address :", address);
    console.log("Invoice Status:", status);

    const data = {
      order_name: order_name,
      invoice_amount: invoice_amount,
      address: address,
      invoice_status: status
    }
    const submitForm = async () => {
      try {
        // Replace with your actual API call logic
        const response = await fetch('http://localhost:8000/create_invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }

        // Handle successful response (e.g., show success toast)
        toast({
          title: "Form submitted successfully!",
          description: "Supplier added successfully!",
        });
        form.reset(); // Reset the form
      } catch (error) {
        // Handle errors (e.g., show error toast)
        toast({
          title: "Failed to submit form.",
          description: "Please check your input and try again.",
        });
      }
    };

    submitForm();
  }

  ////
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* <h1>{orders.order_name}</h1> */}
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Select Order
          </label>
          <div className="relative">
            <select
              id="order_name"
              name="order_name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="customer-error"
              onChange={handleOrderChange}
            >
              <option value="" disabled>
                Select order
              </option>
              {orders.map((order) => (
                <option key={order.id} value={order.order_name}>
                  {order.order_name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

        </div>
        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Enter INR amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Order Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Enter the address
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Enter address"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>



        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
}