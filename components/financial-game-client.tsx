
"use client";

import type { LearningModule as LearningModuleType } from "@/types";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  AlertTriangle, 
  TrendingUp, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  Gift, 
  ShoppingCart, 
  Landmark, 
  Briefcase, 
  DollarSign,
  Home,
  Coffee,
  Train,
  Plug,
  Smartphone,
  Ticket,
  CreditCard,
  Utensils,
  Wine,
  NotebookPen,
  LucideIcon,
  CircleDollarSign,
  ReceiptText,
  ListChecks,
  PiggyBank,
  ShieldAlert,
  ShieldCheck,
  School,
  Wallet,
  Bike,
  Drama,
  Banknote,
  Lightbulb, 
  Award, 
  BookCopy,
  Save,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-provider";
import { db as firebaseDbService, isFirebaseInitialized } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

interface FinancialGameClientProps {
  module: LearningModuleType;
}

const TOTAL_ROUNDS = 3;
const INITIAL_SALARY = 35000;
const INSURANCE_MONTHLY_PREMIUM = 500;
const COURSE_COST = 1000;
const EMERGENCY_FUND_TARGET_AMOUNT = 20000;
const MAX_EVENT_DRAWS_PER_ROUND = 2;
const QUIZ_REWARD_PER_CORRECT_ANSWER = 1000;
const QUIZ_QUESTIONS_PER_ROUND = 2;


interface ExpenseItem {
  id: string;
  name: string;
  cost: number;
  icon: LucideIcon;
}

interface OptionalExpenseItem extends ExpenseItem {
  purchased: boolean;
}

const NECESSARY_EXPENSES_DATA: ExpenseItem[] = [
  { id: 'rent', name: '房租', cost: 9000, icon: Home },
  { id: 'food', name: '餐費', cost: 4500, icon: Coffee },
  { id: 'transport', name: '交通費', cost: 1500, icon: Train },
  { id: 'utilities', name: '水電瓦斯費', cost: 1000, icon: Plug },
  { id: 'phone', name: '手機/網路費', cost: 1000, icon: Smartphone },
];
const totalNecessaryExpenses = NECESSARY_EXPENSES_DATA.reduce((sum, exp) => sum + exp.cost, 0);

const INITIAL_OPTIONAL_EXPENSES_DATA: ExpenseItem[] = [
  { id: 'concert', name: '看aespa演唱會', cost: 8700, icon: Ticket },
  { id: 'merch', name: '買nmixx周邊小卡', cost: 4800, icon: CreditCard },
  { id: 'dinner', name: '跟曖昧對象吃海底撈', cost: 2000, icon: Utensils },
  { id: 'club', name: '去夜店', cost: 5000, icon: Wine },
  { id: 'books', name: '誠品買書', cost: 700, icon: NotebookPen },
];

const AESPA_CONCERT_IMAGE_URL = "https://th.bing.com/th/id/OIP.1WJ0vc2SOcivZl5AOOJPEwHaE8?w=222&h=180&c=7&r=0&o=7&cb=iwp2&dpr=2&pid=1.7&rm=3";
const NMIXX_MERCH_IMAGE_URL = "https://th.bing.com/th/id/OIP.Q3BjsBXjyUvcJtYHmRbZZgHaJD?cb=iwp2&rs=1&pid=ImgDetMain";


interface InvestmentOption {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  cost?: number;
  actionType: 'fixed_deposit' | 'etf' | 'emergency_fund' | 'insurance' | 'course';
  isOneTimeAction?: boolean;
}

interface RandomEvent {
  id: string;
  name: string; 
  description: string;
  effect: number;
  type: 'positive' | 'negative';
  icon: LucideIcon;
}

const INVESTMENT_OPTIONS_DATA: InvestmentOption[] = [
  { id: 'fixed_deposit', name: '存入定存', description: '利息穩定', icon: PiggyBank, actionType: 'fixed_deposit' },
  { id: 'etf', name: '投資 ETF', description: '可能獲利，也可能虧損', icon: TrendingUp, actionType: 'etf' },
  { id: 'emergency_fund', name: '建立緊急預備金', description: `先儲存 ${EMERGENCY_FUND_TARGET_AMOUNT.toLocaleString()} 元`, icon: ShieldAlert, actionType: 'emergency_fund', cost: EMERGENCY_FUND_TARGET_AMOUNT, isOneTimeAction: true },
  { id: 'insurance', name: '買保險', description: `每月支出${INSURANCE_MONTHLY_PREMIUM.toLocaleString()}元，遇隨機事件可減損失`, icon: ShieldCheck, actionType: 'insurance', cost: 0, isOneTimeAction: true },
  { id: 'course', name: '學理財課程', description: `一次性支出${COURSE_COST.toLocaleString()}元，提升月儲蓄能力+10%`, icon: School, actionType: 'course', cost: COURSE_COST, isOneTimeAction: true },
];

