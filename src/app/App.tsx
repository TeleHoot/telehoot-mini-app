import { type FC, Suspense, useEffect, useState } from "react";
import { AppRouter } from "./providers/AppRouter/AppRouter";
import WebApp from '@twa-dev/sdk';


const App: FC = () => {
  const [webApp, setWebApp] = useState<typeof WebApp| null>(null);

  useEffect(() => {
    const tgWebApp = WebApp;
    setWebApp(tgWebApp);


    // Инициализация приложения
    tgWebApp.ready();

    // Расширяем приложение на весь экран (опционально)
    tgWebApp.expand();
  }, []);

  return (
    <Suspense fallback={''}>
      <AppRouter />
    </Suspense>
  );
};

export default App;
