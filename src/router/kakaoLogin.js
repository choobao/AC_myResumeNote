import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { Prisma } from "@prisma/client";
import dotenv from "dotenv";
import qs from "qs";
import cookieParser from "cookie-parser";
import axios from "axios";
import jwt from "jsonwebtoken";

dotenv.config(); //process.env.

const router = express.Router();



export default router;
