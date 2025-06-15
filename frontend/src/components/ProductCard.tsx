import React from 'react';

interface Props {
  name: string;
  price: string;
  link: string;
  image: string;
  rating: string;
  review_count: string;
  availability: string;
  is_prime: boolean;
  discount: string;
}

const ProductCard: React.FC<Props> = ({
  name,
  price,
  link,
  image,
  rating,
  review_count,
  availability,
  is_prime,
  discount,
}) => (
  <div className="bg-white p-4 shadow rounded-lg hover:shadow-md transition">
    <img src={image} alt={name} className="h-40 object-contain mx-auto" />
    <h3 className="text-lg font-bold mt-2">{name}</h3>
    <p className="text-sm text-gray-600 mb-1">Rating: {rating} ({review_count} reviews)</p>
    <p className="text-sm text-green-600">{availability}</p>
    <p className="text-xl font-semibold text-blue-600 mt-2">₹{price}</p>
    {discount && <p className="text-sm text-red-500">{discount}</p>}
    {is_prime && <p className="text-sm text-indigo-600">Prime Eligible</p>}
    <a href={link} target="_blank" rel="noopener noreferrer">
      <button className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
        View on Amazon
      </button>
    </a>
  </div>
);

export default ProductCard;
