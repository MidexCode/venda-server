import cron from "node-cron";
import { advanceOrderStatus } from "../modules/tracking/tracking.service";

export const startTrackingJob = () => {
  cron.schedule("*/2 * * * *", async () => {
    console.log("Running tracking job...");
    await advanceOrderStatus();
  });

  console.log("Tracking cron job started");
};
