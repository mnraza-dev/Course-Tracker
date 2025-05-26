
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
  
  export type RootStackParamList = {
    Home: undefined;
    CourseDetail: { courseId: string };
    AddCourse: undefined;
  };