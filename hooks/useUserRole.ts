import { useState, useEffect } from 'react';

export type UserRole = 'farmer' | 'buyer' | 'logistics' | null;

export function useUserRole() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo user role
    if (typeof window !== 'undefined') {
      const demoUser = localStorage.getItem('demo_user');
      if (demoUser) {
        try {
          const user = JSON.parse(demoUser);
          setUserRole(user.role || 'farmer');
        } catch (error) {
          setUserRole('farmer');
        }
      } else {
        setUserRole('farmer'); // Default for demo
      }
    }
    setLoading(false);
  }, []);

  const updateUserRole = (role: UserRole) => {
    setUserRole(role);
    if (typeof window !== 'undefined' && role) {
      const demoUser = localStorage.getItem('demo_user');
      if (demoUser) {
        try {
          const user = JSON.parse(demoUser);
          user.role = role;
          localStorage.setItem('demo_user', JSON.stringify(user));
        } catch (error) {
          console.error('Error updating user role:', error);
        }
      }
    }
  };

  return { userRole, loading, updateUserRole };
}