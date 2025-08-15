import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Zap, Shield } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}

      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              ConnectAgent AI
            </span>
          </div>
          <Link href="/login">
            <Button variant="outline">Entrar</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Crie seus próprios
          <span className="text-blue-600"> Agentes de IA</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transforme suas ideias em agentes inteligentes. Configure, personalize
          e implemente assistentes de IA para automatizar suas tarefas.
        </p>
        <Link href="/login">
          <Button size="lg" className="text-lg px-8 py-4">
            Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Criação Rápida</h3>
            <p className="text-gray-600">
              Configure seu agente em minutos com nossa interface intuitiva
            </p>
          </div>
          <div className="text-center p-6">
            <Bot className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">IA Avançada</h3>
            <p className="text-gray-600">
              Powered by GPT-4 para conversas naturais e inteligentes
            </p>
          </div>
          <div className="text-center p-6">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Seguro e Confiável</h3>
            <p className="text-gray-600">
              Seus dados protegidos com as melhores práticas de segurança
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
