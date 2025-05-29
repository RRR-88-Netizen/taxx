
import type { LearningModule, AccordionContentData, FinancialGameContentData, QuizContentData, RecordsDashboardContentData } from "@/types";

const insuranceAccordionContent: AccordionContentData = {
  type: 'accordion',
  items: [
    {
      id: 'travelInsurance',
      title: '旅平險 (旅遊平安險)',
      description: '旅遊平安險，簡稱旅平險，主要保障你在國內外旅遊期間，因突發意外事故所導致的身故、失能或醫療費用。部分旅平險也包含海外突發疾病醫療、旅遊不便（如班機延誤、行李遺失等）及緊急救援服務等保障。',
      links: [
        { name: '國泰產險 - 旅遊綜合保險', url: 'https://www.cathay-ins.com.tw/INSEBWeb/BOBE/travel/travel_quote/prompt' },
        { name: '富邦產險 - 旅行平安險', url: 'https://www.tmnewa.com.tw/ec/travel/overseas/?msclkid=bf5fcb8c860510d10b2da3b97db95571&utm_source=bing&utm_medium=cpc&utm_campaign=A07%E6%97%85%E8%A1%8C%E7%B6%9C%E5%90%88%E4%BF%9D%E9%9A%AA&utm_term=%E7%B7%9A%E4%B8%8A%E6%97%85%E9%81%8A%E9%9A%AA&utm_content=03%E6%97%85%E9%81%8A%E9%9A%AA' }
      ]
    },
    {
      id: 'accidentInsurance',
      title: '意外險 (傷害保險)',
      description: '意外險，也稱為傷害保險，主要針對「非由疾病引起之外來突發事故」所造成的傷害、失能或身故提供保障。其保障範圍不限於特定地點或活動，但必須符合「意外」的定義。',
      links: [
        { name: '國泰人壽 - 意外傷害保險', url: 'https://www.cathaylife.com.tw/cathaylife/products/accident' },
        { name: '富邦人壽 - 意外險', url: 'https://www.fubon.com/insurance/b2c/content/prod_accident/index.html' }
      ]
    },
    {
      id: 'fireInsurance',
      title: '火災險 (住宅火災及地震基本保險)',
      description: '住宅火災及地震基本保險，俗稱火災險，主要保障你的住宅建築物本身因火災、閃電雷擊、爆炸、航空器及其零配件之墜落、機動車輛碰撞等事故，以及地震所造成的損失。',
      links: [
        { name: '國泰產險 - 住宅火災及地震基本保險', url: 'https://www.cathay-ins.com.tw/cathayins/personal/group/tenant/' },
        { name: '富邦產險 - 住宅火災及地震基本保險', url: 'https://www.fubon.com/insurance/b2c/content/main/new03.html' }
      ]
    },
    {
      id: 'lifeInsurance',
      title: '人壽險 (壽險)',
      description: '人壽保險，簡稱壽險，是以被保險人的生存或死亡為保險標的。當被保險人在保險期間內身故、全殘，或生存至保險契約約定的年限時，保險公司會依照契約給付保險金。主要目的是提供家庭經濟保障、遺族照護或儲蓄規劃。',
      links: [
        { name: '國泰人壽 - 人壽保險', url: 'https://www.cathaylife.com.tw/cathaylife/products/life-caring' },
        { name: '富邦人壽 - 壽險', url: 'https://www.fubon.com/life/direct/' }
      ]
    }
  ]
};

const financialGameContent: FinancialGameContentData = {
  type: 'financial_game',
};

