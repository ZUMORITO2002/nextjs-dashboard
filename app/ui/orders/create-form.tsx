'use client';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useFormState } from 'react-dom';
import { CustomerField, OrdersField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from '@/app/ui/button';
import { createOrder } from '@/app/lib/actions';
import DocumentTextIcon from '@heroicons/react/20/solid/DocumentTextIcon';
import { toast } from "@/components/ui/use-toast"

const OrderFormSchema = z.object({
  customer_name: z
    .string(),

  order_name: z
    .string(),

  status: z
    .string(),
})

type OrderFormValues = z.infer<typeof OrderFormSchema>


import { useState } from 'react';

export default function OrderForm({ customers }: { customers: CustomerField[] }) {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerField | null>(null);
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderFormSchema),
    mode: "onChange",
    defaultValues: {
      customer_name: "",
      order_name: "",
      status: ""
    }
  });

  const handleCustomerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = event.target.value;
    const selectedCustomer = customers.find(customer => customer.id === customerId) || null;
    setSelectedCustomer(selectedCustomer);

    // Update the form state with the selected customer's details
    form.setValue('customer_name', selectedCustomer?.name || '');
    // Optionally, update the status field based on the customer's selection
    // form.setValue('status', 'pending'); // Example: Set status to 'pending'
  };

  const [selectedStatus, setSelectedStatus] = useState<{ value: string; id: string }>({ value: '', id: '' });

  // Function to handle status selection
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus({ value: event.target.value, id: event.target.id });
  };




  function onSubmit() {
    const customer_name = (document.getElementById('customer') as HTMLSelectElement)?.value;
    const order_name = (document.getElementById('order_name') as HTMLInputElement)?.value;
    const statusRadios = document.getElementsByName('status');
    let status = '';
    for (let i = 0; i < statusRadios.length; i++) {
        if ((statusRadios[i] as HTMLInputElement).checked) {
            status = (statusRadios[i] as HTMLInputElement).value;
            break;
        }
    }

    console.log("Customer Name:", customer_name);
    console.log("Order Name:", order_name);
    console.log("Status:", status);

    const data = {
      customer_name: customer_name,
      order_name: order_name,
      status: status
    }
    const submitForm = async () => {
      try {
        // Replace with your actual API call logic
        const response = await fetch('http://localhost:8000/create_order', {
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Selection */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              onChange={handleCustomerChange}
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.name}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>


        {/* Order Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Enter the description
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="order_name"
                name="description"
                type="text"
                placeholder="Enter description"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>



        {/* Order Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the Order status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  type="radio"
                  value="In Progress"
                  {...form.register('status')} // Register the radio button with React Hook Form
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
                  id="delivered"
                  type="radio"
                  value="Finished"
                  {...form.register('status')} // Register the radio button with React Hook Form
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="delivered"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Finished <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/orders"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Add Order</Button>
      </div>
    </form>
  )
}

