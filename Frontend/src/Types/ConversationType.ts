export interface conversation{
  members: string[];
  latestMessageTimestamp:Date;
  timestamps: Date;
}

export interface conversationType{
  _id:string;
  members: string[];
  latestMessageTimestamp:Date;
  timestamps: Date;
}