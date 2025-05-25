import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

interface Course {
  id: number;
  title: string;
  description: string;
  status: string;
  startDate: string;
  modules: Array<{
    moduleId: number;
    title: string;
    totalLessons: number;
    completedLessons: number;
    completed: boolean;
  }>;
}

interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

const statusColors = {
  completed: '#4CAF50',
  'in-progress': '#2196F3',
  paused: '#FFA726',
};

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  // Calculate total lessons and completed lessons across all modules
  const totalLessons = course.modules.reduce((sum, module) => sum + module.totalLessons, 0);
  const completedLessons = course.modules.reduce((sum, module) => sum + module.completedLessons, 0);
  const progress = totalLessons > 0 ? completedLessons / totalLessons : 0;
  
  // Get background image based on course title
  const getBackgroundImage = () => {
    // For now, using a simple color scheme, but we can add specific images for different courses
    return `https://picsum.photos/seed/course${course.id}/800/400`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <ImageBackground 
        source={{ uri: getBackgroundImage() }} 
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>{course.title}</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
          </View>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>{Math.round(progress * 100)}% completed</Text>
            <View style={styles.lessonCountText}>
              <Text>{completedLessons}/{totalLessons} lessons</Text>
              <View style={[styles.statusDot, { backgroundColor: statusColors[course.status as keyof typeof statusColors] }]}>
                <Text style={styles.statusText}> • {course.status.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backgroundImage: {
    width: '100%',
    height: 200,
  },
  backgroundImageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 5,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lessonCountText: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  statusDot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    marginLeft: 5,
  },
});

export default CourseCard;