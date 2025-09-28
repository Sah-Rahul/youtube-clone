import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import History from "../pages/History";
import LikedVideo from "../pages/LikedVideo";
import MyContent from "../pages/MyContent";
import Collection from "../pages/Collection";
import Subcriber from "../pages/Subcriber";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import { Toaster } from "react-hot-toast";

const AppRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/liked-video" element={<LikedVideo />} />
          <Route path="/history" element={<History />} />
          <Route path="/my-content" element={<MyContent />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/subscribers" element={<Subcriber />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
