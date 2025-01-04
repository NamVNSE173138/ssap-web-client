import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useParams } from "react-router-dom";
import { ScholarshipProgramType } from "../ScholarshipProgram/data";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { FaCalendarAlt } from "react-icons/fa";
import { Checkbox, Paper } from "@mui/material";
import { getExpertsByFunder } from "@/services/ApiServices/expertService";
import { IoIosAddCircleOutline, IoIosDoneAll, IoMdClose } from "react-icons/io";
import { assignExpertsToScholarshipProgram, getAllScholarshipProgramExperts } from "@/services/ApiServices/scholarshipProgramService";
import { message, notification } from "antd";
import { SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";


const AddExpertToScholarship = () => {
  const { id } = useParams<{ id: string }>();
  const token = useSelector((state: RootState) => state.token.token);
  const [data, setData] = useState<ScholarshipProgramType | null>(null);
  const [_loading, setLoading] = useState<boolean>(true);
  const [_error, setError] = useState<string | null>(null);
  const user = useSelector((state: any) => state.token.user);
  const [_experts, setExperts] = useState<any[]>([]);
  const [selectedExperts, setSelectedExperts] = useState<any[]>([]);
  const [expertsInScholarship, setExpertsInScholarship] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredExpert, setFilteredExpert] = useState<any[]>([]);
  const [scholarshipMajor, setScholarshipMajor] = useState<any[]>([]);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(_experts?.length / ITEMS_PER_PAGE);
  const paginatedmExperts = _experts?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const filtered = _experts.filter((expert) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return (
        expert.username.toLowerCase().includes(lowerCaseSearchTerm) ||
        (expert.major && expert.major.toLowerCase().includes(lowerCaseSearchTerm))
      );
    });
    setFilteredExpert(filtered);
  }, [searchTerm, _experts]);


  const clearSearch = () => {
    setSearchTerm("");
  };

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
        setScholarshipMajor(response.data.data.major.name)
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

  const fetchExpertsInScholarship = async () => {
    try {
      const response = await getAllScholarshipProgramExperts(Number(id));
      if (response.statusCode === 200) {
        setExpertsInScholarship(response.data);
      } else {
        setError("Failed to get experts in scholarship");
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
    fetchExpertsInScholarship();
  }, [id]);

  const handleDone = async () => {
    try {
      if (!_experts || _experts.length === 0) {
        notification.error({ message: "Experts data is not loaded. Please try again later." });
        return;
      }

      const invalidExperts = selectedExperts.filter((expertId) => {
        const expert = _experts.find((e) => e.expertId === expertId);
        return !expert || expert.major !== scholarshipMajor;
      });

      if (invalidExperts.length > 0) {
        const invalidExpertNames = invalidExperts
          .map((expertId) => _experts.find((e) => e.expertId === expertId)?.username || "Unknown")
          .join(", ");
        notification.error({
          message: `The following experts do not match your scholarship major "(${scholarshipMajor})": ${invalidExpertNames}.`,
        });

        return;
      }

      await assignExpertsToScholarshipProgram(Number(id), selectedExperts);
      notification.success({ message: "Experts assigned successfully!" });

      setSelectedExperts([]);
      fetchExpertsInScholarship();

      navigate(`/scholarship-program/${id}`);
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
            <div className="w-full mt-4 lg:mt-6">
              <div className="relative w-full mb-10">
                <input
                  className="w-1/2 h-12 pl-14 pr-12 py-3 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 ease-in-out rounded-lg shadow-lg bg-gradient-to-r  text-lg placeholder-gray-500 text-gray-800"
                  placeholder="Search expert for name, major.."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 text-xl" />
                {searchTerm && (
                  <IoMdClose
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 cursor-pointer text-xl hover:text-red-500 transition-colors"
                    onClick={clearSearch}
                  />
                )}
              </div>
            </div>
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
            {paginatedmExperts.length > 0 ? (
              paginatedmExperts.map((expert: any, index: any) => {
                const isAlreadyInScholarship = expertsInScholarship.some(
                  (existingExpert) => existingExpert.expertId === expert.expertId
                );

                return (
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
                        disabled={isAlreadyInScholarship}
                        onClick={(e) => {
                          if (isAlreadyInScholarship) {
                            e.preventDefault();
                            notification.error({
                              message: `${expert.username} is already in scholarship.`,
                            });
                          }
                        }}
                        onChange={() => {
                          if (selectedExperts.includes(expert.expertId)) {
                            setSelectedExperts(
                              selectedExperts.filter((id) => id !== expert.expertId)
                            );
                          } else {
                            setSelectedExperts([...selectedExperts, expert.expertId]);
                          }
                        }}
                      />
                    </div>


                    {/* Cột số thứ tự */}
                    <div style={{ flex: 0.5 }}>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</div>

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
                );
              })
            ) : (
              <p className="text-center text-gray-500">No experts match your search.</p>
            )}
            <div style={{ marginTop: "20px", marginBottom: '10px', display: "flex", justifyContent: "end" }}>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  style={{
                    margin: "0 5px",
                    padding: "5px 10px",
                    backgroundColor: currentPage === index + 1 ? "#419f97" : "#f1f1f1",
                    color: currentPage === index + 1 ? "white" : "black",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </Paper>
          <div className="flex mt-5 justify-end">
            <p>{selectedExperts.length} Selected</p>
          </div>
          <div className="flex justify-end mt-5">
            <button
              disabled={selectedExperts.length === 0}
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