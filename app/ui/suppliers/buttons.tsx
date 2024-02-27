import { PlusIcon, TrashIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { removeSupplier } from '@/app/lib/actions';

export function AddSupplier() {
  return (
    <Link
      href="/dashboard/Suppliers/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Supplier</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}


export function SummarySupplier() {
  return (
    <Link
      href="/dashboard/Suppliers/summary"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Summary of Supplier</span>{' '}
      <EyeIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function EditSupplier({ id }: { id: string }) {
  return (
    <Link
    href={`/dashboard/customers/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function RemoveSupplier({ id }: { id: string }) {
  const removeSupplierWithId = removeSupplier.bind(null, id);
  return (
    <form action={removeSupplierWithId}>
    <>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </>
    </form>
  );
}