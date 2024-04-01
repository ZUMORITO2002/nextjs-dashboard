// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone_number: string;
};

export type Employee = {
  employee_id:string;
  id: string;
  name: string;
  address: string;
  phone_number: string;
  date_of_joining: string;
};

export type Invoice = {
  order_id: string;
  order_name: string;
  invoice_amount: number;
  address: string;
  date: string;
  customer_name: string;
  invoice_status: 'unpaid' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
  phone_number: string;
};

export type InvoiceForm = {
  order_id: string;
  order_name: string;
  invoice_amount: string;
  address: string;
  invoice_status: string;
};

export type Suppliers = {
  id: string;
  name : string;
  email: string;
  location: string; 
  organization_type: string;
  industry: string;
  revenue: number;
  num_employees: number;
  year_of_incorporation: string;
  receiving_purchase_orders: string;
  receiving_payments: string;
  currency: string;
  rating : string;
};

export type Supplier = {
  id: string;
  supplier_id: string;
  supplier_name : string;
  email: string;
  phone: string; 
  rating : string;
};

export type FormattedSuppliersTable = {
  id: string;
  name: string;
  email: string;
  rating : string;
};

export type SuppliersField = {
  id: string;
  name: string;
  phone: string;
  email: string;
  rating: string;

};

export type SuppliersTableType = {
  id: string;
  name: string;
  email: string;
  rating: string;
};

export type OrderForm = {
  order_id: string;
  order_name: string;
  customer_name: string;
  order_status: 'In Progress' | 'Finished';
};

export type OrdersTable = {
  order_id: string;
  order_name: string;
  customer_name: string;
  order_status: 'In Progress' | 'Finished';
};

export type OrdersField = {
  order_id: string;
  order_name: string;
  customer_name: string;
  order_status: 'In Progress' | 'Finished';
};



export type Orders = {
  id: string;
  order_name: string;
  customer: string;
  date: string;
  order_status: 'In Progress' | 'Finished';
};

export type MaterialsField = {
  material_id: string;
  material_name: string;
  material_amt: number;
};

export type Materials = {
  id: string;
  material_id: string;
  material_name: string;
  material_amt: number;
};


export type MaterialsForm = {
  id: string;
  materials_id: string;
  name: string;
  stock: number;
  
};


export type MaterialsTable = {
  id: string;
  materials_id: string;
  name: string;
  stock: number;
};


export type QuotationField = {
  id: string;
  quotation_id: string;
  name: string;
  supplier: string;
  date:string;
  status:'denied' | 'approved';
};

export type QuotationTable = {
  id: string;
  quotation_id: string;
  name: string;
  supplier: string;
  date:string;
  status:'denied' | 'approved';
};

export type QuotationForm = {
  id: string;
  quotation_id: string;
  name: string;
  supplier: string;
  date:string;
  status:'denied' | 'approved';

};

export type Quotation= {
  id:string;
  qoutation_id: string;
  quotation_name: string;
  supplier_name: string;
  date:string;
  quotation_status:'Rejected' | 'Accepted'| 'Under Review';

};

export type Salary= {
  id:string;
  employee: string;
  date:string;
  amount:string;

};




