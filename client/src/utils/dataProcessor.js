/**
 * Data Processing Utilities for CampusConnect
 * Uses modern ES6+ array methods (find, filter, reduce) for efficient operations.
 */

/**
 * Finds a specific student by ID in the students list.
 * (TODO 15: Finding a specific student)
 * @param {Array} students 
 * @param {string} id 
 * @returns {Object|undefined}
 */
export const findStudentById = (students, id) => {
  return students.find(s => s._id === id || s.id === id);
};

/**
 * Filters tasks to locate incomplete ones (pending or in-progress).
 * (TODO 15: Locating incomplete tasks)
 * @param {Array} tasks 
 * @returns {Array}
 */
export const getIncompleteTasks = (tasks) => {
  return tasks.filter(t => t.status !== 'completed');
};

/**
 * Counts the total number of completed tasks.
 * (TODO 15: Counting completed tasks)
 * @param {Array} tasks 
 * @returns {number}
 */
export const countCompletedTasks = (tasks) => {
  return tasks.reduce((count, task) => {
    return task.status === 'completed' ? count + 1 : count;
  }, 0);
};

/**
 * Groups tasks by their status.
 * (TODO 15: Grouping tasks by status)
 * @param {Array} tasks 
 * @returns {Object} { pending: number, 'in-progress': number, completed: number }
 */
export const groupTasksByStatus = (tasks) => {
  return tasks.reduce(
    (groups, task) => {
      const status = task.status;
      if (status in groups) {
        groups[status]++;
      } else {
        groups[status] = 1;
      }
      return groups;
    },
    { pending: 0, 'in-progress': 0, completed: 0 }
  );
};

/**
 * Generates a full summary of task counts.
 * (TODO 15: Generating dashboard summaries)
 * @param {Array} tasks 
 * @returns {Object} { total: number, pending: number, inProgress: number, completed: number }
 */
export const generateTaskSummary = (tasks) => {
  const groups = groupTasksByStatus(tasks);
  return {
    total: tasks.length,
    pending: groups.pending,
    inProgress: groups['in-progress'] || 0,
    completed: groups.completed
  };
};
