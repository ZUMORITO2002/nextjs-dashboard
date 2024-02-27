import Pagination from '@/app/ui/suppliers/pagination';
import Search from '@/app/ui/search';
import { AddSupplier} from '@/app/ui/suppliers/buttons';
import { lusitana } from '@/app/ui/fonts';
import { CustomersTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchSuppliers } from '@/app/lib/data';
import { Metadata } from 'next';
import Table from '@/app/ui/suppliers/table';
import { string } from 'zod';
import { SuppliersField,SuppliersTableType, FormattedSuppliersTable } from '@/app/lib/definitions';
 
export const metadata: Metadata = {
  title: 'Suppliers ',
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
    // const currentPage = Number(searchParams?.page) || 1;
    // const totalPages = await fetchSuppliersPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Supplier</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search suppliers..." />
        <AddSupplier />
      </div>
      <Suspense key={query} fallback={<CustomersTableSkeleton />}>
        <Table query={query} />
      </Suspense>
       {/* <Suspense key={query + currentPage} fallback={<CustomersTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div> */}
    </div>
  );
}