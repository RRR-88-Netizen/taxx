
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Calculator, FileText, Workflow, History } from "lucide-react"; // Changed HelpCircle to Workflow
import Image from "next/image";

const features = [
  {
    title: "申請指南",
    description: "為你的申請需求提供逐步協助。",
    href: "/application-guide",
    icon: FileText,
    image: "https://th.bing.com/th/id/OIP.qIQ7RZEuBHXwtKqcKrkSywHaHa?cb=iwp2&rs=1&pid=ImgDetMain",
    aiHint: "指南 文件"
  },
  {
    title: "AI 稅務助理",
    description: "跟AI說說問題吧",
    href: "/tax-assistant",
    icon: Calculator,
    image: "https://www.nibib.nih.gov/sites/default/files/inline-images/AI%20600%20x%20400.jpg",
    aiHint: "金融 機器人"
  },
  {
    title: "申請流程圖",
    description: "視覺化展示各項申請的完整流程。",
    href: "/application-flowchart",
    icon: Workflow, // Changed from HelpCircle
    image: "https://th.bing.com/th/id/OIP.cRVwxZkuBBHPoaJrYsTB7AHaEu?w=264&h=180&c=7&r=0&o=5&dpr=2&pid=1.7",
    aiHint: "流程圖 步驟" // Updated aiHint
  },
  {
    title: "學習系統",
    description: "來一起學習知識吧",
    href: "/learning-system",
    icon: BookOpen,
    image: "https://th.bing.com/th/id/R.5bec7731f410e6149b260bf5b163e6b6?rik=ShJ%2b7UAlPkrCfA&riu=http%3a%2f%2fwww.kuaipng.com%2fUploads%2fpic%2fw%2f2021%2f10-05%2f109831%2fwater_109831_698_698_.png&ehk=sIauSPzPXELZi0QLzXPe7eOjkr133u0DgqHVdt2H7Zw%3d&risl=&pid=ImgRaw&r=0",
    aiHint: "教育 線上"
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-12">
      <section className="text-center py-16 bg-gradient-to-r from-primary/20 via-background to-accent/20 w-full rounded-lg shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            歡迎來到 <span className="text-primary">牛馬學習</span>
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-md text-muted-foreground">
            牛馬學習希望你能透過這個系統對於報稅和各項申請事務更熟悉，還有一些理財小知識，並提供測驗讓你評估吸收多少，祝你體驗愉快！
          </p>
        </div>
      </section>

      <section className="w-full">
        <h2 className="text-3xl font-semibold tracking-tight text-center mb-10">
          探索我們的功能
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0">
                <Image 
                  src={feature.image} 
                  alt={feature.title} 
                  width={600} 
                  height={400} 
                  className="w-full h-48 object-cover"
                  data-ai-hint={feature.aiHint} 
                />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center mb-2">
                  <feature.icon className="h-6 w-6 text-primary mr-3" />
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href={feature.href}>
                    前往 {feature.title} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
