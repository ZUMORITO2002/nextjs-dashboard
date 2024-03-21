import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
  SuppliersField,
  SuppliersTableType,
  OrdersTable,
  FormattedSuppliersTable,
  OrderForm,
  OrdersField,
  MaterialsField,
  MaterialsForm,
  MaterialsTable,
  QuotationField,
  QuotationTable,
  QuotationForm,
  Suppliers,
  Invoice,
  Supplier,
  Orders,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchRevenue() {
  noStore();
  try {
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const response = await fetch(`http://127.0.0.1:8000/get_invoice/${id}/`);
    const responseData = await response.json();
    const invoice: InvoiceForm[] = responseData.map((item: any) => ({
      order_id: item.order_id,
      order_name : item.order_name,
      invoice_amount: item.id,
      address: item.address,
      invoice_status: item.invoice_status
  }));

    return invoice;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all invoices.');
  }
}


export async function getInvoicebyid(orderId : string){
  console.log('I was triggered')
  try {
    const response = await fetch(`http://localhost:8000/get_invoice/${orderId}/`);

    if (!response.ok) {
      throw new Error("Failed to fetch customer data");
    }

    const invoiceData = await response.json();
    // return {
    //   order_id: invoiceData.order_id, // Ensure ID is included in the returned object
    //   order_name: invoiceData.order_name,
    //   invoice_amount: invoiceData.invoice_amount,
    //   address: invoiceData.address,
    //   invoice_status: invoiceData.invoice_status
    // };
    return invoiceData; // Return the fetched customer data
  } catch (error) {
    console.error("Error fetching customer data:", error);
    // Handle errors (e.g., show error message)
    return {
      order_id:"",
      order_name: "",
      invoice_amount: "",
      address: "",
      invoice_status: "" // Set defaults if fetching fails
    };
  }
}


