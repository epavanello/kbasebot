"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createPagesBrowserClient,
  Session,
  SupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { Subscription, getSubscription } from "../supabase";
import { Database } from "../types/database.types";
import {
  getPermissions,
  Permissions,
  Plan,
  PLAN_PERMISSIONS,
} from "@/lib/permissions/plans";

type SuapabaseAuthContextType = {
  supabase: SupabaseClient<Database>;
  session: null | Session;
  user?: User;
  isLoading: boolean;
  subscription: null | Subscription;
  plan: Plan;
  permission: Permissions;
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
  const [permission, setPermission] = useState<Permissions>(
    PLAN_PERMISSIONS[Plan.FREE],
  );
  const [plan, setPlan] = useState<Plan>(Plan.FREE);

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

          getSubscription(supabase, session?.user.id).then(setSubscription);
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

  useEffect(() => {
    const { permission, plan } = getPermissions(subscription);

    if (permission) setPermission(permission);
    if (plan) setPlan(plan);
  }, [subscription]);

  return (
    <SupabaseAuthContext.Provider
      value={{
        supabase,
        user,
        session,
        subscription,
        plan,
        permission,
        isLoading,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export { SupabaseAuthProvider, useSupabaseAuth };
