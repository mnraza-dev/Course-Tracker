import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import AddCourseScreen from '../screens/AddCourseScreen';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home Screen' }} />
                <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: 'Course Details' }} />
                <Stack.Screen name="AddCourse" component={AddCourseScreen} options={{ title: 'Add Course' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;