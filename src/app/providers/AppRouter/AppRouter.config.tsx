import { Navigate, Outlet, RouteObject, useSearchParams } from "react-router-dom";
import { createContext, FC, LazyExoticComponent, ReactNode, Suspense, useEffect, useState } from "react";
import { auth, getMe, User } from "@entity/User";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Main } from "@pages/Main";
import WebApp from "@twa-dev/sdk";
import { Welcome } from "@pages/Welcome";
import { Quiz } from "@pages/Quiz";
import { Loader2 } from "lucide-react";

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
    return (
      <div className="flex items-center justify-center h-screen bg-[#F1F1F1]">
        <Loader2 className="h-12 w-12 animate-spin text-[#0D0BCC]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F1F1]">
      <AuthContext.Provider value={data?.data}>
        <main className="flex-1">
          <Outlet />
        </main>
      </AuthContext.Provider>
    </div>);
};

export const RedirectToMain = (): ReactNode => {
  const isUser = localStorage.getItem("user");
  const [searchParams] = useSearchParams();
  console.log(searchParams)

  if (!isUser)
    return <Navigate to={"/Welcome"} />;
  else if (searchParams.get('tgWebAppStartParam'))
    return <Navigate to={`/Quiz?quizCode=${searchParams.get('tgWebAppStartParam')}`} />;
  else
    return <Navigate to={"/Main"} />;
};

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [{
      path: "/",
      element: <RedirectToMain />,
    }, {
      path: "/Welcome",
      element: ToLazy(Welcome),
    }, {
      path: "/Main",
      element: ToLazy(Main),
    }, {
      path: "/Quiz",
      element: ToLazy(Quiz),
    },
    ],
  },
];
