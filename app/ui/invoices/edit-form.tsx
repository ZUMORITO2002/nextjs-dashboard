'use client';

import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
// ... other imports
import { zodResolver } from "@hookform/resolvers/zod"
import { updateInvoice } from '@/app/lib/actions';
import { CustomerField, Invoice, InvoiceForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import DocumentTextIcon from '@heroicons/react/20/solid/DocumentTextIcon';
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input"

let global_id = "";

const InvoiceFormSchema = z.object({
  order_name: z.string(),
  invoice_amount: z.string(),
  address: z.string(),
  invoice_status: z.string()
});

type InvoiceFormValues = z.infer<typeof InvoiceFormSchema>


export default function EditInvoiceForm({ orderId }: { orderId: string }) {
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(InvoiceFormSchema),
    mode: "onChange",
    defaultValues: async () => {
      try {
        const response = await fetch(`http://localhost:8000/get_invoice/${orderId}/`);

        if (!response.ok) {
          throw new Error("Failed to fetch customer data");
        }

        const invoiceData = await response.json();
        // return {
        //   order_id: invoiceData.order_id, // Ensure ID is included in the returned object
        //   order_name: invoiceData.order_name,
        //   invoice_amount: invoiceData.invoice_amount,
        //   address: invoiceData.address,
        //   invoice_status: invoiceData.invoice_status
        // };
        return invoiceData; // Return the fetched customer data
      } catch (error) {
        console.error("Error fetching customer data:", error);
        // Handle errors (e.g., show error message)
        return {
          order_id: "",
          order_name: "",
          invoice_amount: "",
          address: "",
          invoice_status: "" // Set defaults if fetching fails
        };
      }
    }

  });


  const statusRadios = document.getElementsByName('invoice_status');
  let invoice_status = '';
  for (let i = 0; i < statusRadios.length; i++) {
    if ((statusRadios[i] as HTMLInputElement).checked) {
      invoice_status = (statusRadios[i] as HTMLInputElement).value;
      break;
    }
  }

  // console.log("Customer Name:", customer_name);
  // console.log("Order Name:", order_name);
  console.log("Status:", invoice_status);

  const data1 = {
    invoice_status: invoice_status
  }


  // const data ={
  //   order_id:invoice.order_id,
  //   invoice_amount : invoice.invoice_amount,
  //   address : invoice.address,
  //   invoice_status : invoice.invoice_status
  // }

  async function onSubmit(data: InvoiceFormValues) {
    data = {
      order_name: data.order_name,
      invoice_amount: data.invoice_amount,
      address: data.address,
      invoice_status: data1.invoice_status
    }
    console.log("Button Was Clicked")
    console.log("This is data variable", data)
    // data.id = global_id
    try {
      const response = await fetch(`http://localhost:8000/update_invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update customer");
      }

      // Handle successful response (e.g., show success toast)
      toast({
        title: "Customer updated successfully!",
        description: "Customer information has been updated.",
      });
      // Navigate back or handle success as needed
    } catch (error) {
      // Handle errors (e.g., show error toast)
      toast({
        title: "Failed to update customer.",
        description: "Please try again or contact support.",
      });
    }
  }




  return (
    <Form {...form}>
      {/* Form fields for name, email, phone_number (same as create-customer) */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="order_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Name</FormLabel>
              <FormControl>
                <Input {...field} readOnly />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="invoice_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Order Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the Invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="Unpaid"
                  type="radio"
                  value="Unpaid"
                  {...form.register('invoice_status')} // Register the radio button with React Hook Form
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
                  id="Paid"
                  type="radio"
                  value="Paid"
                  {...form.register('invoice_status')} // Register the radio button with React Hook Form
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

        <Button type="submit">Update Order</Button>
      </form>
    </Form>
  );
}
