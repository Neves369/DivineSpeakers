import React, { createContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";

interface AuthContextData {
  changeVerifyUpdates(up: boolean): void;
  changePdfUrl(url: string): void;
  theme: any;
  pdfUrl: string;
  verifyUpdates: boolean;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [theme, setTheme] = useState<any>();
  const [verifyUpdates, setverifyUpdates] = useState(true);

  function changeVerifyUpdates(up: boolean) {
    setverifyUpdates(up);
  }

  function changePdfUrl(url: string) {
    setPdfUrl(url);
  }

  const getData = async () => {
    firestore()
      .collection("carroussell")
      .where("status", "==", true)
      .onSnapshot((query: any) => {
        setTheme(query.docs[0]._data);
      });
  };

  useEffect(() => {
    if (!theme) {
      getData();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        changeVerifyUpdates,
        changePdfUrl,
        verifyUpdates,
        theme,
        pdfUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
