
// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import compression from "compression";
// import rateLimit from "express-rate-limit";
// import mongoose from "mongoose";
// import env from "./config/env";

// import connectDB from "./config/db";

// import authRoutes from "./routes/authRoutes";
// import airportRoutes from "./routes/airport.routes";
// import flightRoutes from "./routes/flight.routes";
// import placeRoutes from "./routes/placeRoute";
// import itineraryRoutes from "./routes/itinerary.routes";
// import { errorHandler } from "./middleware/errorHandler";

// connectDB();

// const app = express();
// if (env.NODE_ENV === 'production') {
//   app.set('trust proxy', 1);
// }
// app.use(express.json());
// app.use(helmet({
//   crossOriginResourcePolicy: false,
// }));
// app.use(compression());

// // CORS configuration
// const allowedOrigins = (env.CORS_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);
// app.use(cors({
//   origin: allowedOrigins.length ? allowedOrigins : undefined,
//   credentials: true,
// }));

// // Basic rate limiting for public endpoints
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 300,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);

// app.get("/api/health", (_req, res) => res.json({ ok: true }));
// app.get("/api/readiness", (_req, res) => {
//   const ready = mongoose.connection.readyState === 1; // connected
//   res.status(ready ? 200 : 503).json({ ready });
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/airports", airportRoutes);
// app.use("/api/flights", flightRoutes);
// app.use("/api/places", placeRoutes);
// app.use("/api/itineraries", itineraryRoutes);

// app.use(errorHandler);

// const PORT = Number(env.PORT || 5000);
// const server = app.listen(PORT, () =>{
//     console.log(`Server running on port ${PORT} (${env.NODE_ENV})`);
// });

// function shutdown(signal: string) {
//   console.log(`Received ${signal}. Shutting down gracefully...`);
//   server.close(async () => {
//     try {
//       await mongoose.disconnect();
//     } catch (e) {
//       // ignore
//     }
//     process.exit(0);
//   });
//   // Force exit after timeout
//   setTimeout(() => process.exit(1), 10000).unref();
// }

// process.on('SIGINT', () => shutdown('SIGINT'));
// process.on('SIGTERM', () => shutdown('SIGTERM'));




import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import env from "./config/env";
import connectDB from "./config/db";

import authRoutes from "./routes/authRoutes";
import airportRoutes from "./routes/airport.routes";
import flightRoutes from "./routes/flight.routes";
import placeRoutes from "./routes/placeRoute";
import itineraryRoutes from "./routes/itinerary.routes";
import { errorHandler } from "./middleware/errorHandler";

/* -------------------- DB -------------------- */
connectDB();

/* -------------------- APP -------------------- */
const app = express();

if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json());

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(compression());

/* -------------------- CORS (FIXED) -------------------- */
const allowedOrigins = (env.CORS_ORIGIN || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // allow Postman / server-to-server
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("❌ Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));


/* -------------------- RATE LIMIT (SAFE) -------------------- */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: req => req.method === "OPTIONS", // CRITICAL
});

app.use(limiter);

/* -------------------- HEALTH -------------------- */
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/readiness", (_req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ ready });
});

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/airports", airportRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/itineraries", itineraryRoutes);

/* -------------------- ERROR HANDLER -------------------- */
app.use(errorHandler);

/* -------------------- SERVER -------------------- */
const PORT = Number(env.PORT || 5000);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${env.NODE_ENV})`);
});

/* -------------------- SHUTDOWN -------------------- */
function shutdown(signal: string) {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    try {
      await mongoose.disconnect();
    } catch (_) {}
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));


