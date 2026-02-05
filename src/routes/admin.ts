import express from "express";
import { prisma } from "../prismaClient";
import { auth } from "../middleware/auth";

const router = express.Router();

router.get("/orders", auth(["ADMIN"]), async (_, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" }
  });
  res.json(orders);
});

router.patch("/orders/:id", auth(["ADMIN"]), async (req, res) => {
  const updated = await prisma.order.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(updated);
});

export default router;
