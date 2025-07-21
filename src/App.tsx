import RegisterForm from "./RegisterForm"
import { Routes, Route} from "react-router-dom"
import LoginForm from "./LoginForm"
import InternetUserAddForm from "./AddInternetUsers"
import AllUsers from "./AllUsers"
import AddViolation from "./AddViolation"
import PrivateRoute from "./PrivateRoute"
import Settings from "./Settings"
import SystemUsersPage from "./SystemUsersPage"
import DeputyMinistryForm from "./DeputyMinistryForm"
import AllMinistries from "./AllMinistries"
import NewDirectorate from "./NewDirectorate"

function App() {

  return (
    <>
      <Routes>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/deputyministryform" element={<DeputyMinistryForm />} />
      <Route path="/allministries" element={<AllMinistries />} />
      <Route path="/newdirectorate" element={<NewDirectorate />} />
      <Route path="/adduser" element={<PrivateRoute><InternetUserAddForm /></PrivateRoute>} />
      <Route path="/all-system-users" element={<SystemUsersPage />} />
      <Route path="/addviolation" element={<PrivateRoute><AddViolation /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AllUsers />
          </PrivateRoute>
        }
      />
    </Routes>
    </>
  )
}

export default App
