import Form from '@/app/ui/orders/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
// import { fetchInvoiceById, fetchCustomers, fetchOrdersById } from '@/app/lib/data';
import { updateOrder } from '@/app/lib/actions';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    console.log("This is order id", id)
    // const [customers,orders] = await Promise.all([
    //     fetchCustomers(),
    //     fetchOrdersById (id),
    //   ]);

    //   if (!orders) {
    //     notFound();
    //   }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'orders', href: '/dashboard/orders' },
          {
            label: 'Edit order',
            href: `/dashboard/orders/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form orderId={id} />
    </main>
  );
}
