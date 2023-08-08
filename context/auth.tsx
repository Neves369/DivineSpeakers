import React, { createContext, useState } from "react";

interface AuthContextData {
  changeSelectAudio(audio: any): void;
  changeVerifyUpdates(up: boolean): void;
  audio: any;
  verifyUpdates: boolean;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [audio, setAudio] = useState();
  const [verifyUpdates, setverifyUpdates] = useState(true);

  function changeSelectAudio(audio: any) {
    setAudio(audio);
  }

  function changeVerifyUpdates(up: boolean) {
    setverifyUpdates(up);
  }

  return (
    <AuthContext.Provider
      value={{
        changeSelectAudio,
        changeVerifyUpdates,
        verifyUpdates,
        audio,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
