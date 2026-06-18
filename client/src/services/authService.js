import { registerUser, loginUser } from '../api'

export const authService = {
  register: async (data) => {
    try {
      const response = await registerUser(data)
      return response.data
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Registration failed. Please try again.')
    }
  },

  login: async (data) => {
    try {
      const response = await loginUser(data)
      return response.data
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Login failed. Please try again.')
    }
  },
}
