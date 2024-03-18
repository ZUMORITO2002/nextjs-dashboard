"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";

// ... other imports
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { addCustomer } from "@/app/lib/actions"
import { CheckIcon, ClockIcon } from "lucide-react";

let global_id = "";

const OrderFormSchema = z.object({
  customer_name: z.string(),
  order_name: z.string(),
  order_status: z.string(),
});

type OrderFormValues = z.infer<typeof OrderFormSchema>

export default function EditCustomerForm({ orderId }: { orderId: string }) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderFormSchema),
    mode: "onChange",
    defaultValues: async () => {
      try {
        const response = await fetch(`http://localhost:8000/get_order/${orderId}`);
  
        if (!response.ok) {
          throw new Error("Failed to fetch customer data");
        }
  
        const orderData = await response.json();
        console.log("this is id ",orderData.id)
        console.log("this is name", orderData.customer_name)
        global_id = orderData.id;
        return {
          // id: orderData.id, // Ensure ID is included in the returned object
          customer_name: orderData.customer_name,
          order_name: orderData.order_name,
          order_status: orderData.order_status,
        };
        return orderData; // Return the fetched customer data
      } catch (error) {
        console.error("Error fetching customer data:", error);
        // Handle errors (e.g., show error message)
        return {
          order_name: "",
          customer_name: "",
          order_status: "", // Set defaults if fetching fails
        };
      }
    },
  });

  // const customer_name = document.getElementById('customer_name') ;
  // const order_name = (document.getElementsByName('order_name') as HTMLInputElement)?.value;
  const statusRadios = document.getElementsByName('order_status');
  let order_status = '';
  for (let i = 0; i < statusRadios.length; i++) {
      if ((statusRadios[i] as HTMLInputElement).checked) {
          order_status = (statusRadios[i] as HTMLInputElement).value;
          break;
      }
  }

  // console.log("Customer Name:", customer_name);
  // console.log("Order Name:", order_name);
  console.log("Status:", order_status);

  const data1 = {
    order_status: order_status
  }


  async function onSubmit(data: OrderFormValues) {
    console.log("Button Was Clicked")
    console.log("This is data variable", data)
    // data.id = global_id
    console.log("This is global" + global_id)
    let new_data ={
        order_id : global_id,
        order_name : data.order_name,
        order_status : data1.order_status
    }
    console.log("This is new data" + new_data)
    try {
      const response = await fetch(`http://localhost:8000/update_order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(new_data),
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
          name="customer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer name</FormLabel>
              <FormControl>
                <Input {...field} readOnly/>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="order_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

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
                  {...form.register('order_status')} // Register the radio button with React Hook Form
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
                  {...form.register('order_status')} // Register the radio button with React Hook Form
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