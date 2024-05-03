'use client'

import React, { useEffect, useState } from 'react';
import {  EstimatedMaterial } from '@/app/lib/definitions';
import { lusitana } from '@/app/ui/fonts';

export default function EstimatedMaterials({
 query,
 currentPage,
}: {
 query: string;
 currentPage: number;
}) {
 const [material, setMaterials] = useState<EstimatedMaterial[]>([]);

 useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/give_estimated_materials');
        if (!response.ok) {
          console.error('Network response was not ok');
          return;
        }
        const data: EstimatedMaterial[] = await response.json();
        console.log('Fetched data:', data); // Debugging line
        setMaterials(data);
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      }
    };

    fetchData();
 }, []); // Empty dependency array means this effect runs once on component mount

 return (
  <div className="flex w-full flex-col md:col-span-4">
  <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
    Estimated Units for next month
  </h2>
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {material.map((material) => (
              <div
                key={material.mat_id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                 <div>
                    <div className="mb-2 flex items-center">
                      <p>{material.mat_name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{material.units}</p>
                 </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                 Material
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                 Estimated Units
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {material.map((material) => (
                <tr
                 key={material.mat_id}
                 className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                 <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{material.mat_name}</p>
                    </div>
                 </td>
                 <td className="whitespace-nowrap px-3 py-3">
                    {material.units}
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

    






