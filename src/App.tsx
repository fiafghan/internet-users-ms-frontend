import RegisterForm from "./RegisterForm"
import { Routes, Route} from "react-router-dom"
function App() {

  return (
    <>
      <Routes>
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
    </>
  )
}

export default App
