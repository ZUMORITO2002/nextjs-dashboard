import Form from '@/app/ui/customers/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
// import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { updateCustomer } from '@/app/lib/actions';
import { notFound } from 'next/navigation';
import EditCustomerForm from '@/app/ui/customers/edit-form'

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    console.log("thi is good id",id)
    // const [invoice, customers] = await Promise.all([
    //     fetchInvoiceById(id),
    //     fetchCustomers(),
    //   ]);

      // if (!invoice) {
      //   notFound();
      // }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Edit Customer',
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      {/* <Form invoice={invoice} customers={customers} /> */}
      <Form customerId={id}/>
    </main>
  );
}