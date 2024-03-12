'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { fetchFilteredOrders, fetchNewOrders, fetchOPOrders, fetchDeliveredOrders } from './data';

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(30, {
      message: "name must not be longer than 30 characters.",
    }),

  email: z
    .string()
    .min(2, {
      message: "email must be at least 2 characters.",
    })
    .max(30, {
      message: "email must not be longer than 30 characters.",
    }),

  phone: z.string().regex(/^\d{10}$/, {
    message: "Phone number must be 10 digits long.",
  }).regex(/^(\d{3}-?\d{3}-?\d{4}|\d{10})$/, {
    message: "Phone number must be in the format XXX-XXX-XXXX or XXXXXXXXXX.",
  }),
})

 type ProfileFormValues = z.infer<typeof profileFormSchema>

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
      invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
      .number()
      .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
      invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
  });

const FormSupplierSchema = z.object({
    id: z.string(),
    suppliername: z.string({
      invalid_type_error: 'Please select a Suppliers.',
    }),
    rating: z.coerce
      .number()
      .gt(0, { message: 'Please enter an rating greater than 0.' }),
    email: z.string({
      invalid_type_error: 'Please enater a email.',}),
  });
  

  const FormMaterialSchema = z.object({
    id: z.string(),
    materialsId: z.string(),
    materialname: z.string({
      invalid_type_error: 'Please select the Material.',
    }),
    stock: z.coerce
      .number()
      .gt(0, { message: 'Please enter an stock greater than 0.' }),
  });


  const FormQuotationSchema = z.object({
    id: z.string(),
    quotationId: z.string(),
    quotationname: z.string({
      invalid_type_error: 'Please select a Quotation.',
    }),
    suppliername: z.string({
      invalid_type_error: 'Please select a Supplier.',
    }),
    status: z.enum(['denied', 'approved'], {
      invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
  });

  
  export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };

  export type NewState =  {
    errors?: {
      suppliername?: string[];
      email?: string[];
      rating?: string[];
    };
    message?: string | null;
  };

  export type MaterialState =  {
    errors?: {
      materialsId?: string[];
      ordername?: string[];
      stock?: string[];
    };
    message?: string | null;
  };

  export type QuotationState =  {
    errors?: {
      quotationId?: string[];
      quotationname?: string[];
      suppliername?: string[];
      status?: string[];
      date?: string[];
    };
    message?: string | null;
  };



const CreateInvoice = FormSchema.omit({ id: true, date: true });


export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {

    try {
      await sql`DELETE FROM invoices WHERE id = ${id}`;
      revalidatePath('/dashboard/invoices');
      return { message: 'Deleted Invoice.' };
    } catch (error) {
      return { message: 'Database Error: Failed to Delete Invoice.' };
    }
  }
  export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }

  //for Customers //



  const AddCustomer = profileFormSchema.omit({ name: true, email: true, phone:true });
  export async function addCustomer (formData: FormData) {
    // Validate form using Zod
    const validatedFields = AddCustomer .safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone_number'),

    });
   
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Add Customer .',
      };
    }
   
    // Prepare data for insertion into the database
   
    
    try {
      console.log("I loved JAG once ")
      const response = await axios.post('http://localhost:8000/create_customer', validatedFields);
      console.log(response.data);
      // revalidatePath('/dashboard/customers');
      // redirect('/dashboard/customers');
      return response.data;
   } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
   }
   
    // Revalidate the cache for the invoices page and redirect the user.
    
  }




const UpdateCustomer = FormSchema.omit({ id: true, date: true });

