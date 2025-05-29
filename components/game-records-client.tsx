
"use client";

import { useAuth } from "@/contexts/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, BarChart3 } from "lucide-react";
import type { GameRecord } from "@/types";
import { db as firebaseDbService, isFirebaseInitialized } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function GameRecordsClient() {
  const { user, isFirebaseEnabled } = useAuth();
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && isFirebaseEnabled && firebaseDbService) {
      const fetchRecords = async () => {
        setLoading(true);
        setError(null);
        try {
          const q = query(
            collection(firebaseDbService, "gameRecords"),
            where("userId", "==", user.uid),
            orderBy("timestamp", "desc")
          );
          const querySnapshot = await getDocs(q);
          const fetchedRecords: GameRecord[] = [];
          querySnapshot.forEach((doc) => {
            // Ensure timestamp is correctly handled if it's a Firestore Timestamp
            const data = doc.data();
            const timestamp = data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(data.timestamp);
            fetchedRecords.push({ id: doc.id, ...data, timestamp } as GameRecord);
          });
          setRecords(fetchedRecords);
        } catch (err) {
          console.error("獲取遊戲記錄時發生錯誤：", err);
          setError("無法載入遊戲紀錄。");
        } finally {
          setLoading(false);
        }
      };
      fetchRecords();
    } else if (isFirebaseEnabled && !user) {
      // User is not logged in, clear records and stop loading
      setRecords([]);
      setLoading(false);
      setError(null);
    } else if (!isFirebaseEnabled) {
      // Firebase is not enabled
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
            由於 Firebase 未正確設定，遊戲紀錄功能目前無法使用。
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
            <BarChart3 className="mr-2 h-6 w-6" />
            財務小遊戲紀錄
          </CardTitle>
          <CardDescription>
            正在載入你的遊戲歷程...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="p-4 border rounded-md space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
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
            請先登入以查看你的遊戲紀錄。
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
          <BarChart3 className="mr-2 h-6 w-6" />
          財務小遊戲紀錄
        </CardTitle>
        <CardDescription>
          這裡將會顯示你過去的財務小遊戲歷程。
        </CardDescription>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-muted-foreground italic">
            你目前沒有任何遊戲紀錄。完成幾局財務小遊戲後，你的紀錄將會出現在這裡。
          </p>
        ) : (
          <div className="space-y-4">
            {records.map(record => (
              <Card key={record.id} className="p-4 bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      遊玩日期：{new Date(record.timestamp as Date).toLocaleString('zh-TW')}
                    </p>
                     <p className="text-xs text-muted-foreground">
                      (共 {record.roundsCompleted} 回合)
                    </p>
                  </div>
                   <Badge 
                    variant={record.finalGrade?.startsWith("S") || record.finalGrade?.startsWith("A") ? "default" : (record.finalGrade?.startsWith("B") ? "secondary" : "destructive")}
                    className="text-xs"
                  >
                    評級：{record.finalGrade || '未評級'}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <p>最終餘額：<span className={`font-semibold ${record.finalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>{record.finalBalance.toLocaleString()} 元</span></p>
                  <p>遊戲內測驗表現： {record.totalCorrectQuizAnswers ?? 0} / {record.totalQuizQuestions ?? 0} 題答對</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
