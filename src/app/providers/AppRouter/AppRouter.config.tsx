import { Outlet, RouteObject } from "react-router-dom";
import { createContext, FC, LazyExoticComponent, ReactNode, Suspense, useEffect, useState } from "react";
import { auth, getMe, TelegramUser, User } from "@entity/User";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Main } from "@pages/Main";
import WebApp from "@twa-dev/sdk";

const ToLazy = (LazyComponent: LazyExoticComponent<FC>): ReactNode => (
  <Suspense fallback={""}>
    <LazyComponent />
  </Suspense>
);

export const AuthContext = createContext<User | null>(null);

export const ProtectedRoute = (): ReactNode => {
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, TelegramUser>(
    "auth",
    auth,
    {
      onSuccess: () => {
        console.log('dsadsadasdsadaddasdsdsadsadsa');
        queryClient.invalidateQueries("auth");
      },
      onError: (error: Error) => {
        console.log(error);
        setError(error.message);
      },
    },
  );

  useEffect(() => {
    if (WebApp?.initDataUnsafe) {
      const initDataUnsafe = WebApp?.initData;

      mutation.mutate(initDataUnsafe);
    }
  }, [WebApp]);

  if (mutation.isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AuthContext.Provider value={mutation.data?.data}>
        <main className="flex-1">
          <Outlet />
        </main>
      </AuthContext.Provider>
    </div>);
};

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [],
  },
  {
    path: "/login",
    element: ToLazy(Main),
  },
];
