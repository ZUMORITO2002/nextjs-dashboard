// 'use client';

// import { updateSupplier} from '@/app/lib/actions';
// import { SuppliersField } from '@/app/lib/definitions';
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

// export default function EditSupplier({
//   suppliers,
// }: {
//   suppliers: SuppliersField[];
// }) {
//   const initialState = { message: null, errors: {} };
//   const updatesupplierWithId = updateSupplier.bind(null, suppliers.name);
//   const [state, dispatch] = useFormState(updatesupplierWithId, initialState);
 
//   return (
//     <form action={dispatch}>
//       <div className="rounded-md bg-gray-50 p-4 md:p-6">

//         {/* Supplier Name */}
//         <div className="mb-4">
//           <label htmlFor="Supplier" className="mb-2 block text-sm font-medium">
//             Choose Supplier
//           </label>
//           <div className="relative">
//           <select
//     id="supplierId"
//   name="Suppliername"
//   className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//   defaultValue={suppliers.length > 0 ? suppliers[0].id : ""}
// >
//               <option value="" disabled>
//                 Select a supplier
//               </option>
//               {suppliers.map((suppliers) => (
//                 <option key={suppliers.id} value={suppliers.id}>
//                   {suppliers.name}
//                 </option>
//               ))}
//             </select>
//             <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
//           </div>
//         </div>

//       </div>
//       <div className="mt-6 flex justify-end gap-4">
//         <Link
//           href="/dashboard/Suppliers"
//           className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
//         >
//           Cancel
//         </Link>
//         <Button type="submit">Edit Supplier</Button>
//       </div>
//     </form>
//   );

// }

// import { updateSupplier } from '@/app/lib/actions';
// import { SuppliersField } from '@/app/lib/definitions';
// import { useState } from 'react'; // Import useState from React
// import Link from 'next/link';
// import { Button } from '@/app/ui/button';

// export default function EditSupplier({
//   suppliers,
// }: {
//   suppliers: SuppliersField[];
// }) {
//   const initialState = { message: null, errors: {} };
//   const [state, setState] = useState(initialState); // Use useState hook
  
//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
    
//     // Handle form submission
//     const formData = new FormData(event.currentTarget);
//     const result = await updateSupplier(formData); // Assuming updateSupplier expects formData
//     setState(result);
//   };
 
//   return (
//     <form onSubmit={handleSubmit}> {/* Use onSubmit instead of action */}
//       <div className="rounded-md bg-gray-50 p-4 md:p-6">
//         {/* Supplier Name */}
//         <div className="mb-4">
//           <label htmlFor="Supplier" className="mb-2 block text-sm font-medium">
//             Choose Supplier
//           </label>
//           <div className="relative">
//             <select
//               id="supplierId"
//               name="Suppliername"
//               className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//               defaultValue={suppliers.length > 0 ? suppliers[0].id : ""}
//             >
//               <option value="" disabled>
//                 Select a supplier
//               </option>
//               {suppliers.map((supplier) => ( // Use "supplier" instead of "suppliers"
//                 <option key={supplier.id} value={supplier.id}>
//                   {supplier.name}
//                 </option>
//               ))}
//             </select>
//             {/* UserCircleIcon can remain the same */}
//           </div>
//         </div>
//       </div>
//       <div className="mt-6 flex justify-end gap-4">
//         <Link
//           href="/dashboard/Suppliers"
//           className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
//         >
//           Cancel
//         </Link>
//         <Button type="submit">Edit Supplier</Button>
//       </div>
//     </form>
//   );
// }


// import { updateSupplier } from '@/app/lib/actions';
// import { SuppliersField } from '@/app/lib/definitions';
// import { useState } from 'react';
// import { Button } from '@/app/ui/button';

// export default function EditSupplier({
//   suppliers,
// }: {
//   suppliers: SuppliersField[];
// }) {
//   const initialState = { message: null, errors: {} };
//   const [state, setState] = useState(initialState);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
    
//     const formData = new FormData(event.currentTarget);
// const id = formData.get('supplierId')?.toString(); // Extract and convert to string

// if (!id) {
//   console.error('Supplier ID is missing');
//   return;
// }

// try {
//   const result = await updateSupplier(id, state, formData); // Provide all required arguments
//   setState(result);
// } catch (error) {
//   console.error('Error updating supplier:', error);
// }
//   };
 
//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="rounded-md bg-gray-50 p-4 md:p-6">
//         {/* Supplier Name */}
//         <div className="mb-4">
//           <label htmlFor="Supplier" className="mb-2 block text-sm font-medium">
//             Choose Supplier
//           </label>
//           <div className="relative">
//             <select
//               id="supplierId"
//               name="Suppliername"
//               className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//               defaultValue={suppliers.length > 0 ? suppliers[0].id : ""}
//             >
//               <option value="" disabled>
//                 Select a supplier
//               </option>
//               {suppliers.map((supplier) => (
//                 <option key={supplier.id} value={supplier.id}>
//                   {supplier.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//       <div className="mt-6 flex justify-end gap-4">
//         <Button type="submit">Edit Supplier</Button>
//       </div>
//     </form>
//   );
// }

import React, { useState } from 'react';
import { useFormState } from 'react-dom';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { SuppliersField } from '@/app/lib/definitions';

export default function EditSupplier({
  suppliers,
}: {
  suppliers: SuppliersField[];
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useState(initialState);

  const updatesupplierWithId = async (id: string) => {
    // Find the supplier object with the given id
    const supplier = suppliers.find((s) => s.id === id);
    if (!supplier) {
      throw new Error(`Supplier with id ${id} not found`);
    }

    // TODO: Implement the logic to update the supplier object
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const supplierId = (e.target as any).supplierId.value;
      updatesupplierWithId(supplierId);
    }}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Supplier Name */}
        <div className="mb-4">
          <label htmlFor="Supplier" className="mb-2 block text-sm font-medium">
            Choose Supplier
          </label>
          <div className="relative">
          <select
    id="supplierId"
    name="Suppliername"
    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
  >
              <option value="" disabled>
                Select a supplier
              </option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/Suppliers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Supplier</Button>
      </div>
    </form>
  );

}