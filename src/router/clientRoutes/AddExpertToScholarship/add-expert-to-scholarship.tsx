import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ScholarshipProgramType } from "../ScholarshipProgram/data";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { FaCalendarAlt } from "react-icons/fa";
import { Checkbox, Paper } from "@mui/material";
import { getExpertsByFunder } from "@/services/ApiServices/expertService";
import { IoIosAddCircleOutline, IoIosDoneAll } from "react-icons/io";
import { assignExpertsToScholarshipProgram } from "@/services/ApiServices/scholarshipProgramService";
import { message, notification } from "antd";

const AddExpertToScholarship = () => {
  const { id } = useParams<{ id: string }>();
  const token = useSelector((state: RootState) => state.token.token);
  const [data, setData] = useState<ScholarshipProgramType | null>(null);
  const [_loading, setLoading] = useState<boolean>(true);
  const [_error, setError] = useState<string | null>(null);
  const user = useSelector((state: any) => state.token.user);
  const [_experts, setExperts] = useState<any[]>([]);
  const [selectedExperts, setSelectedExperts] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/scholarship-programs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        setData(response.data.data);
        console.log(response.data.data);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExperts = async () => {
    try {
      const response = await getExpertsByFunder(Number(user.id));
      console.log(response);
      if (response.statusCode === 200) {
        setExperts(response.data);
      } else {
        setError("Failed to get applicants");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchExperts();
  }, [id]);

  console.log(id)

  const handleDone = async () => {
    try {
      await assignExpertsToScholarshipProgram(Number(id), selectedExperts);
      notification.success({ message: "Experts assigned successfully!" });
    } catch (err) {
      notification.error({ message: "Failed to assign experts." });
    }
  };

  return (
    <div>
      <div className="relative">
        <ScholarshipProgramBackground />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between items-start p-[40px]  z-10">
          <div className="">
            <Breadcrumb className="">
              <BreadcrumbList className="text-[#000]">
                <BreadcrumbItem>
                  <Link to="/" className="md:text-xl text-lg">
                    Home
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    to="/scholarship-program"
                    className=" text-[#000] md:text-xl font-medium text-lg"
                  >
                    Scholarship Program
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <p className="text-[#000] md:text-xl text-lg font-semibold">
                    {data?.name}
                  </p>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <p className="text-[#000] md:text-xl text-lg font-semibold">
                    Expert List
                  </p>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </div>

      <div className=" max-w-8xl mx-auto p-6 mt-10 mb-5">
        <div className="max-w-[1216px] mx-auto">
          <div className="mb-6 px-4 sm:px-6 xl:px-0">
            <div className="relative flex items-center gap-3">
              <div className="p-2 bg-[#1eb2a6] rounded-full">
                <FaCalendarAlt className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Expert List</h2>
            </div>
            <div className="bg-[#1eb2a6] w-12 h-1 rounded-full mt-3 transition-all duration-300 ease-in-out"></div>
          </div>

          {/* Experts Section */}
          <Paper
            elevation={3}
            style={{
              padding: '20px',
              borderRadius: '10px',
              backgroundColor: '#fafafa',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              overflow: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontWeight: 'bold',
                backgroundColor: '#f1f1f1',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '10px',
              }}
            >
              <div style={{ flex: 0.25 }}></div>
              <div style={{ flex: 0.5 }}>#</div>
              <div style={{ flex: 0.5 }}>Avatar</div>
              <div style={{ flex: 0.75 }}>Name</div>
              <div style={{ flex: 1 }}>Email</div>
              <div style={{ flex: 0.75 }}>Phone</div>
              <div style={{ flex: 1.5 }}>Major</div>
            </div>

            {/* Expert Cards */}
            {(_experts && Array.isArray(_experts) && _experts.filter((expert: any) => expert.isVisible !== false).length > 0) ? (
              _experts.filter((expert: any) => expert.isVisible !== false).map((expert: any, index: any) => (
                <div
                  key={expert.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#f9f9f9',
                    padding: '10px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e3f2fd')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                >

                  <div style={{ flex: 0.25 }}>
                    <input
                      type="checkbox"
                      checked={selectedExperts.includes(expert.expertId)}
                      onChange={() => {
                        if (selectedExperts.includes(expert.expertId)) {
                          setSelectedExperts(selectedExperts.filter((id) => id !== expert.expertId));
                        } else {
                          setSelectedExperts([...selectedExperts, expert.expertId]);
                        }
                      }}
                    />
                  </div>

                  {/* Cột số thứ tự */}
                  <div style={{ flex: 0.5 }}>{index + 1}</div>

                  <div style={{ flex: 0.5 }}>
                    <img
                      src={expert.avatarUrl || '/path/to/default-avatar.jpg'}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #0369a1',
                      }}
                    />
                  </div>

                  {/* Cột tên chuyên gia */}
                  <div style={{ flex: 0.75 }}>
                    <span style={{ fontWeight: 'bold', color: '#0369a1' }}>{expert.username}</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 'bold', color: '#0369a1' }}>{expert.email}</span>
                  </div>

                  <div style={{ flex: 0.75 }}>
                    <span style={{ fontWeight: 'bold', color: '#0369a1' }}>{expert.phoneNumber}</span>
                  </div>

                  {/* Cột major */}
                  <div style={{ flex: 1.5 }}>
                    <span style={{ fontWeight: 'bold', color: '#0369a1' }}>{expert.major || "N/a"}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No experts match your search.</p>
            )}


          </Paper>
          <div className="flex mt-5 justify-end">
            <p>{selectedExperts.length} Selected</p>
          </div>
          <div className="flex justify-end mt-5">
            <button
              onClick={handleDone}
              className="flex items-center gap-3 bg-blue-500 text-white hover:bg-[#1eb2a6] hover:text-white transition-all duration-300 px-5 py-2 rounded-lg shadow-md active:scale-95"
            >
              <IoIosDoneAll className="text-2xl" />
              <span className="text-lg font-medium">Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpertToScholarship;