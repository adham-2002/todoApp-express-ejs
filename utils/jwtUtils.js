import jwt from "jsonwebtoken";
// Access Token : short-lived token 15 min
// Refresh Token : long-lived token 7-30 day
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
export const generateJoinToken = (groupId) => {
  // console.log(process.env.JWT_SECRET_KEY);
  return jwt.sign({ groupId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};
