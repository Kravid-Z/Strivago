import express from "express";
import UserModel from "../../models/user/userModel";
import { authenticate, refreshToken } from "../../Common/auth/tools.js";
import { jwtAuthMiddleware } from "../../Common/auth/index.js";
import passport from "passport";

const loginRouter = express.Router();

loginRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.checkCredentials(email, password);
    const tokens = await authenticate(user);
    res.send(tokens);
  } catch (error) {
    next(error);
  }
});
// //REFRESH TOKEN IN LOCAL STORAGE
// loginRouter.post("/refreshToken", async (req, res, next) => {
//   const oldRefreshToken = req.body.refreshToken;
//   if (!oldRefreshToken) {
//     const err = new Error("Refresh token missing");
//     err.statusCode = 400;
//     next(err);
//   } else {
//     try {
//       const newTokens = await refreshToken(oldRefreshToken);
//       res.send(newTokens);
//     } catch (error) {
//       console.log(error);
//       const err = new Error(error);
//       err.statusCode = 401;
//       next(err);
//     }
//   }
// });

// REFRESH TOKEN WITH COOKIES
loginRouter.post("/refreshToken", async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    // 1. We need to check the validity and integrity of the old refresh token, if ok we are going to generate a new pair of access + refresh token
    const tokens = await refreshToken(oldRefreshToken);
    // 2. Send back the new tokens
    res.cookie("accessToken", tokens.accessToken, {
      sameSite: "lax",
      httpOnly: true,
    });

    // LOCAL ENVIRONMENT --> sameSite:"lax", httpOnly:true, PRODUCTION ENVIRONMENT (with 2 different domains) --> sameSite:"none", secure: true, httpOnly: true
    res.cookie("refreshToken", tokens.refreshToken, {
      sameSite: "lax",
      httpOnly: true,
    });
    res.send();
    tokens;
  } catch (error) {
    console.log(error);
    const err = new Error("Please login again!");

    err.statusCode = 401;
    next(err);
  }
});

loginRouter.post("/logout", jwtAuthMiddleware, async (req, res, next) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.send("Logged out!");
  } catch (error) {
    next(error);
  }
});

// **************** GOOGLE OAUTH *******************************
loginRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

loginRouter.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      // res.send(req.user.tokens)
      res.cookie("accessToken", req.user.tokens.accessToken, {
        sameSite: "lax",
        httpOnly: true,
      });

      // LOCAL ENVIRONMENT --> sameSite:"lax", PRODUCTION ENVIRONMENT (with 2 different domains) --> sameSite:"none", secure: true
      res.cookie("refreshToken", req.user.tokens.refreshToken, {
        sameSite: "lax",
        httpOnly: true,
      });
      res.status(200).redirect("http://localhost:3000");
    } catch (error) {
      next(error);
    }
  }
);

export default loginRouter;