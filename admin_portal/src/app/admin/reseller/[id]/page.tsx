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
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Reseller Details</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <div className="flex items-center mb-6">
          {reseller.image && (
            <img src={reseller.image} alt={reseller.businessName} className="w-24 h-24 rounded-full object-cover mr-6" />
          )}
          <div>
            <h2 className="text-2xl font-semibold">{reseller.businessName}</h2>
            <p className="text-gray-500">{reseller.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Owner Name:</strong> {reseller.ownerName}</p>
            <p><strong>Contact:</strong> {reseller.contact}</p>
            <p><strong>Address:</strong> {reseller.address}</p>
            <p><strong>City:</strong> {reseller.city}</p>
          </div>
          <div>
            <p><strong>Type:</strong> {reseller.type}</p>
            <p><strong>Catalogue Count:</strong> {reseller.catalogueCount}</p>
            <p><strong>Created:</strong> {new Date(reseller.createdAt).toLocaleDateString()}</p>
            <p><strong>Updated:</strong> {new Date(reseller.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
        {reseller.aboutUs && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">About Us</h3>
            <p>{reseller.aboutUs}</p>
          </div>
        )}
        {reseller.connections.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Connections</h3>
            <ul>
              {reseller.connections.map((connection, index) => (
                <li key={index}>
                  User ID: {connection.userId}, Type: {connection.Type}
                </li>
              ))}
            </ul>
          </div>
        )}
        {reseller.bgImage && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Background Image</h3>
            <img src={reseller.bgImage} alt="Background" className="w-full h-48 object-cover rounded-lg" />
          </div>
        )}
        {/* Posts Section */}
        {posts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Posts</h3>
            <ul>
              {posts.map((post, index) => (
                <li key={index} className="mb-4">
                  <p><strong>Description:</strong> {post.description}</p>
                  <p><strong>Category:</strong> {post.category}</p>
                  <div className="flex">
                    {post.images.map((image, i) => (
                      <img key={i} src={image} alt={`Post ${index} Image ${i}`} className="w-16 h-16 object-cover mr-2" />
                    ))}
                  </div>
                  <p><strong>Created At:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Requirements Section */}
        {requirements.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Requirements</h3>
            <ul>
              {requirements.map((requirement, index) => (
                <li key={index} className="mb-4">
                  <p><strong>Product Name:</strong> {requirement.productName}</p>
                  <p><strong>Category:</strong> {requirement.category}</p>
                  <p><strong>Quantity:</strong> {requirement.quantity}</p>
                  <p><strong>Total Price:</strong> {requirement.totalPrice}</p>
                  <p><strong>Details:</strong> {requirement.details}</p>
                  <div className="flex">
                    {requirement.images.map((image, i) => (
                      <img key={i} src={image} alt={`Requirement ${index} Image ${i}`} className="w-16 h-16 object-cover mr-2" />
                    ))}
                  </div>
                  <p><strong>Created At:</strong> {new Date(requirement.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Catalogs Section */}
        {catalogs.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Catalogs</h3>
            <ul>
              {catalogs.map((catalog, index) => (
                <li key={index} className="mb-4">
                  <p><strong>Product Name:</strong> {catalog.productName}</p>
                  <p><strong>Category:</strong> {catalog.category}</p>
                  <p><strong>Description:</strong> {catalog.description}</p>
                  <p><strong>Price:</strong> {catalog.price}</p>
                  <div className="flex">
                    {catalog.images.map((image, i) => (
                      <img key={i} src={image} alt={`Catalog ${index} Image ${i}`} className="w-16 h-16 object-cover mr-2" />
                    ))}
                  </div>
                  <p><strong>Created At:</strong> {new Date(catalog.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
