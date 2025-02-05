import GroupMember from "../models/groupMembersModel.js";
import apiError from "../utils/apiError.js";
const authorizeGroupAdmin = (roles) => {
  return async (req, res, next) => {
    const groupId = req.params.groupId || req.body.groupId;
    const userId = req.user._id;
    const groupMember = await GroupMember.findOne({
      user: userId,
      group: groupId,
    });
    if (!groupMember || !roles.includes(groupMember.role)) {
      return next(
        new apiError(
          `Group not exits or you are not a ${roles} of the group`,
          403
        )
      );
    }
    // req.member = groupMember;
    next();
  };
};

export default authorizeGroupAdmin;
