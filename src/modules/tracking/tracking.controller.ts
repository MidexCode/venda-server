import { Request, Response } from "express";
import * as TrackingService from "./tracking.service";

export const getTrackingEvents = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const order = await TrackingService.getTrackingEvents(
    req.params.orderId as string,
    req.user!.id,
  );
  res.json({ success: true, data: order });
};
