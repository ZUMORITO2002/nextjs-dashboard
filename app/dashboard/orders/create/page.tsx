import Form from '@/app/ui/orders/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchOrders } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Orders', href: '/dashboard/orders' },
          {
            label: 'Create Orders',
            href: '/dashboard/orders/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}