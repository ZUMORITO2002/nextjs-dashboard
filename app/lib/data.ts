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
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      amount: invoice.amount,
    }));
    console.log(invoice);
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  noStore();
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
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
    const data = await sql<SuppliersField>`
    SELECT id,Name,Rating FROM suppliers ORDER BY id ASC
    `;

    const Suppliers = data.rows;
    return Suppliers;
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
    customer_id,
    name,
    location,
    date,
    amount,
    status
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

export async function fetchOrdersById(id: string) {
  noStore();
  try {
    const data = await sql<OrderForm>`
      SELECT
        orders.id,
        orders.customer_id,
        orders.amount,
        orders.status
      FROM orders
      WHERE orders.id = ${id};
    `;

    const order = data.rows.map((order) => ({
      ...order,
      amount: order.amount,
    }));
    console.log(order);
    return order[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch id of order.');
  }
}

export async function fetchOrders() {
  noStore();
  try {
    const data = await sql<OrdersField>`
      SELECT
        id,
        name
      FROM orders
      ORDER BY name ASC
    `;

    const orders = data.rows;
    return orders;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all orders.');
  }
}

export async function fetchNewOrders() {
  noStore();

  try {
    const orders = await sql<OrdersTable>`
    SELECT
    id,
    customer_id,
    name,
    location,
    date,
    amount,
    status
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
    customer_id,
    name,
    location,
    date,
    amount,
    status
    FROM
    orders
    WHERE
    status = 'pending'
    ORDER BY
    status;

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
    customer_id,
    name,
    location,
    date,
    amount,
    status
    FROM
    orders
    WHERE
    status = 'delivered'
    ORDER BY
    status;

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
    materials_id,
    name,
    stock
    FROM materials
    ORDER BY CAST(id AS INTEGER) ASC;

    `;

    const materials = data.rows;
    return materials;
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