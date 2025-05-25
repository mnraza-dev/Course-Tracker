import React from 'react';
import { View, StyleSheet } from 'react-native';

interface LayoutProps {
  children: React.ReactNode;
  style?: object;
}

const Layout: React.FC<LayoutProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
});

export default Layout;