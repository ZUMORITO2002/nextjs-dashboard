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
      <h1 className="text-5xl font-semibold justify-center al">OR</h1>
      <p className="text-muted-foreground">File upload component for React</p>
      <div className="flex gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow" variant="outline">
              File upload
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center">
                Upload your files
              </DialogTitle>
              <DialogDescription className="text-center">
                The only file upload you will ever need
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <ImageUpload />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

