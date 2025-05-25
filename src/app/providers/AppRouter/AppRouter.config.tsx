import { Navigate, Outlet, RouteObject } from "react-router-dom";
import { createContext, FC, LazyExoticComponent, ReactNode, Suspense, useEffect, useState } from "react";
import { auth, getMe, User } from "@entity/User";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Main } from "@pages/Main";
import WebApp from "@twa-dev/sdk";
import { Welcome } from "@pages/Welcome";
import { Quiz } from "@pages/Quiz";

const ToLazy = (LazyComponent: LazyExoticComponent<FC>): ReactNode => (
  <Suspense fallback={""}>
    <LazyComponent />
  </Suspense>
);

export const AuthContext = createContext<User | null>(null);

export const ProtectedRoute = (): ReactNode => {
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: ["auth"],
    queryFn: getMe,
  });

  const mutation = useMutation<void, Error, string>(
    "auth",
    auth,
    {
      onSuccess: () => {
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

  if (mutation.isLoading || isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AuthContext.Provider value={data?.data}>
        <main className="flex-1">
          <Outlet />
        </main>
      </AuthContext.Provider>
    </div>);
};

export const RedirectToMain = (): ReactNode => {
  const isUser = localStorage.getItem("user");

  if (!isUser)
    return <Navigate to={"/Welcome"} />;
  else
    return <Navigate to={"/Main"} />;
};

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [{
      path: "/",
      element: <RedirectToMain/>,
    }, {
        path: "/Welcome",
        element: ToLazy(Welcome),
      },{
        path: "/Main",
        element: ToLazy(Main),
      },{
        path: "/Quiz",
        element: ToLazy(Quiz),
      },
    ],
  },
];
