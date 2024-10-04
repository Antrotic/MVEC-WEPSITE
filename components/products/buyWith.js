import React, { useEffect, useState } from "react";
import { ProductApi } from "../../api/main/product";
import RiveResult from "../loader/rive-result";
import ProductCard from "./card";
import ProductSection from "./section";

const BuyWith = ({ productId }) => {
  const [buyWithProduct, setBuyWithProduct] = useState([]);

  const getRelatedProduct = () => {
    ProductApi.getBuyWith(productId)
      .then((res) => {
        setBuyWithProduct(res.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getRelatedProduct();
  }, [productId]);

  return (
    <div className="same-product">
      <ProductSection title="Often bought products with this product">
        {buyWithProduct.map((data, key) => {
          return <ProductCard key={key} data={data} />;
        })}
        {buyWithProduct?.length === 0 && (
          <RiveResult text="There are no items in the related products" />
        )}
      </ProductSection>
    </div>
  );
};

export default BuyWith;
