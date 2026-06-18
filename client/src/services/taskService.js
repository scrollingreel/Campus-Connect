import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../api'

export const taskService = {
  getAll: async (userId) => {
    try {
      const response = await getTasks(userId)
      return response.data
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Failed to load tasks.')
    }
  },

  getById: async (id) => {
    try {
      const response = await getTaskById(id)
      return response.data
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Failed to load task.')
    }
  },

  create: async (data) => {
    try {
      const response = await createTask(data)
      return response.data
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Failed to create task.')
    }
  },

  update: async (id, data) => {
    try {
      const response = await updateTask(id, data)
      return response.data
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Failed to update task.')
    }
  },

  remove: async (id) => {
    try {
      const response = await deleteTask(id)
      return response.data
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Failed to delete task.')
    }
  },
}
