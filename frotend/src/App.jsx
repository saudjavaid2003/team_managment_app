import React from 'react'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import PrivateRoute from './routes/PrivateRoute'
import Dashboard from './pages/admin/Dashboard'
import ManageTasks from './pages/admin/ManageTasks'
import CreateTasks from './pages/admin/CreateTasks'
import ManageUsers from './pages/admin/ManageUsers'
import UserDashboard from './user/userDashboard'
import MyTasks from './user/MyTaks'
import ViewTaskDetails from './user/ViewTaskDetails'

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'

const App = () => {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />

        {/* Admin Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/tasks" element={<ManageTasks />} />
          <Route path="/admin/create-task" element={<CreateTasks />} />
          <Route path="/admin/manage-user" element={<ManageUsers />} />
        </Route>

        {/* User Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/my-tasks" element={<MyTasks />} />
          <Route path="/user/view-task/:id" element={<ViewTaskDetails />} />
        </Route>

      </Routes>
    </Router>
  )
}

export default App
