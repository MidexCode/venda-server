import { Request, Response } from "express";
import * as AIService from "./ai.service";

export const aiSearch = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.body;
  if (!query) {
    res.status(400).json({ success: false, message: "Query is required" });
    return;
  }
  const results = await AIService.aiSearch(query);
  res.json({ success: true, data: results });
};

export const getRecommendations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const results = await AIService.getRecommendations(req.user!.id);
  res.json({ success: true, data: results });
};

export const chatAssistant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ success: false, message: "Message is required" });
    return;
  }
  const reply = await AIService.chatAssistant(message, req.user!.id);
  res.json({ success: true, data: { reply } });
};
