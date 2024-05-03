import { CheckIcon, ClockIcon,DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function QuotationStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-red-100 text-red-500': status === 'denied',
          'bg-yellow-500 text-yellow-900': status === 'under_review',
          'bg-green-500 text-white': status === 'approved',
        },
      )}
    >
      {status === 'denied' ? (
        <>
          Rejected
          <ClockIcon className="ml-1 w-4 text-red-500" />
        </>
      ) : null}

      {status === 'under_review' ? (
        <>
          Under Review
          <DocumentMagnifyingGlassIcon className="ml-1 w-4 text-gray-500" />
        </>
      ): null}

      {status === 'approved' ? (
        <>
          Accepted
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}