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

const profileFormSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone_number: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function EditCustomerForm({ customerId }: { customerId: string }) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: async () => {
      try {
        console.log(customerId)
        const response = await fetch(`http://localhost:8000/get_customer/${customerId}`);
  
        if (!response.ok) {
          throw new Error("Failed to fetch customer data");
        }
  
        const customerData = await response.json();
        return customerData; // Return the fetched customer data
      } catch (error) {
        console.error("Error fetching customer data:", error);
        // Handle errors (e.g., show error message)
        return {
          name: "",
          email: "",
          phone_number: "", // Set defaults if fetching fails
        };
      }
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    try {
      const response = await fetch(`http://localhost:8000/edit_customer/${customerId}`, {
        method: "PUT",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {/* {form.formState.errors.phone && (
                <FormMessage>{form.formState.errors.phone.message}</FormMessage>
              )} */}
            </FormItem>
          )}
        />

      <Button type="submit">Update Customer</Button>
      </form>
    </Form>
  );
}   





// 'use client';

// import { updateCustomer } from '@/app/lib/actions';
// import { CustomerField, InvoiceForm } from '@/app/lib/definitions';
// import {
//   CheckIcon,
//   ClockIcon,
//   CurrencyDollarIcon,
//   UserCircleIcon,
//   CurrencyRupeeIcon
// } from '@heroicons/react/24/outline';
// import Link from 'next/link';
// import { Button } from '@/app/ui/button';
// import { useFormState } from 'react-dom';

// export default function Editcustomer({
//   invoice,
//   customers,
// }: {
//   invoice: InvoiceForm;
//   customers: CustomerField[];
// }) {
//   const initialState = { message: null, errors: {} };
//   const updatecustomerWithId = updateCustomer.bind(null, invoice.id);
//   const [state, dispatch] = useFormState(updatecustomerWithId, initialState);
 
//   return (
//     <form action={dispatch}>
//       <div className="rounded-md bg-gray-50 p-4 md:p-6">
//         {/* Customer Name */}
//         <div className="mb-4">
//           <label htmlFor="customer" className="mb-2 block text-sm font-medium">
//             Choose customer
//           </label>
//           <div className="relative">
//             <select
//               id="customer"
//               name="customerId"
//               className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//               defaultValue={invoice.customer_id}
//             >
//               <option value="" disabled>
//                 Select a customer
//               </option>
//               {customers.map((customer) => (
//                 <option key={customer.id} value={customer.id}>
//                   {customer.name}
//                 </option>
//               ))}
//             </select>
//             <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
//           </div>
//         </div>


//         {/* Invoice Amount */}
//         <div className="mb-4">
//           <label htmlFor="amount" className="mb-2 block text-sm font-medium">
//             Choose an amount
//           </label>
//           <div className="relative mt-2 rounded-md">
//             <div className="relative">
//               <input
//                 id="amount"
//                 name="amount"
//                 type="number"
//                 step="0.01"
//                 defaultValue={invoice.amount}
//                 placeholder="Enter amount in INR"
//                 className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//               />
//               <CurrencyRupeeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
//             </div>
//           </div>
//         </div>


//         {/* Invoice Status */}
//         <fieldset>
//           <legend className="mb-2 block text-sm font-medium">
//             Set the invoice status
//           </legend>
//           <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
//             <div className="flex gap-4">
//               <div className="flex items-center">
//                 <input
//                   id="pending"
//                   name="status"
//                   type="radio"
//                   value="pending"
//                   defaultChecked={invoice.status === 'pending'}
//                   className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
//                 />
//                 <label
//                   htmlFor="pending"
//                   className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
//                 >
//                   Pending <ClockIcon className="h-4 w-4" />
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="paid"
//                   name="status"
//                   type="radio"
//                   value="paid"
//                   defaultChecked={invoice.status === 'paid'}
//                   className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
//                 />
//                 <label
//                   htmlFor="paid"
//                   className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
//                 >
//                   Paid <CheckIcon className="h-4 w-4" />
//                 </label>
//               </div>
//             </div>
//           </div>
//         </fieldset>
//       </div>
//       <div className="mt-6 flex justify-end gap-4">
//         <Link
//           href="/dashboard/invoices"
//           className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
//         >
//           Cancel
//         </Link>
//         <Button type="submit">Edit Customer</Button>
//       </div>
//     </form>
//   );

// }