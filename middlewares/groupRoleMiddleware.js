import GroupMember from "../models/groupMembersModel.js";
import Group from "../models/groupModel.js";
import apiError from "../utils/apiError.js";
import logger from "../utils/logger.js";
const checkGroupRole = (roles) => {
  return async (req, res, next) => {
    const groupMember = await GroupMember.findOne({
      user: req.user._id,
      group: req.params.groupId,
    });
    if (!groupMember || !roles.includes(groupMember.role)) {
      return next(
        new apiError("You are not allowed to access this route", 403)
      );
    }
    next();
  };
};

export default checkGroupRole;
