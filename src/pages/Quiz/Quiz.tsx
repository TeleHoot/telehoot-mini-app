import { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useWebSocket } from "@shared/hooks/useWebsocet";
import { Button } from "@shared/components/ui/button";
import { Avatar, AvatarImage } from "@shared/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shared/components/ui/table";
import { Participant } from "@entity/Participant";
import { AuthContext } from "@app/providers/AppRouter/AppRouter.config";
import { Answer, Question } from "@entity/Question";
import { Input } from "@shared/components/ui/input";

type Stages = "start" | "counter" | "questions" | "personalResults" | "allResults";

type Results = Array<{ participant: Participant, total_points: number }>;

// Персональные результаты
const PersonalResults: FC<{
  results: Results;
  currentUserId: string;
  onNext: () => void;
}> = ({ results, currentUserId, onNext }) => {
  const [showButton, setShowButton] = useState(false);
  const currentUser = results?.find(r => r.participant?.user?.id === currentUserId);
  const currentUserPlace = results?.findIndex(r => r.participant?.user?.id === currentUserId) + 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!currentUser || !currentUserPlace) return null;

  const getMedalImage = () => {
    switch (currentUserPlace) {
      case 1: return "/gold.svg";
      case 2: return "/silver.svg";
      case 3: return "/bronze.svg";
      default: return null;
    }
  };

  const medalImage = getMedalImage();
  const photoUrl = currentUser.participant?.user?.photo_url || "";
  const username = currentUser.participant?.user?.username || "";
  const totalPoints = currentUser.total_points || 0;

  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      {/* Quiz title placeholder */}
      <p className="font-manrope font-bold text-center text-[#0D0BCC] mb-6">
        Название квиза
      </p>

      <div className="flex flex-col items-center w-full max-w-md">
        {/* Avatar with medal */}
        <div className="relative mb-4">
          <Avatar className="w-[194px] h-[194px] mt-10">
            <AvatarImage src={photoUrl} />
          </Avatar>
          {medalImage && (
            <img
              src={medalImage}
              alt="medal"
              className="absolute -top-4.5 left-1/2 transform -translate-x-1/2 w-[88px] h-[88px]"
            />
          )}
        </div>

        {/* Place */}
        <p className="font-manrope font-semibold text-[20px] text-center text-[#0D0BCC] mb-2">
          {currentUserPlace} место
        </p>

        {/* Username */}
        <p className="font-manrope font-semibold text-xl leading-5 text-[#18191B] mb-2">
          {username}
        </p>

        {/* Points */}
        <p className="font-manrope font-medium text-base leading-5 text-center text-[#18191B] mb-6">
          {totalPoints} очков
        </p>

        {/* Congratulations */}
        <p className="font-manrope font-semibold text-2xl leading-6 text-center text-[#0D0BCC] mb-6">
          Поздравляем!
        </p>
      </div>

      {showButton && (
        <Button
          onClick={onNext}
          className="w-full mt-1"
          style={{
            height: '50px',
            minWidth: '50px',
            gap: '10px',
            borderRadius: '10px',
            padding: '15px 12px',
            backgroundColor: "#0D0BCC",
            color: "#FFFFFF",
            border: 'none',
            boxShadow: 'none',
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: '17px',
            lineHeight: '22px',
            letterSpacing: '-0.4px',
            textAlign: 'center',
            verticalAlign: 'middle',
          }}
        >
          Посмотреть общие результаты
        </Button>
      )}
    </div>
  );
};

