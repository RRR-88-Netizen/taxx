
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { taxQueryAssistant, type TaxQueryAssistantOutput } from "@/ai/flows/tax-query-assistant";
import { useState } from "react";
import { Loader2, MessageSquare } from "lucide-react";

const formSchema = z.object({
  query: z.string().min(10, { message: "請輸入詳細的稅務問題（至少 10 個字元）。" }),
});

export function TaxAssistantClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<TaxQueryAssistantOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAiResponse(null);
    try {
      const response = await taxQueryAssistant({ query: values.query });
      setAiResponse(response);
      toast({ title: "AI 回應已收到", description: "AI 已回答您的查詢。" });
    } catch (error: any) {
      console.error("AI 稅務助理發生錯誤:", error);
      toast({
        title: "錯誤",
        description: error.message || "無法從 AI 助理獲取回應。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-primary mb-2" />
        <CardTitle className="text-3xl font-bold">AI 稅務助理</CardTitle>
        <CardDescription>問問我吧! 免責說明：投資理財有風險，請三思。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">您的稅務問題</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例如：自由工作者常見的扣除額有哪些？"
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  正在獲取答案...
                </>
              ) : (
                "詢問 AI 助理"
              )}
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-2 pt-6">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">AI 正在思考中...</p>
          </div>
        )}

        {aiResponse && (
          <Card className="mt-6 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl text-primary">AI 的回答：</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-foreground">{aiResponse.answer}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}

