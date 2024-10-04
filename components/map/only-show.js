import React, { useEffect, useMemo } from "react";
import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import { parseCookies } from "nookies";
import { useRef } from "react";

const cookies = parseCookies();
let config = null;
if (cookies?.settings) {
  config = JSON.parse(cookies?.settings);
}

const MapOnlyShow = ({ google, mapData }) => {
  const mapRef = useRef();
  const initialCenter = {
    lat: mapData?.location?.latitude,
    lng: mapData?.location?.longitude,
  };

  const shopLocation = {
    lat: mapData?.shop?.location?.latitude,
    lng: mapData?.shop?.location?.longitude,
  };

  const bounds = useMemo(
    () => new google.maps.LatLngBounds(),
    [
      mapData?.location?.latitude,
      mapData?.location?.longitude,
      mapData?.shop?.location?.latitude,
      mapData?.shop?.location?.longitude,
    ]
  );

  useEffect(() => {
    if (mapData.shop) {
      bounds.extend(initialCenter);
      bounds.extend(shopLocation);
      mapRef.current?.map.fitBounds(bounds);
    }
    // eslint-disable-next-line
  }, [
    mapData?.location?.latitude,
    mapData?.location?.longitude,
    mapData?.shop?.location?.latitude,
    mapData?.shop?.location?.longitude,
    bounds,
  ]);

  return (
    <div className="map-wrapper">
      <Map
        google={google}
        initialCenter={initialCenter}
        className="container map"
        ref={mapRef}
        bounds={bounds}
      >
        <Marker
          position={initialCenter}
          icon={{
            url: "https://cdn-icons-png.flaticon.com/32/64/64113.png",
          }}
        />
        {mapData.shop && (
          <Marker
            position={shopLocation}
            icon={{
              url: "/assets/images/location2.png",
            }}
          />
        )}
      </Map>
    </div>
  );
};
export default GoogleApiWrapper({
  apiKey: config?.google_map_key
    ? config.google_map_key
    : process.env.NEXT_PUBLIC_MAP_KEY,
  libraries: ["places"],
})(MapOnlyShow);