// Общие результаты
const AllResults: FC<{
  results: Results;
  currentUserId: string;
}> = ({ results, currentUserId }) => {
  // Filter out host and prepare winners
  const participants = results.filter(el => el.participant.role !== "host");
  const winners = participants.slice(0, 3);
  const otherParticipants = participants.slice(3);
  const [firstPlace, secondPlace, thirdPlace] = winners;

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-white">
      {/* Top 3 participants on podiums */}
      <div className="flex justify-center items-end gap-4 mb-8 mt-10 w-full max-w-md" style={{ height: '180px' }}>
        {/* 2nd place */}
        {secondPlace && (
          <div className="flex flex-col items-center h-full">
            <div
              className="flex-1 w-24 flex flex-col items-center justify-end relative pt-8"
              style={{
                background: `
                  linear-gradient(180deg, #F64E60 0%, rgba(246, 78, 96, 0.476) 68.4%, rgba(246, 78, 96, 0) 100%),
                  linear-gradient(180deg, #0D0BCC 0%, #83A6FF 70.4%, rgba(54, 153, 255, 0) 100%)
                `,
                backgroundBlendMode: 'overlay, normal',
                borderRadius: '8px 8px 0 0'
              }}
            >
              <div className="absolute -top-4 flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={secondPlace.participant.user.photo_url} />
                  </Avatar>
                  <img
                    src="/silver.svg"
                    alt="silver medal"
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-10 h-10"
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="font-inter font-medium text-[16px] text-[#FFFFFF]">{secondPlace.participant.user.username}</p>
                  <p className="font-inter text-[#FFFFFF] text-[14px]">{secondPlace.total_points} очков</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1st place */}
        {firstPlace && (
          <div className="flex flex-col items-center h-full">
            <div
              className="flex-1 w-32 flex flex-col items-center justify-end relative pt-10"
              style={{
                background: `
                  linear-gradient(180deg, #FF4072 0%, rgba(246, 78, 96, 0.476) 68.4%, rgba(255, 216, 220, 0.476) 100%)
                `,
                borderRadius: '8px 8px 0 0'
              }}
            >
              <div className="absolute -top-4 flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={firstPlace.participant.user.photo_url} />
                  </Avatar>
                  <img
                    src="/gold.svg"
                    alt="gold medal"
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-10 h-10"
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="font-inter font-medium text-[16px] text-[#FFFFFF]">{firstPlace.participant.user.username}</p>
                  <p className="font-inter text-[#FFFFFF] text-[14px]">{firstPlace.total_points} очков</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3rd place */}
        {thirdPlace && (
          <div className="flex flex-col items-center h-full">
            <div
              className="flex-1 w-20 flex flex-col items-center justify-end relative pt-8"
              style={{
                background: `
                  linear-gradient(180deg, #F64E60 0%, rgba(246, 78, 96, 0.476) 68.4%, rgba(246, 78, 96, 0) 100%),
                  linear-gradient(180deg, #8950FC 0%, rgba(137, 80, 252, 0.391) 71.9%, rgba(137, 80, 252, 0) 100%)
                `,
                backgroundBlendMode: 'overlay, normal',
                borderRadius: '8px 8px 0 0'
              }}
            >
              <div className="absolute -top-4 flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={thirdPlace.participant.user.photo_url} />
                  </Avatar>
                  <img
                    src="/bronze.svg"
                    alt="bronze medal"
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-10 h-10"
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="font-inter font-medium text-[16px] text-[#FFFFFF]">{thirdPlace.participant.user.username}</p>
                  <p className="font-inter text-[#FFFFFF] text-[14px]">{thirdPlace.total_points} очков</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Other participants list (starting from 4th place) */}
      <div className="w-full max-w-md">
        <ul className="space-y-3">
          {otherParticipants.map((result, index) => {
            const isCurrentUser = result.participant.user.id === currentUserId;
            const position = index + 4;

            return (
              <li
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: '#F6F6F6' }}
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <p className="font-manrope font-medium text-lg">
                    {position}
                  </p>
                </div>
                <Avatar className="w-12 h-12">
                  <AvatarImage src={result.participant.user.photo_url} />
                </Avatar>
                <div className="flex-1">
                  <p className="font-manrope font-medium text-lg">
                    {result.participant.user.username}
                    {isCurrentUser && <span className="ml-2 text-blue-600">(Вы)</span>}
                  </p>
                  <p className="font-manrope font-normal text-sm text-gray-600">
                    {result.total_points} очков
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const Counter: FC<{ next: Dispatch<SetStateAction<Stages>> }> = ({ next }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [next]);

  useEffect(() => {
    if (count === 0) {
      next("questions");
    }
  }, [count]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="text-9xl font-bold font-manrope" style={{ color: "#0D0BCC" }}>{count}</div>
    </div>
  );
};

const QuizPage: FC<{
  question: Question & { isLast: boolean };
  onAnswerSelect: (answers: Answer[]) => void;
  setSelectedAnswers: any,
  selectedAnswers: any,
  setTextAnswer: any,
  textAnswer: any,
}> = ({ question, onAnswerSelect, setSelectedAnswers, selectedAnswers, setTextAnswer, textAnswer }) => {


  const handleSingleSelect = (answer: Answer) => {
    setSelectedAnswers([answer]);
    onAnswerSelect([answer]);
  };

  const handleMultipleSelect = (answer: Answer, isChecked: boolean) => {
    const newAnswers = isChecked
      ? [...selectedAnswers, answer]
      : selectedAnswers.filter(a => a.text !== answer.text);
    setSelectedAnswers(newAnswers);
    onAnswerSelect(newAnswers);
  };

  const handleTextAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextAnswer(e.target.value);
    onAnswerSelect([{ text: e.target.value, order: 0, is_correct: false }]);
  };

  const isAnswerSelected = (answer: Answer) => {
    return selectedAnswers.some(a => a.text === answer.text);
  };

  return (
    <div className="mx-auto p-4 bg-white min-h-screen flex flex-col">
      <div className="mb-6 text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 font-manrope" style={{ color: "#0D0BCC" }}>
          {question.title}
        </h1>
        {question.description && (
          <p className="text-lg md:text-xl font-manrope">
            {question.description}
          </p>
        )}
      </div>

      {question.media_path && (
        <div className="mb-6 flex justify-center">
          <img
            src={question.media_path}
            alt="Question media"
            className="max-h-48 md:max-h-64 rounded-lg object-contain"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center">
        {question.type === "text" ? (
          <div className="mb-6">
            <Input
              value={textAnswer}
              onChange={handleTextAnswerChange}
              placeholder="Type your answer here..."
              className="w-full text-base md:text-lg p-3 border-2 border-[#0D0BCC] rounded-lg"
            />
          </div>
        ) : question.type === "single_choice" ? (
          <div className="space-y-3">
            {question.answers
              .sort((a, b) => a.order - b.order)
              .map((answer, index) => (
                <div
                  key={answer.text}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSingleSelect(answer)}
                >
                  <div className={`w-5 h-5 rounded-full border-2 border-[#0D0BCC] flex items-center justify-center ${
                    isAnswerSelected(answer) ? "bg-[#0D0BCC]" : ""
                  }`}>
                    {isAnswerSelected(answer) && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="text-lg md:text-xl">{answer.text}</span>
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-3">
            {question.answers
              .sort((a, b) => a.order - b.order)
              .map((answer, index) => (
                <div
                  key={answer.text}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleMultipleSelect(answer, !isAnswerSelected(answer))}
                >
                  <div className={`w-5 h-5 border-2 border-[#0D0BCC] rounded flex items-center justify-center ${
                    isAnswerSelected(answer) ? "bg-[#0D0BCC]" : ""
                  }`}>
                    {isAnswerSelected(answer) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-lg md:text-xl">{answer.text}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Quiz: FC = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stages>("start");
  const [userName, setUserName] = useState("");
  const [isJoin, setIsJoin] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question & { isLast: boolean }>();
  const [searchParams] = useSearchParams();
  const { send, setMessageHandlers } = useWebSocket(searchParams.get("quizCode") as string);
  const [results, setResults] = useState<Results | null>(null);
  const user = useContext(AuthContext);

  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);
  const [textAnswer, setTextAnswer] = useState("");

  useEffect(() => {
    setMessageHandlers({
      "join": () => setIsJoin(true),
      "cancel": () => navigate("/", { replace: true }),
      "start": (data) => {
        setStage("counter");
        if (data?.question) {
          setCurrentQuestion({ ...data.question, isLast: data.is_last_question });
        }
      },
      "next": (data) => {
        if (data?.question) {
          setCurrentQuestion({ ...data.question, isLast: data.is_last_question });
          setTextAnswer("");
          setSelectedAnswers([]);
        }
      },
      "finish": (data) => {
        setResults(data.results);
        setStage("personalResults");
      },
    });
  }, [setMessageHandlers, navigate]);

  const join = () => {
    send(JSON.stringify({ type: "join", username: userName || user.username }));
  };

  const handleAnswerSelect = (answers: Answer[]) => {
    send(JSON.stringify({
      type: "answer",
      answers: answers.map(a => a.text),
    }));
  };

  if (stage === "start") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
        <div className="w-full max-w-md space-y-6">
          <p className="text-[20px] font-semibold text-center text-[#18191B] mb-2 font-inter">
            Квиз скоро начнется
          </p>
          <p className="text-[16px] text-medium text-center text-[#707579] mb-4 font-inter">
            Как вас видеть организатору?
          </p>
          <Input
            onChange={e => setUserName(e.target.value)}
            value={userName}
            placeholder={user.username}
            className="text-xl p-4 border-2 h-[40px] rounded-lg text-[14px] bg-[#FFFFFF] font-inter"
            style={{
                backgroundColor: "#FFFFFF",
                background: "#FFFFFF"
          }}
          />

          {!isJoin ? (
            <Button
              onClick={join}
              className="w-full py-6 bg-[#0D0BCC] h-[50px] font-inter text-[#FFFFFF]"
            >
              <span className="text-[#FFFFFF] text-[17px] font-semibold">Присоединиться</span>
            </Button>
          ) : (
            <Button
              onClick={join}
              disabled
              className="w-full py-6 text-xl bg-transparent h-[50px] border-#0D0BCC"
            >
              <span className="text-[#0D0BCC] text-[17px] font-semibold">Ожидаем начало...</span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (stage === "counter") return <Counter next={setStage} />;

  if (stage === "questions" && currentQuestion) {
    return (
      <QuizPage
        setSelectedAnswers={setSelectedAnswers}
        selectedAnswers={selectedAnswers}
        setTextAnswer={setTextAnswer}
        textAnswer={textAnswer}
        question={currentQuestion}
        onAnswerSelect={handleAnswerSelect}
      />
    );
  }

  if (stage === "personalResults" && results && user) {
    return (
      <PersonalResults
        results={results}
        currentUserId={user.id}
        onNext={() => setStage("allResults")}
      />
    );
  }

  if (stage === "allResults" && results && user) {
    return (
      <AllResults
        results={results}
        currentUserId={user.id}
      />
    );
  }

  return null;
};

export default Quiz;
