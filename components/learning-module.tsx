
"use client";

import type { LearningModule as LearningModuleType } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { db as firebaseDbService, isFirebaseInitialized } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";
import type { UserProgress } from "@/types";

interface LearningModuleProps {
  module: LearningModuleType;
}

export function LearningModule({ module }: LearningModuleProps) {
  const { user, isFirebaseEnabled } = useAuth();
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dbAvailable, setDbAvailable] = useState(false);

  useEffect(() => {
    setDbAvailable(isFirebaseInitialized && !!firebaseDbService && isFirebaseEnabled);
  }, [isFirebaseEnabled]);

  useEffect(() => {
    async function checkCompletionStatus() {
      if (user && dbAvailable && firebaseDbService) {
        const progressDocRef = doc(firebaseDbService, "userProgress", user.uid);
        const progressSnap = await getDoc(progressDocRef);
        if (progressSnap.exists()) {
          const progressData = progressSnap.data() as UserProgress;
          setIsCompleted(progressData.completedModules?.includes(module.id) || false);
        }
      }
    }
    checkCompletionStatus();
  }, [user, module.id, dbAvailable]);
  
  const handleMarkAsComplete = async () => {
    if (!user) {
      toast({ title: "需要登入", description: "請登入以追蹤您的進度。", variant: "destructive" });
      return;
    }
    if (!dbAvailable || !firebaseDbService) {
      toast({ title: "服務不可用", description: "無法儲存進度。資料庫未設定。", variant: "destructive"});
      return;
    }

    setIsLoading(true);
    try {
      const progressDocRef = doc(firebaseDbService, "userProgress", user.uid);
      const progressSnap = await getDoc(progressDocRef);

      if (progressSnap.exists()) {
        await updateDoc(progressDocRef, {
          completedModules: arrayUnion(module.id)
        });
      } else {
        await setDoc(progressDocRef, {
          userId: user.uid,
          completedModules: [module.id]
        });
      }
      setIsCompleted(true);
      toast({ title: "進度已儲存！", description: `模組「${module.title}」已標記為完成。` });
    } catch (error) {
      console.error("標記模組完成時發生錯誤：", error);
      toast({ title: "錯誤", description: "無法儲存進度。", variant: "destructive"});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {module.imageUrl && (
        <div className="relative w-full h-48">
          <Image 
            src={module.imageUrl} 
            alt={module.title} 
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{objectFit: "cover"}}
            data-ai-hint={module.aiHint || "教育 抽象"}
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{module.title}</CardTitle>
        <CardDescription className="h-20 overflow-y-auto text-sm">{module.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-xs text-muted-foreground">預計時間：45 分鐘</p>
         {!dbAvailable && user && (
          <div className="mt-2 text-xs text-destructive flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            進度追蹤不可用。
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <Button variant="outline" className="w-full sm:w-auto" asChild>
          <Link href={`/learning-system/${module.id}`}>
            開始學習 <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        {user && dbAvailable && (
          <Button 
            variant={isCompleted ? "ghost" : "default"} 
            onClick={handleMarkAsComplete}
            disabled={isCompleted || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "儲存中..." : (isCompleted ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> 已完成
              </>
            ) : "標記為完成")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
