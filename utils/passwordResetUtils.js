import crypto from "crypto";

//1) Generate reset code
const generateResetCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
//2) Hash reset code with sha256
const hashCode = (code) =>
  crypto.createHash("sha256").update(code).digest("hex");
//3) Save reset code to user
const saveResetCodeToUser = async (user, hashedCode) => {
  user.passwordResetCode = hashedCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  // console.log(user);
  await user.save();
};
// export
export { generateResetCode, hashCode, saveResetCodeToUser };
