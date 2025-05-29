
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle, FileText, Link as LinkIcon } from "lucide-react"; 

const guideSections = [
  {
    id: "householdRegistration",
    title: "戶籍謄本申請",
    checklistIntro: "必須帶的東西：",
    checklistItems: [
      "身分證",
      "印章",
      "申請人如非本人，需委託書及雙方身分證件影本",
    ],
    remainingContent: `
辦理地點：
- 任一戶政事務所

需填寫文件：
- 戶籍謄本申請書

相關文件PDF：<a href="https://land.chcg.gov.tw/files/32_1040414_2007-4-9-10-57-7-187.pdf" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline inline-flex items-center">委託書 <LinkIcon class="ml-1 h-4 w-4" /></a>`,
    points: [], 
  },
  {
    id: "moveInOrOut",
    title: "遷入（出）登記",
    checklistIntro: "必須帶的東西：",
    checklistItems: [
      "身分證",
      "印章",
      "新住址的房屋權狀影本或租賃契約（證明住居正當性）",
    ],
    remainingContent: `
辦理地點：
- 遷入地或遷出地戶政事務所

需填寫文件：
- 遷徙登記申請書

相關文件PDF：<a href="https://www.ris.gov.tw/documents/data/2/bb6e1dca-67f4-4378-bc5e-29694e921ce1.pdf" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline inline-flex items-center">遷入登記申請書 <LinkIcon class="ml-1 h-4 w-4" /></a>`,
    points: [ 
      "未成年人遷徙，應由法定代理人或戶長辦理。",
      "注意辦理期限，避免逾期罰鍰。",
    ],
  },
  {
    id: "landOwnershipFirstRegistration",
    title: "土地所有權第一次登記",
    checklistIntro: "必須帶的東西：",
    checklistItems: [
      "身分證及印章",
      "土地買賣契約、繼承證明文件或法院判決書等相關證明",
      "建築改良物所有權證明（如為建地）",
    ],
    remainingContent: `
辦理地點：
- 土地所在地地政事務所

需填寫文件：
- 土地所有權第一次登記申請書
- 登記原因證明文件表
- 申請書內附收件收據聯
相關文件PDF：<a href="https://csland.land.taichung.gov.tw/archive/image/MTU0NTEyM1-lnJ-lnLDnmbvoqJjnlLPoq4vmm7gxMDEwNjA3LeWcn_WcsOaJgOacieasiuesrOS4gOasoeeZu_iomC43MjA2Mzg4MTU5MjM=.doc" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline inline-flex items-center">土地所有權第一次登記申請書 <LinkIcon class="ml-1 h-4 w-4" /></a>`,
    points: [],
  },
  {
    id: "buildingOwnershipFirstRegistration",
    title: "建物所有權第一次登記",
    checklistIntro: "必須帶的東西：",
    checklistItems: [
      "身分證與印章",
      "建物第一次登記測量成果圖",
      "建造執照、使用執照或其他合法建築證明文件",
      "建物完工證明（如完工照片）",
    ],
    remainingContent: `
辦理地點：
- 建物所在地地政事務所

需填寫文件：
- 建物第一次登記申請書
- 建物標示變更申請書（如同時辦理變更）
- 登記原因證明文件（如自建切結書）

相關文件PDF：
<a href="https://w3fs.tainan.gov.tw/Download.ashx?u=LzAwMS9VcGxvYWQvMjA3L3JlbGZpbGUvMjI0ODYvNzgxMTA1OC85NTZmMmU5OC01ZDQ2LTQyNTctYTQxYi1lMDYzOGQ4YjdjNGMub2R0&n=MjAxNjA1MTkxMzU2MTM3ODk0NTIub2R0&icon=.odt" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline inline-flex items-center">建物標示變更申請書 <LinkIcon class="ml-1 h-4 w-4" /></a>
<a href="https://e-services.tycg.gov.tw/TycgOnline/DownloadFileServlet;jsessionid=9A51D80D140B0DB792B326432ED2C84F?type=AP0303D4_LINK&pkid=1e9a8aea-9dfe-4210-ad89-e62d7df0192a" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline inline-flex items-center">登記申請書 <LinkIcon class="ml-1 h-4 w-4" /></a>`,
    points: [],
  },
  {
    id: "cadastralChangeNotification",
    title: "地籍異動即時通知",
    checklistIntro: "必須帶的東西：",
    checklistItems: [
      "本人身分證與印章",
      "行動電話或電子郵件信箱資料（需填寫）",
    ],
    remainingContent: `
辦理地點：
- 任一地政事務所（建議到不動產所在地辦理）
- 或線上使用自然人憑證申辦（部分縣市支援）

需填寫文件：
- 地籍異動即時通申請書（現場提供，或地政局網站下載）

相關文件PDF：<a href="https://www.land.moi.gov.tw/chhtml/addcount?cupid=497&tmptype=d1-20231127154114.pdf" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline inline-flex items-center">地籍異動申請書 <LinkIcon class="ml-1 h-4 w-4" /></a>`,
    points: [], 
  },
  {
    id: "houseNumberChange",
    title: "門牌變更",
    checklistIntro: "必須帶的東西：",
    checklistItems: [
      "身分證與印章",
      "建築物使用執照或相關建物權利證明",
      "土地所有權狀或房屋稅單",
    ],
    remainingContent: `
辦理地點：
建物所在地的戶政事務所（部分縣市由地政事務所辦理）

需填寫文件：
門牌申請書（變更或補發類型）
門牌證明申請表
相關文件PDF：
<a href="https://ws.tycg.gov.tw/Download.ashx?u=LzAwMS9VcGxvYWQvMTU4L3JlbGZpbGUvMTU0NDUvMTA1MDA2Mi9jODM5Yjk5NC01M2YwLTRkYzgtOTRiZi0wMDgwZWEzODcwNzEucGRm&n=6KOc55m86ZaA54mM55Sz6KuL5pu4LnBkZg%3d%3d" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline inline-flex items-center">門牌申請書 <LinkIcon class="ml-1 h-4 w-4" /></a>
<a href="https://www.ris.gov.tw/documents/data/2/1580a511-5552-4c35-b599-eccb9a46e1be.pdf" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline inline-flex items-center">門牌證明 <LinkIcon class="ml-1 h-4 w-4" /></a>`,
    points: [],
  },
];

