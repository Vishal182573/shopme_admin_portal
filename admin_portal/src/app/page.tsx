"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Consumer {
  _id: string;
  name: string;
  email: string;
}

interface Reseller {
  _id: string;
  ownerName: string;
  businessName: string;
  email: string;
}

const AdminPortal: React.FC = () => {
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [resellers, setResellers] = useState<Reseller[]>([]);

  useEffect(() => {
    // Fetch consumers and resellers data from your API
    const fetchData = async () => {
      try {
        const consumersResponse = await fetch('https://shopemeapp-backend.onrender.com/api/user/getConsumers');
        const consumersData = await consumersResponse.json();
        console.log(consumersData);
        setConsumers(consumersData);

        const resellersResponse = await fetch('https://shopemeapp-backend.onrender.com/api/user/getResellers');
        const resellersData = await resellersResponse.json();
        setResellers(resellersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Consumers</h2>
          <ul className="bg-white shadow-md rounded-lg overflow-hidden">
            {consumers.map((consumer) => (
              <li key={consumer._id} className="border-b last:border-b-0">
                <Link href={`/admin/consumer/${consumer._id}`}>
                  <div className="block px-4 py-3 hover:bg-gray-50 transition duration-150 ease-in-out">
                    <span className="font-medium">{consumer.name}</span>
                    <span className="text-gray-500 ml-2">{consumer.email}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Resellers</h2>
          <ul className="bg-white shadow-md rounded-lg overflow-hidden">
            {resellers.map((reseller) => (
              <li key={reseller._id} className="border-b last:border-b-0">
                <Link href={`/admin/reseller/${reseller._id}`}>
                  <div className="block px-4 py-3 hover:bg-gray-50 transition duration-150 ease-in-out">
                    <span className="font-medium">{reseller.businessName}</span>
                    <span className="text-gray-500 ml-2">{reseller.email}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;