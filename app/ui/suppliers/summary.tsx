import Image from 'next/image';
import { EditSupplier, RemoveSupplier, SummarySupplier } from '@/app/ui/suppliers/buttons';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredSuppliers, fetchSuppliersById} from '@/app/lib/data';

export default async function SummaryTable({
  id,
}: {
  id: string;
}) {
  const suppliers = await fetchSuppliersById(id);

  return (
    <div className="mt-6 flow-root">
 <div className="inline-block min-w-full align-middle">
    <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
      <table className="min-w-full text-gray-900 md:table">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr>
            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
              Field
            </th>
            <th scope="col" className="px-3 py-5 font-medium">
              Value
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {suppliers?.map((supplier) => (
            <div key={supplier.id}>
              {Object.entries(supplier).map(([key, value]) => (
                <tr
                 key={`${supplier.id}-${key}`}
                 className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                 <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                    </div>
                 </td>
                 <td className="whitespace-nowrap px-3 py-3">
                    {value}
                 </td>
                </tr>
              ))}
              </div>
          ))}
        </tbody>
      </table>
    </div>
 </div>
</div>

  );
}