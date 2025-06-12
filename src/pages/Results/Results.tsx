import { useContext, useEffect, useState } from "react";

import { useQuery } from 'react-query';
import { CreateSessionData, getSession, getSessionResults } from "@entity/Session";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { AllResults, PersonalResults } from "@pages/Quiz/Quiz";
import { AuthContext } from "@app/providers/AppRouter/AppRouter.config";

export const useSession = (
  data: CreateSessionData & { sessionId: string }
) => {
  return useQuery({
    queryKey: ['session', data],
    queryFn: () => getSession(data),
  });
};

export const useSessionResults = (
  data: CreateSessionData & { sessionId: string }
) => {
  return useQuery({
    queryKey: ['results', data],
    queryFn: () => getSessionResults(data),
  });
};

const Results = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId') || '';
  const quizId = searchParams.get('quizId') || '';
  const organizationId = searchParams.get('organizationId') || '';
  const navigate = useNavigate();
  const user =useContext(AuthContext);

  useEffect(() => {
    if (!sessionId || !quizId) {
      navigate('/', { replace: true });
    }
  }, [sessionId, quizId, navigate]);
  const [showAllParticipants, setShowAllParticipants] = useState(false);

  const { data: sessionData, isLoading, error } = useSession({
    organizationId: organizationId || '',
    quizId,
    sessionId,
  });

  const { data: sessionResultsData } = useSessionResults({
    organizationId: organizationId || '',
    quizId,
    sessionId,
  });


  if (isLoading) return <div>Loading...</div>;
  if (error || !sessionData) return <div>Error loading session data</div>;// Распаковываем данные (зависит от структуры твоего blob json)


  if (!showAllParticipants && sessionResultsData?.data && user) {
    return (
      <PersonalResults
        results={sessionResultsData.data}
        currentUserId={user.id}
        onNext={() => setShowAllParticipants(true)}
      />
    );
  }

  if (showAllParticipants && sessionResultsData?.data && user) {
    return (
      <AllResults
        results={sessionResultsData.data}
        currentUserId={user.id}
      />
    );
  }

  return (
    <>
      {!showAllParticipants ? (
        <QuizResults
          results={sessionResultsData.data}
          quizTitle={sessionData.data.quiz.name}
          onNext={() => setShowAllParticipants(true)}
        />
      ) : (
        <AllParticipants
          results={sessionResultsData.data}
          quizTitle={sessionData.data.quiz.name}
          sessionId={sessionData.data.id}
          currentOrganizationId={organizationId}
          quizId={quizId}
        />
      )}
    </>
  );
};

export default Results;
