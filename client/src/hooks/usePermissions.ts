import { useAuth } from '../context/AuthContext';

// Custom hook to check user permissions
export const usePermissions = () => {
  const { user } = useAuth();

  const canRead = (): boolean => {
    return true; // All users can read
  };

  const canCreate = (): boolean => {
    return user?.role === 'admin'; // Only admins can create
  };

  const canUpdate = (): boolean => {
    return user?.role === 'admin'; // Only admins can update
  };

  const canDelete = (): boolean => {
    return user?.role === 'admin'; // Only admins can delete
  };

  const canManageAll = (): boolean => {
    return user?.role === 'admin'; // Only admins can manage all features
  };

  const canManageForum = (): boolean => {
    return user?.role === 'admin' || user?.role === 'user'; // Admins and users can manage forum
  };

  const canManageSchedules = (): boolean => {
    return user?.role === 'admin'; // Only admins can manage schedules
  };

  const canManageAssignments = (): boolean => {
    return user?.role === 'admin'; // Only admins can manage assignments
  };

  const canManageActivities = (): boolean => {
    return user?.role === 'admin'; // Only admins can manage activities
  };

  const canManageExternalInfo = (): boolean => {
    return user?.role === 'admin'; // Only admins can manage external info
  };

  return {
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    canManageAll,
    canManageForum,
    canManageSchedules,
    canManageAssignments,
    canManageActivities,
    canManageExternalInfo,
    role: user?.role
  };
};