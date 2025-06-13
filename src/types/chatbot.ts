export interface Chatbot {
  id: string;
  name: string;
  welcomeMessage: string;
  logoUrl: string | null;
  colorScheme: string;
  widgetPosition: string;
  apiKey: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  trainingSources?: TrainingSource[];
}

export interface TrainingSource {
  id: string;
  type: string;
  url?: string;
  filename?: string;
  status: string;
  progress: number;
  extractedContent?: string;
  extractedUrls?: string[];
  createdAt: string;
  updatedAt: string;
  chatbotId: string;
}