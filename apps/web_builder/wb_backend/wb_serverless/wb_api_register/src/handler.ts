import cors from "cors";
import express, { Application } from "express";
import compression from "compression";
import bodyParser from 'body-parser';

import { APIGatewayProxyEvent, Context } from 'aws-lambda';
const serverless = require('serverless-http');

import { loadEnvConfig } from "@kis/common/src/utils/config";
import { registerHandler } from "./register-handler";

loadEnvConfig();

const app: Application = express();

const router = express.Router();
router.use(compression());
router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// body-parser
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Register routes
router.post("/register", registerHandler);

// Add routes to app
app.use("/", router);

// Initialize serverless-http
const handler = serverless(app);

export const start = async (event: APIGatewayProxyEvent, context: Context) => {
  return handler(event, context);
};