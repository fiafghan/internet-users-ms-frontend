import RegisterForm from "./RegisterForm"
import { Routes, Route} from "react-router-dom"
import LoginForm from "./LoginForm"
import InternetUserAddForm from "./AddInternetUsers"

function App() {

  return (
    <>
      <Routes>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/adduser" element={<InternetUserAddForm />} />
    </Routes>
    </>
  )
}

export default App
