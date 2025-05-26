import { useQuery } from "react-query";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { use, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QrCode } from "lucide-react";
import axios from "axios";
import { AuthContext } from "@app/providers/AppRouter/AppRouter.config";
import { useTelegram } from "@shared/hooks/useTelegram";

type Quiz = {
  id: string;
  title: string;
  description: string;
  code: string;
};

const siteLink = import.meta.env.VITE_SITE_LINK;

const Main = () => {
  const authContext = use(AuthContext);
  const [quizCode, setQuizCode] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { tg } = useTelegram();
  const navigate = useNavigate();

  // Получаем последние квизы
  const { data: quizzes } = useQuery<Quiz[]>({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const response = await axios.get("/api/quizzes");
      return response.data;
    },
  });

  const handleJoinQuiz = async () => {
    if (quizCode.length === 4) {
      navigate("/Quiz?quizCode=" + quizCode);
    }
  };

  const openScanner = () => {
    // Показываем нативный сканер QR-кода Telegram
    tg.showScanQrPopup(
      {
        text: "Наведите камеру на QR-код",
      },
      (text: string | null) => {
        if (text) {
          const urlParams = new URLSearchParams(text.split("?")[1]);
          // Можно сразу перейти к викторине, если код валидный
          if (urlParams.get("startapp")?.length === 4) {
            navigate("/Quiz?quizCode=" + urlParams.get("startapp"));
            tg.closeScanQrPopup();
          }
        }
      },
    );
  };

  return (
    <div className="p-4 space-y-6 bg-[#F1F1F1]" style={{
      minHeight: "100vh",
    }}>
      {/* Приветствие */}
      <div className="space-y-1">
        <h1 className="text-[20px] text-[#18191B] font-semibold">👋🏻 Привет, {authContext?.username}!</h1>
      </div>

      {/* Заголовок "Квизы" с кнопкой сканера */}
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-semibold text-[#18191B]">Квизы</h2>
        <Button
          onClick={openScanner}
          style={{
            width: "130px",
            height: "35px",
            minWidth: "50px",
            gap: "5px",
            borderRadius: "20px",
            padding: "15px 10px",
            border: "1px solid #0D0BCC",
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "22px",
            letterSpacing: "-0.4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            color: "#0D0BCC",
          }}
        >
          <QrCode className="h-4 w-4 mr-1" />
          QR-код
        </Button>
      </div>

      {/* Карточка для подключения */}
      <div className="p-4 space-y-4 rounded-lg" style={{
        backgroundColor: "#E5EAF2",
      }}>
        <div className="space-y-2">
          <h3 className="font-medium text-[16px] text-[#18191B]">Войти по коду</h3>
          <p className="text-[14px] text-[#707579]">
            Узнать код можно у организатора
          </p>
        </div>
        <div className="space-y-2">
          <Input
            placeholder="Введите 4-значный код"
            value={quizCode}
            onChange={(e) => setQuizCode(e.target.value)}
            className="w-full"
            style={{
              backgroundColor: "#FFFFFF",
              border: "none",
              boxShadow: "none",
              height: "40px",
              borderRadius: "10px",
              padding: "15px 12px",
              fontFamily: "Inter",
              fontSize: "14px",
            }}
          />
          <Button
            onClick={handleJoinQuiz}
            className="w-full mt-1"
            style={{
              height: "50px",
              minWidth: "50px",
              gap: "10px",
              borderRadius: "10px",
              padding: "15px 12px",
              backgroundColor: "#0D0BCC",
              color: "#FFFFFF",
              border: "none",
              boxShadow: "none",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "17px",
              lineHeight: "22px",
              letterSpacing: "-0.4px",
              textAlign: "center",
              verticalAlign: "middle",
            }}
          >
            Найти
          </Button>
        </div>
      </div>

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
          Создание своего квиза сейчас доступно только в веб-версии. Мобильная версия находится в разработке, спасибо за
          понимание ♥
        </p>
        <Button
          asChild
          className="w-full mt-1"
          style={{
            height: "50px",
            minWidth: "50px",
            gap: "10px",
            borderRadius: "10px",
            padding: "15px 12px",
            backgroundColor: "#0D0BCC",
            color: "#FFFFFF",
            border: "none",
            boxShadow: "none",
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "17px",
            lineHeight: "22px",
            letterSpacing: "-0.4px",
            textAlign: "center",
            verticalAlign: "middle",
          }}
        >
          <Link to={siteLink} target="_blank">
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

export default Main;
