const logger  = require('../utils/logger');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const Task    = require('../models/Task');

const getTasks = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.userId) filter.assignedUser = req.query.userId;

    const tasks = await Task.find(filter)
      .populate('assignedUser', 'name email')
      .sort({ createdAt: -1 });

    logger.info('Tasks list retrieved', { count: tasks.length });
    sendSuccess(res, 200, 'Tasks retrieved successfully.', { count: tasks.length, tasks });
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedUser', 'name email');
    if (!task) {
      return sendError(res, 404, 'Task not found.');
    }
    sendSuccess(res, 200, 'Task retrieved successfully.', { task });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, assignedUser } = req.body;

    if (!title) {
      return sendError(res, 400, 'Task title is required.');
    }

    const task = await Task.create({
      title,
      description,
      status,
      assignedUser: assignedUser || req.user.id,
    });
    await task.populate('assignedUser', 'name email');

    logger.info('Task created', { taskId: task._id, title: task.title });
    sendSuccess(res, 201, 'Task created successfully.', { task });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map((e) => e.message).join(' ');
      return sendError(res, 400, msg);
    }
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, assignedUser } = req.body;
    const updates = {};
    if (title !== undefined)        updates.title        = title;
    if (description !== undefined)  updates.description  = description;
    if (status !== undefined)       updates.status       = status;
    if (assignedUser !== undefined) updates.assignedUser = assignedUser || null;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('assignedUser', 'name email');

    if (!task) {
      return sendError(res, 404, 'Task not found.');
    }

    logger.info('Task updated', { taskId: task._id });
    sendSuccess(res, 200, 'Task updated successfully.', { task });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map((e) => e.message).join(' ');
      return sendError(res, 400, msg);
    }
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return sendError(res, 404, 'Task not found.');
    }
    logger.info('Task deleted', { taskId: req.params.id });
    sendSuccess(res, 200, 'Task deleted successfully.', {});
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
