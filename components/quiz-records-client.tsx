
"use client";

import { useAuth } from "@/contexts/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, CheckCircle, XCircle, ListChecks, Percent } from "lucide-react";
import type { QuizAttemptRecord, QuizQuestionAttemptRecord } from "@/types";
import { Badge } from "@/components/ui/badge";
import { db as firebaseDbService, isFirebaseInitialized } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";


export default function QuizRecordsClient() {
  const { user, isFirebaseEnabled } = useAuth();
  const [records, setRecords] = useState<QuizAttemptRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && isFirebaseEnabled && firebaseDbService) {
      const fetchRecords = async () => {
        setLoading(true);
        setError(null);
        try {
          const q = query(
            collection(firebaseDbService, "quizAttempts"),
            where("userId", "==", user.uid),
            orderBy("timestamp", "desc")
          );
          const querySnapshot = await getDocs(q);
          const fetchedRecords: QuizAttemptRecord[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Ensure timestamp is correctly handled
            const timestamp = data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(data.timestamp);
            // Ensure questionsAttempted is an array
            const questionsAttempted = Array.isArray(data.questionsAttempted) ? data.questionsAttempted : [];
            fetchedRecords.push({ 
              id: doc.id, 
              ...data, 
              timestamp,
              questionsAttempted 
            } as QuizAttemptRecord);
          });
          setRecords(fetchedRecords);
        } catch (err) {
          console.error("獲取測驗記錄時發生錯誤：", err);
          setError("無法載入測驗紀錄。");
        } finally {
          setLoading(false);
        }
      };
      fetchRecords();
    } else if (isFirebaseEnabled && !user) {
      setRecords([]);
      setLoading(false);
      setError(null);
    } else if (!isFirebaseEnabled) {
      setLoading(false);
      setError("Firebase 服務未正確設定。");
    }
  }, [user, isFirebaseEnabled, firebaseDbService]);


  if (!isFirebaseEnabled) {
    return (
      <Card className="mt-6 border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive-foreground">
            <AlertTriangle className="mr-2 h-5 w-5" />
            服務不可用
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground/80">
            由於 Firebase 未正確設定，測驗紀錄功能目前無法使用。
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
       <Card className="mt-6 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-semibold text-primary">
            <ListChecks className="mr-2 h-6 w-6" />
            測驗作答紀錄
          </CardTitle>
          <CardDescription>
            正在載入你的測驗歷程...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map(i => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!user && !loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-muted-foreground" />
            需要登入
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            請先登入以查看你的測驗紀錄。
          </p>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
     return (
      <Card className="mt-6 border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive-foreground">
            <AlertTriangle className="mr-2 h-5 w-5" />
            載入錯誤
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground/80">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-primary">
          <ListChecks className="mr-2 h-6 w-6" />
          測驗作答紀錄
        </CardTitle>
        <CardDescription>
          回顧你過去的測驗表現，並從錯誤中學習。
        </CardDescription>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-muted-foreground italic">你目前沒有任何測驗紀錄。</p>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {records.map((attempt) => (
              <AccordionItem key={attempt.id} value={attempt.id} className="border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
                <AccordionTrigger className="p-4 hover:no-underline focus:ring-1 focus:ring-ring rounded-t-lg data-[state=open]:rounded-b-none">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full text-left">
                    <div className="flex-1 mb-2 sm:mb-0">
                      <h3 className="font-medium text-base text-foreground">{attempt.quizTitle}</h3>
                      <p className="text-xs text-muted-foreground">
                        作答時間：{new Date(attempt.timestamp as Date).toLocaleString('zh-TW')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm shrink-0">
                      <Badge variant={attempt.accuracy >= 0.6 ? "default" : "destructive"} className="bg-primary/10 text-primary-foreground">
                        得分：{attempt.score} / {attempt.totalPossibleScore}
                      </Badge>
                      <Badge variant="secondary" className="bg-accent/80 text-accent-foreground">
                        <Percent className="mr-1 h-3 w-3" />
                        答對率：{(attempt.accuracy * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-2 space-y-3">
                  <h4 className="text-sm font-semibold mt-2 mb-1 text-muted-foreground">題目詳情：</h4>
                  {attempt.questionsAttempted && attempt.questionsAttempted.length > 0 ? (
                    attempt.questionsAttempted.map((q, index) => (
                      <div key={`${attempt.id}-${q.questionId}`} className={`p-3 rounded-md border ${q.isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                        <p className="font-medium text-sm text-foreground mb-1">{index + 1}. {q.questionText}</p>
                        <p className="text-xs text-muted-foreground">
                          你的答案： 
                          <span className={`font-semibold ${q.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {q.options?.filter(opt => q.selectedOptionIds?.includes(opt.id)).map(opt => opt.text).join(", ") || "未作答"}
                          </span>
                          {q.isCorrect ? <CheckCircle className="inline h-3.5 w-3.5 ml-1 text-green-600" /> : <XCircle className="inline h-3.5 w-3.5 ml-1 text-red-600" />}
                        </p>
                        {!q.isCorrect && (
                          <p className="text-xs text-blue-600">
                            正確答案： {q.options?.filter(opt => q.correctOptionIds?.includes(opt.id)).map(opt => opt.text).join(", ")}
                          </p>
                        )}
                        {q.explanation && !q.isCorrect && (
                          <p className="text-xs text-muted-foreground mt-1 italic">說明：{q.explanation}</p>
                        )}
                      </div>
                    ))
                  ) : (
                     <p className="text-xs text-muted-foreground italic">此次測驗沒有詳細的題目記錄。</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
