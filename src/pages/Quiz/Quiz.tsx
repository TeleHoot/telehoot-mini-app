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
  const currentUser = results.find(r => r.participant.user.id === currentUserId);
  const currentUserPlace = results.findIndex(r => r.participant.user.id === currentUserId) + 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!currentUser) return null;

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
      <h2 className="text-2xl font-semibold mb-6">Поздравляем!</h2>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <div className="flex flex-col items-center mb-4">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={currentUser.participant.user.photo_url} />
          </Avatar>
          <h3 className="text-xl font-bold">{currentUser.participant.user.username}</h3>
          <p className="text-gray-600">Ваш результат: {currentUser.total_points} очков</p>
        </div>

        <div className={`p-4 rounded-lg transition-all duration-500 ${
          currentUserPlace <= 3 ? "bg-gradient-to-r from-blue-100 to-purple-100" : "bg-gray-100"
        }`}>
          <p className="text-lg font-semibold">
            🎉 Вы заняли {currentUserPlace} место!
          </p>
          {currentUserPlace <= 3 && (
            <p className="mt-2 text-blue-600">
              {currentUserPlace === 1 ? "Поздравляем с победой!" :
                currentUserPlace === 2 ? "Отличный результат!" : "Хороший результат!"}
            </p>
          )}
        </div>
      </div>

      {showButton && (
        <Button
          onClick={onNext}
          className="mt-6 bg-[#0D0BCC] hover:bg-[#0D0BCC]/90"
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
  const winners = results.filter(el => el.participant.role !== "host").slice(0, 3);
  const [firstPlace, secondPlace, thirdPlace] = winners;

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
      {/* Топ-3 участников */}
      <div className="flex justify-center items-end gap-8 mb-12 w-full">
        {/* 2 место */}
        {secondPlace && (
          <div className="flex flex-col items-center">
            <div className="h-48 w-40 rounded-t-lg flex flex-col items-center justify-end p-4 bg-gray-300">
              <Avatar className="w-20 h-20 mb-2">
                <AvatarImage src={secondPlace.participant.user.photo_url} />
              </Avatar>
              <span className="font-semibold">
                {secondPlace.participant.user.username}
              </span>
              <span className="text-sm text-gray-600">
                {secondPlace.total_points} pts
              </span>
            </div>
            <div className="bg-gray-400 text-white px-4 py-2 rounded-b-lg w-full text-center">
              2nd Place
            </div>
          </div>
        )}

        {/* 1 место */}
        {firstPlace && (
          <div className="flex flex-col items-center">
            <div className="h-64 w-48 rounded-t-lg flex flex-col items-center justify-end p-4 bg-yellow-400">
              <Avatar className="w-24 h-24 mb-2">
                <AvatarImage src={firstPlace.participant.user.photo_url} />
              </Avatar>
              <span className="font-semibold">
                {firstPlace.participant.user.username}
              </span>
              <span className="text-sm text-gray-600">
                {firstPlace.total_points} pts
              </span>
            </div>
            <div className="bg-yellow-600 text-white px-4 py-2 rounded-b-lg w-full text-center">
              1st Place
            </div>
          </div>
        )}

        {/* 3 место */}
        {thirdPlace && (
          <div className="flex flex-col items-center">
            <div className="h-40 w-36 rounded-t-lg flex flex-col items-center justify-end p-4 bg-amber-700">
              <Avatar className="w-16 h-16 mb-2">
                <AvatarImage src={thirdPlace.participant.user.photo_url} />
              </Avatar>
              <span className="font-semibold text-white">
                {thirdPlace.participant.user.username}
              </span>
              <span className="text-sm text-gray-200">
                {thirdPlace.total_points} pts
              </span>
            </div>
            <div className="bg-amber-800 text-white px-4 py-2 rounded-b-lg w-full text-center">
              3rd Place
            </div>
          </div>
        )}
      </div>

      {/* Таблица всех участников */}
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">Все участники</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Место</TableHead>
              <TableHead>Участник</TableHead>
              <TableHead>Очки</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => {
              const isCurrentUser = result.participant.user.id === currentUserId;
              const isTop3 = index < 3;

              return (
                <TableRow
                  key={index}
                  className={
                    isCurrentUser ? "bg-blue-50 font-medium" :
                      isTop3 ? "bg-amber-50" : ""
                  }
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={result.participant.user.photo_url} />
                      </Avatar>
                      <span>{result.participant.user.username}</span>
                      {isCurrentUser && <span className="ml-2">(Вы)</span>}
                    </div>
                  </TableCell>
                  <TableCell>{result.total_points}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
    send(JSON.stringify({ type: "join", username: userName || "@..." }));
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
          <h1 className="text-3xl font-bold text-center text-[#0D0BCC] mb-8 font-manrope">
            Присоединиться к квизу
          </h1>
          <Input
            onChange={e => setUserName(e.target.value)}
            value={userName}
            placeholder="Введите ваш никнейм"
            className="text-xl p-4 border-2 border-[#0D0BCC] rounded-lg"
          />
          <p className="text-lg text-center text-gray-600 mb-4">
            Введите ваш никнейм для участия в квизе
          </p>

          {!isJoin ? (
            <Button
              onClick={join}
              className="w-full py-6 text-xl bg-[#0D0BCC] hover:bg-[#0D0BCC]/90"
            >
              Присоединиться
            </Button>
          ) : (
            <div className="text-center text-xl text-[#0D0BCC] p-8">
              Ожидание начала квиза...
            </div>
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
