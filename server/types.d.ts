/**
 * Backend Data Structure Type Safety Definitions (TODO 11)
 */

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string; // Hashed string, excluded in select queries
  role: 'student' | 'faculty' | 'admin';
  registrationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedUser: string | IUser | null; // Mongoose ObjectId reference
  createdAt: Date;
  updatedAt: Date;
}

export interface IAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  date: Date;
}
