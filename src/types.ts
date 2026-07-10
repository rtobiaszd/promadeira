export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
}

export type Role = 'master_admin' | 'admin' | 'manager' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  tenantId: string;
}

export type ChannelType = 'whatsapp' | 'email' | 'telegram';

export interface EntryPoint {
  id: string;
  channel: ChannelType;
  name: string;
  identifier: string; // WhatsApp number, Email address, Telegram username
  status: 'active' | 'disconnected' | 'pending';
  chatbotMode: 'menu' | 'ai' | 'hybrid';
  chatbotConfig: ChatbotConfig;
  mappedPipelineId: string;
  mappedStageId: string;
}

export interface ChatbotConfig {
  menuFlow?: MenuFlow;
  aiPrompt?: string;
  aiTemperature?: number;
  aiFallbackStageId?: string;
}

export interface MenuFlow {
  initialStepId: string;
  steps: Record<string, MenuStep>;
}

export interface MenuStep {
  id: string;
  text: string;
  options: MenuOption[];
}

export interface MenuOption {
  key: string; // '1', '2', etc.
  label: string;
  nextStepId?: string;
  triggerWorkflowId?: string;
  moveToStageId?: string;
}

export type NodeType = 'trigger' | 'condition' | 'action' | 'ai' | 'delay';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  config: Record<string, any>;
  nextId?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  triggerType: 'message_received' | 'deal_stage_changed' | 'webhook_received' | 'scheduled';
  triggerConfig: Record<string, any>;
  startNodeId: string;
  nodes: Record<string, WorkflowNode>;
}

export interface Deal {
  id: string;
  title: string;
  contactName: string;
  contactPhone?: string;
  contactEmail?: string;
  value: number;
  pipelineId: string;
  stageId: string;
  assignedAgentId?: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, any>;
}

export interface StageAutomation {
  onEnterActions: StageAction[];
  conditions: StageCondition[];
  autoMoveStageId?: string;
  optionalAiPrompt?: string;
}

export interface StageAction {
  type: 'send_message' | 'create_jira_issue' | 'call_webhook' | 'assign_agent';
  config: Record<string, any>;
}

export interface StageCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export interface Stage {
  id: string;
  name: string;
  order: number;
  automation?: StageAutomation;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: Stage[];
}

export interface IntegrationProvider {
  id: string; // 'jira' | 'github' | 'webhook' | 'twilio' | 'telegram'
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'not_connected';
  credentials: Record<string, string>;
  supportedActions: {
    id: string;
    name: string;
    fields: { id: string; label: string; type: 'text' | 'password' | 'textarea' }[];
  }[];
}

export interface InboundLog {
  id: string;
  timestamp: string;
  source: string; // e.g. 'Jira Webhook', 'WhatsApp Inbound'
  payload: string; // JSON string
  matchedWorkflowId?: string;
  workflowStatus?: 'success' | 'failed' | 'running' | 'none';
  executionLog?: string[];
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  telegram?: string;
  companyName?: string;
  tags: string[];
  notes?: string;
}

export interface Appointment {
  id: string;
  title: string;
  contactId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  notes?: string;
}

export interface Message {
  id: string;
  sender: 'contact' | 'agent' | 'bot';
  senderName: string;
  text: string;
  timestamp: string;
  channel: ChannelType;
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  channel: ChannelType;
  lastMessageText: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'closed' | 'snoozed';
  messages: Message[];
}
