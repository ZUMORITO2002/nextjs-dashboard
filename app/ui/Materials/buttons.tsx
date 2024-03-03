'use client'
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { removeMaterial } from '@/app/lib/actions';

export function AddMaterials() {
  return (
    <Link
      href="/dashboard/Materials/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Materials</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateMaterials({ id }: { id: string }) {
  return (
    <Link
    href={`/dashboard/Materials/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}


export function RemoveMaterial({ id }: { id: string }) {
  const removeMaterialWithId = removeMaterial.bind(null, id);
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      removeMaterialWithId(); 
    }}>
    <>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </>
    </form>
  );
}
