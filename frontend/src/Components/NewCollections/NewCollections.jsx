import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import Item from '../Item/Item'

const NewCollections = () => {

   const [new_collection, setNew_Collection] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/newcollections')
    .then(res => res.json())
    .then(data => setNew_Collection(data));
  },[])

  return (
    <div className= "new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collection.map((product,i)=>{
          return<Item
          key={i}
          id={product.id}
          name={product.name}
          image={product.image}
          new_price={product.new_price}
          old_price={product.old_price}
          />
      })}

      </div>
    </div>
  )
}
export default NewCollections;