import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

export const useTelegram = () => {
  const [tg, setTg] = useState<any>(null);

  useEffect(() => {
    const telegram = WebApp;
    if (telegram) {
      telegram.expand();
      setTg(telegram);
    }
  }, []);

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
  };
};
