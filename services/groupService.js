import asyncHandler from "express-async-handler";
import Group from "../models/groupModel.js";
import apiError from "../utils/apiError.js";
import GroupMember from "../models/groupMembersModel.js";
import ApiFeatures from "../utils/apiFeature.js";
//! @desc get Groups created by the logged in user
// @Route POST /api/v1/groups
// @access Private admin
export const getGroups = asyncHandler(async (req, res, next) => {
  // 1) find all the groups created by the logged in user
  const groups = await GroupMember.find({
    user: req.user._id,
  }).populate("group");
  res.status(200).json({
    status: "success",
    message: "Groups fetched successfully",
    data: groups,
  });
});
export const getGroup = asyncHandler(async (req, res, next) => {
  // 1) find all the groups created by the logged in user
  const group = await Group.findById(req.params.groupId);
  res.status(200).json({
    status: "success",
    message: "Group fetched successfully",
    data: group,
  });
});
//! @desc create Group
// @Route POST /api/v1/groups
// @access public group admin
export const createGroup = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  //1) create group with the name and description
  const group = await Group.create({
    name,
    description,
    createdBy: req.user._id,
  });
  //2) Create a admin group member with the user id and group id and role as admin
  const groupMember = await GroupMember.create({
    user: req.user._id,
    group: group._id,
    role: "admin",
  });
  res.status(200).json({
    status: "success",
    message: "Group created successfully",
    data: group,
  });
});
//! @desc update Group
// @Route PUT /api/v1/groups/:id
// @access private admin of the group only
export const updateGroup = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  // 1) find the group by id
  const group = await Group.findById(req.params.groupId);
  if (!group) {
    return next(new apiError("Group not found", 404));
  }
  // 2) check if the user is the admin of the group handled by middleware

  // 3) update the group
  group.name = name;
  group.description = description;
  await group.save();
  res.status(200).json({
    status: "success",
    message: "Group updated successfully",
    data: group,
  });
});
//! @desc delete Group
// @Route DELETE /api/v1/groups/:id
// @access private admin of the group only
export const deleteGroup = asyncHandler(async (req, res, next) => {
  // 1) find the group by id
  const group = await Group.findById(req.params.groupId);
  if (!group) {
    return next(new apiError("Group not found", 404));
  }
  // 2) check if the user is the admin of the group handled by middleware

  // 3) delete the group
  await Group.findByIdAndDelete(req.params.groupId);
  // 4) delete all the group members of the group
  await GroupMember.deleteMany({ group: req.params.groupId });
  res.status(200).json({
    status: "success",
    message: "Group deleted successfully",
  });
});
