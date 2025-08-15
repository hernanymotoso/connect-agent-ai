'use client'

import { useState } from 'react'
import { QrCode, Smartphone, Wifi, X, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react'
import { whatsappProviderApi } from '@/utils/api'

interface Agent {
  id: string
  name: string
  description: string
  status: 'ACTIVE' | 'INACTIVE'
  temperature: number
  createdAt: string
  updatedAt: string
}

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  agent: Agent | null
}

export function QRCodeModal({ isOpen, onClose, agent }: QRCodeModalProps) {
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'generating' | 'waiting' | 'connected' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [instanceId, setInstanceId] = useState<string | null>(null)

  const generateQRCode = async () => {
    if (!agent) return

    setConnectionStatus('generating')
    setError(null)

    try {
      const response = await fetch('/api/whatsapp/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: agent.id,
        }),
      })
          
      const data = await response.json()
      
      const base64Image = data.qrCode      

      setQrCodeBase64(base64Image)
      setInstanceId(agent.id)
      setConnectionStatus('waiting')

      pollConnectionStatus(agent.id)
      
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setConnectionStatus('error')
    }
  }

  const pollConnectionStatus = (instanceId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/whatsapp/status/${instanceId}`)
        
        if (!response.ok) {
          throw new Error('Erro ao verificar status')
        }
        
        const data = await response.json()
        
        if (data.connected === true) {
          setConnectionStatus('connected')
          clearInterval(pollInterval)
          
          setTimeout(() => {
            handleClose()
            console.log('WhatsApp conectado com sucesso!')
          }, 2000)
        }
        
        if (data.status === 'qr_expired') {
          clearInterval(pollInterval)
          setError('QR Code expirou. Gerando um novo...')
          setTimeout(() => {
            generateQRCode()
          }, 1000)
        }
        
      } catch (error) {
        console.error('Erro ao verificar status:', error)
      }
    }, 3000) 

    const timeout = setTimeout(() => {
      clearInterval(pollInterval)
      if (connectionStatus === 'waiting') {
        setConnectionStatus('error')
        setError('Tempo limite excedido. O QR Code pode ter expirado.')
      }
    }, 120000) // 2 minutos

    const checkConnected = setInterval(() => {
      if (connectionStatus === 'connected') {
        clearTimeout(timeout)
        clearInterval(checkConnected)
      }
    }, 1000)
  }

  const handleClose = () => {
    setQrCodeBase64(null)
    setConnectionStatus('idle')
    setError(null)
    setInstanceId(null)
    onClose()
  }

  const handleRetry = () => {
    setConnectionStatus('idle')
    setError(null)
    setQrCodeBase64(null)
    setInstanceId(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Conectar WhatsApp</h2>
              <p className="text-sm text-gray-500">{agent?.name}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Steps */}
          <div className="space-y-3">
            <div className={`flex items-center space-x-3 p-3 rounded-lg ${
              connectionStatus === 'generating' ? 'bg-blue-50 border border-blue-200' :
              connectionStatus === 'waiting' || connectionStatus === 'connected' ? 'bg-green-50 border border-green-200' :
              'bg-gray-50 border border-gray-200'
            }`}>
              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                connectionStatus === 'generating' ? 'bg-blue-500' :
                connectionStatus === 'waiting' || connectionStatus === 'connected' ? 'bg-green-500' :
                'bg-gray-300'
              }`}>
                {connectionStatus === 'generating' ? (
                  <RefreshCw className="h-3 w-3 text-white animate-spin" />
                ) : connectionStatus === 'waiting' || connectionStatus === 'connected' ? (
                  <CheckCircle2 className="h-3 w-3 text-white" />
                ) : (
                  <span className="text-white text-xs">1</span>
                )}
              </div>
              <span className="text-sm font-medium">Gerar QR Code</span>
            </div>

            <div className={`flex items-center space-x-3 p-3 rounded-lg ${
              connectionStatus === 'waiting' ? 'bg-blue-50 border border-blue-200' :
              connectionStatus === 'connected' ? 'bg-green-50 border border-green-200' :
              'bg-gray-50 border border-gray-200'
            }`}>
              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                connectionStatus === 'waiting' ? 'bg-blue-500' :
                connectionStatus === 'connected' ? 'bg-green-500' :
                'bg-gray-300'
              }`}>
                {connectionStatus === 'waiting' ? (
                  <QrCode className="h-3 w-3 text-white" />
                ) : connectionStatus === 'connected' ? (
                  <CheckCircle2 className="h-3 w-3 text-white" />
                ) : (
                  <span className="text-white text-xs">2</span>
                )}
              </div>
              <span className="text-sm font-medium">Escanear com WhatsApp</span>
            </div>

            <div className={`flex items-center space-x-3 p-3 rounded-lg ${
              connectionStatus === 'connected' ? 'bg-green-50 border border-green-200' :
              'bg-gray-50 border border-gray-200'
            }`}>
              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                connectionStatus === 'connected' ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {connectionStatus === 'connected' ? (
                  <Wifi className="h-3 w-3 text-white" />
                ) : (
                  <span className="text-white text-xs">3</span>
                )}
              </div>
              <span className="text-sm font-medium">Conectado!</span>
            </div>
          </div>

          {/* QR Code Area */}
          {connectionStatus === 'idle' && (
            <div className="text-center py-8">
              <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Conecte seu WhatsApp
              </h3>
              <p className="text-gray-600 mb-6">
                Clique no botão abaixo para gerar o QR Code e conectar seu WhatsApp ao agente.
              </p>
              <button
                onClick={generateQRCode}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
              >
                <QrCode className="h-5 w-5" />
                <span>Gerar QR Code</span>
              </button>
            </div>
          )}

          {connectionStatus === 'generating' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Gerando QR Code...
              </h3>
              <p className="text-gray-600">
                Aguarde enquanto preparamos a conexão.
              </p>
            </div>
          )}

          {connectionStatus === 'waiting' && qrCodeBase64 && (
            <div className="text-center space-y-4">
              {/* QR Code Base64 */}
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                <img 
                  src={qrCodeBase64} 
                  alt="QR Code WhatsApp" 
                  className="w-48 h-48 mx-auto"
                  onError={(e) => {
                    console.error('Erro ao carregar QR Code:', e)
                    setError('Erro ao carregar QR Code')
                    setConnectionStatus('error')
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">
                  Escaneie o QR Code
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>1. Abra o WhatsApp no seu celular</p>
                  <p>2. Toque em <strong>Menu (⋮)</strong> e depois em <strong>Dispositivos conectados</strong></p>
                  <p>3. Toque em <strong>Conectar um dispositivo</strong></p>
                  <p>4. Aponte o celular para esta tela para escanear o código</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Aguardando conexão...</span>
              </div>
              
              {/* Botão para regenerar QR Code */}
              <button
                onClick={generateQRCode}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                QR Code não apareceu? Clique para gerar novamente
              </button>
            </div>
          )}

          {connectionStatus === 'connected' && (
            <div className="text-center py-8">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Conectado com sucesso!
              </h3>
              <p className="text-gray-600">
                Seu WhatsApp foi conectado ao agente <strong>{agent?.name}</strong>.
              </p>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="text-center py-8">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Erro na conexão
              </h3>
              <p className="text-gray-600 mb-4">
                {error || 'Não foi possível conectar o WhatsApp. Tente novamente.'}
              </p>
              <button
                onClick={handleRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


