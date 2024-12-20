"use client";
import React, { useEffect, useState } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { UserDetailContext } from "./_context/UserDetailContext";
function Provider({ children }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

  const { user } = useUser();
  const [userDetail, setUserDetail] = useState([]);
  const VerifyUser = async () => {
    const dataResult = await axios.post("/api/verify-user", {
      user: user,
    });
    setUserDetail(dataResult.data.result);
  };

  useEffect(() => {
    user && VerifyUser();
  }, [user]);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <div>
        <ConvexProvider client={convex}>
          <PayPalScriptProvider
            options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
          >
            {children}
          </PayPalScriptProvider>
        </ConvexProvider>
      </div>
    </UserDetailContext.Provider>
  );
}

export default Provider;
