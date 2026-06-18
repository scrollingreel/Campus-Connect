const { sendSuccess } = require('../utils/apiResponse');

const announcements = [
  { id: 1, title: 'Semester Registration Open', content: 'Course registration for Fall 2025 is now open. Log in to the portal to register your courses before July 15th.', category: 'Academic', date: '2025-06-10', priority: 'high' },
  { id: 2, title: 'Campus Cultural Fest — TechFest 2025', content: 'Annual TechFest is scheduled for July 22–24. Register your teams for hackathons, robotics, and design competitions.', category: 'Events', date: '2025-06-08', priority: 'medium' },
  { id: 3, title: 'Library Extended Hours', content: 'The Central Library will remain open 24/7 from June 20 to July 5 to support students during examinations.', category: 'Facilities', date: '2025-06-05', priority: 'low' },
  { id: 4, title: 'Scholarship Applications Now Open', content: 'Merit and need-based scholarships are available for the 2025–26 academic year. Apply before June 30th.', category: 'Financial Aid', date: '2025-06-01', priority: 'high' },
];

const getAnnouncements = (req, res) => {
  sendSuccess(res, 200, 'Announcements retrieved successfully.', { count: announcements.length, announcements });
};

module.exports = { getAnnouncements };
