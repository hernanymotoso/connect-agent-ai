import axios from 'axios'

export const whatsappProviderApi = axios.create({
  baseURL: process.env.WHATSAPP_API_PROVIDER_URL
})

export const creativityAgentFunctionsApi = axios.create({
  baseURL: process.env.CREATIVITY_AGENT_FUNCTIONS_URL,
});
