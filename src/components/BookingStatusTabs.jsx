import React, { useState } from "react";
import { Tabs, Table, Select, Button, Input, message } from "antd";

const { TabPane } = Tabs;
const { Option } = Select;

// Sample data for the table (replace with your actual data)
const sampleData = [
  {
    key: "1",
    name: "Hoang Vien",
    phone: "0901234567",
    checkIn: "2022-01-05",
    checkOut: "2022-01-10",
    price: "8,000,000",
  },
  {
    key: "2",
    name: "Nguyen Van A",
    phone: "0912345678",
    checkIn: "2022-03-01",
    checkOut: "2022-03-03",
    price: "4,000,000",
  },
  {
    key: "3",
    name: "Tran Thi B",
    phone: "0923456789",
    checkIn: "2022-04-01",
    checkOut: "2022-04-02",
    price: "2,000,000",
  },
  {
    key: "4",
    name: "Le Van C",
    phone: "0934567890",
    checkIn: "2022-04-15",
    checkOut: "2022-04-20",
    price: "10,000,000",
  },
  {
    key: "5",
    name: "Pham Thi D",
    phone: "0945678901",
    checkIn: "2022-04-21",
    checkOut: "2022-04-26",
    price: "10,000,000",
  },
  {
    key: "6",
    name: "Hoang Vien",
    phone: "0956789012",
    checkIn: "2022-05-01",
    checkOut: "2022-05-06",
    price: "4,000,000",
  },
  {
    key: "7",
    name: "Nguyen Van E",
    phone: "0967890123",
    checkIn: "2022-05-15",
    checkOut: "2022-05-18",
    price: "6,000,000",
  },
  {
    key: "8",
    name: "Tran Thi F",
    phone: "0978901234",
    checkIn: "2022-05-19",
    checkOut: "2022-05-22",
    price: "6,000,000",
  },
  {
    key: "9",
    name: "Le Van G",
    phone: "0989012345",
    checkIn: "2022-06-01",
    checkOut: "2022-06-07",
    price: "12,000,000",
  },
];

// Function to parse price string to number for sorting
const parsePrice = (priceStr) => {
  return parseInt(priceStr.replace(/[^\d]/g, ""));
};

