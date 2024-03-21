import { PlusIcon, TrashIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { removeQuotation } from '@/app/lib/actions';

export function AddQuotation() {
  return (
    <Link
      href="/dashboard/quotation/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Quotation</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}



export function UpdateQuotation({ id }: { id: string }) {
  return (
    <Link
    href={`/dashboard/quotation/${id}/edit`}
      className="rounded-md border p-2 hover:bg-blue-600"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function RemoveQuotation({ id }: { id: string }) {
  const deleteQuotationWithId = async () =>{
    const response = await fetch(`http://localhost:8000/delete_quotation/${id}/`,{
      method: 'DELETE',
      // headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to delete order');
    }
  } 
  return (
    <form onSubmit={deleteQuotationWithId}> 
      <>
        <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </>
    </form>
  );
}