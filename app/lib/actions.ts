'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

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

  const AddCustomer = FormSchema.omit({ id: true, date: true });
  export async function addCustomer (prevState: State, formData: FormData) {
    // Validate form using Zod
    const validatedFields = AddCustomer .safeParse({
      customerId: formData.get('customerId'),
      status: formData.get('status'),
    });
   
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Add Customer .',
      };
    }
   
    // Prepare data for insertion into the database
    const { customerId, status } = validatedFields.data;
    const date = new Date().toISOString().split('T')[0];
   
    // Insert data into the database
    try {
      await sql`
        INSERT INTO customers (customer_id, status, date)
        VALUES (${customerId}, ${status}, ${date})
      `;
    } catch (error) {
      // If a database error occurs, return a more specific error.
      return {
        message: 'Database Error: Failed to Add Customer .',
      };
    }
   
    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
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
  const validatedFields = CreateInvoice.safeParse({
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

