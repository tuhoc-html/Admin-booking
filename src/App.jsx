import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import BookingStatusTabs from "./components/BookingStatusTabs";
import RoomManagement from "./pages/RoomManagement";
import HotelInfo from "./pages/HotelInfo";

const { Content } = Layout;

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCollapse = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sidebar onCollapse={handleCollapse} />
      <Layout
        className={`transition-all duration-300 ${
          isMobile ? "ml-0" : isSidebarCollapsed ? "ml-[80px]" : "ml-[250px]"
        }`}
        style={{ height: "100vh", overflow: "hidden" }}
      >
        <Content
          style={{
            background: "#fff",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<BookingStatusTabs />} />
            <Route path="/room-management" element={<RoomManagement />} />
            <Route path="/edit-hotel" element={<HotelInfo />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
