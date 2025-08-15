"use client";

import { signIn, getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chrome } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CA</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              ConnectAgent AI
            </span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Bem-vindo de volta</CardTitle>
            <CardDescription>
              Entre com sua conta Google para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              <Chrome className="mr-2 h-5 w-5" />
              {loading ? "Entrando..." : "Continuar com Google"}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Ao continuar, você concorda com nossos{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Termos de Serviço
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
