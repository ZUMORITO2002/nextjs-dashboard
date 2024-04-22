"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";

// ... other imports
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
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


const QuotationFormSchema = z.object({
  quotation_name: z.string(),
  supplier_name: z.string(),
  quotation_status: z.string(),
});

type QuotationFormValues = z.infer<typeof   QuotationFormSchema>

export default function EditQuotationForm({ quotationId }: { quotationId: string }) {
  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(QuotationFormSchema),
    mode: "onChange",
    defaultValues: async () => {
      try {
        const response = await fetch(`http://localhost:8000/get_quotation/${quotationId}/`);
  
        if (!response.ok) {
          throw new Error("Failed to fetch customer data");
        }
  
        const quotationData = await response.json();
        console.log("this is id ",quotationData.id)
        console.log("this is name", quotationData.quotation_name)
        return {
          // id: orderData.id, // Ensure ID is included in the returned object
          quotation_name: quotationData.quotation_name,
          supplier_name: quotationData.supplier_name,
          quotation_status: quotationData.quotation_status,
        };
        return quotationData; // Return the fetched customer data
      } catch (error) {
        console.error("Error fetching suppllier data:", error);
        // Handle errors (e.g., show error message)
        return {
          quotation_name: "",
          supplier_name: "",
          quotation_status: "", // Set defaults if fetching fails
        };
      }
    },
  });

  // const customer_name = document.getElementById('customer_name') ;
  // const order_name = (document.getElementsByName('order_name') as HTMLInputElement)?.value;
  const statusRadios = document.getElementsByName('quotation_status');
  let quotation_status = '';
  for (let i = 0; i < statusRadios.length; i++) {
      if ((statusRadios[i] as HTMLInputElement).checked) {
          quotation_status = (statusRadios[i] as HTMLInputElement).value;
          break;
      }
  }

  // console.log("Customer Name:", customer_name);
  // console.log("Order Name:", order_name);
  console.log("Status:", quotation_status);

  const data1 = {
    quotation_status: quotation_status
  }


  async function onSubmit(data: QuotationFormValues) {
    console.log("Button Was Clicked")
    console.log("This is data variable", data)
    let new_data ={
        quotation_id : quotationId,
        quotation_name : data.quotation_name,
        supplier_name : data.supplier_name,
        quotation_status : data1.quotation_status
    }
    console.log("This is new data" + new_data)
    console.log("This is quotation id " + quotationId)

    try {
      const response = await fetch(`http://localhost:8000/update_quotation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(new_data),
        
      });
      console.log(new_data)

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
          name="supplier_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Input {...field} readOnly/>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quotation_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quotation Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Order Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the quotation status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  type="radio"
                  value="Rejected"
                  {...form.register('quotation_status')} // Register the radio button with React Hook Form
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Rejected <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="delivered"
                  type="radio"
                  value="Under Review"
                  {...form.register('quotation_status')} // Register the radio button with React Hook Form
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="delivered"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-yellow-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Under Review <DocumentMagnifyingGlassIcon  className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="delivered"
                  type="radio"
                  value="Accepted"
                  {...form.register('quotation_status')} // Register the radio button with React Hook Form
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="delivered"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Accepted <CheckIcon className="h-4 w-4" />
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