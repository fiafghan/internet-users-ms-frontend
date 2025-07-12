import RegisterForm from "./RegisterForm"
import { Routes, Route} from "react-router-dom"
import LoginForm from "./LoginForm"


function App() {

  return (
    <>
      <Routes>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
    </>
  )
}

export default App
