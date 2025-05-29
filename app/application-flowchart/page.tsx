
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, Workflow } from "lucide-react";

interface FlowchartStep {
  text: string;
  type: 'start' | 'process' | 'end';
}

interface FlowchartData {
  id: string;
  title: string;
  steps: FlowchartStep[];
}

const flowcharts: FlowchartData[] = [
  {
    id: "householdRegistration",
    title: "戶籍謄本申請流程",
    steps: [
      { text: "開始", type: 'start' },
      { text: "身分驗證", type: 'process' },
      { text: "填寫申請資料", type: 'process' },
      { text: "繳費", type: 'process' },
      { text: "申請送出", type: 'process' },
      { text: "審核資料", type: 'process' },
      { text: "謄本核發", type: 'process' },
      { text: "結束", type: 'end' },
    ],
  },
  {
    id: "moveInOrOut",
    title: "遷入(出)登記流程",
    steps: [
      { text: "開始", type: 'start' },
      { text: "遷出地辦理遷出登記", type: 'process' },
      { text: "取得遷出證明", type: 'process' },
      { text: "遷入地辦理遷入登記", type: 'process' },
      { text: "審查資料", type: 'process' },
      { text: "核發新戶籍謄本", type: 'process' },
      { text: "結束", type: 'end' },
    ],
  },
  {
    id: "landOwnershipFirstRegistration",
    title: "土地所有權第一次登記流程",
    steps: [
      { text: "開始", type: 'start' },
      { text: "提出申請", type: 'process' },
      { text: "檢附權利文件與圖資", type: 'process' },
      { text: "土地機關現地調查", type: 'process' },
      { text: "資料審查", type: 'process' },
      { text: "公告登記", type: 'process' },
      { text: "頒發所有權狀", type: 'process' },
      { text: "結束", type: 'end' },
    ],
  },
  {
    id: "buildingOwnershipFirstRegistration",
    title: "建物所有權第一次登記流程",
    steps: [
      { text: "開始", type: 'start' },
      { text: "填報資料", type: 'process' },
      { text: "附建照及使用執照", type: 'process' },
      { text: "現場勘查", type: 'process' },
      { text: "資料審核", type: 'process' },
      { text: "登記建物權屬", type: 'process' },
      { text: "發給建物權狀", type: 'process' },
      { text: "結束", type: 'end' },
    ],
  },
  {
    id: "cadastralChangeNotification",
    title: "地籍異動即時通知申請流程",
    steps: [
      { text: "開始", type: 'start' },
      { text: "申請（線上或臨櫃）", type: 'process' },
      { text: "登錄通知資料（手機 / Email）", type: 'process' },
      { text: "身份審核", type: 'process' },
      { text: "啟用即時通知服務", type: 'process' },
      { text: "結束", type: 'end' },
    ],
  },
  {
    id: "houseNumberChange",
    title: "門牌變更流程",
    steps: [
      { text: "開始", type: 'start' },
      { text: "提出門牌變更申請", type: 'process' },
      { text: "審查資料", type: 'process' },
      { text: "實地查勘", type: 'process' },
      { text: "新門牌核定", type: 'process' },
      { text: "發送變更通知", type: 'process' },
      { text: "結束", type: 'end' },
    ],
  },
];

export default function ApplicationFlowchartPage() {
  const getStepClasses = (type: FlowchartStep['type']) => {
    switch (type) {
      case 'start':
      case 'end':
        return "bg-primary text-primary-foreground font-bold shadow-lg border-primary";
      case 'process':
      default:
        return "bg-secondary/30 text-secondary-foreground/90 border-secondary/50 shadow-sm hover:shadow-md transition-shadow";
    }
  };

  return (
    <div className="space-y-12">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-primary/10 p-8 rounded-t-lg">
          <Workflow className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-4xl font-bold">申請流程圖</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            這裡將以視覺化的方式呈現各項重要申請的步驟與流程。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {flowcharts.map((flowchart) => (
          <Card key={flowchart.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader className="bg-secondary/10 py-4">
              <CardTitle className="text-xl text-center font-semibold text-secondary-foreground">{flowchart.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-1 flex-grow">
              {flowchart.steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-full max-w-sm p-3 rounded-md text-center text-sm ${getStepClasses(step.type)}`}>
                    {step.text}
                  </div>
                  {index < flowchart.steps.length - 1 && (
                    <ArrowDown className="my-1.5 h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
