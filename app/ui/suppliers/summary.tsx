import Image from 'next/image';
import {
  EditSupplier,
  RemoveSupplier,
  SummarySupplier,
} from '@/app/ui/suppliers/buttons';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredSuppliers, fetchSuppliersById } from '@/app/lib/data';
import React from 'react';

export default async function SummaryTable({ id }: { id: string }) {
  const suppliers = await fetchSuppliersById(id);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="w-full">
  <tbody>
    {suppliers?.map((supplier) => (
      <React.Fragment key={supplier.id}>
        <tr className="border-b text-sm">
          <td className="whitespace-nowrap py-3 pl-6 pr-3">Supplier ID </td>
          <td className="whitespace-nowrap px-3 py-3">{supplier.id}</td>
        </tr>
        <tr className="border-b text-sm">
          <td className="whitespace-nowrap py-3 pl-6 pr-3">Name</td>
          <td className="whitespace-nowrap px-3 py-3">{supplier.name}</td>
        </tr>
        <tr className="border-b text-sm">
          <td className="whitespace-nowrap py-3 pl-6 pr-3">Email</td>
          <td className="whitespace-nowrap px-3 py-3">{supplier.email}</td>
        </tr>
        <tr className="border-b text-sm">
          <td className="whitespace-nowrap py-3 pl-6 pr-3">Location</td>
          <td className="whitespace-nowrap px-3 py-3">{supplier.location}</td>
        </tr>
        <tr className="border-b text-sm">
          <td className="whitespace-nowrap py-3 pl-6 pr-3">Organization Type</td>
          <td className="whitespace-nowrap px-3 py-3">{supplier.organization_type}</td>
        </tr>
        <tr className="border-b text-sm">
          <td className="whitespace-nowrap py-3 pl-6 pr-3">Supplier Industry</td>
          <td className="whitespace-nowrap px-3 py-3">{supplier.industry}</td>
        </tr>
        <tr className="border-b text-sm">
          <td className="whitespace-nowrap py-3 pl-6 pr-3">Revenue</td>
          <td className="whitespace-nowrap px-3 py-3">{supplier.revenue}</td>
        </tr>
        <tr className="border-b text-sm">
          <td className="whitespace-nowrap py-3 pl-6 pr-3">Number Of Employees</td>
          <td className="whitespace-nowrap px-3 py-3">{supplier.num_employees}</td>
        </tr>
        <tr className="border-b text-sm">
          <td className="whitespace-nowrap py-3 pl-6 pr-3">Year of Incorporation</td>
          <td className="whitespace-nowrap px-3 py-3">{supplier.year_of_incorporation}</td>
        </tr>
        <tr className="border-b text-sm">
          <td className="whitespace-nowrap py-3 pl-6 pr-3">Receiving Purchase Orders</td>
          <td className="whitespace-nowrap px-3 py-3">{supplier.receiving_purchase_orders}</td>
        </tr>
        <tr className="border-b text-sm">
          <td className="whitespace-nowrap py-3 pl-6 pr-3">Currency</td>
          <td className="whitespace-nowrap px-3 py-3">{supplier.currency}</td>
        </tr>
        <tr className="border-b text-sm">
          <td className="whitespace-nowrap py-3 pl-6 pr-3">Rating</td>
          <td className="whitespace-nowrap px-3 py-3">{supplier.rating}</td>
        </tr>

      </React.Fragment>
    ))}
  </tbody>
</table>
        </div>
      </div>
    </div>
  );
}
