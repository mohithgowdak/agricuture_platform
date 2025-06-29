import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Platform } from 'react-native';

export type UserRole = 'farmer' | 'buyer' | 'logistics' | null;

export function useUserRole() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserRole = async () => {
      // Check for demo user role
      const demoUserStr = await storage.getItem('demo_user');
      if (demoUserStr) {
        try {
          const user = JSON.parse(demoUserStr);
          setUserRole(user.role || 'farmer');
        } catch (error) {
          setUserRole('farmer');
        }
      } else {
        setUserRole('farmer'); // Default for demo
      }
      setLoading(false);
    };

    // Load user role on mount
    loadUserRole();

    // Listen for logout events (only on web)
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleLogout = () => {
        console.log('🔄 Resetting user role due to logout');
        setUserRole(null);
        setLoading(false);
      };

      window.addEventListener('userLogout', handleLogout);
      
      // Cleanup listener on unmount
      return () => {
        window.removeEventListener('userLogout', handleLogout);
      };
    }
  }, []);

  const updateUserRole = async (role: UserRole) => {
    setUserRole(role);
    if (role) {
      const demoUserStr = await storage.getItem('demo_user');
      if (demoUserStr) {
        try {
          const user = JSON.parse(demoUserStr);
          user.role = role;
          await storage.setItem('demo_user', JSON.stringify(user));
        } catch (error) {
          console.error('Error updating user role:', error);
        }
      }
    }
  };

  return { userRole, loading, updateUserRole };
}