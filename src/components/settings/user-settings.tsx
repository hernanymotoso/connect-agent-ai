"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
}

interface UserSettingsProps {
  user: User;
}

export function UserSettings({ user }: UserSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user.name || "");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Implementar API de atualização de usuário
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulação
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Perfil */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Gerencie suas informações pessoais</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="text-lg">
                  {user.name?.charAt(0).toUpperCase() ||
                    user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">
                  {user.name || "Sem nome"}
                </h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500">
                O email não pode ser alterado
              </p>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Configurações da Conta */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Conta</CardTitle>
          <CardDescription>
            Gerencie preferências e limites da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2">
            <div>
              <h4 className="font-medium">Plano Atual</h4>
              <p className="text-sm text-gray-600">
                Plano Gratuito - 3 agentes
              </p>
            </div>
            <Button variant="outline">Upgrade</Button>
          </div>

          <div className="flex justify-between items-center py-2">
            <div>
              <h4 className="font-medium">Agentes Criados</h4>
              <p className="text-sm text-gray-600">0 de 3 agentes utilizados</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
