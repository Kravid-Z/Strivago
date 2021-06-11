import express, { Express, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import passport from "passport";
import oauth from "./common/utils/auth/oauth";
import cookieParser from "cookie-parser";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import {
  notFoundErrorHandler,
  unauthorizedErrorHandler,
  badRequestErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorHandler,
} from "./common/errorHandler";
import mainRouter from "./routes";
import ErrorResponse from "./common/errorResponse";

const server: Express = express();

const PORT = process.env.PORT || 5000;

// const whiteList = [process.env.FE_URL_DEV, process.env.FE_URL_PROD];

// const corsOptions = {
//   origin: function (origin: string, next: NextFunction) {
//     if (whiteList.indexOf(origin) !== -1) {
//       console.log("ORIGIN: ", origin);

//       next();
//     } else {
//       next(new ErrorResponse(403, `NOT ALLOWED BY CORS`));
//     }
//   },
// };
server.use(express.json());
server.use(cookieParser());
// server.use(cors({ origin: "http://localhost:3000", credentials: true }));
server.use(passport.initialize());
server.use(cors());
server.use(mainRouter);

//GENERAL ERRORS
server.use(notFoundErrorHandler);
server.use(badRequestErrorHandler);
server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(catchAllErrorHandler);


const { MONGODB_URL } = process.env
//Why throwing this error fix problem undefine type for MONGODB_URL ??????
if (!MONGODB_URL) {
  throw new ErrorResponse(500,"No .env configured.")
}
mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() =>
    server.listen(PORT, () => {
      console.table(listEndpoints(server));
      console.log(
        "\u001b[" +
          35 +
          "m" +
          "Server is running on port: " +
          PORT +
          "\u001b[0m"
      );
    })
  )
  .catch((err) => console.log(err));
