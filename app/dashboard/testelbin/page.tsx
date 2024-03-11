// testelbn/page.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { Customer } from './types';

const Page: React.FC = () => {
 const [customers, setCustomers] = useState<Customer[]>([]);

 useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/list_customers');
        if (!response.ok) {
          console.error('Network response was not ok');
          return;
        }
        const data: Customer[] = await response.json();
        console.log('Fetched data:', data); // Debugging line
        setCustomers(data);
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      }
    };

    fetchData();
 }, []);

 return (
    <div>
      <h1>List of Customers</h1>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.name} - {customer.email} - {customer.phone_number}
          </li>
        ))}
      </ul>
    </div>
 );
};

export default Page;
