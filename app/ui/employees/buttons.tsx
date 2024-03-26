import { PlusIcon, TrashIcon, PencilIcon , BanknotesIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { removeEmployee } from '@/app/lib/actions';

export function AddEmployee() {
  return (
    <Link
      href="/dashboard/employees/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Employee</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function EditEmployee ({ id }: { id: string }) {
  return (
    <Link
    href={`/dashboard/employees/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}


export function SalaryEmployee ({ id }: { id: string }) {
  return (
    <Link
    href={`/dashboard/employees/${id}/salary`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      < BanknotesIcon className="w-5" />
    </Link>
  );
}

export function RemoveEmployee ({ id }: { id: string }) {
  const removeEmployeeWithId = removeEmployee.bind(null, id);
  return (
    <form action={removeEmployeeWithId}>
    <>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Remove</span>
        <TrashIcon className="w-5" />
      </button>
    </>
    </form>
  );
}