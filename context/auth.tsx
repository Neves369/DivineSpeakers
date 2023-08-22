import React, { createContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";

interface AuthContextData {
  changeSelectAudio(audio: any): void;
  changeVerifyUpdates(up: boolean): void;
  audio: any;
  theme: any;
  verifyUpdates: boolean;
}

// const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
//   requestNonPersonalizedAdsOnly: true,
// });

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [audio, setAudio] = useState();
  const [theme, setTheme] = useState<any>();
  const [verifyUpdates, setverifyUpdates] = useState(true);

  function changeSelectAudio(audio: any) {
    setAudio(audio);
  }

  function changeVerifyUpdates(up: boolean) {
    setverifyUpdates(up);
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
        changeSelectAudio,
        changeVerifyUpdates,
        verifyUpdates,
        audio,
        theme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
