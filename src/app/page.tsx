import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Monitoolring</CardTitle>
          <CardDescription>
            Projeto inicializado com Next.js, Tailwind e shadcn/ui.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Começar</Button>
        </CardContent>
      </Card>
    </main>
  );
}
