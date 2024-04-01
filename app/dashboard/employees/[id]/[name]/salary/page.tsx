import Form from '@/app/ui/employees/salary';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
// import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { updateCustomer } from '@/app/lib/actions';
import { notFound } from 'next/navigation';
import EditCustomerForm from '@/app/ui/customers/edit-form'

export default async function Page({ params }: { params: { id: string , name:string} }) {
    const id = params.id;
    const name = params.name;
    console.log("thi is good id",name, id)
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Salary', href: '/dashboard/employees' },
          {
            label: `${name}`,
            href: `/dashboard/employees/${id}/${name}/salary`,
            active: true,
          },
        ]}
      />

      <Form salaryId={id}/>
    </main>
  );
}