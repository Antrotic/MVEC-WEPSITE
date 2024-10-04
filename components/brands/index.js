import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { getImage } from "../../utils/getImage";

function BrandCard({ data }) {
  const shop = useSelector((state) => state.stores.currentStore);
  return (
    <>
      <Link href={`/stores/${shop?.slug}/all-brand/${data.brand.slug}`}>
        <div className="brand-card">{getImage(data.brand?.img)}</div>
      </Link>
    </>
  );
}

export default BrandCard;
