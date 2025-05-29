
import { getLearningModuleById } from '@/lib/learning-data';
import type { LearningModule as LearningModuleType, AccordionContentData, FinancialGameContentData, QuizContentData, RecordsDashboardContentData } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BookOpenText, Link as LinkIcon, BarChart3, ListChecks, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Accordion, AccordionContent as ShadAccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FinancialGameClient from '@/components/financial-game-client';
import QuizClient from '@/components/quiz-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameRecordsClient from '@/components/game-records-client';
import QuizRecordsClient from '@/components/quiz-records-client';
import { useAuth } from "@/contexts/auth-provider"; // Required for auth check on records page

interface ModulePageProps {
  params: {
    moduleId: string;
  };
}

// This component needs to be a client component if it uses hooks like useAuth directly.
// However, since it's an async server component for data fetching,
// we'll pass user information down if needed or handle auth checks within client components.
// For now, let's assume RecordsClient components will handle their own auth checks.

export default async function LearningModulePage({ params }: ModulePageProps) {
  const module: LearningModuleType | undefined = await getLearningModuleById(params.moduleId);

  if (!module) {
    notFound();
  }

  const renderContent = () => {
    if (typeof module.content === 'string') {
      return (
        <div
          className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none whitespace-pre-wrap text-foreground"
        >
          {module.content}
        </div>
      );
    } else if (module.content.type === 'accordion') {
      const accordionData = module.content as AccordionContentData;
      return (
        <Accordion type="single" collapsible className="w-full">
          {accordionData.items.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-b-0 mb-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="p-6 text-lg font-medium hover:no-underline text-left">
                {item.title}
              </AccordionTrigger>
              <ShadAccordionContent className="p-6 pt-0 text-muted-foreground space-y-3">
                {item.description && (
                  <p className="mb-3 whitespace-pre-wrap text-sm text-foreground/80">
                    {item.description}
                  </p>
                )}
                {item.links && item.links.length > 0 && (
                  <ul className="space-y-2">
                    {item.links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:text-primary/80 hover:underline transition-colors"
                        >
                          {link.name}
                          <LinkIcon className="ml-2 h-4 w-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </ShadAccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );
    } else if (module.content.type === 'financial_game') {
      return <FinancialGameClient module={module} />;
    } else if (module.content.type === 'quiz') {
      const quizData = module.content as QuizContentData;
      return <QuizClient quizData={quizData} />;
    } else if (module.content.type === 'records_dashboard') {
      // For records dashboard, we can use Tabs to switch between game and quiz records.
      // Auth check will be handled within GameRecordsClient and QuizRecordsClient.
      return (
        <Tabs defaultValue="quiz_records" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quiz_records" className="text-xs sm:text-sm">
              <ListChecks className="mr-1 sm:mr-2 h-4 w-4" />測驗紀錄
            </TabsTrigger>
            <TabsTrigger value="game_records" className="text-xs sm:text-sm">
              <BarChart3 className="mr-1 sm:mr-2 h-4 w-4" />遊戲紀錄
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quiz_records">
            <QuizRecordsClient />
          </TabsContent>
          <TabsContent value="game_records">
            <GameRecordsClient />
          </TabsContent>
        </Tabs>
      );
    }
    return <p>內容格式錯誤或不受支援。</p>;
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="bg-primary/10 p-6 md:p-8 rounded-t-lg">
          {module.imageUrl && (
            <div className="relative w-full h-64 md:h-80 rounded-md overflow-hidden mb-6">
              <Image
                src={module.imageUrl}
                alt={module.title}
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint={module.aiHint || "學習 知識"}
              />
            </div>
          )}
          <div className="flex items-center mb-2">
            <BookOpenText className="h-8 w-8 text-primary mr-3" />
            <CardTitle className="text-3xl md:text-4xl font-bold">{module.title}</CardTitle>
          </div>
          <CardDescription className="text-lg text-muted-foreground">
            {module.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          {module.introductionText && (
            <div
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none whitespace-pre-wrap text-foreground mb-6 pb-6 border-b"
            >
              {module.introductionText}
            </div>
          )}
          {renderContent()}
        </CardContent>
      </Card>
      <div className="text-center">
        <Button variant="outline" asChild>
          <Link href="/learning-system">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回學習系統
          </Link>
        </Button>
      </div>
    </div>
  );
}
