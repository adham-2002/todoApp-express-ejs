import GroupMember from "../models/groupMembersModel.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeature.js";
import jwt from "jsonwebtoken";
import { generateJoinToken } from "../utils/jwtUtils.js";
export const getGroupMembers = asyncHandler(async (req, res, next) => {
  console.log("hi");
  const groupsMembers = new ApiFeatures(
    GroupMember.find({ group: req.params.groupId }),
    req.query
  )
    .filter()
    .sort()
    .limitFields("")
    .search()
    .paginate();
  const groupMembers = await groupsMembers.mongooseQuery.populate(
    "user",
    "username email _id "
  );
  res.status(200).json({
    success: true,
    message: "Group members fetched successfully",
    pagination: groupsMembers.paginationResult,
    data: groupMembers,
  });
});
export const getGroupMember = asyncHandler(async (req, res, next) => {
  // get group member by id
  console.log(req.params);
  const groupMember = await GroupMember.findById(req.params.memberId).populate(
    "user",
    "username email _id role createdAt"
  );
  if (!groupMember) {
    return next(new ApiError("Group member not found", 404));
  }
  res.status(200).json({
    success: true,
    data: groupMember,
  });
});
// add group member
export const addGroupMember = asyncHandler(async (req, res, next) => {
  const { user, role, group } = req.body;
  //1) check if the user is already a member of the group
  const isMember = await GroupMember.findOne({
    user,
    group,
  });
  if (isMember) {
    return next(new ApiError("User is already a member of the group", 400));
  }
  const groupMember = await GroupMember.create({
    user,
    role,
    group,
  });
  res.status(201).json({
    success: true,
    data: groupMember,
  });
});
export const updateGroupMember = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  const groupMember = await GroupMember.findByIdAndUpdate(
    req.params.memberId,
    { role },
    { new: true }
  );
  if (!groupMember) {
    return next(new ApiError("Group member not found", 404));
  }
  res.status(200).json({
    success: true,
    data: groupMember,
  });
});
export const deleteGroupMember = asyncHandler(async (req, res, next) => {
  const groupMember = await GroupMember.findByIdAndDelete(req.params.memberId);
  if (!groupMember) {
    return next(new ApiError("Group member not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Group member deleted successfully",
  });
});
export const generateJoinLink = asyncHandler(async (req, res, next) => {
  const { groupId } = req.params;
  console.log(groupId);
  const joinToken = generateJoinToken(groupId);
  const joinLink = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/groups/join/${joinToken}`;
  res.status(200).json({
    success: true,
    message: "Join link generated successfully",
    data: joinLink,
  });
});
export const joinGroup = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return next(new ApiError("Invalid token please login again", 400));
  }
  const { groupId } = decoded;
  // check if the user is already a member of the group
  const isMember = await GroupMember.findOne({
    user: req.user._id,
    group: groupId,
  });
  if (isMember) {
    return next(new ApiError("User is already a member of the group", 400));
  }
  const groupMember = await GroupMember.create({
    user: req.user._id,
    role: "member",
    group: groupId,
  });
  res.status(200).json({
    success: true,
    message: "Member joined successfully",
    data: groupMember,
  });
});
