'use client';

import { updateMaterial } from '@/app/lib/actions';
import { MaterialsField, MaterialsForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';

  export default function EditMaterialForm({ materials,material }: { materials: MaterialsField[] ;material: MaterialsForm;}) {
  const initialState = { message: null, errors: {} };
  const updateMaterialWithId = updateMaterial.bind(null, material.materials_id);
  const [state, dispatch] = useFormState(updateMaterialWithId, initialState);
 
  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Materials Name */}
        <div className="mb-4">
          <label htmlFor="Material" className="mb-2 block text-sm font-medium">
            Choose Materials
          </label>
          <div className="relative">
            <select
              id="material"
              name="material_id"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={material.materials_id}
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Select a Material
              </option>
              {materials.map((name) => (
                <option key={name.id} value={name.id}>
                  {name.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.materialsId &&
              state.errors.materialsId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        
        {/* Materials Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                defaultValue={material.stock}
                placeholder="Enter  amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <WrenchScrewdriverIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/Materials"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Materials</Button>
      </div>
    </form>
  );

}

    