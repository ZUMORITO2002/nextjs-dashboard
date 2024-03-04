'use client';

import { updateQuotation } from '@/app/lib/actions';
import { QuotationField, QuotationForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';

export default function EditQuotationForm({
  quotation,
  quotations,
}: {
  quotation: QuotationForm;
  quotations: QuotationField[];
}) {
  const initialState = { message: null, errors: {} };
  const updateQuotationWithId = updateQuotation.bind(null, quotation.id);
  const [state, dispatch] = useFormState(updateQuotationWithId, initialState);
 
  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Quotation Name */}
        <div className="mb-4">
          <label htmlFor="quotation" className="mb-2 block text-sm font-medium">
            Choose Quotation
          </label>
          <div className="relative">
            <select
              id="quotation"
              name="quotationId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={quotation.quotation_id}
            >
              <option value="" disabled>
                Select a quotation
              </option>
              {quotations.map((quotation) => (
                <option key={quotation.id} value={quotation.id}>
                  {quotation.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Quotation Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the Quotation status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="denied"
                  name="status"
                  type="radio"
                  value="denied"
                  defaultChecked={quotation.status === 'denied'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="denied"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Denied <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="approved"
                  name="status"
                  type="radio"
                  value="approved"
                  defaultChecked={quotation.status === 'approved'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="approved"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Approved <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/quotation"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Quotation</Button>
      </div>
    </form>
  );

}

    