export default function ApplicationGuidePage() {
  return (
    <div className="space-y-12">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-primary/10 p-8 rounded-t-lg">
          <FileText className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-4xl font-bold">申請指南</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            申請各項事情須知，讓你不用多跑一趟！
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-10">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-8">
            必帶物品、應填寫文件
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {guideSections.map((section) => (
              <AccordionItem key={section.id} value={section.id} className="border-b-0 mb-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="p-6 text-lg font-medium hover:no-underline text-left">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0 text-muted-foreground space-y-4">
                  {section.checklistIntro && <p className="font-semibold mb-2 text-foreground">{section.checklistIntro}</p>}
                  {section.checklistItems && section.checklistItems.length > 0 && (
                    <ul className="space-y-3 pl-1 mb-4">
                      {section.checklistItems.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <Checkbox id={`${section.id}-chk-${index}`} className="mr-3 h-5 w-5 rounded shrink-0" />
                          <Label htmlFor={`${section.id}-chk-${index}`} className="font-normal text-sm leading-snug cursor-pointer">
                            {item}
                          </Label>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.remainingContent && <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: section.remainingContent.replace(/\n/g, '<br />') }} />}
                  
                  {/* Fallback for sections not using the checklist structure */}
                  {!section.checklistItems && section.content && <p className="whitespace-pre-wrap">{section.content.replace(/\n/g, '<br />')}</p>}
                  
                  {section.points && section.points.length > 0 && (
                    <ul className="space-y-2 pl-4">
                      {section.points.map((point, index) => (
                        <li key={index} className="flex">
                          <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
