import { whatsappProviderApi } from '@/utils/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { instanceId: string } }
) {
  try {
    const response = await whatsappProviderApi.get(`/instance/connectionState/${params.instanceId}`, { 
      headers: {
        "apiKey": process.env.WHATSAPP_API_PROVIDER_API_KEY
      }
    })
    
    return NextResponse.json({
      connected: response.data.instance.state === 'open',
      status: response.data.instance.state
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao verificar status' }, 
      { status: 500 }
    )
  }
}
