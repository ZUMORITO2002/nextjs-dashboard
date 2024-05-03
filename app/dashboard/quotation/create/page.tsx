import Form from '@/app/ui/quotation/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchSuppliers } from '@/app/lib/data';
import ImageUpload from "@/app/ui/quotation/image-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export default async function Page() {
  const suppliers = await fetchSuppliers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Quotation', href: '/dashboard/quotation' },
          {
            label: 'Create Quotation',
            href: '/dashboard/quotation/create',
            active: true,
          },
        ]}
      />
      <Form suppliers={suppliers} />
    </main>
  );
}

