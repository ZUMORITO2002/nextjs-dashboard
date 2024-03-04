import Image from 'next/image';
import { UpdateQuotation, RemoveQuotation } from '@/app/ui/quotation/buttons';
import QuotationStatus from '@/app/ui/quotation/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredQuotation } from '@/app/lib/data';

export default async function QuotationTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const quotation = await fetchFilteredQuotation(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {quotation?.map((quotation) => (
              <div
                key={quotation.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                  <div className="mb-2 flex items-center">
                      <p>{quotation.quotation_id}</p>
                    </div>
                    <div className="mb-2 flex items-center">
                      <p>{quotation.name}</p>
                    </div>
                    <div className="mb-2 flex items-center">
                      <p>{quotation.supplier}</p>
                    </div>
                  </div>
                  <QuotationStatus status={quotation.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>{formatDateToLocal(quotation.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateQuotation id={quotation.id} />
                    <RemoveQuotation id={quotation.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Quotation ID
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Supplier
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {quotation?.map((quotation) => (
                <tr
                  key={quotation.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {quotation.quotation_id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex items-center gap-3">
                      <p>{quotation.name}</p>
                      </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {quotation.supplier}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(quotation.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <QuotationStatus status={quotation.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateQuotation id={quotation.id} />
                      <RemoveQuotation id={quotation.id} />
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
