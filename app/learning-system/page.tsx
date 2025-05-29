
import { LearningModule } from "@/components/learning-module";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LearningModule as LearningModuleType } from "@/types";
import { BookOpen } from "lucide-react";
import { getAllLearningModules } from "@/lib/learning-data";


export default async function LearningSystemPage() {
  const modules = await getAllLearningModules();

  return (
    <div className="space-y-12">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-primary/10 p-8 rounded-t-lg">
          <BookOpen className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-4xl font-bold">學習系統</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            透過我們精心策劃的學習模組擴展您的知識。
          </CardDescription>
        </CardHeader>
      </Card>
      
      {modules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            <LearningModule key={module.id} module={module} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg">目前沒有可用的學習模組。請稍後再回來查看。</p>
      )}
    </div>
  );
}
