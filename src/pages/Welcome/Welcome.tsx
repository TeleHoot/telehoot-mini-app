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
    navigate("/main");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#F1F1F1] text-foreground overflow-hidden font-inter">
      {/* Контейнер для контента и картинки */}
      <div className="flex flex-col items-center w-full h-full">
        {/* Картинка приветствия (крупная, выходит за пределы слева) */}
        <div className="w-full flex justify-end pr-1">
          <img
            src="/welcome-image.png"
            alt="Results"
            className="h-[381px] max-w-none object-contain object-left"
          />
        </div>

        {/* Текст и кнопка */}
        <div className="max-w-md w-full space-y-6 text-center mt-8">
          <p className="font-semibold text-[24px] text-[#18191B] font-inter">
            Telehoot
          </p>

          <p className="font-normal text-[14px] text-[#707579] text-center p-2">
            Проводите викторины и мастер-классы, анализируйте вовлечённость и оставайтесь на связи с аудиторией
          </p>

          <Button
            onClick={handleNext}
            style={{
              width: '361px',
              height: '50px',
              minWidth: '50px',
              gap: '10px',
              borderRadius: '10px',
              padding: '15px 12px',
              backgroundColor: '#0D0BCC',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: '17px',
              color: '#FFFFFF'
            }}
            className="mx-auto"
          >
            Далее
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
