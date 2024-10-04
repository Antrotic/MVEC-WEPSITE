import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { setCookie, parseCookies } from "nookies";
import { setCookies } from "../utils/setCookies";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [userLocation, setUserLocation] = useState("");

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function logOut() {
    return signOut(auth);
  }
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({ prompt: "select_account" });

    return signInWithPopup(auth, googleAuthProvider);
  }
  function facebookSignIn() {
    const facebookAuthProvider = new FacebookAuthProvider();
    return signInWithPopup(auth, facebookAuthProvider);
  }
  function phoneNumberSignIn(phoneNumber) {
    const appVerifier = new RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: () => {
          console.log("Callback!");
        },
      },
      auth
    );

    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const setUserDefaultLocation = (selectedAddress) => {
    const { longitude, latitude, address } = selectedAddress;
    setCookie(null, "userLocation", `${latitude},${longitude}`);
    setUserLocation(`${latitude},${longitude}`);
    if (address)
      setCookies({
        name: "formatted_address",
        value: address,
      });
  };

  useEffect(() => {
    if (!parseCookies().userLocation)
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const { latitude, longitude } = position.coords;
          setUserDefaultLocation({
            latitude,
            longitude,
          });
        },
        function (error) {
          const defaultLocation =
            process.env.NEXT_PUBLIC_DEFAULT_LOCATION.split(",");
          setUserDefaultLocation({
            latitude: defaultLocation[0],
            longitude: defaultLocation[1],
          });
          console.log(error);
        }
      );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        logIn,
        signUp,
        logOut,
        googleSignIn,
        phoneNumberSignIn,
        facebookSignIn,
        setUserDefaultLocation,
        userLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
