
import { Course } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COURSE_DATA_KEY = 'courseProgressData';

// Validate if an object is a Course
const isCourse = (obj: any): obj is Course => {
  return (
    typeof obj.id === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    ['completed', 'in-progress', 'paused'].includes(obj.status) &&
    typeof obj.startDate === 'string' &&
    (obj.endDate === undefined || typeof obj.endDate === 'string') &&
    Array.isArray(obj.modules)
  );
};

// Validate if loaded data is an array of courses
const validateCourses = (data: any): data is Course[] => {
  if (!Array.isArray(data)) return false;
  return data.every(isCourse);
};

export const loadCourseData = async (): Promise<Course[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(COURSE_DATA_KEY);
    if (jsonValue != null) {
      const parsedData = JSON.parse(jsonValue);
      if (validateCourses(parsedData)) {
        return parsedData;
      } else {
        console.warn('Invalid course data format', parsedData);
        return []; // Return empty array if data is invalid
      }
    }
    return []; // Return empty array if no data found
  } catch (error) {
    console.error('Error loading course data:', error);
    return []; // Return empty array on error
  }
};

export const saveCourseData = async (courses: Course[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(courses);
    await AsyncStorage.setItem(COURSE_DATA_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving course data:', error);
  }
};