'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bot, MoreHorizontal, Edit, Trash2, Play, Pause, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { QRCodeModal } from '@/components/modals/qr-code-modal'

interface Agent {
  id: string
  name: string
  description: string
  status: 'ACTIVE' | 'INACTIVE'
  temperature: number
  createdAt: string
  updatedAt: string
}

interface AgentsListProps {
  agents: Agent[]
}

export function AgentsList({ agents: initialAgents }: AgentsListProps) {
  const [agents, setAgents] = useState(initialAgents)
  const [deletingAgent, setDeletingAgent] = useState<string | null>(null)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const router = useRouter()

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Tem certeza que deseja deletar este agente?')) return

    setDeletingAgent(agentId)
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar agente')
      }

      setAgents(prev => prev.filter(agent => agent.id !== agentId))
      toast.success('Agente deletado com sucesso!')
    } catch (error) {
      toast.error('Erro ao deletar agente')
      console.error(error)
    } finally {
      setDeletingAgent(null)
    }
  }

  const handleToggleStatus = async (agentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar status')
      }

      setAgents(prev => prev.map(agent => 
        agent.id === agentId ? { ...agent, status: newStatus as 'ACTIVE' | 'INACTIVE' } : agent
      ))
      
      toast.success(`Agente ${newStatus === 'ACTIVE' ? 'ativado' : 'desativado'}!`)
    } catch (error) {
      toast.error('Erro ao atualizar status')
      console.error(error)
    }
  }

  const openQRModal = (agent: Agent) => {
    setSelectedAgent(agent)
    setQrModalOpen(true)
  }

  const closeQRModal = () => {
    setQrModalOpen(false)
    setSelectedAgent(null)
  }

  if (agents.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum agente criado
          </h3>
          <p className="text-gray-500 mb-6">
            Comece criando seu primeiro agente de IA personalizado
          </p>
          <Link href="/dashboard/agents/new">
            <Button>Criar Primeiro Agente</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <Badge variant={agent.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {agent.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => handleToggleStatus(agent.id, agent.status)}
                    >
                      {agent.status === 'ACTIVE' ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Ativar
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/agents/${agent.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteAgent(agent.id)}
                      className="text-red-600"
                      disabled={deletingAgent === agent.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deletingAgent === agent.id ? 'Deletando...' : 'Deletar'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 line-clamp-2">
                {agent.description}
              </CardDescription>
              
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex justify-between">
                  <span>Temperatura:</span>
                  <span>{agent.temperature}</span>
                </div>
                <div className="flex justify-between">
                  <span>Criado:</span>
                  <span>{new Date(agent.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              
              <button
                onClick={() => openQRModal(agent)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Smartphone className="h-4 w-4" />
                <span>Conectar</span>
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal do QR Code */}
      <QRCodeModal 
        isOpen={qrModalOpen}
        onClose={closeQRModal}
        agent={selectedAgent}
      />
    </>
  )
}
