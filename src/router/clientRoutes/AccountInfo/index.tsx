import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Input, Spin, message, Select, Avatar, Card, Col, Row } from 'antd';
import { useParams } from 'react-router-dom';
import { getAccountById, updateAccount } from '@/services/ApiServices/accountService';

const AccountInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getAccountById(Number(id));
        setProfileData(data);
      } catch (error) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (values: any) => {
    try {
      await updateAccount({ ...values, Id: profileData.id });
      message.success('Profile updated successfully!');
      setProfileData({ ...profileData, ...values });
      setIsEditing(false);
    } catch (error) {
      message.error('Failed to update profile.');
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  if (!profileData) {
    return <Alert message="Profile not found." type="warning" />;
  }

  return (
    <Card title="Account Info" style={{ width: '100%', maxWidth: '600px', margin: '20px auto' }}>
      <Row gutter={16}>
        <Col span={6}>
          <Avatar size={100} src={profileData.avatar} />
        </Col>
        <Col span={18}>
          {isEditing ? (
            <Form
              initialValues={{
                Username: profileData.username,
                FullName: profileData.fullName,
                PhoneNumber: profileData.phoneNumber,
                Email: profileData.email,
                HashedPassword: profileData.hashedPassword,
                Address: profileData.address,
                Avatar: profileData.avatar,
                Gender: profileData.gender,
                Status: profileData.status,
              }}
              onFinish={handleSave}
            >
              <Form.Item label="Username" name="Username" rules={[{ required: true, message: 'Please input your username!' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Full Name" name="FullName" rules={[{ required: true, message: 'Please input your full name!' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Phone Number" name="PhoneNumber">
                <Input />
              </Form.Item>
              <Form.Item label="Email" name="Email" rules={[{ required: true, message: 'Please input your email!' }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="Hashed Password"
                name="HashedPassword"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password disabled />
              </Form.Item>
              <Form.Item label="Address" name="Address">
                <Input />
              </Form.Item>
              <Form.Item label="Avatar URL" name="Avatar">
                <Input />
              </Form.Item>
              <Form.Item label="Gender" name="Gender" rules={[{ required: true, message: 'Please select your gender!' }]}>
                <Select placeholder="Select your gender">
                  <Select.Option value="Male">Male</Select.Option>
                  <Select.Option value="Female">Female</Select.Option>
                  <Select.Option value="Others">Others</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Status" name="Status" rules={[{ required: true, message: 'Please select a status!' }]}>
                <Select disabled>
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
                  <Select.Option value="Suspended">Suspended</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
                <Button type="default" onClick={() => setIsEditing(false)} style={{ marginLeft: '10px' }}>
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <div>
              <p><strong>Username:</strong> {profileData.username}</p>
              <p><strong>Full Name:</strong> {profileData.fullName}</p>
              <p><strong>Phone Number:</strong> {profileData.phoneNumber}</p>
              <p><strong>Address:</strong> {profileData.address}</p>
              <p><strong>Email:</strong> {profileData.email}</p>
              <p><strong>Gender:</strong> {profileData.gender}</p>

              <Button className='mt-3' type="primary" onClick={handleEdit}>Edit Profile</Button>
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default AccountInfo;
