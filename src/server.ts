import app from "./app";
import { startTrackingJob } from "./jobs/trackingJob";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Venda server running on http://localhost:${PORT}`);
  startTrackingJob();
});
