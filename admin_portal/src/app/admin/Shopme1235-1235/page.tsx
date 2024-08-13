"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaUser, FaStore } from 'react-icons/fa';

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
  const [consumerSearch, setConsumerSearch] = useState('');
  const [resellerSearch, setResellerSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const consumersResponse = await fetch('https://shopemeapp-backend.onrender.com/api/user/getConsumers');
        const consumersData = await consumersResponse.json();
        setConsumers(consumersData);

        const resellersResponse = await fetch('https://shopemeapp-backend.onrender.com/api/user/getResellers');
        const resellersData = await resellersResponse.json();
        setResellers(resellersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredConsumers = consumers.filter(consumer =>
    consumer.name.toLowerCase().includes(consumerSearch.toLowerCase()) ||
    consumer.email.toLowerCase().includes(consumerSearch.toLowerCase())
  );

  const filteredResellers = resellers.filter(reseller =>
    reseller.businessName.toLowerCase().includes(resellerSearch.toLowerCase()) ||
    reseller.email.toLowerCase().includes(resellerSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center text-indigo-700">Admin Portal</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <UserList
              title="Consumers"
              users={filteredConsumers}
              searchTerm={consumerSearch}
              setSearchTerm={setConsumerSearch}
              icon={<FaUser className="text-indigo-500" />}
              linkPrefix="/admin/consumer/"
            />
            <UserList
              title="Resellers"
              users={filteredResellers}
              searchTerm={resellerSearch}
              setSearchTerm={setResellerSearch}
              icon={<FaStore className="text-indigo-500" />}
              linkPrefix="/admin/reseller/"
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface UserListProps {
  title: string;
  users: (Consumer | Reseller)[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  icon: React.ReactNode;
  linkPrefix: string;
}

const UserList: React.FC<UserListProps> = ({ title, users, searchTerm, setSearchTerm, icon, linkPrefix }) => (
  <div className="bg-white shadow-xl rounded-lg overflow-hidden">
    <div className="bg-indigo-100 p-4">
      <h2 className="text-2xl font-semibold text-indigo-800 flex items-center gap-2">
        {icon} {title}
      </h2>
      <div className="mt-4 relative">
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          className="w-full p-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
    {users.length === 0 ? (
      <p className="text-center py-4 text-gray-500">No {title.toLowerCase()} found</p>
    ) : (
      <ul className="divide-y divide-gray-200">
        {users.map((user) => (
          <li key={user._id}>
            <Link href={`${linkPrefix}${user._id}`}>
              <div className="block px-6 py-4 hover:bg-indigo-50 transition duration-150 ease-in-out">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-indigo-600">
                    {'name' in user ? user.name : user.businessName}
                  </span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default AdminPortal;