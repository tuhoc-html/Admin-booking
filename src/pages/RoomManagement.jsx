import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  message,
  Modal,
  Form,
  Input,
  Select,
  Upload,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import room1 from "../assets/room.png";
import CreateRoom from "./CreateRoom";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Sample room data (replace with your actual data)
const initialRooms = [
  {
    id: "1",
    name: "Phòng Ocean",
    type: "Phòng Thường",
    description: "Giường siêu rộng, đầy đủ tiện nghi",
    beds: "1 giường",
    price: "2.000.000 VND",
    image: room1, // Replace with actual image URL
  },
];

const RoomManagement = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // New state for delete confirmation modal
  const [roomToDelete, setRoomToDelete] = useState(null); // New state to store the ID of the room to delete
  const [editingRoom, setEditingRoom] = useState(null);
  const [form] = Form.useForm();
  const [image, setImage] = useState(null);
  const pageSize = 3; // Maximum 3 rooms per page
  const totalPages = Math.ceil(rooms.length / pageSize);

  // Paginate the data
  const paginatedData = rooms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Show delete confirmation modal
  const showDeleteConfirm = (id) => {
    setRoomToDelete(id);
    setIsDeleteModalVisible(true);
  };

  // Handle room deletion after confirmation
  const handleConfirmDelete = () => {
    if (roomToDelete) {
      const updatedRooms = rooms.filter((room) => room.id !== roomToDelete);
      setRooms(updatedRooms);
      message.success(`Đã xóa phòng với ID: ${roomToDelete}`);
      // Adjust page if necessary
      const newTotalPages = Math.ceil(updatedRooms.length / pageSize);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (updatedRooms.length === 0) {
        setCurrentPage(1);
      }
    }
    setIsDeleteModalVisible(false);
    setRoomToDelete(null);
  };

  // Handle cancel deletion
  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setRoomToDelete(null);
    message.info("Hủy xóa phòng!");
  };

  // Handle room creation
  const handleCreateRoom = (newRoom) => {
    const currentPageRooms = rooms.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    if (currentPageRooms.length < pageSize) {
      // If the current page has fewer than 3 rooms, add the new room to the current page
      const updatedRooms = [...rooms];
      const insertIndex =
        (currentPage - 1) * pageSize + currentPageRooms.length;
      updatedRooms.splice(insertIndex, 0, newRoom); // Insert the new room at the end of the current page
      setRooms(updatedRooms);
    } else {
      // If the current page is full (3 rooms), add the new room to the next page
      const updatedRooms = [...rooms, newRoom];
      setRooms(updatedRooms);
      const newTotalPages = Math.ceil(updatedRooms.length / pageSize);
      setCurrentPage(newTotalPages); // Navigate to the new page where the room was added
    }
    message.success("Phòng đã được thêm vào danh sách!");
  };

  // Show create room modal
  const showCreateRoomModal = () => {
    setIsCreateModalVisible(true);
  };

  // Handle room editing
  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setImage(room.image);
    form.setFieldsValue({
      name: room.name,
      type: room.type,
      description: room.description,
      beds: parseInt(room.beds.replace(" giường", "")) || 1, // Ensure beds is a number
      price: parseInt(room.price.replace(" VND", "").replace(/\./g, "")) || 0, // Ensure price is a number
    });
    setIsModalVisible(true);
  };

  // Handle modal submission
  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedRoom = {
          ...editingRoom,
          name: values.name,
          type: values.type,
          description: values.description,
          beds: `${values.beds} giường`,
          price: `${parseInt(values.price).toLocaleString("vi-VN")} VND`,
          image: image || editingRoom.image,
        };
        setRooms(
          rooms.map((room) => (room.id === editingRoom.id ? updatedRoom : room))
        );
        message.success("Thông tin phòng đã được cập nhật!");
        setIsModalVisible(false);
        setEditingRoom(null);
        setImage(null);
        form.resetFields();
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  // Handle modal cancellation
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingRoom(null);
    setImage(null);
    form.resetFields();
  };

  // Handle image upload
  const handleImageChange = (info) => {
    if (info.file.status === "done") {
      setImage(URL.createObjectURL(info.file.originFileObj));
      message.success("Ảnh phòng đã được cập nhật!");
    } else if (info.file.status === "error") {
      message.error("Tải ảnh lên thất bại!");
    }
  };

  // Custom upload request (simulated)
  const customRequest = ({ file, onSuccess, onError }) => {
    const isImage = file.type.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 2; // Less than 2MB

    if (!isImage) {
      message.error("Chỉ được tải lên file ảnh!");
      onError("File type error");
      return;
    }

    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
      onError("File size error");
      return;
    }

    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header with Create Room Button */}
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0">
          Quản lý phòng
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateRoomModal}
          className="bg-orange-500 hover:bg-orange-600 border-none"
        >
          Tạo phòng
        </Button>
      </div>

      {/* Room List */}
      <Row gutter={[16, 16]} className="flex-grow">
        {paginatedData.map((room) => (
          <Col xs={24} key={room.id}>
            <Card
              className="shadow-md rounded-lg"
              bodyStyle={{
                display: "flex",
                alignItems: "center",
                padding: "16px",
              }}
            >
              <img
                alt={room.name}
                src={room.image}
                style={{
                  width: "150px",
                  height: "100px",
                  objectFit: "cover",
                  marginRight: "16px",
                }}
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/150")
                } // Fallback image
              />
              <div style={{ flex: 1 }}>
                <Title level={4} style={{ margin: 0 }}>
                  {room.name}
                </Title>
                <Text type="secondary">{room.type}</Text>
                <br />
                <Text>{room.description}</Text>
                <br />
                <Text>{room.beds}</Text>
              </div>
              <div
                style={{
                  textAlign: "right",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Text strong style={{ marginBottom: "8px" }}>
                  {room.price}
                </Text>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <Button
                    type="primary"
                    danger
                    onClick={() => showDeleteConfirm(room.id)} // Updated to show the custom delete confirmation modal
                    style={{ width: "100px" }}
                  >
                    Xóa phòng
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => handleEditRoom(room)}
                    className="bg-orange-500 hover:bg-orange-600 border-none"
                    style={{ width: "100px" }}
                  >
                    Sửa phòng
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ marginRight: "8px" }}
        ></Button>
        <span>{`${currentPage} / ${totalPages || 1}`}</span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ marginLeft: "8px" }}
        ></Button>
      </div>

      {/* Edit Room Modal */}
      <Modal
        title="Chỉnh sửa thông tin phòng"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Lưu thay đổi"
        cancelText="Hủy bỏ"
        okButtonProps={{
          className: "bg-orange-500 hover:bg-orange-600 border-none",
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Hình ảnh phòng">
            <div className="flex items-center">
              <img
                src={
                  image ||
                  (editingRoom
                    ? editingRoom.image
                    : "https://via.placeholder.com/100")
                }
                alt="Room Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  marginRight: "16px",
                }}
              />
              <Upload
                showUploadList={false}
                customRequest={customRequest}
                onChange={handleImageChange}
              >
                <Button icon={<UploadOutlined />}>Thay đổi ảnh</Button>
              </Upload>
            </div>
          </Form.Item>

          <Form.Item
            label="Tên phòng"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
          >
            <Input placeholder="Tên phòng" />
          </Form.Item>

          <Form.Item
            label="Loại phòng"
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn loại phòng!" }]}
          >
            <Select placeholder="Chọn loại phòng">
              <Option value="Phòng Thường">Phòng Thường</Option>
              <Option value="Phòng Cao Cấp">Phòng Cao Cấp</Option>
              <Option value="Suite">Suite</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Mô tả phòng"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả phòng!" }]}
          >
            <TextArea rows={3} placeholder="Mô tả tiện ích" />
          </Form.Item>

          <Form.Item
            label="Số giường"
            name="beds"
            rules={[
              { required: true, message: "Vui lòng nhập số giường!" },
              { type: "number", min: 1, message: "Số giường phải lớn hơn 0!" },
            ]}
            getValueFromEvent={(e) => parseInt(e.target.value) || 1}
          >
            <Input type="number" placeholder="Số giường" min={1} />
          </Form.Item>

          <Form.Item
            label="Giá phòng (VND)"
            name="price"
            rules={[
              { required: true, message: "Vui lòng nhập giá phòng!" },
              { type: "number", min: 0, message: "Giá phòng không được âm!" },
            ]}
            getValueFromEvent={(e) => parseInt(e.target.value) || 0}
          >
            <Input type="number" placeholder="Giá phòng" min={0} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Room Modal */}
      <CreateRoom
        isModalVisible={isCreateModalVisible}
        setIsModalVisible={setIsCreateModalVisible}
        onCreate={handleCreateRoom}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa phòng"
        open={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Có"
        cancelText="Không"
        okButtonProps={{
          danger: true, // Make the "Có" button red to indicate a destructive action
        }}
      >
        <p>Bạn có muốn xóa phòng không?</p>
      </Modal>
    </div>
  );
};

export default RoomManagement;
