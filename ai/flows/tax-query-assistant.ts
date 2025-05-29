
// src/ai/flows/tax-query-assistant.ts
'use server';
/**
 * @fileOverview 一個回答稅務相關查詢的 AI 助理。
 *
 * - taxQueryAssistant - 一個處理稅務相關問題回答的函數。
 * - TaxQueryAssistantInput - taxQueryAssistant 函數的輸入類型。
 * - TaxQueryAssistantOutput - taxQueryAssistant 函數的返回類型。
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaxQueryAssistantInputSchema = z.object({
  query: z.string().describe('使用者提出的稅務相關問題。'),
});
export type TaxQueryAssistantInput = z.infer<typeof TaxQueryAssistantInputSchema>;

const TaxQueryAssistantOutputSchema = z.object({
  answer: z.string().describe('對稅務相關問題的回答。'),
});
export type TaxQueryAssistantOutput = z.infer<typeof TaxQueryAssistantOutputSchema>;

export async function taxQueryAssistant(input: TaxQueryAssistantInput): Promise<TaxQueryAssistantOutput> {
  return taxQueryAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'taxQueryAssistantPrompt',
  input: {schema: TaxQueryAssistantInputSchema},
  output: {schema: TaxQueryAssistantOutputSchema},
  prompt: `您是一位樂於助人的 AI 助理，專精於稅務相關資訊。

  請盡您所能回答以下問題，提供有用的指引和相關資訊。

  問題：{{{query}}}`,
});

const taxQueryAssistantFlow = ai.defineFlow(
  {
    name: 'taxQueryAssistantFlow',
    inputSchema: TaxQueryAssistantInputSchema,
    outputSchema: TaxQueryAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

