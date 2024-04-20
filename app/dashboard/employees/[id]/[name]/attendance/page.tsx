import Form from '@/app/ui/employees/attendance';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';

export default async function Page({ params }: { params: { id: string , name:string} }) {
    const id = params.id;
    const name = decodeURIComponent(params.name); // Decode the name
    console.log("this is good id", name, id);
    
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Attendance', href: '/dashboard/employees' },
                    {
                        label: `${name}`,
                        href: `/dashboard/employees/${id}/${encodeURIComponent(name)}/attendance`, // Encode the name in the href
                        active: true,
                    },
                ]}
            />

            <Form employeeId={id}/>
        </main>
    );
}