import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ListingDetailPage from "./pages/ListingDetailPage";
import DiscoverPage from "./pages/DiscoverPage";
import ExperiencesPage from "./pages/ExperiencesPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import UserComponent from "./components/user/UserComponent";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AdminComponent from "./components/admin/AdminComponent";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<UserComponent />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        <Route path="/admin" element={<AdminComponent />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
