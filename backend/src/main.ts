import "dotenv/config";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import logger from "morgan";

// loute imports 😭
import userRouter from "./User/router";
import appRouter from "./app/router";
import wareHousestoreRouter from "./app/wareHousestore";
import storeSalesInventoryRouter from "./app/storeSalesInventory";

const app: Express = express();

// middleware
const corsOptions: cors.CorsOptions = {
  origin: "*", 
 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  credentials: true, // Allow credentials if needed
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));

// Handle preflight requests
app.options('*', cors(corsOptions));  // Handle OPTIONS for all routes

// routes 😂
app.use("/api/user", userRouter);
app.use("/api/A", appRouter);
app.use("/wareHousestore", wareHousestoreRouter);
app.use( storeSalesInventoryRouter);
app.get("/", (req: Request, res: Response) => {
  console.log(req.body);
  res.json("Api xcx Running 18:sddf");
}); 

app.listen(process.env.PORT, () => {
  console.log(`Server up and running on http://localhost:${process.env.PORT}`);
});
