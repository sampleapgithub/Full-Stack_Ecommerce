import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item';

const Popular = () => {

  const [popularProducts, setpopularProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/popularinwomen')
    .then(res => res.json())
    .then(data => setpopularProducts(data));
  },[])

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.map((product, i) => (
          <Item 
            key={i}
            id={product.id}
            name={product.name}
            image={product.image}
            new_price={product.new_price}
            old_price={product.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;
