
//import { Sidebar } from '@/components/AccountInfo';
//import { GoPencil } from 'react-icons/go';
// import { ApiUserInfoType } from '@/features/api';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAppSelector } from '@/store';
// import Spinner from '@/components/Spinner';
// import { accInfoStyle } from './acc-info';
// import { BASE_URL } from '@/constants/api';

//const AccountInfo = () => {
    // const [profile, setProfile] = useState<ApiUserInfoType | null>(null);
    // const [loading, setLoading] = useState<boolean>(true);
    // const [error, setError] = useState<string | null>(null);

    // const token = useAppSelector((state) => state.auth.token);

    // useEffect(() => {
    //     const fetchUserProfile = async () => {
    //         try {
    //             // const token = localStorage.getItem('accessToken');

    //             if (!token) {
    //                 setError('Token not found');
    //                 setLoading(false);
    //                 return;
    //             }

    //             const response = await axios.get(`${BASE_URL}/user-profile`, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             });

    //             if (response.data.isSuccess) {
    //                 setProfile(response.data.data);
    //             } else {
    //                 setError('Failed to fetch user profile');
    //             }
    //         } catch (err) {
    //             setError((err as Error).message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchUserProfile();
    // }, []); // eslint-disable-line

    //const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
     //   e.preventDefault();
    //    console.log('submit');
   // };

    // if (error) return <p>Error: {error}</p>;

    //return (
       // <div className='grid grid-cols-12 h-full'>
        //    <Sidebar className='col-start-1 col-end-3' />
        //    <div className='col-start-3 col-end-13 flex flex-col justify-start gap-1 p-20 rounded-l-[3rem] '>
                {/* <div className='lg:py-8 py-6 lg:pl-4 pl-3 border-b border-gray-300'>
                    <h1 className='lg:text-2xl text-xl'>Hồ sơ của tôi</h1>
                </div> */}
          //      <form onSubmit={handleSubmit} className='lg:px-28 flex flex-col gap-12'>
                    {/* {loading */}
                        {/* ? <Spinner size='large' /> */}
                        {/* :  */}
              //          <>
                //            <div className='flex justify-start items-center gap-8'>
                  //              <div className='relative cursor-pointer'>
                   //                 <img src='https://via.placeholder.com/150' alt='avatar' className='rounded-full lg:w-32 w-24 ml-7 lg:ml-0' />
                     //               <div className='bg-[#FFB142] rounded-full w-fit p-1 absolute lg:right-2 right-0 lg:bottom-4 bottom-0'>
                      //                  <GoPencil size={24} color='white' />
                        //            </div>
                         //       </div>
                             //   <div className='flex flex-col gap-2'>
                                    {/* <p className='text-xl font-semibold'>{profile?.userName}</p> */}
                                   // <p className='text-sm lg:text-base'>Hồ Chí Minh, Việt Nam</p>
                               // </div>
                           // </div>
                           // <div className='grid grid-cols-2 lg:gap-8 gap-0 lg:mx-0 mx-2'>
                            //    <div className='columns-1'>
                               //     <label htmlFor='username' className="{(accInfoStyle.label.large, accInfoStyle.label.small)}">Tên đăng nhập:</label>
                               //     <input type='text' id='username' className='lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl' value="{profile?.userName || ''}" readOnly />
                               // </div>
                               // <div className='columns-1'>
                                //    <label htmlFor='fullName' className="{(accInfoStyle.label.large, accInfoStyle.label.small)}">Họ và tên:</label>
                                //    <input type='text' id='fullName' className='lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl' value="{profile?.userName || ''}" readOnly />
                              //  </div>
                          //  </div>
                           // <div className='grid grid-cols-2 lg:gap-8 gap-0 lg:mx-0 mx-2'>
                               // <div className='columns-1'>
                                //    <label htmlFor='phoneNumber' className="{(accInfoStyle.label.large, accInfoStyle.label.small)}">Số điện thoại:</label>
                                //    <input type='text' id='phoneNumber' className='lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl' value="{profile?.phone || ''} "/>
                               // </div>
                              //  <div className='columns-1'>
                               //     <label htmlFor='email' className="{(accInfoStyle.label.large, accInfoStyle.label.small)}">Email:</label>
                               //     <input type='email' id='email' className='lg:w-full lg:h-15 h-9 w-[95%] lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl' value="{profile?.email || ''}" />
                              //  </div>
                          //  </div>
                           // <div className='lg:mx-0 mx-2'>
                             //   <div>
                             //       <label htmlFor='address' className="{(accInfoStyle.label.large, accInfoStyle.label.small)}">Địa chỉ:</label>
                             //       <input type='text' id='address' className='lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-gray-300 text-base lg:text-xl' value="{profile?.address || ''}" />
                            //    </div>
                       //     </div>
                      //  </>
                     {/* } */}
                  //  <div className='flex justify-center'>
                    //    <button type='submit' className='lg:mb-7 mb-5 bg-[#067CEB] text-primary-foreground lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base'>Lưu thay đổi</button>
                 //   </div>
            //    </form>
         //   </div>
      //  </div >
   // );
//};


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