const RANDOM_EVENTS_DATA: RandomEvent[] = [
  { id: 'bonus', name: '年終獎金', description: '收到年終獎金！', effect: 5000, type: 'positive', icon: Gift },
  { id: 'found_wallet', name: '撿到錢包', description: '撿到錢包（交給失主，獲獎金）', effect: 1000, type: 'positive', icon: Wallet },
  { id: 'broken_phone', name: '手機摔壞', description: '手機摔壞需更換', effect: -4000, type: 'negative', icon: Smartphone },
  { id: 'stolen_bike', name: '腳踏車被偷', description: '腳踏車被偷，需搭計程車通勤', effect: -1500, type: 'negative', icon: Bike },
  { id: 'parking_ticket', name: '收到罰單', description: '收到罰單（違規停車）', effect: -2000, type: 'negative', icon: ReceiptText },
];

interface LocalQuizOption {
  id: string;
  text: string;
}

interface LocalQuizQuestion {
  id: string;
  questionText: string;
  options: LocalQuizOption[];
  correctOptionId: string;
  reward: number;
}


const QUIZ_QUESTIONS_BANK: LocalQuizQuestion[] = [
  {
    id: 'q1',
    questionText: '「複利」是指什麼？',
    options: [
      { id: 'q1o1', text: '利息只會根據本金計算' },
      { id: 'q1o2', text: '利息會滾入本金再生利息' },
      { id: 'q1o3', text: '每年固定利率的利息' },
    ],
    correctOptionId: 'q1o2',
    reward: QUIZ_REWARD_PER_CORRECT_ANSWER,
  },
  {
    id: 'q2',
    questionText: '一般建議緊急預備金至少準備多少個月的生活費？',
    options: [
      { id: 'q2o1', text: '1-2 個月' },
      { id: 'q2o2', text: '3-6 個月' },
      { id: 'q2o3', text: '12 個月以上' },
    ],
    correctOptionId: 'q2o2',
    reward: QUIZ_REWARD_PER_CORRECT_ANSWER,
  },
  {
    id: 'q3',
    questionText: '下列何者是風險較高的投資工具？',
    options: [
      { id: 'q3o1', text: '政府公債' },
      { id: 'q3o2', text: '銀行定存' },
      { id: 'q3o3', text: '股票' },
    ],
    correctOptionId: 'q3o3',
    reward: QUIZ_REWARD_PER_CORRECT_ANSWER,
  },
  {
    id: 'q4',
    questionText: '「分散投資」的主要目的是什麼？',
    options: [
      { id: 'q4o1', text: '追求最高報酬' },
      { id: 'q4o2', text: '降低整體投資風險' },
      { id: 'q4o3', text: '快速致富' },
    ],
    correctOptionId: 'q4o2',
    reward: QUIZ_REWARD_PER_CORRECT_ANSWER,
  },
  {
    id: 'q5',
    questionText: '購買保險的主要功能是？',
    options: [
      { id: 'q5o1', text: '賺取高額回報' },
      { id: 'q5o2', text: '轉嫁未來可能發生的財務風險' },
      { id: 'q5o3', text: '短期儲蓄' },
    ],
    correctOptionId: 'q5o2',
    reward: QUIZ_REWARD_PER_CORRECT_ANSWER,
  },
   {
    id: 'q6',
    questionText: '何謂「機會成本」？',
    options: [
      { id: 'q6o1', text: '所有可能的機會加總的成本' },
      { id: 'q6o2', text: '為了得到某樣東西，所必須放棄價值最高的替代方案' },
      { id: 'q6o3', text: '創業失敗的成本' },
    ],
    correctOptionId: 'q6o2',
    reward: QUIZ_REWARD_PER_CORRECT_ANSWER,
  },
  {
    id: 'q7',
    questionText: '「通貨膨脹」通常會導致什麼現象？',
    options: [
      { id: 'q7o1', text: '貨幣購買力上升' },
      { id: 'q7o2', text: '物價普遍持續上漲，貨幣購買力下降' },
      { id: 'q7o3', text: '物價普遍持續下跌' },
    ],
    correctOptionId: 'q7o2',
    reward: QUIZ_REWARD_PER_CORRECT_ANSWER,
  },
];

interface AllPlayedQuizInfo {
  question: LocalQuizQuestion;
  playerAnswerId?: string;
  isCorrect: boolean;
}


