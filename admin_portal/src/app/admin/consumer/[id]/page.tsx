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

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!consumer) {
    return <div className="container mx-auto px-4 py-8">Consumer not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Consumer Details</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
        <div className="flex items-center mb-6">
          {consumer.image && (
            <img src={consumer.image} alt={consumer.name} className="w-24 h-24 rounded-full object-cover mr-6" />
          )}
          <div>
            <h2 className="text-2xl font-semibold">{consumer.name}</h2>
            <p className="text-gray-500">{consumer.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Contact:</strong> {consumer.contact}</p>
            <p><strong>City:</strong> {consumer.city}</p>
            <p><strong>Type:</strong> {consumer.type}</p>
          </div>
          <div>
            <p><strong>Created:</strong> {new Date(consumer.createdAt).toLocaleDateString()}</p>
            <p><strong>Updated:</strong> {new Date(consumer.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
        {consumer.bio && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Bio</h3>
            <p>{consumer.bio}</p>
          </div>
        )}
        {consumer.connections.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Connections</h3>
            <ul>
              {consumer.connections.map((connection, index) => (
                <li key={index}>
                  User ID: {connection.userId}, Type: {connection.Type}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Posts Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
        <h3 className="text-2xl font-semibold mb-4">Posts</h3>
        {posts.length > 0 ? (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post._id} className="border-b pb-4">
                <p><strong>Description:</strong> {post.description}</p>
                <p><strong>Category:</strong> {post.category}</p>
                <p><strong>Created:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
                {post.images.length > 0 && (
                  <div className="mt-2">
                    <p><strong>Images:</strong></p>
                    <div className="flex flex-wrap gap-2">
                      {post.images.map((image, index) => (
                        <img key={index} src={image} alt={`Post image ${index + 1}`} className="w-24 h-24 object-cover rounded" />
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No posts found.</p>
        )}
      </div>

      {/* Requirements Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
        <h3 className="text-2xl font-semibold mb-4">Requirements</h3>
        {requirements.length > 0 ? (
          <ul className="space-y-4">
            {requirements.map((requirement) => (
              <li key={requirement._id} className="border-b pb-4">
                <p><strong>Product Name:</strong> {requirement.productName}</p>
                <p><strong>Category:</strong> {requirement.category}</p>
                <p><strong>Quantity:</strong> {requirement.quantity}</p>
                <p><strong>Total Price:</strong> ${requirement.totalPrice}</p>
                <p><strong>Details:</strong> {requirement.details}</p>
                <p><strong>Created:</strong> {new Date(requirement.createdAt).toLocaleDateString()}</p>
                {requirement.images.length > 0 && (
                  <div className="mt-2">
                    <p><strong>Images:</strong></p>
                    <div className="flex flex-wrap gap-2">
                      {requirement.images.map((image, index) => (
                        <img key={index} src={image} alt={`Requirement image ${index + 1}`} className="w-24 h-24 object-cover rounded" />
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No requirements found.</p>
        )}
      </div>

      {/* Catalogs Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <h3 className="text-2xl font-semibold mb-4">Catalogs</h3>
        {catalogs.length > 0 ? (
          <ul className="space-y-4">
            {catalogs.map((catalog) => (
              <li key={catalog._id} className="border-b pb-4">
                <p><strong>Product Name:</strong> {catalog.productName}</p>
                <p><strong>Category:</strong> {catalog.category}</p>
                <p><strong>Description:</strong> {catalog.description}</p>
                <p><strong>Price:</strong> ${catalog.price}</p>
                <p><strong>Created:</strong> {new Date(catalog.createdAt).toLocaleDateString()}</p>
                {catalog.images.length > 0 && (
                  <div className="mt-2">
                    <p><strong>Images:</strong></p>
                    <div className="flex flex-wrap gap-2">
                      {catalog.images.map((image, index) => (
                        <img key={index} src={image} alt={`Catalog image ${index + 1}`} className="w-24 h-24 object-cover rounded" />
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No catalogs found.</p>
        )}
      </div>
    </div>
  );
}