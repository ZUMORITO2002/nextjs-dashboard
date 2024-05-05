import { CheckIcon, ClockIcon,DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function QuotationStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-red-100 text-red-500': status === 'Rejected',
          'bg-yellow-500 text-yellow-900': status === 'Under Review',
          'bg-green-500 text-white': status === 'Accepted',
        },
      )}
    >
      {status === 'Rejected' ? (
        <>
          Rejected
          <ClockIcon className="ml-1 w-4 text-red-500" />
        </>
      ) : null}

      {status === 'Under Review' ? (
        <>
          Under Review
          <DocumentMagnifyingGlassIcon className="ml-1 w-4 text-gray-500" />
        </>
      ): null}

      {status === 'Accepted' ? (
        <>
          Accepted
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}