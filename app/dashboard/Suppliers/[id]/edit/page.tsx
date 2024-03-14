import Form from '@/app/ui/suppliers/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
// import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { updateCustomer } from '@/app/lib/actions';
import { notFound } from 'next/navigation';
import EditCustomerForm from '@/app/ui/customers/edit-form'

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    console.log("thi is good id",id)
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

      <Form supplierId={id}/>
    </main>
  );
}