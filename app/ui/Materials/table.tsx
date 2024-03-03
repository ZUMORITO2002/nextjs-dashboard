'use server'

import Image from 'next/image';
import { UpdateMaterials, RemoveMaterial } from '@/app/ui/Materials/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredMaterials } from '@/app/lib/data';

export default async function MaterialsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const materials = await fetchFilteredMaterials(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {materials?.map((material) => (
              <div
                key={material.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{material.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{material.materials_id}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(material.stock)}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateMaterials id={material.id} />
                    <RemoveMaterial id={material.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Material ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Material Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  In Stock
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {materials?.map((material) => (
                <tr
                  key={material.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{material.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {material.materials_id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(material.stock)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateMaterials id={material.id} />
                      <RemoveMaterial id={material.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
