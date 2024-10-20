import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import IdleTimer from './components/common/IdleTimer';

// Lazy load components
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword'));
const PasswordReset = lazy(() => import('./components/auth/PasswordReset'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Profile = lazy(() => import('./components/profile/Profile'));
const ChangePassword = lazy(() => import('./components/auth/ChangePassword'));
const TaskManager = lazy(() => import('./components/tasks/TaskManager'));
const TaskDetail = lazy(() => import('./components/tasks/TaskDetail'));

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      {user && <Navbar />}
      {user && process.env.REACT_APP_USE_IDLE_TIMER === 'true' && <IdleTimer />}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uidb64/:token" element={<PasswordReset />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/tasks" element={<TaskManager />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
          </Route>
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;