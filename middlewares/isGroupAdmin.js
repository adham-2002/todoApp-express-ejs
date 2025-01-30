import GroupMember from "../models/groupMembersModel.js";
import Group from "../models/groupModel.js";
import apiError from "../utils/apiError.js";
import logger from "../utils/logger.js";
const isGroupAdmin = async (req, res, next) => {
  const groupMember = await GroupMember.findOne({
    user: req.user._id,
    group: req.params.id,
    role: "admin",
  });

  if (!groupMember) {
    return next(new apiError("Group not exists or you are not admin", 401));
  }
  next();
};
export default isGroupAdmin;
