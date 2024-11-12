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
import { migrateGuestCart } from "../utils/cartMigration";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [userLocation, setUserLocation] = useState("");

  async function logIn(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await migrateGuestCart();
    return result;
  }
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function logOut() {
    return signOut(auth);
  }
  async function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({ prompt: "select_account" });
    const result = await signInWithPopup(auth, googleAuthProvider);
    await migrateGuestCart();
    return result;
  }
  async function facebookSignIn() {
    const facebookAuthProvider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, facebookAuthProvider);
    await migrateGuestCart();
    return result;
  }
  async function phoneNumberSignIn(phoneNumber) {
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

    const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    await migrateGuestCart();
    return result;
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
