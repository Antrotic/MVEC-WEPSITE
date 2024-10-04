import { toast } from "react-toastify";
import { getLocationObj } from "./getLocation";

// Step 1: Get user coordinates
export function getCurrentLocation({ setAddress, setValue, findMe }) {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  function success(pos) {
    var crd = pos.coords;
    let lat = crd.latitude.toString();
    let lng = crd.longitude.toString();
    if (findMe) findMe({ lat, lng });
    getLocationObj({ location: { lat, lng }, setAddress, setValue });
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    toast.error(err.message);
  }
  navigator.geolocation.getCurrentPosition(success, error, options);
}