const sampleQuizContent: QuizContentData = {
  type: 'quiz',
  title: '綜合知識測驗',
  questions: [
    {
      id: 'q1',
      questionText: '根據「戶籍謄本申請流程」，申請人如非本人，需準備下列哪項文件？',
      type: 'single-choice',
      options: [
        { id: 'q1o1', text: '良民證' },
        { id: 'q1o2', text: '委託書及雙方身分證件影本' },
        { id: 'q1o3', text: '最新年度所得稅申報書' },
      ],
      correctOptionIds: ['q1o2'],
      points: 10,
      explanation: '申請戶籍謄本若非本人，需委託書及雙方身分證件影本。'
    },
    {
      id: 'q2',
      questionText: '「遷入(出)登記」應在哪個地點辦理？',
      type: 'single-choice',
      options: [
        { id: 'q2o1', text: '僅限遷入地戶政事務所' },
        { id: 'q2o2', text: '遷入地或遷出地戶政事務所' },
        { id: 'q2o3', text: '任一地政事務所' },
      ],
      correctOptionIds: ['q2o2'],
      points: 10,
      explanation: '遷入(出)登記可以在遷入地或遷出地的戶政事務所辦理。'
    },
    {
      id: 'q5',
      questionText: '下列哪種保險主要保障旅遊期間因突發意外導致的身故、失能或醫療費用？',
      type: 'single-choice',
      options: [
        { id: 'q5o1', text: '火災險' },
        { id: 'q5o2', text: '旅平險' },
        { id: 'q5o3', text: '人壽險' },
      ],
      correctOptionIds: ['q5o2'],
      points: 10,
      explanation: '旅平險主要保障旅遊期間的意外事故。'
    },
    {
      id: 'q6',
      questionText: '「非由疾病引起之外來突發事故」造成的傷害，主要由哪種保險承保？',
      type: 'single-choice',
      options: [
        { id: 'q6o1', text: '意外險 (傷害保險)' },
        { id: 'q6o2', text: '住宅火災及地震基本保險' },
        { id: 'q6o3', text: '壽險' },
      ],
      correctOptionIds: ['q6o1'],
      points: 10,
      explanation: '意外險（傷害保險）針對非疾病引起的外來突發事故。'
    },
    {
      id: 'q7',
      questionText: '申請「地籍異動即時通知」時，需要提供下列哪項資料？',
      type: 'single-choice',
      options: [
        { id: 'q7o1', text: '房屋權狀正本' },
        { id: 'q7o2', text: '行動電話或電子郵件信箱資料' },
        { id: 'q7o3', text: '近三個月薪資證明' },
      ],
      correctOptionIds: ['q7o2'],
      points: 10,
      explanation: '申請地籍異動即時通知需要提供行動電話或電子郵件信箱。'
    },
    {
      id: 'q8',
      questionText: '「建物所有權第一次登記」應在哪個地點辦理？',
      type: 'single-choice',
      options: [
        { id: 'q8o1', text: '任一戶政事務所' },
        { id: 'q8o2', text: '建物所在地地政事務所' },
        { id: 'q8o3', text: '國稅局' },
      ],
      correctOptionIds: ['q8o2'],
      points: 10,
      explanation: '建物所有權第一次登記應在建物所在地的地政事務所辦理。'
    },
    {
      id: 'q10',
      questionText: '根據「保險介紹」模組，下列哪些是提到的人壽保險的主要目的？（可複選）',
      type: 'multiple-choice',
      options: [
        { id: 'q10o1', text: '短期獲取高額利潤' },
        { id: 'q10o2', text: '提供家庭經濟保障' },
        { id: 'q10o3', text: '遺族照護' },
        { id: 'q10o4', text: '保障旅遊不便' },
        { id: 'q10o5', text: '儲蓄規劃' },
      ],
      correctOptionIds: ['q10o2', 'q10o3', 'q10o5'],
      points: 10,
      explanation: '人壽保險的主要目的包括提供家庭經濟保障、遺族照護和儲蓄規劃。'
    },
  ],
};

const recordsDashboardContent: RecordsDashboardContentData = {
  type: 'records_dashboard',
};

export const sampleModules: LearningModule[] = [
  {
    id: "module1",
    title: "財務小遊戲",
    description: "學習個人理財、預算規劃及投資基礎，為你的財務未來打下堅實基礎。",
    content: financialGameContent,
    imageUrl: "https://images.pexels.com/photos/210600/pexels-photo-210600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    aiHint: "財務 計算",
  },
  {
    id: "module2",
    title: "遊戲、測驗紀錄",
    description: "在這裡查看你過去的遊戲表現和測驗結果，分析你的理財決策和學習進度。",
    content: recordsDashboardContent, // Updated content type
    imageUrl: "https://th.bing.com/th/id/OIP.pu5rF3xQvceQw9JRNj0teQHaHB?w=188&h=180&c=7&r=0&o=7&cb=iwp2&dpr=2&pid=1.7&rm=3",
    aiHint: "數據 圖表",
  },
  {
    id: "module3",
    title: "保險介紹",
    description: "認識不同種類的保險及其功能，學會如何選擇適合自己的保險產品。",
    introductionText: "保險是什麼？\n\n保險是一種風險管理的工具。透過集合眾人的力量，共同分攤少數人可能遭遇的巨大損失。簡單來說，就是你定期支付一筆相對較小的金額（保費）給保險公司，當約定的保險事故發生時（例如生病、意外、死亡、財物損失等），保險公司會依照契約給付一筆較大的金額（保險金），以彌補你的經濟損失或提供支持。\n\n保險的目的：\n\n保險的主要目的是提供保障，轉嫁不可預測的風險，確保個人、家庭或企業在面臨突發狀況時，能夠獲得財務上的緩衝與支持，維持生活穩定，並降低因意外事件帶來的經濟衝擊。\n\n以下為常見的保險類型介紹：",
    content: insuranceAccordionContent,
    imageUrl: "https://th.bing.com/th/id/OIP.sA64l_BXgP5DVAoSXRUGAAHaFz?w=216&h=182&c=7&r=0&o=7&cb=iwp2&dpr=2&pid=1.7&rm=3",
    aiHint: "保險 家庭",
  },
  {
    id: "module4",
    title: "測驗",
    description: "透過小測驗檢視學習成效，鞏固所學知識點。",
    content: sampleQuizContent,
    imageUrl: "https://th.bing.com/th/id/OIP.nC6zGHlttc7r8E8-ISLmewHaDt?w=311&h=174&c=7&r=0&o=7&cb=iwp2&dpr=2&pid=1.7&rm=3",
    aiHint: "測驗 學習",
  },
];

export async function getAllLearningModules(): Promise<LearningModule[]> {
  // Simulate API call delay
  return new Promise(resolve => setTimeout(() => resolve(sampleModules), 100));
}

export async function getLearningModuleById(id: string): Promise<LearningModule | undefined> {
  // Simulate API call delay
  return new Promise(resolve => setTimeout(() => resolve(sampleModules.find(module => module.id === id)), 100));
}
