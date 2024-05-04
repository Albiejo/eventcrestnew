import { Document, Schema, model } from "mongoose";

export interface MessageDocument extends Document {
    conversationId: string;
    senderId: string;
    text: string;
    imageName: string;
    imageUrl: string;
    createdAt: Date;
}

const MessageSchema = new Schema<MessageDocument>(
    {
        conversationId: String,
        senderId: String,
        text: String,
        imageName:String,
        imageUrl:String

    },
    {
        timestamps: true
    }
);

export default model<MessageDocument>("Message", MessageSchema);

