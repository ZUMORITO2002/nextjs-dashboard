'use client';

import { useFormState } from 'react-dom';
import { SuppliersField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { Quotation } from '@/app/lib/actions';

import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import { z } from "zod"


import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { addCustomer } from "@/app/lib/actions"

const QuotationFormSchema = z.object({
  quotation_name: z
    .string(),

  supplier_name: z
    .string(),

  quotation: z
    .string(),

  quotation_status: z.string(),
})

 type QuotationFormValues = z.infer<typeof QuotationFormSchema>


import { useState } from 'react';
import DocumentTextIcon from '@heroicons/react/20/solid/DocumentTextIcon';
import DocumentMagnifyingGlassIcon from '@heroicons/react/20/solid/DocumentMagnifyingGlassIcon';

export default function Form({ suppliers }: { suppliers: SuppliersField[] }) {
  const [selectedSupplier, setSelectedSupplier] = useState<SuppliersField | null>(null);
  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(QuotationFormSchema),
    mode: "onChange",
    defaultValues: {
      quotation_name: "",
      supplier_name: "",
      quotation: "",
      quotation_status: ""
    }
  });

  const handleSupplierChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const suppliersId = event.target.value;
    const selectedSupplier = suppliers.find(suppliers => suppliers.id === suppliersId) || null;
    setSelectedSupplier(selectedSupplier);
  };

  function onSubmit() {
    const quotation_name = (document.getElementById('quotation_name') as HTMLSelectElement)?.value;
    const supplier_name = (document.getElementById('supplier_name') as HTMLInputElement)?.value;
    const quotation_status = document.getElementsByName('status');
    let status = '';
    for (let i = 0; i < quotation_status.length; i++) {
        if ((quotation_status[i] as HTMLInputElement).checked) {
            status = (quotation_status[i] as HTMLInputElement).value;
            break;
        }
    }

    console.log("quotation Name:", quotation_name);
    console.log("supplier Name:", supplier_name);
    console.log("Status:", status);

    const data = {
      quotation_name: quotation_name,
      supplier_name: supplier_name,
      quotation_status: status
    }
    const submitForm = async () => {
      console.log("quotation data", data)
      try {
        // Replace with your actual API call logic
        const response = await fetch('http://localhost:8000/create_quotation', {
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
  console.log("JAG LOVE",suppliers)
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Selection */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose supplier
          </label>
          <div className="relative">
            <select
              id="supplier_name"
              name="supplier_name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              onChange={handleSupplierChange}
            >
              <option value="" disabled>
                Select a supplier
              </option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.name}>
                  {supplier.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Order Description */}
      <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Quotation Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="quotation_name"
                name="quotation_name"
                type="text"
                placeholder="Quotation Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      
        <fieldset>
           <legend className="mb-2 block text-sm font-medium">
             Set the Quotation status
           </legend>
           <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
             <div className="flex gap-4">
               <div className="flex items-center">
                 <input
                   id="Rejected"
                  name="status"
                  type="radio"
                   value="Rejected"
                   className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
               />
                 <label
                  htmlFor="Rejected"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Rejected <ClockIcon className="h-4 w-4" />
                </label>
            


              <div className="flex items-center">
                <input
                  id="Under Review"
                  name="status"
                  type="radio"
                  value="Under Review"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
               
               <label
                  htmlFor="Under Review"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Under Review <DocumentMagnifyingGlassIcon className="ml-1 w-4 text-gray-500" />
                </label>

              <div className="flex items-center">
                <input
                  id="Accepted"
                  name="status"
                  type="radio"
                  value="Accepted"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="Accepted"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Accepted <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          </div>
          </div>
        </fieldset>
        <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/quotations"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Add quotation</Button>
        </div>

    </form>
  )
 
}

// export default function Form({ quotation }: { quotation: QuotationField[] }) {
//   const initialState = { message: null, errors: {} };
//   const [state, dispatch] = useFormState(Quotation, initialState);
 
  // return (
  //   <form action={dispatch}>
  //     <div className="rounded-md bg-gray-50 p-4 md:p-6">
  //       {/* Quotation Name */}
  //       <div className="mb-4">
  //         <label htmlFor="customer" className="mb-2 block text-sm font-medium">
  //           Choose Quotation
  //         </label>
  //         <div className="relative">
  //           <select
  //             id="quotation"
  //             name="quotationId"
  //             className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
  //             defaultValue=""
  //             aria-describedby="quotation-error"
  //           >
  //             <option value="" disabled>
  //               Select a Quotation
  //             </option>
  //             {quotation.map((name) => (
  //               <option key={name.id} value={name.id}>
  //                 {name.name}
  //               </option>
  //             ))}
  //           </select>
  //           <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
  //         </div>
  //         <div id="quotation-error" aria-live="polite" aria-atomic="true">
  //           {state.errors?.quotationId &&
  //             state.errors.quotationId.map((error: string) => (
  //               <p className="mt-2 text-sm text-red-500" key={error}>
  //                 {error}
  //               </p>
  //             ))}
  //         </div>
  //       </div>
  //               {/* Invoice Amount */}
  //               <div className="mb-4">
  //         <label htmlFor="amount" className="mb-2 block text-sm font-medium">
  //           Choose an amount
  //         </label>
  //         <div className="relative mt-2 rounded-md">
  //           <div className="relative">
  //             <input
  //               id="amount"
  //               name="amount"
  //               type="number"
  //               step=""
  //               placeholder="E"
  //               className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
  //               required
  //             />
  //             <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
  //           </div>
  //         </div>
  //       </div>

  //       {/* Quotation Status */}
  //       <fieldset>
  //         <legend className="mb-2 block text-sm font-medium">
  //           Set the Quotation status
  //         </legend>
  //         <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
  //           <div className="flex gap-4">
  //             <div className="flex items-center">
  //               <input
  //                 id="denied"
  //                 name="status"
  //                 type="radio"
  //                 value="denied"
  //                 className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
  //               />
  //               <label
  //                 htmlFor="denied"
  //                 className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
  //               >
  //                 Denied <ClockIcon className="h-4 w-4" />
  //               </label>
  //             </div>
  //             <div className="flex items-center">
  //               <input
  //                 id="approved"
  //                 name="status"
  //                 type="radio"
  //                 value="approved"
  //                 className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
  //               />
  //               <label
  //                 htmlFor="approved"
  //                 className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
  //               >
  //                 Approved <CheckIcon className="h-4 w-4" />
  //               </label>
  //             </div>
  //           </div>
  //         </div>
  //       </fieldset>
  //     </div>
  //     <div className="mt-6 flex justify-end gap-4">
  //       <Link
  //         href="/dashboard/quotation"
  //         className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
  //       >
  //         Cancel
  //       </Link>
  //       <Button type="submit">Create Quotation</Button>
  //     </div>
  //   </form>
  // );}