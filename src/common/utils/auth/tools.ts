import jwt from "jsonwebtoken";
import User from "../../Routes/users/userModel.js";

export const authenticate = async (user) => {
  const newAccessToken = await generateJWT({ _id: user._id });
  const newRefreshToken = await generateRefreshJWT({ _id: user._id });

  user.refreshToken = newRefreshToken;
  await user.save();

  return { token: newAccessToken, refreshToken: newRefreshToken };
};

const generateJWT = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30s" },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

export const verifyJWT = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    })
  );

const generateRefreshJWT = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const verifyRefreshToken = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    })
  );

export const refreshToken = async (oldRefreshToken) => {
//JWT VERSION WITH OUT OAUTH!
    //   const decoded = await verifyRefreshToken(oldRefreshToken);

//   const user = await User.findOne({ _id: decoded._id });

//   if (!user) {
//     throw new Error("Access is forbidden");
//   }

//   const currentRefreshToken = user.refreshToken;

//   if (currentRefreshToken !== oldRefreshToken) {
//     throw new Error("Refresh token is wrong");
//   }

//   const newAccessToken = await generateJWT({ _id: user._id });
//   const newRefreshToken = await generateRefreshJWT({ _id: user._id });

//   user.refreshToken = newRefreshToken;
//   await user.save();

//   return { token: newAccessToken, refreshToken: newRefreshToken };
  // 1. is the token expired or not valid?

  const content = await verifyRefreshToken(oldRefreshToken)

  // 2. if the token is valid we can move on with the refresh token flow

  const user = await UserModel.findById(content._id)

  if (!user) throw new Error("Token not valid!")

  if (user.refreshToken !== oldRefreshToken) throw new Error("Token not valid!")

  // 3. if everything is fine we need to generate a new pair of tokens

  const newAccessToken = await generateJWT({ _id: user._id })
  const newRefreshToken = await generateRefreshJWT({ _id: user._id })

  // 4. save new refresh token in db

  user.refreshToken = newRefreshToken

  await user.save()

  return { newAccessToken, newRefreshToken }
};