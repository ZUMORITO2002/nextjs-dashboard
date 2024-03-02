import Form from '@/app/ui/orders/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers, fetchOrdersById } from '@/app/lib/data';
import { updateOrder } from '@/app/lib/actions';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [invoice, customers,orders] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
        fetchOrdersById (id),
      ]);

      if (!invoice) {
        notFound();
      }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Orders', href: '/dashboard/orders' },
          {
            label: 'Edit Order',
            href: `/dashboard/orders/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form order={orders} customers={customers} />
    </main>
  );
}
