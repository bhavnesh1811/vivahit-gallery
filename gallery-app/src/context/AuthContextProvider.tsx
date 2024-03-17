import { createContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../configs/firebase";

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};
type Props = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});


export function AuthContextProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);
      if (currentUser) setUser(currentUser);
      else setUser(null);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  const values: AuthContextType = {
    user: user,
    setUser: setUser,
  };

  return (
    <AuthContext.Provider value={values}>{!loading && children}</AuthContext.Provider>
  );
}
