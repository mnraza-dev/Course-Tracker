import React, { useState } from 'react';
import { View, FlatList, Switch, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import CourseCard from '../components/CourseCard';
import Layout from '../components/Layout';
import { updateCourse, markLessonCompleted, setCourseStatus } from '../services/CourseService';

// Define types for our course structure
interface Lesson {
  lessonId: string;
  title: string;
  completed: boolean;
}

interface Module {
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

type CourseDetailRouteParams = {
  course: Course;
};

type CourseDetailScreenRouteProp = RouteProp<{ CourseDetail: CourseDetailRouteParams }, 'CourseDetail'>;

interface CourseDetailScreenProps {}

const CourseDetailScreen: React.FC<CourseDetailScreenProps> = () => {
  const route = useRoute<CourseDetailScreenRouteProp>();
  const course = route.params?.course as Course;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updatedCourse, setUpdatedCourse] = useState<Course>(course);

  const toggleLessonCompletion = async (moduleId: number, lessonId: string, completed: boolean) => {
    setIsLoading(true);
    try {
      const course = await markLessonCompleted(
        updatedCourse.id,
        moduleId,
        lessonId,
        !completed
      );
      setUpdatedCourse(course);
    } catch (error) {
      console.error('Error updating lesson status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCourseStatus = async () => {
    setIsLoading(true);
    try {
      const newStatus = updatedCourse.status === 'completed' ? 'in-progress' : 'completed';
      const updated = await setCourseStatus(updatedCourse.id, newStatus);
      setUpdatedCourse(updated);
    } catch (error) {
      console.error('Error updating course status:', error);
    } finally {
      setIsLoading(false);
    }
    };

  const renderModuleItem = ({ item }: { item: Module }) => {
    return (
      <View style={styles.moduleCard}>
        <Text style={styles.moduleTitle}>{item.title}</Text>
        <Text style={styles.lessonCountText}>
          {item.completedLessons}/{item.totalLessons} lessons completed
        </Text>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${(item.completedLessons / item.totalLessons) * 100}%` }
            ]}
          />
        </View>
        {item.lessons.map((lesson: Lesson) => (
          <View key={lesson.lessonId} style={styles.lessonItem}>
            <Text>{lesson.title}</Text>
            <Switch
              value={lesson.completed}
              onValueChange={() => toggleLessonCompletion(item.moduleId, lesson.lessonId, lesson.completed)}
              disabled={isLoading}
            />
          </View>
        ))}
      </View>
    );
  };

  if (!course) {
    return (
      <Layout>
        <View style={styles.emptyContainer}>
          <Text>Course not found</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={styles.container}>
        <CourseCard course={updatedCourse} onPress={() => {}} />
        
        <View style={styles.statusSwitch}>
          <Text>Mark as completed: </Text>
          <Switch
            value={updatedCourse.status === 'completed'}
            onValueChange={toggleCourseStatus}
            disabled={isLoading}
          />
        </View>
        
        <FlatList
          data={updatedCourse.modules}
          renderItem={renderModuleItem}
          keyExtractor={item => item.moduleId.toString()}
        />
        
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#2196F3" />
          </View>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  moduleCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lessonCountText: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  lessonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statusSwitch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    marginBottom: 12,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CourseDetailScreen;