import Form from '@/app/ui/Materials/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchMaterialsById, fetchMaterials } from '@/app/lib/data';
import { updateMaterial } from '@/app/lib/actions';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [materials] = await Promise.all([
        fetchMaterialsById(id),
        fetchMaterials(),
      ]);

      if (!materials) {
        notFound();
      }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Materials', href: '/dashboard/Materials' },
          {
            label: 'Edit Materials',
            href: `/dashboard/Materials/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form material={materials} materials={[]}  />
    </main>
  );
}