import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Course } from '../services/CourseService';
import CourseCard from '../components/CourseCard';
import Layout from '../components/Layout';
import { loadCourseData } from '../services/CourseService';
interface HomeScreenProps {}
const HomeScreen: React.FC<HomeScreenProps> = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const navigation = useNavigation();
  const loadCourses = async () => {
    try {
      const courseData = await loadCourseData();
      setCourses(courseData);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    loadCourses();
  }, []);
  const onRefresh = () => {
    setRefreshing(true);
    loadCourses();
  };
  const navigateToCourseDetail = (course: Course) => {
    navigation.navigate('CourseDetail' as never, { course } as never);
  };

  if (loading) {
    return (
      <Layout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text>Loading courses...</Text>
        </View>
      </Layout>
    );
  }

  if (courses.length === 0) {
    return (
      <Layout>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No courses found. Tap the + icon below to add a new course.
          </Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={styles.container}>
        <FlatList
          data={courses}
          renderItem={({ item }) => 
            <CourseCard 
              course={item} 
              onPress={() => navigateToCourseDetail(item)} 
            />
          }
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default HomeScreen;