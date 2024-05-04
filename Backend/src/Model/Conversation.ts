import { Document, Schema, model } from "mongoose";

export interface conversationDocument extends Document {
    members: string[];
    latestMessageTimestamp:Date;
    timestamps: Date;
}

const ConversationSchema = new Schema<conversationDocument>(
    {
        members: [String],
        latestMessageTimestamp: Date
    },
    {
        timestamps: true
    }
);

export default model<conversationDocument>("conversation", ConversationSchema);
