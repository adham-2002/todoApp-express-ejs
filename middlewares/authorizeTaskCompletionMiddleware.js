// this is a middleware function that checks if the user is assigned to the task they are trying to complete. If the user is not assigned to the task, the middleware will return a 403 Forbidden response. Otherwise, it will call the next middleware function in the chain.
const authorizeTaskCompletion = async (req, res, next) => {
  const taskId = req.params.taskId;
  const userId = req.user.id;

  const isAssigned = await TaskAssignment.exists({
    task: taskId,
    assignedTo: userId,
    isActive: true,
  });

  if (!isAssigned) return res.status(403).json({ error: "Not task assignee" });
  next();
};