export default function FinancialGameClient({ module }: FinancialGameClientProps) {
  const { user, isFirebaseEnabled } = useAuth();
  const [currentRound, setCurrentRound] = useState(0); 
  const [balance, setBalance] = useState(0);
  const [monthlyIncome] = useState(INITIAL_SALARY);
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [optionalExpensesThisRound, setOptionalExpensesThisRound] = useState<OptionalExpenseItem[]>([]);
  
  const [eventDrawsRemainingThisRound, setEventDrawsRemainingThisRound] = useState(0);
  const [lastDrawnEvent, setLastDrawnEvent] = useState<RandomEvent | null>(null);
  const [investmentsMade, setInvestmentsMade] = useState<string[]>([]);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [savingsBonusPercentage, setSavingsBonusPercentage] = useState(0); 

  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<LocalQuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({}); 
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResults, setQuizResults] = useState<Array<{ questionId: string; isCorrect: boolean; selectedOptionId?: string; correctOptionId: string }> | null>(null);
  const [totalCorrectQuizAnswers, setTotalCorrectQuizAnswers] = useState(0);
  const [allPlayedQuizQuestions, setAllPlayedQuizQuestions] = useState<AllPlayedQuizInfo[]>([]);
  const [finalGrade, setFinalGrade] = useState<string | null>(null);
  const [isSavingRecord, setIsSavingRecord] = useState(false);


  const { toast } = useToast();

  const addLog = useCallback((message: string) => {
    setGameLog(prevLog => [`[回合 ${currentRound || 1}] ${message}`, ...prevLog.slice(0, 14)]);
  }, [currentRound]);

  const selectQuizQuestions = useCallback(() => {
    const shuffled = [...QUIZ_QUESTIONS_BANK].sort(() => 0.5 - Math.random());
    setCurrentQuizQuestions(shuffled.slice(0, QUIZ_QUESTIONS_PER_ROUND)); 
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResults(null);
  }, []);

  const calculateFinalGrade = useCallback(() => {
    if (totalCorrectQuizAnswers > 4 && balance > 30000) {
      return "S 級 (理財大師！)";
    } else if (totalCorrectQuizAnswers >= 3 && balance > 25000) {
      return "A 級 (表現優異！)";
    } else if (totalCorrectQuizAnswers >= 2 && balance > 20000) {
      return "B 級 (相當不錯！)";
    } else {
      return "C 級 (再加強！)";
    }
  }, [totalCorrectQuizAnswers, balance]);

  const saveGameRecord = async (grade: string) => {
    if (!user || !isFirebaseEnabled || !firebaseDbService) {
      toast({
        title: "無法儲存記錄",
        description: "需要登入且 Firebase 已正確設定。",
        variant: "destructive",
      });
      return;
    }
    setIsSavingRecord(true);
    try {
      const gameData = {
        userId: user.uid,
        timestamp: serverTimestamp(),
        finalBalance: balance,
        roundsCompleted: TOTAL_ROUNDS,
        finalGrade: grade,
        totalCorrectQuizAnswers: totalCorrectQuizAnswers,
        totalQuizQuestions: TOTAL_ROUNDS * QUIZ_QUESTIONS_PER_ROUND,
      };
      await addDoc(collection(firebaseDbService, "gameRecords"), gameData);
      toast({
        title: "遊戲記錄已儲存",
        description: "你的遊戲表現已成功記錄！",
      });
    } catch (error) {
      console.error("儲存遊戲記錄時發生錯誤：", error);
      toast({
        title: "儲存失敗",
        description: "無法儲存你的遊戲記錄。",
        variant: "destructive",
      });
    } finally {
      setIsSavingRecord(false);
    }
  };

  const handleNextRoundLogic = useCallback((prevRound: number) => {
    if (prevRound >= TOTAL_ROUNDS) {
      setIsGameOver(true);
      const grade = calculateFinalGrade();
      setFinalGrade(grade);
      addLog(`遊戲結束！你的最終評級是：${grade}`);
      if (user && isFirebaseEnabled) { // Save record only if user is logged in
        saveGameRecord(grade);
      }
      return;
    }

    const nextRoundNumber = prevRound + 1;
    setCurrentRound(nextRoundNumber); 

    setBalance(prevBalance => {
      let newBalance = prevBalance;
      if (prevRound === 0 && nextRoundNumber === 1) { 
        newBalance = 0; 
      }
      
      const bonusFromSavingsCourse = INITIAL_SALARY * savingsBonusPercentage;
      const totalIncomeThisRound = INITIAL_SALARY + bonusFromSavingsCourse;
      newBalance += totalIncomeThisRound;
      addLog(`獲得月薪 ${INITIAL_SALARY.toLocaleString()} 元。`);
      if (bonusFromSavingsCourse > 0) {
        addLog(`理財課程使你額外儲蓄 ${bonusFromSavingsCourse.toLocaleString()} 元！`);
      }
      
      newBalance -= totalNecessaryExpenses;
      addLog(`支付必要開銷共 ${totalNecessaryExpenses.toLocaleString()} 元。`);
      if (newBalance < 0 && prevRound === 0 && nextRoundNumber === 1 && (prevBalance + totalIncomeThisRound - totalNecessaryExpenses < 0) ) {
         addLog(`警告：初始月薪不足以支付基本開銷！你的餘額已為負。`);
      }

      if (hasInsurance) {
        if (newBalance >= INSURANCE_MONTHLY_PREMIUM) {
          newBalance -= INSURANCE_MONTHLY_PREMIUM;
          addLog(`支付保險費 ${INSURANCE_MONTHLY_PREMIUM.toLocaleString()} 元。`);
        } else {
          addLog(`餘額不足 ${INSURANCE_MONTHLY_PREMIUM.toLocaleString()} 元支付保險費。你的保險已失效！`);
          setHasInsurance(false); 
          setInvestmentsMade(prev => prev.filter(id => id !== 'insurance'));
          toast({ title: "保險失效", description: "因餘額不足支付保費，你的保險已失效。", variant: "destructive" });
        }
      }
      return newBalance;
    });

    setOptionalExpensesThisRound(
      INITIAL_OPTIONAL_EXPENSES_DATA.map(exp => ({ ...exp, purchased: false }))
    );
    setEventDrawsRemainingThisRound(MAX_EVENT_DRAWS_PER_ROUND);
    setLastDrawnEvent(null);
    selectQuizQuestions(); 
  }, [INITIAL_SALARY, savingsBonusPercentage, hasInsurance, addLog, toast, selectQuizQuestions, calculateFinalGrade, user, isFirebaseEnabled, balance, totalCorrectQuizAnswers]); 

  const startGame = () => {
    setIsGameStarted(true);
    setGameLog([]); 
    setBalance(0); 
    setLastDrawnEvent(null);
    setInvestmentsMade([]);
    setHasInsurance(false);
    setSavingsBonusPercentage(0);
    setIsGameOver(false);
    setFinalGrade(null);
    setOptionalExpensesThisRound([]); 
    setEventDrawsRemainingThisRound(0);
    setTotalCorrectQuizAnswers(0);
    setAllPlayedQuizQuestions([]);
    
    addLog("財務小遊戲開始！準備迎接挑戰吧！");
    setCurrentRound(0); 
    handleNextRoundLogic(0); 
  };

  const handleBuyOptionalExpense = (expenseId: string) => {
    const expense = optionalExpensesThisRound.find(exp => exp.id === expenseId);
    if (!expense || expense.purchased) return;

    if (balance >= expense.cost) {
      setBalance(prev => prev - expense.cost);
      addLog(`購買了 ${expense.name}，花費 ${expense.cost.toLocaleString()} 元。`);
      setOptionalExpensesThisRound(prevExpenses =>
        prevExpenses.map(exp =>
          exp.id === expenseId ? { ...exp, purchased: true } : exp
        )
      );
    } else {
      addLog(`餘額不足，無法購買 ${expense.name}。`);
      toast({
        title: "餘額不足",
        description: `你沒有足夠的錢購買 ${expense.name}。`,
        variant: "destructive",
      });
    }
  };
  
  const handleInvestmentOption = useCallback((optionId: string) => {
    const option = INVESTMENT_OPTIONS_DATA.find(opt => opt.id === optionId);
    if (!option) return;

    const alreadyDone = option.isOneTimeAction && investmentsMade.includes(optionId);
    if (alreadyDone) {
        addLog(`你已經 ${option.name} 過了。`);
        toast({ title: "提示", description: `你已經 ${option.name} 過了。`});
        return;
    }
    
    const cost = option.cost || 0;

    if (option.actionType !== 'insurance' && cost > 0 && balance < cost) {
        addLog(`餘額不足，無法執行「${option.name}」。需要 ${cost.toLocaleString()} 元。`);
        toast({ title: "餘額不足", description: `執行「${option.name}」需要 ${cost.toLocaleString()} 元。` });
        return;
    }

    switch (option.actionType) {
      case 'course':
        setBalance(prev => prev - cost);
        setSavingsBonusPercentage(0.1);
        setInvestmentsMade(prev => [...prev, optionId]);
        addLog(`你參加了理財課程，花費 ${cost.toLocaleString()} 元。每月儲蓄能力提升10%！`);
        toast({ title: "學習成功", description: "理財課程完成，儲蓄能力提升！" });
        break;
      case 'insurance':
        if (hasInsurance) {
             addLog(`你已經購買保險了。`);
             toast({ title: "提示", description: `你已經購買保險了。`});
             return;
        }
        setHasInsurance(true);
        setInvestmentsMade(prev => [...prev, optionId]);
        addLog(`你購買了保險，之後每月將支付 ${INSURANCE_MONTHLY_PREMIUM.toLocaleString()} 元保費。`);
        toast({ title: "保險已購買", description: `每月將從你的餘額中扣除 ${INSURANCE_MONTHLY_PREMIUM.toLocaleString()} 元保費。` });
        break;
      case 'emergency_fund':
        setBalance(prev => prev - cost);
        setInvestmentsMade(prev => [...prev, optionId]);
        addLog(`你建立了緊急預備金，撥款 ${cost.toLocaleString()} 元。`);
        toast({ title: "預備金已建立", description: `已從餘額撥款 ${cost.toLocaleString()} 元至緊急預備金。` });
        break;
      case 'fixed_deposit':
      case 'etf':
        toast({ title: "理財行動", description: `你選擇了了解 ${option.name}。 (詳細功能待後續實作)` });
        addLog(`你考慮了 ${option.name}。`);
        break;
      default:
        addLog(`你考慮了 ${option.name}。`);
    }
  }, [balance, addLog, toast, investmentsMade, hasInsurance]);

  const handleDrawEventCard = () => {
    if (eventDrawsRemainingThisRound <= 0) {
      toast({ title: "提示", description: "本回合抽卡機會已用盡。" });
      return;
    }

    let eventToApply: RandomEvent;
    const positiveEvents = RANDOM_EVENTS_DATA.filter(e => e.type === 'positive');
    const negativeEvents = RANDOM_EVENTS_DATA.filter(e => e.type === 'negative');
    
    if (hasInsurance && Math.random() < 0.3) { // 30% chance for insurance to affect outcome
      if (positiveEvents.length > 0) {
        eventToApply = positiveEvents[Math.floor(Math.random() * positiveEvents.length)];
        addLog(`🍀 保險發揮作用！你抽到了較有利的事件：${eventToApply.name}`);
      } else { 
        // Fallback if no positive events (should not happen with current data, but good practice)
        eventToApply = RANDOM_EVENTS_DATA[Math.floor(Math.random() * RANDOM_EVENTS_DATA.length)];
        addLog(`你抽到了事件：${eventToApply.name} (保險嘗試觸發正面事件，但無可用選項)`);
      }
    } else {
      eventToApply = RANDOM_EVENTS_DATA[Math.floor(Math.random() * RANDOM_EVENTS_DATA.length)];
      addLog(`你抽到了事件：${eventToApply.name}`);
    }
    
    setLastDrawnEvent(eventToApply);
    setBalance(prev => prev + eventToApply.effect);

    if (eventToApply.type === 'positive') {
      addLog(`效果：${eventToApply.description} 獲得 ${eventToApply.effect.toLocaleString()} 元！`);
    } else {
      addLog(`效果：${eventToApply.description} 損失 ${Math.abs(eventToApply.effect).toLocaleString()} 元！`);
      if (balance + eventToApply.effect < 0 && balance >= 0) { 
        addLog(`警告：${eventToApply.name} 事件導致你的餘額變為負數！`);
      }
    }
    setEventDrawsRemainingThisRound(prev => prev - 1);
  };

  const handleQuizAnswer = (questionId: string, optionId: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitQuiz = () => {
    if (quizSubmitted) return;

    let correctAnswersCountInRound = 0;
    let rewardEarnedThisRound = 0;
    const roundResults: Array<{ questionId: string; isCorrect: boolean; selectedOptionId?: string; correctOptionId: string }> = [];
    const playedQuestionsInfo: AllPlayedQuizInfo[] = [];

    currentQuizQuestions.forEach(q => {
      const selectedOptionId = quizAnswers[q.id];
      const isCorrect = selectedOptionId === q.correctOptionId;
      if (isCorrect) {
        correctAnswersCountInRound++;
        rewardEarnedThisRound += q.reward;
      }
      roundResults.push({
        questionId: q.id,
        isCorrect,
        selectedOptionId,
        correctOptionId: q.correctOptionId,
      });
      playedQuestionsInfo.push({
        question: q,
        playerAnswerId: selectedOptionId,
        isCorrect: isCorrect,
      });
    });

    setBalance(prev => prev + rewardEarnedThisRound);
    setTotalCorrectQuizAnswers(prev => prev + correctAnswersCountInRound);
    setAllPlayedQuizQuestions(prev => [...prev, ...playedQuestionsInfo]);
    setQuizResults(roundResults);
    setQuizSubmitted(true);
    addLog(`理財小測驗完成！答對 ${correctAnswersCountInRound} / ${currentQuizQuestions.length} 題，獲得獎勵 ${rewardEarnedThisRound.toLocaleString()} 元。`);
    toast({
      title: "測驗結果",
      description: `你答對了 ${correctAnswersCountInRound} 題，獲得 ${rewardEarnedThisRound.toLocaleString()} 元！`,
    });
  };

  const advanceToNextRound = () => {
    handleNextRoundLogic(currentRound);
  };

  if (!isGameStarted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg shadow-lg">
        <CardTitle className="text-2xl font-bold mb-4 text-center">歡迎來到財務小遊戲！</CardTitle>
        <CardDescription className="mb-6 text-center text-muted-foreground">
          在這個遊戲中，你將體驗管理個人財務的挑戰與樂趣。準備好了嗎？
        </CardDescription>
        <Button onClick={startGame} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">開始遊戲</Button>
      </div>
    );
  }

  if (isGameOver) {
    const incorrectlyAnswered = allPlayedQuizQuestions.filter(q => !q.isCorrect);
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center bg-primary/10 p-6">
          <Award className="mx-auto h-16 w-16 text-primary mb-3" />
          <CardTitle className="text-3xl font-bold">遊戲結束！</CardTitle>
          <CardDescription>你的財務之旅成績如下：</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold">最終評級：<span className="text-primary">{finalGrade || "計算中..."}</span></p>
            <p className="text-lg">最終餘額：<span className={`font-semibold ${balance >=0 ? 'text-green-600': 'text-red-600'}`}>{balance.toLocaleString()}</span> 元</p>
            <p className="text-lg">測驗總答對題數：<span className="font-semibold">{totalCorrectQuizAnswers}</span> / {TOTAL_ROUNDS * QUIZ_QUESTIONS_PER_ROUND}</p>
          </div>
          
          <div className="mt-6 border-t pt-4">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <BookCopy className="mr-2 h-5 w-5 text-muted-foreground" />測驗回顧
            </h3>
            {incorrectlyAnswered.length > 0 ? (
              <div className="space-y-4">
                {incorrectlyAnswered.map((item, index) => {
                  const playerAnswerText = item.question.options.find(opt => opt.id === item.playerAnswerId)?.text || "未作答";
                  const correctAnswerText = item.question.options.find(opt => opt.id === item.question.correctOptionId)?.text;
                  return (
                    <Card key={index} className="p-4 bg-destructive/10 border-destructive/50">
                      <p className="font-medium text-foreground mb-1">{index + 1}. {item.question.questionText}</p>
                      <p className="text-sm text-foreground">你的答案：<span className="font-semibold">{playerAnswerText}</span> <XCircle className="inline h-4 w-4 ml-1 text-red-500" /></p>
                      <p className="text-sm text-green-700 dark:text-green-400">正確答案：<span className="font-semibold">{correctAnswerText}</span> <CheckCircle className="inline h-4 w-4 ml-1 text-green-500" /></p>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
                <p className="font-semibold text-green-600">太棒了！所有理財小測驗題目都答對了！</p>
              </div>
            )}
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <ReceiptText className="h-5 w-5 mr-2 text-muted-foreground" />遊戲日誌回顧：
            </h3>
            <div className="max-h-48 overflow-y-auto text-left text-sm bg-muted/50 p-3 rounded-md space-y-1PrettyScrollbar">
              {gameLog.map((log, index) => (
                <p key={index} className="text-muted-foreground">{log}</p>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center p-6">
          <Button onClick={startGame} variant="outline">重新開始</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="w-full max-w-4xl mx-auto shadow-xl animate-fade-in">
        <CardHeader className="bg-secondary/30 rounded-t-lg p-6">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-2xl md:text-3xl font-bold text-primary flex items-center">
              <CircleDollarSign className="mr-2 h-7 w-7"/>財務小遊戲
            </CardTitle>
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">第 {currentRound} / {TOTAL_ROUNDS} 回合</p>
              <Progress value={(currentRound / TOTAL_ROUNDS) * 100} className="w-24 md:w-32 h-2 mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center text-lg p-3 bg-background/50 rounded-md shadow-sm">
                  <DollarSign className={`h-6 w-6 mr-2 ${balance >=0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span>目前餘額：</span>
                  <span className={`font-bold text-xl md:text-2xl ml-1 ${balance >=0 ? 'text-green-600': 'text-red-600'}`}>{balance.toLocaleString()} 元</span>
              </div>
              <div className="flex items-center text-sm p-3 bg-background/50 rounded-md shadow-sm text-muted-foreground">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <span>本月基本薪資：{INITIAL_SALARY.toLocaleString()} 元</span>
                  {savingsBonusPercentage > 0 && <span className="ml-2 text-green-600 text-xs">(+{(INITIAL_SALARY * savingsBonusPercentage).toLocaleString()}元儲蓄加成)</span>}
              </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-1 space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-3 flex items-center text-foreground">
                <ListChecks className="h-6 w-6 mr-2 text-primary" />必要支出 (自動扣款)
              </h3>
              <Card className="p-4 bg-card border shadow">
                <ul className="space-y-2">
                  {NECESSARY_EXPENSES_DATA.map(exp => (
                    <li key={exp.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <div className="flex items-center">
                        <exp.icon className="h-5 w-5 mr-2 text-primary/80" />
                        <span className="text-foreground">{exp.name}</span>
                      </div>
                      <span className="font-medium text-foreground">{exp.cost.toLocaleString()} 元</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t mt-3 pt-3 text-right">
                  <p className="text-sm font-semibold text-destructive">總計： {totalNecessaryExpenses.toLocaleString()} 元</p>
                </div>
              </Card>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 flex items-center text-accent-foreground">
                <ShoppingCart className="h-6 w-6 mr-2" />可選支出
              </h3>
              <div className="space-y-3">
                {optionalExpensesThisRound.map(exp => {
                  const cantAfford = balance < exp.cost;
                  const buttonDisabled = exp.purchased || cantAfford;
                  let buttonLabel = exp.purchased ? "已購買" : "購買";
                  if (!exp.purchased && cantAfford) buttonLabel = "餘額不足";

                  if (exp.id === 'concert') {
                    return (
                      <Tooltip key={exp.id}>
                        <TooltipTrigger asChild>
                          <Card className={`p-3 bg-card border shadow-sm hover:shadow-md transition-shadow ${buttonDisabled && !exp.purchased ? 'opacity-60' : ''}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <exp.icon className="h-5 w-5 mr-3 text-accent-foreground/80" />
                                <div>
                                  <p className="font-medium text-foreground">{exp.name}</p>
                                  <p className="text-xs text-muted-foreground">{exp.cost.toLocaleString()} 元</p>
                                </div>
                              </div>
                              <Button 
                                size="sm"
                                onClick={() => handleBuyOptionalExpense(exp.id)}
                                disabled={buttonDisabled}
                                variant={exp.purchased ? "secondary" : "default"}
                                className="min-w-[80px]"
                              >
                                {buttonLabel}
                              </Button>
                            </div>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                          <Image 
                            src={AESPA_CONCERT_IMAGE_URL} 
                            alt="aespa concert" 
                            width={222} 
                            height={180}
                            className="rounded-md"
                            data-ai-hint="aespa concert" 
                          />
                        </TooltipContent>
                      </Tooltip>
                    );
                  }
                  if (exp.id === 'merch') {
                    return (
                      <Tooltip key={exp.id}>
                        <TooltipTrigger asChild>
                          <Card className={`p-3 bg-card border shadow-sm hover:shadow-md transition-shadow ${buttonDisabled && !exp.purchased ? 'opacity-60' : ''}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <exp.icon className="h-5 w-5 mr-3 text-accent-foreground/80" />
                                <div>
                                  <p className="font-medium text-foreground">{exp.name}</p>
                                  <p className="text-xs text-muted-foreground">{exp.cost.toLocaleString()} 元</p>
                                </div>
                              </div>
                              <Button 
                                size="sm"
                                onClick={() => handleBuyOptionalExpense(exp.id)}
                                disabled={buttonDisabled}
                                variant={exp.purchased ? "secondary" : "default"}
                                className="min-w-[80px]"
                              >
                                {buttonLabel}
                              </Button>
                            </div>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                          <Image 
                            src={NMIXX_MERCH_IMAGE_URL} 
                            alt="NMIXX merch" 
                            width={180} 
                            height={225} 
                            className="rounded-md object-contain" 
                            data-ai-hint="nmixx kpop" 
                          />
                        </TooltipContent>
                      </Tooltip>
                    );
                  }
                  return (
                    <Card key={exp.id} className={`p-3 bg-card border shadow-sm hover:shadow-md transition-shadow ${buttonDisabled && !exp.purchased ? 'opacity-60' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <exp.icon className="h-5 w-5 mr-3 text-accent-foreground/80" />
                          <div>
                            <p className="font-medium text-foreground">{exp.name}</p>
                            <p className="text-xs text-muted-foreground">{exp.cost.toLocaleString()} 元</p>
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleBuyOptionalExpense(exp.id)}
                          disabled={buttonDisabled}
                          variant={exp.purchased ? "secondary" : "default"}
                          className="min-w-[80px]"
                        >
                          {buttonLabel}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-3 flex items-center"><Landmark className="h-5 w-5 mr-2 text-blue-500" />理財選項</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INVESTMENT_OPTIONS_DATA.map(opt => {
                  const isActionTaken = (opt.isOneTimeAction && investmentsMade.includes(opt.id)) || (opt.actionType === 'insurance' && hasInsurance);
                  let canAfford = true;
                  if (opt.cost && opt.cost > 0) {
                    canAfford = balance >= opt.cost;
                  }
                   if (opt.actionType === 'insurance' && !hasInsurance) {
                     canAfford = balance >= INSURANCE_MONTHLY_PREMIUM; 
                   }

                  const buttonDisabled = isActionTaken || !canAfford;
                  
                  let buttonText = opt.name;
                  if (opt.cost && opt.actionType !== 'insurance') buttonText += ` (${opt.cost.toLocaleString()}元)`;
                  else if (opt.actionType === 'insurance' && !hasInsurance) buttonText = `買保險 (月付${INSURANCE_MONTHLY_PREMIUM}元)`;

                  if (isActionTaken) {
                    if (opt.actionType === 'insurance') buttonText = "保險已生效";
                    else buttonText = `${opt.name} - 已完成`;
                  } else if (!canAfford) {
                     buttonText = `${opt.name} (餘額不足)`;
                  }

                  return (
                    <Card key={opt.id} className={`p-3 bg-card border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ${buttonDisabled && !isActionTaken ? 'opacity-60' : ''}`}>
                      <div>
                        <div className="flex items-center mb-1">
                          <opt.icon className={`h-5 w-5 mr-2 ${isActionTaken ? 'text-muted-foreground' : 'text-blue-600' }`} />
                          <p className="font-medium text-foreground">{opt.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{opt.description}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleInvestmentOption(opt.id)}
                        disabled={buttonDisabled}
                        variant={isActionTaken ? "secondary" : "outline"}
                        className="w-full mt-auto text-xs"
                      >
                        {buttonText}
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Drama className="h-5 w-5 mr-2 text-purple-500" /> 抽卡區 ({eventDrawsRemainingThisRound} / {MAX_EVENT_DRAWS_PER_ROUND} 次)
              </h3>
              <Button
                onClick={handleDrawEventCard}
                disabled={eventDrawsRemainingThisRound <= 0 || isGameOver}
                className="w-full mb-4 bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Ticket className="mr-2 h-5 w-5" /> 抽一張卡！
              </Button>
              {lastDrawnEvent && (
                <Card className={`p-4 bg-card border shadow-sm ${lastDrawnEvent.type === 'positive' ? 'border-green-400 bg-green-50/50' : 'border-red-400 bg-red-50/50'}`}>
                  <div className="flex items-center">
                    <lastDrawnEvent.icon className={`h-7 w-7 mr-3 ${lastDrawnEvent.type === 'positive' ? 'text-green-600' : 'text-red-600'}`} />
                    <div>
                      <p className="font-semibold text-foreground">{lastDrawnEvent.name}</p>
                      <p className="text-sm text-muted-foreground">{lastDrawnEvent.description}</p>
                      <p className={`text-sm font-medium ${lastDrawnEvent.type === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                        影響：{lastDrawnEvent.effect > 0 ? '+' : ''}{lastDrawnEvent.effect.toLocaleString()} 元
                      </p>
                    </div>
                  </div>
                </Card>
              )}
              {eventDrawsRemainingThisRound > 0 && !lastDrawnEvent && !isGameOver && (
                 <div className="p-4 bg-muted/30 border border-dashed rounded-lg shadow-sm text-center text-muted-foreground">
                    <p>點擊上方按鈕抽卡！</p>
                </div>
              )}
               {eventDrawsRemainingThisRound === 0 && !lastDrawnEvent && !isGameOver &&(
                 <div className="p-4 bg-muted/30 border border-dashed rounded-lg shadow-sm text-center text-muted-foreground">
                    <p>本回合抽卡機會已用盡。</p>
                </div>
              )}
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" /> 理財小測驗
              </h3>
              {!quizSubmitted ? (
                <Card className="p-4 bg-card border shadow">
                  {currentQuizQuestions.map((q, index) => (
                    <div key={q.id} className={`mb-6 ${index < currentQuizQuestions.length - 1 ? 'pb-6 border-b' : ''}`}>
                      <p className="font-medium text-foreground mb-3">{index + 1}. {q.questionText}</p>
                      <RadioGroup
                        onValueChange={(value) => handleQuizAnswer(q.id, value)}
                        value={quizAnswers[q.id] || ""}
                        className="space-y-2"
                      >
                        {q.options.map(opt => (
                          <div key={opt.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt.id} id={`${q.id}-${opt.id}`} />
                            <Label htmlFor={`${q.id}-${opt.id}`} className="font-normal cursor-pointer">{opt.text}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                  <Button 
                    onClick={handleSubmitQuiz} 
                    className="w-full mt-4"
                    disabled={Object.keys(quizAnswers).length !== currentQuizQuestions.length || currentQuizQuestions.length === 0}
                  >
                    提交答案
                  </Button>
                </Card>
              ) : (
                <Card className="p-4 bg-card border shadow">
                  <h4 className="text-lg font-semibold mb-3">測驗結果：</h4>
                  {quizResults?.map((result, index) => {
                    const question = currentQuizQuestions.find(q => q.id === result.questionId);
                    if (!question) return null;
                    const selectedOptionText = question.options.find(o => o.id === result.selectedOptionId)?.text;
                    const correctOptionText = question.options.find(o => o.id === result.correctOptionId)?.text;

                    return (
                      <div key={result.questionId} className={`mb-4 pb-4 ${index < quizResults.length - 1 ? 'border-b' : ''}`}>
                        <p className="font-medium text-foreground mb-1">{index + 1}. {question.questionText}</p>
                        <p className="text-sm">你的答案：<span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>{selectedOptionText || "未作答"}</span>
                          {result.isCorrect ? <CheckCircle className="inline h-4 w-4 ml-1 text-green-500" /> : <XCircle className="inline h-4 w-4 ml-1 text-red-500" />}
                        </p>
                        {!result.isCorrect && <p className="text-sm text-blue-600">正確答案：{correctOptionText}</p>}
                      </div>
                    );
                  })}
                  <p className="mt-4 font-semibold text-center">
                    你答對了 {quizResults?.filter(r => r.isCorrect).length || 0} / {currentQuizQuestions.length} 題，
                    獲得獎勵 <DollarSign className="inline h-4 w-4 text-green-600" /> {(quizResults?.filter(r => r.isCorrect).length || 0) * QUIZ_REWARD_PER_CORRECT_ANSWER} 元！
                  </p>
                </Card>
              )}
            </section>

          </div>
        </CardContent>
        
        {gameLog.length > 0 && (
            <CardContent className="p-6 pt-0 lg:col-span-3">
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <ReceiptText className="h-5 w-5 mr-2 text-muted-foreground" />遊戲日誌：
                </h3>
                <div className="max-h-40 overflow-y-auto text-sm bg-muted/50 p-3 rounded-md space-y-1PrettyScrollbar">
                  {gameLog.map((log, index) => (
                    <p key={index} className="text-muted-foreground">{log}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          )}

        <CardFooter className="p-6 border-t flex justify-end lg:col-span-3">
          <Button 
            onClick={advanceToNextRound} 
            size="lg" 
            className="min-w-[150px] bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isGameOver || (currentRound === 0 && !isGameStarted) || (currentQuizQuestions.length > 0 && !quizSubmitted) } 
          >
            {currentRound < TOTAL_ROUNDS ? "結束本月 / 下一回合" : "查看結果"}
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
