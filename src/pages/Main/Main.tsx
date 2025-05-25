import { useQuery } from "react-query";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Card } from "@shared/components/ui/card";
import { use, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scan } from "lucide-react";
import axios from "axios";
import { AuthContext } from "@app/providers/AppRouter/AppRouter.config";
import { useTelegram } from "@shared/hooks/useTelegram";

type Quiz = {
  id: string;
  title: string;
  description: string;
  code: string;
};

const Main = () => {
  const authContext = use(AuthContext);
  const [quizCode, setQuizCode] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { tg } = useTelegram();
  const navigate = useNavigate()

  // Получаем последние квизы
  const { data: quizzes } = useQuery<Quiz[]>({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const response = await axios.get("/api/quizzes");
      return response.data;
    },
  });


  const handleJoinQuiz = async () => {
    if(quizCode.length === 4) {
      navigate("/Quiz?quizCode=" + quizCode);
    }
  };

  const openScanner = () => {
    setIsScannerOpen(true);
    // Здесь можно добавить логику для сканера QR кода
    // Например, использовать WebView для вызова нативного сканера
    tg.showScanQrPopup({
      text: "Наведите камеру на QR-код",
    }, (text: string) => {
      setQuizCode(text);
      setIsScannerOpen(false);
    });
  };

  return (
    <div className="p-4 space-y-6" style={{
      backgroundColor: "var(--tg-theme-bg-color)",
      color: "var(--tg-theme-text-color)",
      minHeight: "100vh",
    }}>
      {/* Приветствие */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Привет, @{authContext?.username}!</h1>
        <p className="text-muted-foreground" style={{ color: "var(--tg-theme-hint-color)" }}>
          Добро пожаловать в наше приложение
        </p>
      </div>

      {/* Заголовок "Квизы" с кнопкой сканера */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Квизы</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={openScanner}
          style={{
            backgroundColor: "var(--tg-theme-secondary-bg-color)",
            color: "var(--tg-theme-text-color)",
          }}
        >
          <Scan className="h-4 w-4" />
        </Button>
      </div>

      {/* Карточка для подключения */}
      <Card className="p-4 space-y-4" style={{
        backgroundColor: "var(--tg-theme-secondary-bg-color)",
      }}>
        <div className="space-y-2">
          <h3 className="font-medium">Присоединиться к квизу</h3>
          <p className="text-sm text-muted-foreground" style={{ color: "var(--tg-theme-hint-color)" }}>
            Введите код квиза или отсканируйте QR-код
          </p>
        </div>
        <div className="flex space-x-2">
          <Input
            placeholder="Код квиза"
            value={quizCode}
            onChange={(e) => setQuizCode(e.target.value)}
            style={{
              backgroundColor: "var(--tg-theme-bg-color)",
              color: "var(--tg-theme-text-color)",
            }}
          />
          <Button
            onClick={handleJoinQuiz}
            style={{
              backgroundColor: "var(--tg-theme-button-color)",
              color: "var(--tg-theme-button-text-color)",
            }}
          >
            Подключиться
          </Button>
        </div>
      </Card>

      {/* Последние квизы */}
      <div className="space-y-4">
        <h3 className="font-semibold">Последние квизы</h3>
        {quizzes?.length ? (
          <div className="space-y-3">
            {/*quizzes?.map((quiz) => (
              <Card key={quiz.id} className="p-4" style={{
                backgroundColor: "var(--tg-theme-secondary-bg-color)",
              }}>
                <h4 className="font-medium">{quiz.title}</h4>
                <p className="text-sm text-muted-foreground mt-1" style={{ color: "var(--tg-theme-hint-color)" }}>
                  {quiz.description}
                </p>
                <p className="text-xs mt-2" style={{ color: "var(--tg-theme-link-color)" }}>
                  Код: {quiz.code}
                </p>
              </Card>
            ))*/}
          </div>
        ) : (
          <p className="text-muted-foreground" style={{ color: "var(--tg-theme-hint-color)" }}>
            У вас пока нет активных квизов
          </p>
        )}
      </div>

      {/* Блок с редиректом на сайт */}
      <div className="space-y-3 pt-4">
        <h3 className="font-semibold">Добавить квиз</h3>
        <p className="text-muted-foreground" style={{ color: "var(--tg-theme-hint-color)" }}>
          Создание своего квиза сейчас доступно только в веб-версии. Мобильная версия находится в разработке, спасибо за понимание ♥
        </p>
        <Button
          asChild
          className="w-full"
          style={{
            backgroundColor: "var(--tg-theme-button-color)",
            color: "var(--tg-theme-button-text-color)",
          }}
        >
          <Link to="https://ваш-сайт.com" target="_blank">
            Перейти на сайт
          </Link>
        </Button>
      </div>

      {/* Модальное окно сканера (заглушка) */}
      {isScannerOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-background p-4 rounded-lg max-w-sm w-full">
            <h3 className="font-semibold text-lg mb-2">Сканирование QR-кода</h3>
            <p className="text-muted-foreground mb-4">
              Наведите камеру на QR-код
            </p>
            <div className="h-64 w-full bg-muted flex items-center justify-center mb-4">
              <p className="text-muted-foreground">Область сканирования</p>
            </div>
            <Button
              onClick={() => setIsScannerOpen(false)}
              className="w-full"
            >
              Отмена
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main
