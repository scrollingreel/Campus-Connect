import { getUsers, getUserById, updateUser, deleteUser } from '../api'

export const userService = {
  getAll: async () => {
    try {
      const response = await getUsers()
      return response.data
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Failed to load users.')
    }
  },

  getById: async (id) => {
    try {
      const response = await getUserById(id)
      return response.data
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Failed to load user.')
    }
  },

  update: async (id, data) => {
    try {
      const response = await updateUser(id, data)
      return response.data
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Failed to update user.')
    }
  },

  remove: async (id) => {
    try {
      const response = await deleteUser(id)
      return response.data
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Failed to delete user.')
    }
  },
}
