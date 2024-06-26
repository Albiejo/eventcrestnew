export interface conversation{
  _id:string;
  members: string[];
  latestMessageTimestamp:Date;
  latestMessage:string;
  timestamps: Date;
  updatedAt: Date;
}

export interface conversationType{
  _id:string;
  members: string[];
  latestMessageTimestamp:Date;
  latestMessage:string;
  timestamps: Date;
  updatedAt: Date;
}


export interface ConversationProps {
  conversation: conversationType;
  currentUser: { _id: string };
}