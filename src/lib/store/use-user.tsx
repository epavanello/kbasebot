"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Session,
  SupabaseClient,
  User,
  createPagesBrowserClient,
} from "@supabase/auth-helpers-nextjs";
import { UserInfo as Subscription } from "../supabase";
import { Database } from "../types/database.types";

type SuapabaseAuthContextType = {
  supabase: SupabaseClient<Database>;
  session: null | Session;
  user?: User;
  isLoading: boolean;
  subscription: null | Subscription;
};

const SupabaseAuthContext = createContext<SuapabaseAuthContextType>(null!);

const useSupabaseAuth = () => {
  const context = useContext<SuapabaseAuthContextType>(SupabaseAuthContext);

  if (context === undefined) {
    throw new Error("useSupabaseAuth context was used outside of its Provider");
  }

  return context;
};

const SupabaseAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [supabase] = useState(() => createPagesBrowserClient<Database>());
  const [session, setSession] = useState<null | Session>(null);
  const [user, setUser] = useState<undefined | User>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<null | Subscription>(null);

  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    supabase.auth
      .getSession()
      .then(async ({ data: { session }, error }) => {
        try {
          if (error) throw error;
          setSession(session);
          setUser(session?.user);
          await supabase
            .from("subscriptions")
            .select()
            .single()
            .then((response) => {
              const { data } = response;
              setSubscription(data);
            });
        } catch (error) {
          console.log(error);
        }
      })
      .then()
      .finally(() => {
        setIsLoading(false);
      });
  }, [router, supabase, supabase.auth]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <SupabaseAuthContext.Provider
      value={{ supabase, user, session, subscription, isLoading }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export { SupabaseAuthProvider, useSupabaseAuth };
