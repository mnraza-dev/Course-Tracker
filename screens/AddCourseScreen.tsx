import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Course } from '../services/CourseService';
import { addCourse } from '../services/CourseService';
import Layout from '../components/Layout';
interface AddCourseScreenProps {}

const AddCourseScreen: React.FC<AddCourseScreenProps> = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const navigation = useNavigation();

  const handleAddCourse = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Course title is required');
      return;
    }

    try {
      const courseId = Math.random().toString(36).substring(2, 9);
       const newCourse: Course = {
        id: parseInt(courseId, 36),
        title: title.trim(),
        description: description.trim(),
        status: 'in-progress',
        startDate: date,
        endDate: undefined,
        modules: [
          {
            moduleId: 1,
            title: 'Module 1',
            totalLessons: 4,
            completedLessons: 0,
            lessons: [
              {
                lessonId: '1.1',
                title: 'Introduction',
                completed: false,
              },
              {
                lessonId: '1.2',
                title: 'Basic Concepts',
                completed: false,
              },
              {
                lessonId: '1.3',
                title: 'Setting Up',
                completed: false,
              },
              {
                lessonId: '1.4',
                title: 'First Project',
                completed: false,
              },
            ],
            completed: false,
          },
          {
            moduleId: 2,
            title: 'Module 2',
            totalLessons: 5,
            completedLessons: 0,
            lessons: [
              {
                lessonId: '2.1',
                title: 'Advanced Concepts',
                completed: false,
              },
              {
                lessonId: '2.2',
                title: 'Working with State',
                completed: false,
              },
              {
                lessonId: '2.3',
                title: 'Navigation',
                completed: false,
              },
              {
                lessonId: '2.4',
                title: 'Theming',
                completed: false,
              },
              {
                lessonId: '2.5',
                title: 'Performance',
                completed: false,
              },
            ],
            completed: false,
          },
        ],
      };

      await addCourse(newCourse);
      setTitle('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      navigation.goBack();
    } catch (error) {
      console.error('Error adding course:', error);
      Alert.alert('Error', 'An error occurred while adding the course');
    }
  };

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Course Title"
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.formGroup}>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Course Description"
            placeholderTextColor="#888"
            multiline={true}
            numberOfLines={4}
          />
        </View>
        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="Start Date (YYYY-MM-DD)"
            placeholderTextColor="#888"
            keyboardType="numbers-and-punctuation"
          />
        </View>
        <Button title="Add Course" onPress={handleAddCourse} />
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    height: 44,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    padding: 10,
    fontSize: 16,
  },
});
export default AddCourseScreen;