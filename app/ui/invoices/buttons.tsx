import { PencilIcon, PlusIcon, TrashIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice } from '@/app/lib/actions';

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function DownloadInvoice({ id }: { id: string }) {
  // const deleteInvoiceWithId = deleteInvoice.bind(null, id);
  const downloadInvoiceWithId = async () =>{
    
    const response = await fetch(`http://127.0.0.1:8000/download-invoice/${id}/`,{
      method: 'GET',
      // headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to download invoice');
    }
  }
  return (
    <form onSubmit={downloadInvoiceWithId}>
    <>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Download</span>
        <DocumentArrowDownIcon className="w-5" />
      </button>
    </>
    </form>
  );
}


export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
    href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}


export function DeleteInvoice({ id }: { id: string }) {
  // const deleteInvoiceWithId = deleteInvoice.bind(null, id);
  const deleteInvoiceWithId = async () =>{
    
    const response = await fetch(`http://localhost:8000/delete_invoice/${id}/`,{
      method: 'DELETE',
      // headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to delete invoice');
    }
  }
  return (
    <form onSubmit={deleteInvoiceWithId}>
    <>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </>
    </form>
  );
}
