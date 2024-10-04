import React from "react";

export default function ParcelShow({ parcel }) {
  const { img, type, max_g, max_length, max_height, max_width } = parcel;
  return (
    <article className="parcelShow">
      <aside className="parcelShow__item">
        <div className="parcelShow__imageWrapper">
          <img className="parcelShow__image" src={img} alt={type} />
        </div>
      </aside>
      <main className="parcelShow__item">
        <ul className="parcelShow__list">
          <li className="parcelShow__listItem">
            <p className="parcelShow__text">
              <strong>weight: </strong>
              {"up.to.weight " + Number(max_g) / 1000} kg
            </p>
          </li>
          <li className="parcelShow__listItem">
            <p className="parcelShow__text">
              <strong>length: </strong>
              {"up.to.length " + Number(max_length) / 100} m
            </p>
          </li>
          <li className="parcelShow__listItem">
            <p className="parcelShow__text">
              <strong>height: </strong>
              {"up.to.length " + Number(max_height) / 100} m
            </p>
          </li>
          <li className="parcelShow__listItem">
            <p className="parcelShow__text">
              <strong>width: </strong>
              {"up.to.length " + Number(max_width) / 100} m
            </p>
          </li>
        </ul>
      </main>
    </article>
  );
}
