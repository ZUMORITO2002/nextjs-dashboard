import {EditSupplier} from '@/app/ui/suppliers/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchSuppliers } from '@/app/lib/data';
import { updateSupplier } from '@/app/lib/actions';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [ Suppliers] = await Promise.all([
        fetchSuppliers(),
      ]);

      if (!Suppliers) {
        notFound();
      }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Supplier', href: '/dashboard/Suppliers' },
          {
            label: 'Edit Supplier',
            href: `/dashboard/Suppliers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditSupplier />
    </main>
  );
}
