import Form from '@/app/ui/Materials/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchMaterials } from '@/app/lib/data';
 
export default async function Page() {
  // const materials = await fetchMaterials();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Materials', href: '/dashboard/Materials' },
          {
            label: 'Create Materials',
            href: '/dashboard/Materials/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}