export async function updateCustomer(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateCustomer.safeParse({
    customerId: formData.get('customerId'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Customer.',
    };
  }
 
  const { customerId,status } = validatedFields.data;
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Customer.' };
  }
 
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

  export async function removeCustomer (id: string) {
  
      try {
        await sql`DELETE FROM customers WHERE id = ${id}`;
        revalidatePath('/dashboard/customers');
        return { message: 'Removed Customer.' };
      } catch (error) {
        return { message: 'Database Error: Failed to Remove Customer.' };
      }
    }

//for Suppliers //

const AddSupplier = FormSupplierSchema.omit({ id: true, date: true });
export async function addSupplier(prevState: NewState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = AddSupplier .safeParse({
    Suppliername: formData.get('name'),
    email: formData.get('email'),
    rating: formData.get('rating'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Add Supplier .',
    };
  }
 
  // Prepare data for insertion into the database
  const { suppliername, email, rating} = validatedFields.data;
  
  // Insert data into the database
  try {
    await sql`
      INSERT INTO suppliers (name, email, rating)
      VALUES (${suppliername}, ${email}, ${rating})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Add Supplier .',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/Suppliers');
  redirect('/dashboard/Suppliers');
}

const UpdateSupplier = FormSupplierSchema.omit({ id: true, date: true });

export async function updateSupplier(
id: string,
prevState: NewState,
formData: FormData,
) {
const validatedFields = UpdateSupplier.safeParse({
  Suppliername: formData.get('name'),
  email: formData.get('email'),
  rating: formData.get('rating'),
});

if (!validatedFields.success) {
  return {
    errors: validatedFields.error.flatten().fieldErrors,
    message: 'Missing Fields. Failed to Update Supplier.',
  };
}

const { suppliername, email, rating} = validatedFields.data;

try {
  await sql`
    UPDATE suppliers
    SET Name = ${suppliername}, email = ${email}
    WHERE id = ${id}
  `;
} catch (error) {
  return { message: 'Database Error: Failed to Update Supplier.' };
}

revalidatePath('/dashboard/Suppliers');
redirect('/dashboard/Suppliers');
}

export async function removeSupplier (id: string) {

    try {
      await sql`DELETE FROM Supplier WHERE id = ${id}`;
      revalidatePath('/dashboard/Suppliers');
      return { message: 'Removed Suppliers.' };
    } catch (error) {
      return { message: 'Database Error: Failed to Remove Supplier.' };
    }
  }


//for Orders//


const CreateOrder = FormSchema.omit({ id: true, date: true });


export async function createOrder(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateOrder.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Add Order.',
    };
  }
 
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO orders (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Add Order.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/orders');
  redirect('/dashboard/orders');
}



const UpdateOrder = FormSchema.omit({ id: true, date: true });

export async function updateOrder(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateOrder.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Order.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE orders
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Order.' };
  }
 
  revalidatePath('/dashboard/orders');
  redirect('/dashboard/orders');
}

export async function removeOrder (id: string) {
  
  try {
    await sql`DELETE FROM orders WHERE id = ${id}`;
    revalidatePath('/dashboard/orders');
    return { message: 'Removed Order.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Remove Order.' };
  }
}



//for Materials//



const CreateMaterial = FormMaterialSchema.omit({ id: true, date: true });


export async function createMaterial(prevState: MaterialState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateMaterial.safeParse({
    MaterialsId: formData.get('materials_id'),
    Materialsname: formData.get('name'),
    stock: formData.get('stock'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Add Materials.',
    };
  }
 
  // Prepare data for insertion into the database
  const { materialsId,materialname, stock } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO materials (materials_id, name, stock)
      VALUES (${materialsId},${materialname}, ${stock})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Add Material.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/Materials');
  redirect('/dashboard/Materials');
}



const UpdateMaterial = FormMaterialSchema.omit({ id: true, date: true });

export async function updateMaterial(
  id: string,
  prevState: MaterialState,
  formData: FormData,
) {
  const validatedFields = UpdateMaterial.safeParse({
    MaterialsId: formData.get('materials_id'),
    Materialsname: formData.get('name'),
    stock: formData.get('stock'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Order.',
    };
  }
 
  const { materialsId, materialname, stock } = validatedFields.data;
 
  try {
    await sql`
      UPDATE materials
      SET  materialid = ${materialsId},name = ${materialname}, stock = ${stock}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Materials.' };
  }
 
  revalidatePath('/dashboard/Materials');
  redirect('/dashboard/Materials');
}

export async function removeMaterial (id: string) {
  
  try {
    await sql`DELETE FROM orders WHERE id = ${id}`;
    revalidatePath('/dashboard/Materials');
    return { message: 'Removed Materials.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Remove Materials.' };
  }
}

//for Quotation//



const CreateQuotation = FormQuotationSchema.omit({ id: true, date: true });


export async function Quotation(prevState: QuotationState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateQuotation.safeParse({
    QuotationId: formData.get('quotation_id'),
    Quotationname: formData.get('name'),
    Suppliername: formData.get('supplier'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Add Quotation.',
    };
  }
 
  // Prepare data for insertion into the database
  const { quotationId,quotationname,suppliername, status } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO materials (quotation_id, name,supplier, status)
      VALUES (${quotationId},${quotationname}, ${suppliername}, ${status})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Add Quotation.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/quotation');
  redirect('/dashboard/quotation');
}



const UpdateQuotation = FormQuotationSchema.omit({ id: true, date: true });

export async function updateQuotation(
  id: string,
  prevState: QuotationState,
  formData: FormData,
) {
  const validatedFields = UpdateQuotation.safeParse({
    QuotationId: formData.get('quotation_id'),
    Quotationname: formData.get('name'),
    Suppliername: formData.get('supplier'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Quotation.',
    };
  }
 
  const { quotationId,quotationname,suppliername, status } = validatedFields.data;
 
  try {
    await sql`
      UPDATE quotation
      SET  quotationid = ${quotationId},name = ${quotationname}, supplier = ${suppliername}, stock = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Quotation.' };
  }
 
  revalidatePath('/dashboard/quotation');
  redirect('/dashboard/quotation');
}

export async function removeQuotation (id: string) {
  
  try {
    await sql`DELETE FROM quotation WHERE id = ${id}`;
    revalidatePath('/dashboard/quotation');
    return { message: 'Removed Quotation.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Remove Quotation.' };
  }
}



export async function fetchOrders(type = 'filtered', query = '', currentPage = 1) {
  switch (type) {
     case 'filtered':
       return await fetchFilteredOrders(query, currentPage);
     case 'new':
       return await fetchNewOrders();
     case 'op':
       return await fetchOPOrders();
     case 'delivered':
       return await fetchDeliveredOrders();
     default:
       return await fetchFilteredOrders(query, currentPage);
  }
 }






 import axios from 'axios';

interface Customer {
 name: string;
 email: string;
 phone_number: string;
}

const createCustomer = async (customer: Customer) => {
 try {
    const response = await axios.post('http://localhost:8000/create_customer/', customer);
    console.log(response.data);
    return response.data;
 } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
 }
};

export { createCustomer };
