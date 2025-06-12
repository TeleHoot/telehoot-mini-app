import { useContext } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import { AuthContext } from "@app/providers/AppRouter/AppRouter.config";
import { getSessions } from "@entity/Session";
import { Card } from "@shared/components/ui/card";
import { getQuestionsWord } from "@pages/Main/Main";

const Profile = () => {
  const authContext = useContext(AuthContext);
  const user = authContext;

  const { data: sessionsData } = useQuery({
    queryKey: ["userSessions"],
    queryFn: () => getSessions(2), // передай сюда id пользователя если надо
  });

  const sessions = sessionsData?.data || [];

  if (!user) return <p>Loading user...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.photo_url}
          alt={user.username}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.first_name} {user.last_name}</h2>
          <p className="text-gray-500">@{user.username}</p>
          <p className="text-sm text-gray-400 mt-1">Принял участие в {sessions.length} квизах</p>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        <p className='font-semibold text-[20px] '>История квизов </p>

        <div className="space-y-4">
          {sessions.map((session: any) => (
            <Card key={session.id} className="p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{session.quiz.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1" style={{ color: "var(--tg-theme-hint-color)" }}>
                    {session.quiz.questions_count} {getQuestionsWord(session.quiz.questions_count)}
                  </p>
                </div>
                <Link
                  to={`/results?sessionId=${session.id}&quizId=${session.quiz.id}&organizationId=${session.quiz.organization.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-md"
                  style={{ color: "#0D0BCC" }}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Результаты</span>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
