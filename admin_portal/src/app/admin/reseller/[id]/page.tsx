"use client"

import React, { useState, useEffect } from 'react';

interface Reseller {
  _id: string;
  ownerName: string;
  businessName: string;
  email: string;
  address: string;
  contact: string;
  city: string;
  type: string;
  image: string;
  bgImage: string;
  aboutUs: string;
  catalogueCount: number;
  connections: Array<{ userId: string; Type: string }>;
  createdAt: string;
  updatedAt: string;
}

interface Post {
  description: string;
  category: string;
  images: string[];
  createdAt: string;
}

interface Requirement {
  productName: string;
  category: string;
  quantity: number;
  totalPrice: number;
  details: string;
  images: string[];
  createdAt: string;
}

interface Catalog {
  productName: string;
  category: string;
  description: string;
  price: number;
  images: string[];
  createdAt: string;
}

export default function ResellerDetails({ params }: { params: { id: string } }) {
  const [reseller, setReseller] = useState<Reseller | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [activeTab, setActiveTab] = useState('about');
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchReseller = async () => {
        try {
          const response = await fetch(`https://shopemeapp-backend.onrender.com/api/user/getReseller/?id=${id}`);
          const data = await response.json();
          setReseller(data);
        } catch (error) {
          console.error('Error fetching reseller:', error);
        }
      };

      const fetchPosts = async () => {
        try {
          const response = await fetch(`https://shopemeapp-backend.onrender.com/api/post/getPostByUserId/?userId=${id}`);
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };

      const fetchRequirements = async () => {
        try {
          const response = await fetch(`https://shopemeapp-backend.onrender.com/api/requirement/getReqByUserid/?userId=${id}`);
          const data = await response.json();
          setRequirements(data);
        } catch (error) {
          console.error('Error fetching requirements:', error);
        }
      };

      const fetchCatalogs = async () => {
        try {
          const response = await fetch(`https://shopemeapp-backend.onrender.com/api/catalog/getAllByUserId/?userId=${id}`);
          const data = await response.json();
          setCatalogs(data);
        } catch (error) {
          console.error('Error fetching catalogs:', error);
        }
      };

      fetchReseller();
      fetchPosts();
      fetchRequirements();
      fetchCatalogs();
    }
  }, [id]);

  if (!reseller) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const tabs = ['About', 'Connections', 'Posts', 'Requirements', 'Catalogs'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden mr-6 mb-4 md:mb-0">
              {reseller.image ? (
                <img src={reseller.image} alt={reseller.businessName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-white">
                  {reseller.businessName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{reseller.businessName}</h1>
              <p className="text-gray-500">{reseller.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Owner:</strong> {reseller.ownerName}</p>
              <p><strong>Contact:</strong> {reseller.contact}</p>
              <p><strong>Address:</strong> {reseller.address}</p>
              <p><strong>City:</strong> {reseller.city}</p>
            </div>
            <div>
              <p><strong>Type:</strong> {reseller.type}</p>
              <p><strong>Catalogues:</strong> {reseller.catalogueCount}</p>
              <p><strong>Created:</strong> {new Date(reseller.createdAt).toLocaleDateString()}</p>
              <p><strong>Updated:</strong> {new Date(reseller.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 font-semibold ${
                activeTab.toLowerCase() === tab.toLowerCase()
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {activeTab === 'about' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">About Us</h2>
            <p className="mb-4">{reseller.aboutUs}</p>
            {reseller.bgImage && (
              <img src={reseller.bgImage} alt="Background" className="w-full h-48 object-cover rounded-lg" />
            )}
          </div>
        )}

        {activeTab === 'connections' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Connections</h2>
            <ul className="space-y-2">
              {reseller.connections.map((connection, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded">
                  User ID: {connection.userId}, Type: {connection.Type}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Posts</h2>
            <ul className="space-y-4">
              {posts.map((post, index) => (
                <li key={index} className="border-b pb-4">
                  <p className="font-semibold">{post.description}</p>
                  <p className="text-sm text-gray-500">Category: {post.category}</p>
                  <div className="flex mt-2">
                    {post.images.map((image, i) => (
                      <img key={i} src={image} alt={`Post ${index} Image ${i}`} className="w-16 h-16 object-cover mr-2 rounded" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{new Date(post.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'requirements' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
            <ul className="space-y-4">
              {requirements.map((requirement, index) => (
                <li key={index} className="border-b pb-4">
                  <p className="font-semibold">{requirement.productName}</p>
                  <p>Category: {requirement.category}</p>
                  <p>Quantity: {requirement.quantity}</p>
                  <p>Total Price: ${requirement.totalPrice}</p>
                  <p className="text-sm">{requirement.details}</p>
                  <div className="flex mt-2">
                    {requirement.images.map((image, i) => (
                      <img key={i} src={image} alt={`Requirement ${index} Image ${i}`} className="w-16 h-16 object-cover mr-2 rounded" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{new Date(requirement.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'catalogs' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Catalogs</h2>
            <ul className="space-y-4">
              {catalogs.map((catalog, index) => (
                <li key={index} className="border-b pb-4">
                  <p className="font-semibold">{catalog.productName}</p>
                  <p>Category: {catalog.category}</p>
                  <p className="text-sm">{catalog.description}</p>
                  <p className="font-bold">Price: ${catalog.price}</p>
                  <div className="flex mt-2">
                    {catalog.images.map((image, i) => (
                      <img key={i} src={image} alt={`Catalog ${index} Image ${i}`} className="w-16 h-16 object-cover mr-2 rounded" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{new Date(catalog.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}