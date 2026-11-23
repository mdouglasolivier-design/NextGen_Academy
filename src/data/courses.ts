import type { Course, QuizQuestion } from '@/types';

export const CATEGORIES = [
  'All Courses',
  'Computer Science',
  'Software Engineering',
  'Artificial Intelligence',
  'Data Science',
  'Cybersecurity',
  'Networking',
  'Linux and Open Source',
  'Business and Management',
] as const;

export const COURSES: Course[] = [
  { id: 1, title: 'Introduction to Computer Science', category: 'Computer Science', level: 'Beginner', hours: 24, price: 0, image: 'photo-1517694712202-14dd9538aa97', description: 'Build a strong foundation in computing, problem-solving, and the way technology works.', certificate: true },
  { id: 2, title: 'Python Programming Essentials', category: 'Software Engineering', level: 'Beginner', hours: 30, price: 0, image: 'photo-1555066931-4365d14bab8c', description: 'Start coding with Python and turn your ideas into practical, real-world applications.', certificate: true },
  { id: 3, title: 'Foundations of Artificial Intelligence', category: 'Artificial Intelligence', level: 'Beginner', hours: 20, price: 49, image: 'photo-1677442136019-21780ecad995', description: 'Discover the principles of AI and explore the intelligent systems shaping our future.', certificate: true },
  { id: 4, title: 'Data Science with Python', category: 'Data Science', level: 'Intermediate', hours: 40, price: 79, image: 'photo-1551288049-bebda4e38f71', description: 'Transform raw data into meaningful insights with Python, visualization, and statistics.', certificate: true },
  { id: 5, title: 'Cybersecurity Fundamentals', category: 'Cybersecurity', level: 'Beginner', hours: 18, price: 0, image: 'photo-1563013544-824ae1b704d3', description: 'Learn how to protect digital systems and navigate an increasingly connected world.', certificate: true },
  { id: 6, title: 'Linux Essentials', category: 'Linux and Open Source', level: 'Beginner', hours: 16, price: 0, image: 'photo-1629654297299-c8506221ca97', description: 'Get comfortable with the Linux command line and open-source operating systems.', certificate: true },
  { id: 7, title: 'Networking: From Theory to Practice', category: 'Networking', level: 'Intermediate', hours: 32, price: 59, image: 'photo-1558494949-ef010cbdcc31', description: 'Understand the networks that connect us, from core protocols to network design.', certificate: true },
  { id: 8, title: 'Business Strategy for a Digital World', category: 'Business and Management', level: 'Advanced', hours: 12, price: 39, image: 'photo-1460925895917-afdab827c52f', description: 'Develop strategic thinking and lead confidently in a fast-changing digital economy.', certificate: false },
];

export const MODULES = [
  'Getting started',
  'Core concepts and foundations',
  'Putting knowledge into practice',
  'Your final assessment',
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { prompt: 'What is the best first step when solving a new problem?', options: ['Skip directly to implementation', 'Understand the problem and define your goal', 'Avoid asking questions'], correct: 1 },
  { prompt: 'How can you best validate your understanding?', options: ['Memorize without practicing', 'Ignore feedback', 'Apply the concept to a practical example'], correct: 2 },
  { prompt: 'What supports effective self-paced learning?', options: ['Practice regularly and reflect on progress', 'Never review earlier lessons', 'Skip all assessments'], correct: 0 },
];

export const PASS_MARK = 2;

export const getCourse = (id: number | string | undefined): Course | undefined =>
  COURSES.find((c) => c.id === Number(id));