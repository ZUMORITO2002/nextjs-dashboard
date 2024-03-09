"use client"
import React, { useEffect, useState } from 'react';
import { user } from '@/app/lib/definitions';

async function getData(): Promise<user[]> {
  const res = await fetch('http://127.0.0.1:8000/list_customers');

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default function Page() {
  const [data, setData] = useState<user[]>([]); // Specify the type explicitly

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await getData();
        setData(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error state
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {data.map((userData: user) => (
        <div key={userData.id}>
          <p>ID: {userData.id}</p>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          <p>Phone Number: {userData.phone_number}</p>
        </div>
      ))}
    </div>
  );
}
