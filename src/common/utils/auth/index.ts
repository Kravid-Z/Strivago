// import atob from "atob";
import { Request, Response, NextFunction } from 'express'
import UserModel from "../../../models/user/userModel";
import ErrorResponse from "../../errorResponse";
import { verifyJWT } from "./tools.js"



//-----> ************* BASIC AUTH **************** <-------------//

// export const basicAuthMiddleware = async (req, res, next) => {
//   if (!req.headers.authorization) {
//     // if you don't provide credentials you are getting a 401
//     const error = new Error("Please provide auth!");
//     error.statusCode = 401;
//     next(error);
//   } else {
//     const decoded = atob(req.headers.authorization.split(" ")[1]);
//     const [email, password] = decoded.split(":");

//     // check the credentials

//     const user = await UserModel.checkCredentials(email, password);
//     if (user) {
//       req.user = user;
//       next();
//     } else {
//       const error = new Error("Credentials are wrong");
//       error.statusCode = 401;
//       next(error);
//     }
//   }
// };


//-----> ************* JWT AUTH **************** <-------------//
export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "")
    const decoded = await verifyJWT(token)
    if(!decoded) throw new ErrorResponse (500, "could verify user")
    
    const user = await UserModel.findOne({
      _id: decoded._id,
    })

    if (!user) {
      throw new ErrorResponse(400, "Sorry user not found")
    }

    req.user = user
    next()
  } catch (e) {
    console.log(e)
    const err = new ErrorResponse(401,"Please authenticate")
    next(err)
  }
}


export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role === "Admin") {
    next();
  } else {
    const error = new ErrorResponse(403,"Admin Only");

    next(error);
  }
};