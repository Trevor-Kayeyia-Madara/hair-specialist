import express, { json } from "express";
import cors from "cors";
import { createUserTable } from "./models/User";

import authRoutes from "./routes/auth";
import specialistRoutes from "./routes/specialist";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());

app.use("/auth", authRoutes);
app.use("/specialists", specialistRoutes);

app.listen(PORT, async () => {
  await createUserTable();
  console.log(`Server running on port ${PORT}`);
});
