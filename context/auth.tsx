import React, { createContext, useState } from "react";

interface AuthContextData {
  changeSelectAudio(audio: any): void;
  audio: any;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [audio, setAudio] = useState();

  function changeSelectAudio(audio: any) {
    setAudio(audio);
  }

  return (
    <AuthContext.Provider
      value={{
        changeSelectAudio,
        audio,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
