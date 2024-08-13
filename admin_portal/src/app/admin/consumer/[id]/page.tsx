"use client"

import React, { useState, useEffect } from 'react';

interface Consumer {
  _id: string;
  name: string;
  email: string;
  contact: string;
  city: string;
  type: string;
  image: string;
  bio: string;
  connections: Array<{ userId: string; Type: string }>;
  createdAt: string;
  updatedAt: string;
}

interface Post {
  _id: string;
  description: string;
  category: string;
  images: string[];
  createdAt: string;
}

interface Requirement {
  _id: string;
  productName: string;
  category: string;
  quantity: number;
  totalPrice: number;
  details: string;
  images: string[];
  createdAt: string;
}

interface Catalog {
  _id: string;
  productName: string;
  category: string;
  description: string;
  price: string;
  images: string[];
  createdAt: string;
}

export default function ConsumerDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const [consumer, setConsumer] = useState<Consumer | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [consumerResponse, postsResponse, requirementsResponse, catalogsResponse] = await Promise.all([
          fetch(`https://shopemeapp-backend.onrender.com/api/user/getConsumer/?id=${id}`),
          fetch(`https://shopemeapp-backend.onrender.com/api/post/getPostByUserId/?userId=${id}`),
          fetch(`https://shopemeapp-backend.onrender.com/api/requirement/getReqByUserid/?userId=${id}`),
          fetch(`https://shopemeapp-backend.onrender.com/api/catalog/getAllByUserId/?userId=${id}`)
        ]);

        const [consumerData, postsData, requirementsData, catalogsData] = await Promise.all([
          consumerResponse.json(),
          postsResponse.json(),
          requirementsResponse.json(),
          catalogsResponse.json()
        ]);

        setConsumer(consumerData);
        setPosts(postsData);
        setRequirements(requirementsData);
        setCatalogs(catalogsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const [activeTab, setActiveTab] = useState('profile');

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!consumer) {
    return <div className="flex items-center justify-center h-screen">Consumer not found</div>;
  }

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'posts', label: 'Posts', count: posts.length },
    { id: 'requirements', label: 'Requirements', count: requirements.length },
    { id: 'catalogs', label: 'Catalogs', count: catalogs.length },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="p-6 sm:p-8 md:flex">
          <div className="md:w-1/3 mb-6 md:mb-0">
            {consumer.image ? (
              <img src={consumer.image} alt={consumer.name} className="w-32 h-32 rounded-full object-cover mx-auto" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-white mx-auto">
                {consumer.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="md:w-2/3 md:pl-8">
            <h1 className="text-3xl font-bold mb-2">{consumer.name}</h1>
            <p className="text-gray-600 mb-4">{consumer.email}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><span className="font-semibold">Contact:</span> {consumer.contact}</p>
              <p><span className="font-semibold">City:</span> {consumer.city}</p>
              <p><span className="font-semibold">Type:</span> {consumer.type}</p>
              <p><span className="font-semibold">Joined:</span> {new Date(consumer.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 bg-gray-200 text-gray-700 py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {activeTab === 'profile' && (
          <div className="p-6">
            {consumer.bio && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Bio</h3>
                <p className="text-gray-700">{consumer.bio}</p>
              </div>
            )}
            {consumer.connections.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Connections</h3>
                <ul className="space-y-2">
                  {consumer.connections.map((connection, index) => (
                    <li key={index} className="bg-gray-100 p-2 rounded text-sm">
                      <span className="font-medium">User ID:</span> {connection.userId}, <span className="font-medium">Type:</span> {connection.Type}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="p-6">
            {posts.length > 0 ? (
              <ul className="space-y-6">
                {posts.map((post) => (
                  <li key={post._id} className="border-b pb-6">
                    <p className="text-lg font-semibold mb-2">{post.description}</p>
                    <p className="text-sm text-gray-600 mb-2">Category: {post.category}</p>
                    <p className="text-xs text-gray-500 mb-3">Posted on {new Date(post.createdAt).toLocaleDateString()}</p>
                    {post.images.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.images.map((image, index) => (
                          <img key={index} src={image} alt={`Post image ${index + 1}`} className="w-24 h-24 object-cover rounded" />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No posts found.</p>
            )}
          </div>
        )}

        {activeTab === 'requirements' && (
          <div className="p-6">
            {requirements.length > 0 ? (
              <ul className="space-y-6">
                {requirements.map((requirement) => (
                  <li key={requirement._id} className="border-b pb-6">
                    <h4 className="text-lg font-semibold mb-2">{requirement.productName}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <p><span className="font-medium">Category:</span> {requirement.category}</p>
                      <p><span className="font-medium">Quantity:</span> {requirement.quantity}</p>
                      <p><span className="font-medium">Total Price:</span> ${requirement.totalPrice}</p>
                      <p><span className="font-medium">Created:</span> {new Date(requirement.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm mb-3">{requirement.details}</p>
                    {requirement.images.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {requirement.images.map((image, index) => (
                          <img key={index} src={image} alt={`Requirement image ${index + 1}`} className="w-24 h-24 object-cover rounded" />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No requirements found.</p>
            )}
          </div>
        )}

        {activeTab === 'catalogs' && (
          <div className="p-6">
            {catalogs.length > 0 ? (
              <ul className="space-y-6">
                {catalogs.map((catalog) => (
                  <li key={catalog._id} className="border-b pb-6">
                    <h4 className="text-lg font-semibold mb-2">{catalog.productName}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <p><span className="font-medium">Category:</span> {catalog.category}</p>
                      <p><span className="font-medium">Price:</span> ${catalog.price}</p>
                      <p><span className="font-medium">Created:</span> {new Date(catalog.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm mb-3">{catalog.description}</p>
                    {catalog.images.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {catalog.images.map((image, index) => (
                          <img key={index} src={image} alt={`Catalog image ${index + 1}`} className="w-24 h-24 object-cover rounded" />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No catalogs found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}