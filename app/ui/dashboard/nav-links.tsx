'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BanknotesIcon,
  WrenchScrewdriverIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  UsersIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

import { FaTruckMoving } from "react-icons/fa";
 
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
  { name: 'Suppliers',
    href: '/dashboard/Suppliers',
    icon: FaTruckMoving,
  },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCartIcon },
  { name: 'Materials', href: '/dashboard/Materials', icon: WrenchScrewdriverIcon },
  { name: 'Quotation', href: '/dashboard/quotation', icon: DocumentTextIcon },
  { name: 'Employees', href: '/dashboard/employees', icon: UsersIcon },
  { name: 'Attendance', href: '/dashboard/attendance', icon: CalendarDaysIcon },
];

export default function NavLinks() {
    const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
            >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

