// import Pagination from '@/app/ui/invoices/pagination';
// import Search from '@/app/ui/search';
// import Table from '@/app/ui/customers/table';
// import { CreateCustomer } from '@/app/ui/customers/buttons'; // Assuming you have a CreateCustomer button component
// import { lusitana } from '@/app/ui/fonts';
// import { CustomersTableSkeleton } from '@/app/ui/skeletons'; // Assuming you have a CustomersTableSkeleton component
// import { Suspense } from 'react';
// import { fetchCustomers , fetchCustomerPages } from '@/app/lib/data'; // Assuming you have a fetchCustomersPages function
// import { Metadata } from 'next';
// import CustomersTable from '@/app/ui/customers/table';
// import { string } from 'zod';
// import { CustomerField, CustomersTableType, FormattedCustomersTable } from '@/app/lib/definitions';

// export const metadata: Metadata = {
//   title: 'Customers',
// };

// export default async function Page({
//   searchParams,
// }: {
//   searchParams?: {
//     query?: string;
//     page?: string;
//   };
// }) {
//   const formatCustomer = (customer: CustomerField): FormattedCustomersTable => {
//     return {
//       email: customer.email;
//       image_url: customer.image_url;
//       total_invoices: customer.total_invoices,
//     };
//   };
//   const formattedCustomers: FormattedCustomersTable[] = CustomerField.map(formatCustomer);
//   const query = searchParams?.query || '';
//   const currentPage = Number(searchParams?.page) || 1;
//   const totalPages = await fetchCustomerPages(query); // Assuming fetchCustomersPages function exists
//   return (
//     <div className="w-full">
//       <div className="flex w-full items-center justify-between">
//         <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
//       </div>
//       <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
//         <Search placeholder="Search customers..." />
//         <CreateCustomer /> {/* Assuming you have a CreateCustomer button */}
//       </div>
//       <Suspense key={query + currentPage} fallback={<CustomersTableSkeleton />}>
//         <CustomersTable customers={formattedCustomers} query={query} currentPage={currentPage} />
//       </Suspense>
//       <div className="mt-5 flex w-full justify-center">
//         <Pagination totalPages={totalPages} /> {/* Assuming Pagination component accepts totalPages prop */}
//       </div>
//     </div>
//   );
// }
