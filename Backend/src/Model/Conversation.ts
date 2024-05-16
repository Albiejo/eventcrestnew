import { Document, Schema, model } from "mongoose";



export interface conversationDocument extends Document {
    members: string[];
    latestMessage:string;
    timestamps: Date;
}

const ConversationSchema = new Schema<conversationDocument>(
    {
        members: [String],
        latestMessage: String
    },
    {
        timestamps: true
    }
);

export default model<conversationDocument>("conversation", ConversationSchema);
