
import Search from '@/app/ui/search';
import { AddMaterials} from '@/app/ui/Materials/buttons';
import { lusitana } from '@/app/ui/fonts';
import { CustomersTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { Metadata } from 'next';
import Table from '@/app/ui/Materials/table';
import Table1 from '@/app/ui/Materials/estimatedtable';


 
export const metadata: Metadata = {
  title: 'Materials ',
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
        <h1 className={`${lusitana.className} text-2xl`}></h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search Materials..." />
        <AddMaterials />
      </div>
      <Suspense key={query} fallback={<CustomersTableSkeleton />}>
        <Table query={query} currentPage={0} />
      </Suspense>
      {/* <Suspense key={query} fallback={<CustomersTableSkeleton />}>
        <Table1 query={query} currentPage={0} />
      </Suspense> */}
       {/* <Suspense key={query + currentPage} fallback={<CustomersTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div> */}
    </div>
  );
}