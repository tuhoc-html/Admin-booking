// src/components/CreateRoom.jsx
import React, { useState } from "react"; // Added useState to the import
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  Button,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const CreateRoom = ({ isModalVisible, setIsModalVisible, onCreate }) => {
  const [form] = Form.useForm();
  const [image, setImage] = useState(null); // Now useState is properly imported

  // Handle form submission to create a new room
  const handleCreateRoom = () => {
    form
      .validateFields()
      .then((values) => {
        const newRoom = {
          id: Date.now().toString(), // Simple ID generation (replace with a proper ID generator in production)
          name: values.name,
          type: values.type,
          description: values.description,
          beds: `${values.beds} giường`,
          price: `${parseInt(values.price).toLocaleString("vi-VN")} VND`,
          image: image || "https://via.placeholder.com/150", // Default image if none uploaded
        };
        onCreate(newRoom); // Call the parent component's onCreate function to add the new room
        message.success("Tạo phòng thành công!");
        setIsModalVisible(false);
        setImage(null);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setImage(null);
    form.resetFields();
  };

  // Handle image upload
  const handleImageChange = (info) => {
    if (info.file.status === "done") {
      setImage(URL.createObjectURL(info.file.originFileObj));
      message.success("Ảnh phòng đã được tải lên!");
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

  return (
    <Modal
      title="Tạo phòng mới"
      open={isModalVisible}
      onOk={handleCreateRoom}
      onCancel={handleCancel}
      okText="Tạo"
      cancelText="Hủy bỏ"
      okButtonProps={{
        className: "bg-orange-500 hover:bg-orange-600 border-none",
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Hình ảnh phòng">
          <div className="flex items-center">
            <img
              src={image || "https://via.placeholder.com/100"}
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
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
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
        >
          <InputNumber
            min={1}
            placeholder="Số giường"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Giá phòng (VND)"
          name="price"
          rules={[
            { required: true, message: "Vui lòng nhập giá phòng!" },
            { type: "number", min: 0, message: "Giá phòng không được âm!" },
          ]}
        >
          <InputNumber
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            }
            parser={(value) => value.replace(/\./g, "")}
            placeholder="Giá phòng"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRoom;
