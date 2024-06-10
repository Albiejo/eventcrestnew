import { Response } from "express";
import { CustomError } from "../Error/CustomError";

export function handleError(res: Response, error: any, contextMessage: string): void {
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({ message: error.message });
  } else {
    console.error(`${contextMessage}:`, error);
    res.status(500).json({ message: error.message});
  }
}