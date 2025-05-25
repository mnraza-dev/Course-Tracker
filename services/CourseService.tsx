import AsyncStorage from '@react-native-async-storage/async-storage';
export interface Lesson {
  lessonId: string;
  title: string;
  completed: boolean;
}
export interface Module {
  moduleId: number;
  title: string;
  totalLessons: number;
  completedLessons: number;
  lessons: Lesson[];
  completed: boolean;
}
export interface Course {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'paused';
  startDate: string;
  endDate?: string;
  modules: Module[];
}
const COURSE_DATA_KEY = 'courseProgressData';
export const loadCourseData = async (): Promise<Course[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(COURSE_DATA_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading course data:', error);
    return [];
  }
};
export const saveCourseData = async (courses: Course[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(courses);
    await AsyncStorage.setItem(COURSE_DATA_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving course data:', error);
  }
}
export const updateCourse = async (updatedCourse: Course): Promise<Course[]> => {
  const courses = await loadCourseData();
  const courseIndex = courses.findIndex(course => course.id === updatedCourse.id);
  
  if (courseIndex >= 0) {
    courses[courseIndex] = updatedCourse;
  } else {
    courses.push(updatedCourse);
  }
  await saveCourseData(courses);
  return courses;
};
export const markLessonCompleted = async (
  courseId: number,
  moduleId: number,
  lessonId: string,
  completed: boolean
): Promise<Course> => {
  const courses = await loadCourseData();
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    throw new Error(`Course with id ${courseId} not found`);
  }
  const module = course.modules.find(m => m.moduleId === moduleId);
  
  if (!module) {
    throw new Error(`Module with id ${moduleId} not found in course ${courseId}`);
  }
  
  const lesson = module.lessons.find(l => l.lessonId === lessonId);
  
  if (!lesson) {
    throw new Error(`Lesson with id ${lessonId} not found in module ${moduleId}`);
  }
  
  if (lesson.completed !== completed) {
    lesson.completed = completed;
      module.completedLessons = completed 
      ? module.completedLessons + 1 
      : module.completedLessons - 1;
      module.completed = module.completedLessons === module.totalLessons;
       const totalLessons = course.modules.reduce((sum, m) => sum + m.totalLessons, 0);
    const completedLessons = course.modules.reduce((sum, m) => sum + m.completedLessons, 0);
    
    course.status = completedLessons === totalLessons ? 'completed' : course.status;
  }
  
  await saveCourseData(courses);
  return course;
};

export const setCourseStatus = async (
  courseId: number,
  newStatus: 'completed' | 'in-progress' | 'paused'
): Promise<Course> => {
  const courses = await loadCourseData();
  const courseIndex = courses.findIndex(course => course.id === courseId);
  
  if (courseIndex < 0) {
    throw new Error(`Course with id ${courseId} not found`);
  }
  
  const updatedCourse = { ...courses[courseIndex], status: newStatus };
  
  if (newStatus === 'completed' && !updatedCourse.endDate) {
    updatedCourse.endDate = new Date().toISOString().split('T')[0];
  } else if (newStatus === 'in-progress' && updatedCourse.endDate) {
    updatedCourse.endDate = undefined;
  }
  
  courses[courseIndex] = updatedCourse;
  await saveCourseData(courses);
  
  return updatedCourse;
};