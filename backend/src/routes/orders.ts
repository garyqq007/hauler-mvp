import express from "express";
import { prisma } from "../prismaClient";
import { haversineKm, calcPriceCents } from "../utils/price";
import { auth } from "../middleware/auth";
import { getDrivingDistanceKm } from "../utils/google";

const router = express.Router();

router.post("/", auth(["CUSTOMER"]), async (req: any, res) => {
  const { pickupLat, pickupLng, dropoffLat, dropoffLng, pickupAddress, dropoffAddress, vehicleType } = req.body;

  const distanceKm = await getDrivingDistanceKm(
    pickupLat,
    pickupLng,
    dropoffLat,
    dropoffLng
  );


  const priceCents = calcPriceCents(distanceKm, vehicleType);

  const order = await prisma.order.create({
    data: {
      customerId: req.user.id,
      pickupAddress,
      dropoffAddress,
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng,
      vehicleType,
      distanceKm,
      priceCents
    }
  });

  res.json(order);
});

//Customer: get my order
router.get("/my-customer", auth(["CUSTOMER"]), async (req: any, res) => {
  const orders = await prisma.order.findMany({
    where: {
      customerId: req.user.id
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  res.json(orders);
});

//customer get active order 非完成的订单
router.get("/my-active-customer", auth(["CUSTOMER"]), async (req: any, res) => {
  const orders = await prisma.order.findMany({
    where: {
      customerId: req.user.id,
      status: {
        in: ["CREATED", "ACCEPTED", "ON_THE_WAY"]
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  res.json(orders);
});

//customer get completed order 用户已完成的订单
router.get("/my-history-customer", auth(["CUSTOMER"]), async (req: any, res) => {
  const orders = await prisma.order.findMany({
    where: {
      customerId: req.user.id,
      status: "DELIVERED"
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  res.json(orders);
});


// Driver: get my active accepted orders
router.get("/my-active", auth(["DRIVER"]), async (req: any, res) => {
  const orders = await prisma.order.findMany({
    where: {
      driverId: req.user.id,
      status: {
        in: ["ACCEPTED", "ON_THE_WAY"]
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  res.json(orders);
});

//Driver: get my history finish orders 
router.get("/my-history", auth(["DRIVER"]), async (req: any, res) => {
  const orders = await prisma.order.findMany({
    where: {
      driverId: req.user.id,
      status: "DELIVERED"
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  res.json(orders);
});

router.get("/open", auth(["DRIVER"]), async (_, res) => {
  const orders = await prisma.order.findMany({
    where: { status: "CREATED" }
  });
  res.json(orders);
});

router.post("/:id/accept", auth(["DRIVER"]), async (req: any, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id }
  });

  if (!order || order.status !== "CREATED")
    return res.status(400).json({ error: "Not available" });

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status: "ACCEPTED", driverId: req.user.id }
  });

  res.json(updated);
});

router.post("/:id/status", auth(["DRIVER"]), async (req: any, res) => {
  const { status } = req.body;
  const order = await prisma.order.findUnique({
    where: { id: req.params.id }
  });

  if (!order || order.driverId !== req.user.id)
    return res.status(403).json({ error: "Forbidden" });

  const flow: any = {
    ACCEPTED: ["ON_THE_WAY"],
    ON_THE_WAY: ["DELIVERED"]
  };

  if (!flow[order.status]?.includes(status))
    return res.status(400).json({ error: "Invalid transition" });

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status }
  });

  res.json(updated);
});

export default router;
