import React, { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import MapOnlyShow from "../map/only-show";
import PercelForm from "./percel-form";
import parcelService from "../../services/parcel";

const ParcelMap = ({
  data,
  setData,
  handleData,
  isFormValidating,
  parcelPrice,
  setParcelPrice,
}) => {
  useEffect(() => {
    if (data.type_id && data.currency_id !== undefined) {
      const address_to = {
        latitude: data.address_to.latitude,
        longitude: data.address_to.longitude,
      };
      const address_from = {
        latitude: data.address_from.latitude,
        longitude: data.address_from.longitude,
      };
      parcelService
        .calculate({
          "address_from[latitude]": address_from.latitude,
          "address_from[longitude]": address_from.longitude,
          "address_to[latitude]": address_to.latitude,
          "address_to[longitude]": address_to.longitude,
          type_id: data.type_id,
          currency_id: data.currency_id,
        })
        .then((res) => setParcelPrice(res.data.data))
        .catch((error) => {
          setParcelPrice({ km: 0, price: 0 });
          toast.error(error.message);
        });
    }
    // eslint-disable-next-line
  }, [
    data.address_from.latitude,
    data.address_from.longitude,
    data.address_to.latitude,
    data.address_to.longitude,
    data.type_id,
  ]);
  const mapData = useMemo(() => {
    return {
      location: data.address_from,
      shop: {
        location: data.address_to,
        parcelPrice,
      },
    };
  }, [data.address_from, data.address_to, parcelPrice]);
  return (
    <div className="parcel-map-wrapper">
      <MapOnlyShow mapData={mapData} />
      <PercelForm
        isFormValidating={isFormValidating}
        data={data}
        setData={setData}
        handleData={handleData}
        parcelPrice={parcelPrice}
      />
    </div>
  );
};

export default ParcelMap;
