import Form from '@/app/ui/quotation/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchQuotationsById, fetchQuotation } from '@/app/lib/data';
import { updateInvoice } from '@/app/lib/actions';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    // const [quotation,quotations] = await Promise.all([
    //     fetchQuotationsById(id),
    //     fetchQuotation(),
    //   ]);

    //   if (!quotation) {
    //     notFound();
    //   }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'quotation', href: '/dashboard/quotation' },
          {
            label: 'Edit Quotation',
            href: `/dashboard/quotation/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form quotationId={id}/>
    </main>
  );
}