import { FC, useEffect } from "react";
import { Button } from "@shared/components/ui/button";
import { useNavigate } from "react-router-dom";

type TMain = {}

const Welcome: FC<TMain> = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("user", "true");
  }, []);

  const handleNext = () => {
    navigate("/main"); // Редирект на основную страницу
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-background text-foreground">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Картинка (можно заменить на свою) */}
        <img
          src="/welcome-image.png"
          alt="Welcome"
          className="w-64 h-64 mx-auto rounded-lg object-cover"
          height={300}
        />

        {/* Заголовок */}
        <h1 className="text-3xl font-bold tracking-tight">
          Добро пожаловать!
        </h1>

        {/* Описание */}
        <p className="text-muted-foreground">
          Это мини-приложение поможет вам сделать вашу жизнь проще.
          Нажмите кнопку ниже, чтобы продолжить и узнать больше.
        </p>

        {/* Кнопка "Далее" */}
        <Button
          onClick={handleNext}
          className="w-full"
          size="lg"
        >
          Далее
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
