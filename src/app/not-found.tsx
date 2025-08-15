import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-500 mb-8">
          A página que você está procurando não existe.
        </p>
        <Link href="/">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Voltar ao início
          </Button>
        </Link>
      </div>
    </div>
  );
}
