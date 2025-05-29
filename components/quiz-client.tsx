
"use client";

import type { QuizContentData, QuizQuestion, QuizOption, QuizQuestionAttemptRecord } from "@/types";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Award, HelpCircle, ListChecks, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-provider";
import { db as firebaseDbService, isFirebaseInitialized } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";


interface QuizClientProps {
  quizData: QuizContentData;
}

export default function QuizClient({ quizData }: QuizClientProps) {
  const { user, isFirebaseEnabled } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answerResults, setAnswerResults] = useState<Array<{ questionId: string; isCorrect: boolean; selected: string[]; correct: string[]; pointsEarned: number }>>([]);
  const [isSavingRecord, setIsSavingRecord] = useState(false);

  const { toast } = useToast();
  const questions = quizData.questions;
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (questionId: string, optionId: string, isChecked?: boolean) => {
    setSelectedAnswers(prev => {
      const currentSelection = prev[questionId] || [];
      if (currentQuestion.type === 'single-choice') {
        return { ...prev, [questionId]: [optionId] };
      } else { // multiple-choice
        if (isChecked) {
          return { ...prev, [questionId]: [...currentSelection, optionId] };
        } else {
          return { ...prev, [questionId]: currentSelection.filter(id => id !== optionId) };
        }
      }
    });
  };

  const saveQuizAttempt = async (calculatedScore: number, calculatedResults: Array<{ questionId: string; isCorrect: boolean; selected: string[]; correct: string[]; pointsEarned: number }>) => {
    if (!user || !isFirebaseEnabled || !firebaseDbService) {
      toast({
        title: "無法儲存記錄",
        description: "需要登入且 Firebase 已正確設定。",
        variant: "destructive",
      });
      return;
    }
    setIsSavingRecord(true);

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const questionsAttempted: QuizQuestionAttemptRecord[] = calculatedResults.map(res => {
      const questionData = questions.find(q => q.id === res.questionId);
      return {
        questionId: res.questionId,
        questionText: questionData?.questionText || "未知題目",
        options: questionData?.options || [],
        selectedOptionIds: res.selected,
        correctOptionIds: res.correct,
        isCorrect: res.isCorrect,
        pointsEarned: res.pointsEarned,
        pointsPossible: questionData?.points || 0,
        explanation: questionData?.explanation,
      };
    });

    try {
      const quizAttemptData = {
        quizTitle: quizData.title,
        userId: user.uid,
        timestamp: serverTimestamp(),
        score: calculatedScore,
        totalPossibleScore: totalPoints,
        accuracy: totalPoints > 0 ? calculatedScore / totalPoints : 0,
        questionsAttempted: questionsAttempted,
      };
      await addDoc(collection(firebaseDbService, "quizAttempts"), quizAttemptData);
      toast({
        title: "測驗記錄已儲存",
        description: "你的測驗表現已成功記錄！",
      });
    } catch (error) {
      console.error("儲存測驗記錄時發生錯誤：", error);
      toast({
        title: "儲存失敗",
        description: "無法儲存你的測驗記錄。",
        variant: "destructive",
      });
    } finally {
      setIsSavingRecord(false);
    }
  };


  const handleSubmitQuiz = () => {
    let currentScore = 0;
    const results = questions.map(q => {
      const userSelection = selectedAnswers[q.id] || [];
      let isCorrect = false;
      let pointsEarnedThisQuestion = 0;

      if (q.type === 'single-choice') {
        isCorrect = userSelection.length === 1 && userSelection[0] === q.correctOptionIds[0];
      } else { // multiple-choice
        const correctSet = new Set(q.correctOptionIds);
        const selectedSet = new Set(userSelection);
        isCorrect = correctSet.size === selectedSet.size && [...correctSet].every(id => selectedSet.has(id));
      }

      if (isCorrect) {
        currentScore += q.points;
        pointsEarnedThisQuestion = q.points;
      }
      return {
        questionId: q.id,
        isCorrect,
        selected: userSelection,
        correct: q.correctOptionIds,
        pointsEarned: pointsEarnedThisQuestion,
      };
    });

    setScore(currentScore);
    setAnswerResults(results);
    setIsQuizSubmitted(true);

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    toast({
      title: "測驗已提交！",
      description: `你的得分是：${currentScore} / ${totalPoints}`,
    });

    if (user && isFirebaseEnabled) {
      saveQuizAttempt(currentScore, results);
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1));
  };
  
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
    setScore(0);
    setAnswerResults([]);
    setIsSavingRecord(false);
  };

  const progressPercentage = useMemo(() => {
    if (isQuizSubmitted) return 100;
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  }, [currentQuestionIndex, questions.length, isQuizSubmitted]);


  if (!currentQuestion && !isQuizSubmitted) {
    return <p>測驗載入中或沒有題目...</p>;
  }

  if (isQuizSubmitted) {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center bg-primary/10">
          <Award className="mx-auto h-16 w-16 text-primary mb-3" />
          <CardTitle className="text-3xl font-bold">測驗結果</CardTitle>
          <CardDescription>你獲得了 <span className="text-primary font-bold text-2xl">{score}</span> / {totalPoints} 分</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {questions.map((q, index) => {
            const result = answerResults.find(r => r.questionId === q.id);
            if (!result) return null;
            const userSelectedOptions = q.options.filter(opt => result.selected.includes(opt.id)).map(opt => opt.text).join(", ") || "未作答";
            const correctOptionsText = q.options.filter(opt => result.correct.includes(opt.id)).map(opt => opt.text).join(", ");
            return (
              <Card key={q.id} className={`p-4 ${result.isCorrect ? 'border-green-500 bg-green-50/50' : 'border-red-500 bg-red-50/50'}`}>
                <p className="font-semibold text-lg mb-2 text-foreground">{index + 1}. {q.questionText}</p>
                <p className="text-sm text-muted-foreground">你的答案：<span className={`font-medium ${result.isCorrect ? 'text-green-700' : 'text-red-700'}`}>{userSelectedOptions}</span>
                  {result.isCorrect ? <CheckCircle className="inline h-4 w-4 ml-1 text-green-600" /> : <XCircle className="inline h-4 w-4 ml-1 text-red-600" />}
                </p>
                {!result.isCorrect && (
                  <p className="text-sm text-blue-600">正確答案：<span className="font-medium">{correctOptionsText}</span></p>
                )}
                {q.explanation && <p className="text-xs text-muted-foreground mt-1 italic">說明：{q.explanation}</p>}
              </Card>
            );
          })}
        </CardContent>
        <CardFooter className="flex justify-center p-6">
          <Button onClick={restartQuiz} variant="outline">重新測驗</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="bg-secondary/30">
        <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-primary flex items-center">
                <HelpCircle className="mr-2 h-6 w-6" />{quizData.title}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
                題目 {currentQuestionIndex + 1} / {questions.length}
            </div>
        </div>
        <Progress value={progressPercentage} className="w-full h-2 mt-2" />
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <p className="text-lg font-semibold mb-4 text-foreground">{currentQuestionIndex + 1}. {currentQuestion.questionText}</p>
          {currentQuestion.type === 'single-choice' ? (
            <RadioGroup
              value={(selectedAnswers[currentQuestion.id] && selectedAnswers[currentQuestion.id][0]) || ""}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              className="space-y-2"
            >
              {currentQuestion.options.map(option => (
                <div key={option.id} className="flex items-center space-x-2 p-2 rounded-md border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option.id} id={`${currentQuestion.id}-${option.id}`} />
                  <Label htmlFor={`${currentQuestion.id}-${option.id}`} className="font-normal cursor-pointer flex-1">{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : ( 
            <div className="space-y-2">
              {currentQuestion.options.map(option => (
                <div key={option.id} className="flex items-center space-x-2 p-2 rounded-md border border-border hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={`${currentQuestion.id}-${option.id}`}
                    checked={(selectedAnswers[currentQuestion.id] || []).includes(option.id)}
                    onCheckedChange={(checked) => handleAnswerChange(currentQuestion.id, option.id, !!checked)}
                  />
                  <Label htmlFor={`${currentQuestion.id}-${option.id}`} className="font-normal cursor-pointer flex-1">{option.text}</Label>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-6 border-t">
        <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} variant="outline">
          <ChevronLeft className="mr-1 h-4 w-4" />上一題
        </Button>
        {currentQuestionIndex === questions.length - 1 ? (
          <Button 
            onClick={handleSubmitQuiz} 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isSavingRecord || Object.values(selectedAnswers).flat().length === 0 && Object.keys(selectedAnswers).length < questions.length}
          >
            {isSavingRecord ? <Save className="mr-2 h-4 w-4 animate-spin" /> : <ListChecks className="mr-2 h-4 w-4" />}
            {isSavingRecord ? "儲存中..." : "提交測驗"}
          </Button>
        ) : (
          <Button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
            下一題<ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
