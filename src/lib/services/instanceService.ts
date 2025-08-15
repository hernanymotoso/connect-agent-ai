import { whatsappProviderApi } from "@/utils/api";
import { Prisma } from "@prisma/client";

type CreateInstanceParams = {
  name: string
  token?: string
  qrcode: boolean
  agentId: string
  userId: string
}

export class InstanceService {
  static async createInstanceWithTransaction(params: CreateInstanceParams, tx: Prisma.TransactionClient) {
    const createdInstance = await whatsappProviderApi.post(
      "/instance/create",
      {
        instanceName: params.name,
        integration: 'WHATSAPP-BAILEYS',
        qrcode: params.qrcode,
        token: params?.token,
      },
      { headers: { apiKey: process.env.WHATSAPP_API_PROVIDER_API_KEY } }
    );

    await tx.instance.create({
      data: {
        id: createdInstance.data.instance.instanceId,
        name: params.name,
        qrcode: params.qrcode,
        token: params?.token,
        agent_id: params.agentId,
        user_id: params.userId,
      },
    });
  }
}
