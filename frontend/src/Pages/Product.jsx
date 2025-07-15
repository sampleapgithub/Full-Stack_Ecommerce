import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrum/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Product = () => {
  const {all_product} = useContext(ShopContext);
  const {productId} = useParams();
  // Return null or loading state if data hasn't loaded yet
  if (all_product.length === 0) {
    return <div>Loading...</div>; // or a spinner
  }
   const product = all_product.find((e) => e.id === Number(productId));
   if (!product) {
    return <div>Product not found</div>;
  }
  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts product={product}/>
    </div>
  );
};
export default Product;