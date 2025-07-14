import RegisterForm from "./RegisterForm"
import { Routes, Route} from "react-router-dom"
import LoginForm from "./LoginForm"
import InternetUserAddForm from "./AddInternetUsers"
import AllUsers from "./AllUsers"
import AddViolation from "./AddViolation"

function App() {

  return (
    <>
      <Routes>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/adduser" element={<InternetUserAddForm />} />
      <Route path="/allusers" element={<AllUsers />} />
      <Route path="/addviolation" element={<AddViolation />} />
    </Routes>
    </>
  )
}

export default App
