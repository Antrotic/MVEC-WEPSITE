import { useMemo } from "react";

export default function useUserLocation(userLocation) {
  const location = useMemo(() => {
    const latlng = userLocation;
    if (!latlng) {
      return undefined;
    }
    return {
      latitude: latlng.split(",")[0],
      longitude: latlng.split(",")[1],
    };
  }, [userLocation]);

  return location;
}
