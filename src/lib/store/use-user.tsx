import { useEffect, useState, createContext, useContext } from "react";
import {
  useUser as useSupaUser,
  useSessionContext,
  User,
} from "@supabase/auth-helpers-react";

import { ProfileDetails } from "@/types/common.types";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: ProfileDetails | null;
  isLoading: boolean;
  refetchData: () => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export interface Props {
  [propName: string]: any;
}

export const UserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext();
  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsloadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<ProfileDetails | null>(null);

  const getUserDetails = () =>
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

  const setAuthData = () => {
    if (user && !isLoadingData && !userDetails) {
      setIsloadingData(true);
      getUserDetails().then((result) => {
        setUserDetails(result.data as ProfileDetails);

        setIsloadingData(false);
      });
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
    }
  };

  const clearAuthData = () => {
    setUserDetails(null);
  };

  useEffect(() => {
    setAuthData();
  }, [user, isLoadingUser]);

  // useEffect(() => {
  //   const { data: authListener } = supabase.auth?.onAuthStateChange(
  //     async (event) => {
  //       if (event === "SIGNED_IN") setAuthData();
  //       if (event === "SIGNED_OUT") clearAuthData();
  //     },
  //   );
  //
  //   return () => {
  //     authListener.subscription.unsubscribe();
  //   };
  // }, []);

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    setLoading: setIsloadingData,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};
