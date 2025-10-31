import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import RegisterForm from "./components/RegisterLoginForm/RegisterForm";

import Home from "./pages/Home/Home";
import Recetas from "./pages/Recetas/Recetas";
import Agenda from "./pages/Agenda/Agenda";
import MoreLessGame from "./pages/MoreLessGame/MoreLessGame";
import IMCPage from "./pages/IMCPage/IMCPage";
import LoginForm from "./components/RegisterLoginForm/LoginForm";
import { UserProvider } from "./contexts/UserContext";
import { LikesProvider } from "./contexts/LikesContext";

function App() {
  return (
    <UserProvider>
      <LikesProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recetas" element={<Recetas />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/juego" element={<MoreLessGame />} />
          <Route path="/imc" element={<IMCPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/Register" element={<RegisterForm />} />
        </Routes>
        <Footer />
      </LikesProvider>
    </UserProvider>
  );
}

export default App;
