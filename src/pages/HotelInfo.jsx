import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, Typography, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Sample hotel data (replace with your actual data)
const initialHotelData = {
  name: "Hyatt Regency Danang Resort & Spa",
  email: "hyatt@gmail.com",
  phone: "ewqewqe",
  address: "5, Trường Sa, Quận Ngũ Hành Sơn, Đà Nẵng",
  description:
    "Hyatt Regency Danang Resort & Spa là khu nghỉ dưỡng được đánh giá cao tại Đà Nẵng. Với dịch vụ và danh tiếng, khu nghỉ dưỡng này là lựa chọn hàng đầu của khách hàng có sức chứa lớn, du khách không cần lo lắng về tình trạng đông đúc, quý tiều mà dịch.",
  avatar: "https://via.placeholder.com/100", // Replace with actual image URL
};

const HotelInfo = () => {
  const [hotelData, setHotelData] = useState(initialHotelData);
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(initialHotelData.avatar);

  // Sync avatar state with hotelData changes
  useEffect(() => {
    setAvatar(hotelData.avatar);
    form.setFieldsValue(hotelData); // Sync form with hotelData
  }, [hotelData, form]);

  // Handle form submission
  const handleSubmit = (values) => {
    const updatedData = { ...values, avatar };
    setHotelData(updatedData);
    message.success("Thông tin khách sạn đã được cập nhật!");
  };

  // Handle avatar upload
  const handleAvatarChange = (info) => {
    if (info.file.status === "done") {
      // In a real app, you'd get the uploaded image URL from the server
      const newAvatar = URL.createObjectURL(info.file.originFileObj);
      setAvatar(newAvatar);
      message.success("Ảnh đại diện đã được cập nhật!");
    } else if (info.file.status === "error") {
      message.error("Tải ảnh lên thất bại!");
    }
  };

  // Custom validation for phone number
  const validatePhoneNumber = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Vui lòng nhập số điện thoại!"));
    }
    if (!/^\d+$/.test(value)) {
      return Promise.reject(new Error("Số điện thoại chỉ được chứa chữ số!"));
    }
    if (value.length < 10 || value.length > 11) {
      return Promise.reject(
        new Error("Số điện thoại phải có 10 hoặc 11 chữ số!")
      );
    }
    return Promise.resolve();
  };

  // Custom upload request (simulated)
  const customRequest = ({ file, onSuccess, onError }) => {
    // Simulate file upload
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
    <div className="p-6 h-full flex flex-col">
      <Title level={2} className="mb-6">
        Chỉnh sửa thông tin khách sạn
      </Title>
      <Card className="shadow-md rounded-lg">
        <Form
          form={form}
          layout="vertical"
          initialValues={hotelData}
          onFinish={handleSubmit}
        >
          <div className="flex">
            {/* Left Section: Form Fields */}
            <div className="flex-1 pr-6">
              <Form.Item
                label={<Text strong>Tên Khách Sạn:</Text>}
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên khách sạn!" },
                ]}
              >
                <Input placeholder="Tên khách sạn" />
              </Form.Item>

              <div className="flex space-x-4">
                <Form.Item
                  label={<Text strong>Email:</Text>}
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                  className="flex-1"
                >
                  <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                  label={<Text strong>Số điện thoại:</Text>}
                  name="phone"
                  rules={[{ validator: validatePhoneNumber }]}
                  className="flex-1"
                >
                  <Input placeholder="Số điện thoại" />
                </Form.Item>
              </div>

              <Form.Item
                label={<Text strong>Địa chỉ:</Text>}
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input placeholder="Địa chỉ" />
              </Form.Item>

              <Form.Item
                label={<Text strong>Mô tả:</Text>}
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <TextArea rows={4} placeholder="Mô tả khách sạn" />
              </Form.Item>
            </div>

            {/* Right Section: Avatar Upload */}
            <div className="flex flex-col items-center w-1/4">
              <img
                src={avatar}
                alt="Hotel Avatar"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  marginBottom: "16px",
                  objectFit: "cover",
                }}
              />
              <Upload
                showUploadList={false}
                customRequest={customRequest}
                onChange={handleAvatarChange}
              >
                <Button icon={<UploadOutlined />}>Tải lên</Button>
              </Upload>
            </div>
          </div>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-orange-500 hover:bg-orange-600 border-none"
            >
              Cập nhật thông tin
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default HotelInfo;
