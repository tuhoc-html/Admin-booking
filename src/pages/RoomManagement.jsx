import React, { useState } from "react";
import { Card, Row, Col, Button, Typography, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import roomOcean from "../assets/room.png";

const { Title, Text } = Typography;

const sampleRooms = [
  {
    id: "1",
    name: "Phòng Ocean",
    type: "Phòng Thường",
    description: "Giường siêu rộng, đầy đủ tiện nghi",
    beds: "1 giường",
    price: "2.000.000 VND",
    image: roomOcean,
  },
];

const RoomManagement = () => {
  const [rooms, setRooms] = useState(sampleRooms);

  const handleDeleteRoom = (id) => {
    setRooms(rooms.filter((room) => room.id !== id));
    message.success(`Đã xóa phòng với ID: ${id}`);
  };

  const handleEditRoom = (id) => {
    message.info(`Chức năng sửa phòng với ID: ${id} đang được phát triển!`);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0">
          Quản lý phòng
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-orange-500 hover:bg-orange-600 border-none"
        >
          Tạo phòng
        </Button>
      </div>

      <Row gutter={[16, 16]} className="flex-grow">
        {rooms.map((room) => (
          <Col xs={24} key={room.id}>
            <Card className="shadow-md rounded-lg p-4 flex items-center">
              <img
                alt={room.name}
                src={room.image}
                className="w-40 h-28 object-cover rounded-md mr-4"
              />
              <div className="flex-grow">
                <Title level={4} className="m-0">
                  {room.name}
                </Title>
                <Text type="secondary">{room.type}</Text>
                <br />
                <Text>{room.description}</Text>
              </div>
              <div className="text-right ml-4 flex flex-col items-end">
                <Text className="text-gray-500">{room.beds}</Text>
                <Text strong className="text-xl text-black">
                  {room.price}
                </Text>
                <div className="mt-2 flex">
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleDeleteRoom(room.id)}
                    className="mr-2"
                  >
                    Xóa phòng
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => handleEditRoom(room.id)}
                    className="bg-orange-500 hover:bg-orange-600 border-none"
                  >
                    Sửa phòng
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RoomManagement;
