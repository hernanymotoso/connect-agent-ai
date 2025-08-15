import { NextRequest, NextResponse } from 'next/server'
import { whatsappProviderApi } from '@/utils/api'

export async function POST(req: NextRequest) {
  try {
    const { agentId } = await req.json()
    
    const response = await whatsappProviderApi.get(`/instance/connect/${agentId}`, {
      headers: {
        "apiKey": process.env.WHATSAPP_API_PROVIDER_API_KEY
      }
    })
    
    return NextResponse.json({
      qrCode: response.data.base64,
      instanceId: response.data.instanceId
    })
    
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar QR Code' }, 
      { status: 500 }
    )
  }
}
