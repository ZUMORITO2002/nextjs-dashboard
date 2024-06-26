'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { UpdateMaterials, RemoveMaterial } from '@/app/ui/Materials/buttons';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchInvoices } from '@/app/lib/data'; 
import {  Material } from '@/app/lib/definitions';

export default function Materials({
 query,
 currentPage,
}: {
 query: string;
 currentPage: number;
}) {
 const [material, setMaterials] = useState<Material[]>([]);

 useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/list_inventorys');
        if (!response.ok) {
          console.error('Network response was not ok');
          return;
        }
        const data: Material[] = await response.json();
        console.log('Fetched data:', data); // Debugging line
        setMaterials(data);
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      }
    };

    fetchData();
 }, []); // Empty dependency array means this effect runs once on component mount

 return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {material.map((material) => (
              <div
                key={material.material_id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                 <div>
                    <div className="mb-2 flex items-center">
                      <p>{material.material_id}</p>
                    </div>
                    <p className="text-sm text-gray-500">{material.material_name}</p>
                 </div>
                 <div className="mb-2 flex items-center">
                    <p>{material.material_amt}</p>
                 </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                 <div className="flex justify-end gap-2">
                    <UpdateMaterials id={material.material_id} />
                    {/* <RemoveMaterial id={material.material_id} /> */}
                 </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                 Inventory ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                 Material Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                 Stock
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                 <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {material.map((material) => (
                <tr
                 key={material.material_id}
                 className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                 <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{material.material_id}</p>
                    </div>
                 </td>
                 <td className="whitespace-nowrap px-3 py-3">
                    {material.material_name}
                 </td>
                 <td className="whitespace-nowrap px-3 py-3">
                    {material.material_amt}
                 </td>
                 <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                    <UpdateMaterials id={material.material_id} />
                    {/* <RemoveMaterial id={material.material_id} /> */}
                    </div>
                 </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
 );
}

    