export async function fetchCustomers() {
  noStore();
  try {
    const response = await fetch('http://127.0.0.1:8000/list_customers');
    const responseData = await response.json();
    const customers: CustomerField[] = responseData.map((item: any) => ({
      id: item.id,
      name: item.name,
      phone_number: item.phone_number
      // Map other properties as needed
  }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchOrders() {
  noStore();
  try {
    const response = await fetch('http://127.0.0.1:8000/list_orders');
    const responseData = await response.json();
    const orders: Orders[] = responseData.map((item: any) => ({
      id: item.id,
      order_name: item.order_name,
      customer: item.customer,
      // Map other properties as needed
  }));

    return orders;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchCustomerPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function fetchSuppliers() {
  noStore();
  try {
    const response = await fetch('http://127.0.0.1:8000/list_suppliers');
    const responseData = await response.json();
    const suppliers: SuppliersField[] = responseData.map((item: any) => ({
      // "supplier_id": 10,
      // "supplier_name": "Donkothhhhh",
      // "email": "rooseweltt47@gmail.com",
      // "phone": "8562314894",
      // "rating": "3"
      id: item.supplier_id,
      name: item.supplier_name,
      phone: item.phone,
      email:item.email,
      rating:item.rating
  }))



    return suppliers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all suppliers.');
  }
}

// export async function fetchSuppliersPages(query: string) {
//   noStore();
//   try {
//     const count = await sql`SELECT COUNT(*)
//     FROM suppliers
//     JOIN suppliers ON suppliers.id = suppliers.id
//     WHERE
//       suppliers.name ILIKE ${`%${query}%`} OR
//       suppliers.email ILIKE ${`%${query}%`} OR
//       suppliers.rating ILIKE ${`%${query}%`}
//   `;

//     const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch total number of customers.');
//   }
// }

export async function fetchFilteredSuppliers(query: string) {
  noStore();
  try {
    const data = await sql<SuppliersTableType>`
    SELECT id,name,email,rating FROM suppliers
    GROUP BY id, name, email, rating ORDER BY id ASC
	  `;

    const suppliers = data.rows.map((Suppliers) => ({
      ...Suppliers,
    }));

    return suppliers;
    console.log(suppliers);
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch suppliers table.');
  }
}

export async function fetchFilteredOrders(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const orders = await sql<OrdersTable>`
    SELECT
    id,
    order_id,
    order_name,
    customer_name,
    date,
    order_status
    FROM
    orders
    ORDER BY
    CAST(id AS INTEGER) ASC;
`;

    return orders.rows;
  } catch (error) {
    console.error(error);
    // throw new Error('Failed to fetch Orders.');
  }
}





export async function fetchNewOrders() {
  noStore();

  try {
    const orders = await sql<OrdersTable>`
    SELECT
    id,
    order_id,
    order_name,
    customer_name,
    date,
    order_status
    FROM
    orders
    ORDER BY
    date DESC;

`;

    return orders.rows;
  } catch (error) {
    console.error(error);
    // throw new Error('Failed to fetch New Orders.');
  }
}

export async function fetchOPOrders() {
  noStore();

  try {
    const orders = await sql<OrdersTable>`
    SELECT
    id,
    order_id,
    order_name,
    customer_name,
    date,
    order_status
    WHERE
    order_status = 'In Progress'
    ORDER BY
    order_status;

`;

    return orders.rows;
  } catch (error) {
    console.error(error);
    // throw new Error('Failed to fetch On Progress Orders.');
  }
}

export async function fetchDeliveredOrders() {
  noStore();
  try {
    const orders = await sql<OrdersTable>`
    SELECT
    id,
    order_id,
    order_name,
    customer_name,
    date,
    order_status
    WHERE
    order_status = 'Finished'
    ORDER BY
    order_status;


`;

    return orders.rows;
  } catch (error) {
    console.error(error);
    // throw new Error('Failed to fetch Delivered Orders.');
  }
}

export async function fetchMaterials() {
  noStore();
  try {
    const data = await sql<MaterialsField>`
    SELECT
    id,
    inventorys_id,
    material_name,
    material_amt
    FROM Inventorys
    ORDER BY CAST(id AS INTEGER) ASC;

    `;

    const inventorys = data.rows;
    return inventorys;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all Materials.');
  }
}


export async function fetchMaterialsById(id: string) {
  noStore();
  try {
    const data = await sql<MaterialsForm>`
      SELECT
        materials.id,
        materials.materials_id,
        materials.name,
        materials.stock
      FROM materials
      WHERE materials.id = ${id};
    `;

    const material = data.rows.map((material) => ({
      ...material,
      stock: material.stock,
    }));
    console.log(material);
    return material[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch id of material.');
  }
}


export async function fetchFilteredMaterials(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const materials = await sql<MaterialsTable>`
    SELECT
    id,
    materials_id,
    name,
    stock
    FROM materials
    ORDER BY CAST(id AS INTEGER) ASC;

    `;

    return materials.rows;
  } catch (error) {
    console.error(error);
    // throw new Error('Failed to fetch Materials.');
  }
}


export async function fetchQuotation() {
  noStore();
  try {
    const data = await sql<QuotationField>`
    SELECT
    id,
    quotation_id,
    name,
    supplier,
    date,
    status
    FROM quotation
    ORDER BY CAST(id AS INTEGER) ASC;

    `;

    const quotations = data.rows;
    return quotations;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all Quotations.');
  }
}



export async function fetchFilteredQuotation(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const quotations = await sql<QuotationTable>`
    SELECT
    id,
    quotation_id,
    name,
    supplier,
    date,
    status
    FROM quotation
    ORDER BY CAST(id AS INTEGER) ASC;
    `;

    return quotations.rows;
  } catch (error) {
    console.error(error);
    // throw new Error('Failed to fetch Quotations.');
  }
}


export async function fetchQuotationsById(id: string) {
  noStore();
  try {
    const data = await sql<QuotationForm>`
      SELECT
        quotation.id,
        quotation.quotation_id,
        quotation.name,
        quotation.supplier,
        quotation.date,
        quotation.status
      FROM quotation
      WHERE quotation.id = ${id};
    `;

    const quotation = data.rows.map((quotation ) => ({
      ...quotation ,
    }));
    console.log(quotation );
    return quotation [0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch id of quotation .');
  }
}



export async function fetchApprovedQuotation() {
  noStore();
  try {
    const quotations = await sql<QuotationTable>`
    SELECT
    id,
    quotation_id,
    name,
    supplier,
    date,
    status
    FROM
    quotation
    WHERE
    status = 'approved'
    ORDER BY
    status;

`;

    return quotations.rows;
  } catch (error) {
    console.error(error);
    // throw new Error('Failed to fetch Delivered Quotations.');
  }
}

export async function fetchDeniedQuotation() {
  noStore();
  try {
    const quotations = await sql<QuotationTable>`
    SELECT
    id,
    quotation_id,
    name,
    supplier,
    date,
    status
    FROM
    quotation
    WHERE
    status = 'denied'
    ORDER BY
    status;


`;

    return quotations.rows;
  } catch (error) {
    console.error(error);
    // throw new Error('Failed to fetch Delivered Quotations.');
  }
}


export async function fetchQuotationPages(query: string) {
  noStore();
  try {
    const count = await sql`
    SELECT
    id,
    quotation_id,
    name,
    supplier,
    date,
    status
    FROM quotation
    ORDER BY CAST(id AS INTEGER) ASC;
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of Quotations.');
  }
}


export async function fetchSuppliersById(id: string){
  noStore();
  console.log(id)
  try{
    const data = await sql<Suppliers>`
      SELECT
        id,
        name,
        email,
        location,
        organization_type,
        industry,
        revenue,
        num_employees,
        year_of_incorporation,
        receiving_purchase_orders,
        currency,
        rating
      FROM suppliers
      WHERE id = ${id};
    `;
    const suppliers = data.rows.map((suppliers) => ({
      ...suppliers,
    }));
    console.log(suppliers);
    return suppliers;
  }catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch id of supplier.');
  }

} 

export async function fetchInvoices(query: string) {
  noStore();
  try {
    const data = await sql<Invoice>`
      SELECT
        id,
        order_id,
        invoice_amount,
        address,
        date,
        customer_name,
        order_status
      FROM invoices
      ORDER BY order_id
    `;

    const invoices = data.rows;
    return invoices;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all invoices.');
  }
}

export async function fetchSupplier(query: string) {
  noStore();
  try {
    const data = await sql<Supplier>`
      SELECT
        id,
        order_id,
        supplier_name,
        phone,
        email,
        rating
      FROM suppliers
      ORDER BY supplier_id
    `;

    const suppliers = data.rows;
    return suppliers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all suppliers.');
  }
}




