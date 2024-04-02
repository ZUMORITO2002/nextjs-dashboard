import Pagination from '@/app/ui/customers/pagination';
import Search from '@/app/ui/search';
import { AddCustomer} from '@/app/ui/customers/buttons';
import { lusitana } from '@/app/ui/fonts';
import { CustomersTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchCustomers , fetchCustomerPages } from '@/app/lib/data';
import { Metadata } from 'next';
import Table from '@/app/ui/attendance/table';
import { string } from 'zod';
import { CustomerField, CustomersTableType, FormattedCustomersTable } from '@/app/lib/definitions';
import { AddEmployee } from '@/app/ui/employees/buttons';
 
export const metadata: Metadata = {
  title: 'Customers ',
};

export default async function Page({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    };
  }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchCustomerPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}></h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search employee..." />
        <AddEmployee />
      </div>
       <Suspense key={query + currentPage} fallback={<CustomersTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}