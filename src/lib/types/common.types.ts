export interface ProfileDetails {
  id: string /* primary key */;
  first_name: string;
  last_name: string;
  full_name?: string;
  avatar_url?: string;
}

export enum IConversationSpeaker {
  System = "system",
  User = "user",
  Assistant = "assistant",
  Function = "function",
}
