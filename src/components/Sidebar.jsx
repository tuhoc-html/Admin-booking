import React, { useState, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  BookOutlined,
  HomeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = ({ onCollapse }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setCollapsed(false);
      } else {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    onCollapse(!collapsed);
    if (isMobile) {
      document.body.classList.toggle("sidebar-open");
    }
  };

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      key: "2",
      icon: <BookOutlined />,
      label: "Quản lý đặt phòng",
      path: "/bookings",
    },
    {
      key: "3",
      icon: <HomeOutlined />,
      label: "Quản lý phòng",
      path: "/room-management",
    },
    {
      key: "4",
      icon: <EditOutlined />,
      label: "Chỉnh sửa thông tin khách sạn",
      path: "/edit-hotel",
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      className={`h-screen fixed top-0 left-0 bg-gray-50 shadow-md z-50 transition-all duration-300 ${
        isMobile && collapsed ? "-translate-x-full" : "translate-x-0"
      }`}
      width={250}
      collapsedWidth={80}
    >
      <div className="flex items-center justify-center h-16 bg-gray-50 border-b border-gray-200">
        {collapsed ? (
          <div className="text-xl font-bold text-orange-500">HB</div>
        ) : (
          <div className="text-xl font-bold text-orange-500">Hotel Booking</div>
        )}
      </div>
      <div className="p-4">
        <Button
          type="primary"
          onClick={toggleCollapsed}
          className="w-full mb-4 bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["1"]}
        className="h-full border-r-0"
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: <Link to={item.path}>{item.label}</Link>,
          className: "text-gray-700 hover:bg-gray-100 text-base py-3",
        }))}
      />
    </Sider>
  );
};

export default Sidebar;