const BookingStatusTabs = () => {
  const [activeTab, setActiveTab] = useState("1"); // Default to 'Chờ xác nhận'
  const [sortBy, setSortBy] = useState("date"); // Default sort by date
  const [sortOrder, setSortOrder] = useState("asc"); // Default ascending
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Track selected rows
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [searchTerm, setSearchTerm] = useState(""); // Track search term
  const pageSize = 5; // Number of items per page

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSelectedRowKeys([]); // Reset selection when switching tabs
    setCurrentPage(1); // Reset to first page when switching tabs
  };

  // Filter data based on search term
  const filteredData = sampleData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm)
  );

  // Sort the filtered data based on selected criteria and order
  const sortedData = [...filteredData].sort((a, b) => {
    let valueA, valueB;
    switch (sortBy) {
      case "date":
        valueA = new Date(a.checkIn);
        valueB = new Date(b.checkIn);
        break;
      case "name":
        valueA = a.name;
        valueB = b.name;
        break;
      case "price":
        valueA = parsePrice(a.price);
        valueB = parsePrice(b.price);
        break;
      default:
        valueA = new Date(a.checkIn);
        valueB = new Date(b.checkIn);
    }
    if (sortOrder === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  // Paginate the data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  // Handle cancel booking
  const handleCancelBooking = (key) => {
    message.success(`Đã hủy đặt phòng với ID: ${key}`);
    // Add your cancel logic here (e.g., API call)
    setSelectedRowKeys(selectedRowKeys.filter((k) => k !== key));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Columns for the table
  const columns = [
    {
      title: (
        <input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys(sortedData.map((item) => item.key));
            } else {
              setSelectedRowKeys([]);
            }
          }}
        />
      ),
      dataIndex: "checkbox",
      key: "checkbox",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedRowKeys.includes(record.key)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.key]);
            } else {
              setSelectedRowKeys(
                selectedRowKeys.filter((k) => k !== record.key)
              );
            }
          }}
        />
      ),
      width: 50,
    },
    { title: "Tên người đặt", dataIndex: "name", key: "name" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Ngày nhận phòng", dataIndex: "checkIn", key: "checkIn" },
    { title: "Ngày trả phòng", dataIndex: "checkOut", key: "checkOut" },
    { title: "Giá tiền", dataIndex: "price", key: "price" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          danger
          onClick={() => handleCancelBooking(record.key)}
          style={{ padding: 0 }}
        >
          Hủy đặt
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Search and Sort Controls */}
      <div className="mb-6 flex space-x-4 items-center">
        <Input
          placeholder="Tìm kiếm theo tên hoặc số điện thoại"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          style={{ width: 300 }}
        />
        <Select
          value={sortBy}
          onChange={(value) => setSortBy(value)}
          style={{ width: 120 }}
        >
          <Option value="date">Ngày</Option>
          <Option value="name">Tên</Option>
          <Option value="price">Giá</Option>
        </Select>
        <Select
          value={sortOrder}
          onChange={(value) => setSortOrder(value)}
          style={{ width: 120 }}
        >
          <Option value="asc">Tăng dần</Option>
          <Option value="desc">Giảm dần</Option>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onChange={handleTabChange} className="mb-6">
        <TabPane tab="Chờ xác nhận" key="1">
          <Table
            columns={columns}
            dataSource={paginatedData}
            pagination={false}
            scroll={{ y: 240 }}
            rowSelection={rowSelection}
          />
          {/* Custom Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ marginRight: "8px" }}
              >
                &lt; Trước
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau &gt;
              </Button>
            </div>
            <span>{`${currentPage} / ${totalPages}`}</span>
          </div>
        </TabPane>
        <TabPane tab="Đã xác nhận" key="2">
          <Table
            columns={columns}
            dataSource={paginatedData}
            pagination={false}
            scroll={{ y: 240 }}
            rowSelection={rowSelection}
          />
          <div className="flex justify-between items-center mt-4">
            <div>
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ marginRight: "8px" }}
              >
                &lt; Trước
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau &gt;
              </Button>
            </div>
            <span>{`${currentPage} / ${totalPages}`}</span>
          </div>
        </TabPane>
        <TabPane tab="Chờ thanh toán" key="3">
          <Table
            columns={columns}
            dataSource={paginatedData}
            pagination={false}
            scroll={{ y: 240 }}
            rowSelection={rowSelection}
          />
          <div className="flex justify-between items-center mt-4">
            <div>
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ marginRight: "8px" }}
              >
                &lt; Trước
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau &gt;
              </Button>
            </div>
            <span>{`${currentPage} / ${totalPages}`}</span>
          </div>
        </TabPane>
        <TabPane tab="Đã thanh toán" key="4">
          <Table
            columns={columns}
            dataSource={paginatedData}
            pagination={false}
            scroll={{ y: 240 }}
            rowSelection={rowSelection}
          />
          <div className="flex justify-between items-center mt-4">
            <div>
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ marginRight: "8px" }}
              >
                &lt; Trước
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau &gt;
              </Button>
            </div>
            <span>{`${currentPage} / ${totalPages}`}</span>
          </div>
        </TabPane>
        <TabPane tab="Đã hủy" key="5">
          <Table
            columns={columns}
            dataSource={paginatedData}
            pagination={false}
            scroll={{ y: 240 }}
            rowSelection={rowSelection}
          />
          <div className="flex justify-between items-center mt-4">
            <div>
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ marginRight: "8px" }}
              >
                &lt; Trước
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau &gt;
              </Button>
            </div>
            <span>{`${currentPage} / ${totalPages}`}</span>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BookingStatusTabs;
