import { Navigate, Outlet, RouteObject, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { createContext, FC, LazyExoticComponent, ReactNode, Suspense, useEffect, useState } from "react";
import { auth, getMe, User } from "@entity/User";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Main } from "@pages/Main";
import WebApp from "@twa-dev/sdk";
import { Welcome } from "@pages/Welcome";
import { Quiz } from "@pages/Quiz";
import { Home, Loader2, User as UserIcon } from "lucide-react"; // lucide-react для иконок
import { Results } from "@pages/Results";
import { Profile } from "@pages/Profile";

const ToLazy = (LazyComponent: LazyExoticComponent<FC>): ReactNode => (
  <Suspense fallback={""}>
    <LazyComponent />
  </Suspense>
);

export const AuthContext = createContext<User | null>(null);

export const ProtectedRoute = ({ withFooter }: { withFooter: boolean }): ReactNode => {
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation(); // Получаем текущий путь

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F1F1]">
      <AuthContext.Provider value={data?.data}>
        <main className="flex-1">
          <Outlet />
        </main>
        {withFooter && <footer
          className="w-full fixed bottom-0 left-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50">
          <button
            onClick={() => navigate("/Main")}
            className={`flex flex-col items-center ${isActive("/Main") ? "text-blue-600" : "text-gray-600"} hover:text-blue-600`}
          >
            <Home className="h-6 w-6" />
          </button>
          <button
            onClick={() => navigate("/Profile")}
            className={`flex flex-col items-center ${isActive("/Profile") ? "text-blue-600" : "text-gray-600"} hover:text-blue-600`}
          >
            <UserIcon className="h-6 w-6" />
          </button>
        </footer>}
      </AuthContext.Provider>
    </div>
  );
};

export const RedirectToMain = (): ReactNode => {
  const isUser = localStorage.getItem("user");
  const [searchParams] = useSearchParams();

  if (!isUser)
    return <Navigate to={"/Welcome"} />;
  else if (searchParams.get("tgWebAppStartParam"))
    return <Navigate to={`/Quiz?quizCode=${searchParams.get("tgWebAppStartParam")}`} />;
  else
    return <Navigate to={"/Main"} />;
};

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedRoute withFooter={true} />,
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
      path: "/Profile",
      element: ToLazy(Profile),
    },
    ],
  }, {
    path: "/",
    element: <ProtectedRoute withFooter={false} />,
    children: [{
      path: "/Quiz",
      element: ToLazy(Quiz),
    }, {
      path: "/results",
      element: ToLazy(Results),
    },
    ],
  },
];
