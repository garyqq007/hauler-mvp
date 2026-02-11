import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth";
import orderRoutes from "./routes/orders";
import adminRoutes from "./routes/admin";

const app = express();
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_, res) => res.send("Hauler MVP API"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
