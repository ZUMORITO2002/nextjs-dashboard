import {EditSupplier} from '@/app/ui/suppliers/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchSuppliersById } from '@/app/lib/data';
import { updateSupplier } from '@/app/lib/actions';
import { notFound } from 'next/navigation';
import Table from '@/app/ui/suppliers/summary';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [ Suppliers] = await Promise.all([
        fetchSuppliersById(id),
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
            label: 'Summary of  Supplier',
            href: `/dashboard/Suppliers/${id}/edit`,
            active: true,
          },
        ]}
      />

      <Table id = {id} />
        
     
    </main>
  );
}
