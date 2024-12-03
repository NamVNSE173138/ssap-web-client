import RouteNames from "@/constants/routeNames";
import { setToken, setUser } from "@/reducers/tokenSlice";
import { GoogleAuth, RegisterUser } from "@/services/ApiServices/authenticationService";
import parseJwt from "@/services/parseJwt";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import RegisterImage from "../../../assets/login-image.jpg";
import { FaEnvelope, FaEye, FaEyeSlash, FaIdBadge, FaImage, FaKey, FaMapMarkedAlt, FaPhoneAlt, FaUser, FaUserAlt, FaUsers } from "react-icons/fa";
import ScreenSpinner from "../../../components/ScreenSpinner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { NotifyNewUser } from "@/services/ApiServices/notification";
import { notification } from "antd";
import { IoIosArrowForward } from "react-icons/io";
import { MdPersonPin } from "react-icons/md";
import { uploadFile } from "@/services/ApiServices/fileUploadService";
import { addProviderDetails } from "@/services/ApiServices/providerService";
import { addFunderDetails } from "@/services/ApiServices/funderService";
import { Table, TableBody, TableContainer } from "@mui/material";
import DocumentRows from "./DocumentRows";
import { Button } from "@/components/ui/button";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { dataListLabelPropDefs } from "@radix-ui/themes/dist/esm/components/data-list.props.js";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("This is not a valid email."),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (value) => /^\d+$/.test(value) && value.length === 10,
      "Phone number must be exactly 10 digits"
    ),
  fullName: z.string().min(1, "Full name is required"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }
    ),
  address: z.string().min(1, { message: "Address is required" }),
  roleId: z.number().refine(
    (value) => [2, 4, 5].includes(value),
    "RoleId must be 2 (Funder), 4 (Provider), or 5 (Applicant)"
  ),
  status: z
    .string()
    .refine(
      (value) => ["Pending", "Active"].includes(value),
      "Status must be 'Pending' or 'Active'"
    ),
  organizationName: z.string().optional(),
  contactPersonName: z.string().optional(),
  providerDocuments: z
    .array(
      z.object({
        name: z.string().min(1, "Document name is required"),
        type: z.string().min(1, "Document type is required"),
        file: z.instanceof(File).refine((file) => file.size > 0, "File is required")
      })
    )
    .optional(),
});


const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [securePassword, setSecurePassword] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(5);
  const [isOpen, setIsOpen] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [rowId, setRowId] = useState<number>(0);
  const [rows, setRows] = useState<any[]>([
    //{ id: 1, name: 'CV', type: "PDF", file: null, isNew: false },
    //{ id: 2, name: 'IELTS', type: "PDF", file: null, isNew: false }
  ]);

  const handleAddRow = () => {
    setRowId(rowId + 1);
    const newRow = { id: rowId + 1, name: "", type: "" }; // Blank row for user input
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleDocumentInputChange = (id: number, field: any, value: any) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phoneNumber: "",
      fullName: "",
      password: "",
      address: "",
      roleId: selectedRole,
      status: selectedRole === 5 ? "Active" : "Pending",
      organizationName: selectedRole === 5 ? null : "",
      contactPersonName: selectedRole === 5 ? null : "",
      documents: selectedRole === 5 ? null : [],
    },
  });  

  const formRef = useRef<HTMLFormElement | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (selectedRole === 4 || selectedRole === 2) {
      setValue("organizationName", "");
      setValue("contactPersonName", "");
      setValue("documents", []);
    } else {
      setValue("organizationName", "");
      setValue("contactPersonName", "");
      setValue("documents", []);
    }
  }, [selectedRole, setValue]);

  const handleRegisterSubmit = async (data: any) => {
    console.log(error)
    setIsLoading(true);
    try {
      const status = selectedRole === 5 ? "Active" : "Pending";

      let uploadUrls = [];
      if (selectedFile) {
        const uploadResponse = await uploadFile([selectedFile]);
        uploadUrls = uploadResponse.data;
      }

      const userData = {
        ...data,
        status,
        roleId: selectedRole,
        avatarUrl: uploadUrls.length > 0 ? uploadUrls[0] : "",
      };

      const user = await RegisterUser(userData);

      setIsLoading(false);
      dispatch(setToken(user.token));
      const userInfo = parseJwt(user.token);
      dispatch(setUser(userInfo));
      navigate(RouteNames.LOGIN);

      notification.success({
        message: "Registration Successful",
        description: "You can now log in.",
        duration: 5,
      });

      await NotifyNewUser(userInfo.id);
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      const errorMessage =
        error?.response?.data?.message || "An error occurred. Please try again later.";
      notification.error({
        message: "Registration Failed",
        description: errorMessage,
        duration: 5,
      });
    }
  };

  const handleRegisterSubmitProvider = async (data: any) => {
    console.log(data);

    setIsLoading(true);
    try {

      const status = "Pending";

      let uploadUrls = [];
      if (selectedFile) {
        const uploadResponse = await uploadFile([selectedFile]);
        uploadUrls = uploadResponse.data;
      }

      const userData = {
        ...data,
        status,
        roleId: selectedRole,
        avatarUrl: uploadUrls.length > 0 ? uploadUrls[0] : "",
      };

      const user = await RegisterUser(userData);

      setIsLoading(false);
      dispatch(setToken(user.token));
      const userInfo = parseJwt(user.token);
      const userId = userInfo.id;
      dispatch(setUser(userInfo));
      navigate(RouteNames.LOGIN);

      notification.success({
        message: "Registration Successful",
        description: "You can now log in.",
        duration: 5,
      });

      await handleProviderDetails(userId, data);

      await NotifyNewUser(userInfo.id);

    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      const errorMessage =
        error?.response?.data?.message || "An error occurred. Please try again later.";
      notification.error({
        message: "Registration Failed",
        description: errorMessage,
        duration: 5,
      });
    }
  };

  const handleProviderDetails = async (userId: number, data: any) => {
    console.log(userId);
    console.log(data);


    const applicationDocuments = [];
    if (rows.length !== 0) {
      setRows(
        rows.map((row) => ({
          ...row,
          errors: {
            name: !row.name,
            type: !row.type,
            file: !row.file,
          },
        }))
      );

      for (const row of rows) {
        if (!row.name || !row.type || !row.file) return;

        // const formData = new FormData();
        // formData.append("File", row.file);
        const name = await uploadFile([row.file]);

        const documentData = {
          name: row.name,
          type: row.type,
          fileUrl: name.data[0],
        };
        applicationDocuments.push(documentData);
      }
    }
    else {
    }
    const providerData = {
      organizationName: data.organizationName,
      contactPersonName: data.contactPersonName,
      providerDocuments: applicationDocuments,
    };

    try {
      await addProviderDetails(userId, providerData);
    } catch (error: any) {
      console.log("Error adding Provider details:", error);
      notification.error({
        message: "Failed to Add Provider Details",
        description: error?.response?.data?.message || "An error occurred while adding provider details.",
        duration: 5,
      });
    }
  };

  const handleRegisterSubmitFunder = async (data: any) => {
    setIsLoading(true);
    try {
      const status = "Pending";

      let uploadUrls = [];
      if (selectedFile) {
        const uploadResponse = await uploadFile([selectedFile]);
        uploadUrls = uploadResponse.data;
      }

      const userData = {
        ...data,
        status,
        roleId: selectedRole,
        avatarUrl: uploadUrls.length > 0 ? uploadUrls[0] : "",
      };

      const user = await RegisterUser(userData);

      setIsLoading(false);
      dispatch(setToken(user.token));
      const userInfo = parseJwt(user.token);
      const userId = userInfo.id;
      dispatch(setUser(userInfo));
      navigate(RouteNames.LOGIN);

      notification.success({
        message: "Registration Successful",
        description: "You can now log in.",
        duration: 5,
      });

      await handleFunderDetails(userId, data);

      await NotifyNewUser(userInfo.id);

    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      const errorMessage =
        error?.response?.data?.message || "An error occurred. Please try again later.";
      notification.error({
        message: "Registration Failed",
        description: errorMessage,
        duration: 5,
      });
    }
  };

  const handleFunderDetails = async (userId: number, data: any) => {
    const applicationDocuments = [];
    if (rows.length !== 0) {
      setRows(
        rows.map((row) => ({
          ...row,
          errors: {
            name: !row.name,
            type: !row.type,
            file: !row.file,
          },
        }))
      );

      for (const row of rows) {
        if (!row.name || !row.type || !row.file) return;

        // const formData = new FormData();
        // formData.append("File", row.file);
        const name = await uploadFile([row.file]);

        const documentData = {
          name: row.name,
          type: row.type,
          fileUrl: name.data[0],
        };
        applicationDocuments.push(documentData);
      }
    }
    else {
    }
    const funderData = {
      organizationName: data.organizationName,
      contactPersonName: data.contactPersonName,
      funderDocuments: applicationDocuments,
    };

    try {
      await addFunderDetails(userId, funderData);
    } catch (error: any) {
      console.log("Error adding Funder details:", error);
      notification.error({
        message: "Failed to Add Funder Details",
        description: error?.response?.data?.message || "An error occurred while adding funder details.",
        duration: 5,
      });
    }
  };

  const handleFormSubmit = (data: any) => {
    console.log(data);

    if (!selectedRole) {
      notification.error({ message: "Please select a role first." });
      return;
    }
    console.log(selectedRole)
    if (selectedRole === 4) {
      // console.log(data);

      handleRegisterSubmitProvider(data);
    } else if (selectedRole === 2) {
      handleRegisterSubmitFunder(data);
    } else if (selectedRole === 5) {
      handleRegisterSubmit(data);
    }
  };

  const handleRoleSelection = (roleId: number) => {
    setSelectedRole(roleId);
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBackStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="h-full">
      <div className="h-screen w-screen relative">
        <div className="absolute top-0 left-0 w-full h-full">
          <img
            src={RegisterImage}
            alt="Register background"
            className="w-full h-full object-cover "
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-black z-10 opacity-5 "></div>{" "}
        <div className="absolute md:w-[50%] w-[80%] h-[60%] md:h-[80%] md:p-[30px] p-2 top-1/2 left-1/2 bg-[rgba(255,255,255,0.75)] z-20 -translate-x-1/2 -translate-y-1/2 rounded-md">
          <div className="w-full h-full bg-transparent md:px-10 px-5 flex flex-col justify-top">
            <div className="w-full">
              <h3 className="text-3xl mb-7 md:mb-7 md:text-4xl text-black font-bold text-center">
                BECOME A MEMBER
              </h3>
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${currentStep === 1 ? "bg-blue-600" : "bg-gray-300"}`}>
                1
              </div>
              <div className="h-1 w-20 bg-gray-300 mx-2"></div>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${currentStep === 2 ? "bg-blue-600" : "bg-gray-300"}`}>
                2
              </div>
              <div className="h-1 w-20 bg-gray-300 mx-2"></div>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${currentStep === 3 ? "bg-blue-600" : "bg-gray-300"}`}>
                3
              </div>
            </div>

            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Choose Your Role</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {["Funder", "Provider", "Applicant"].map((role, index) => {
                    let roleId: any;
                    let roleDescription = "";

                    if (role === "Funder") {
                      roleId = 2;
                      roleDescription =
                        "You will provide scholarships. Submit relevant certifications to register.";
                    } else if (role === "Provider") {
                      roleId = 4;
                      roleDescription =
                        "Focusing on offering services. Submit appropriate certifications to register.";
                    } else if (role === "Applicant") {
                      roleId = 5;
                      roleDescription =
                        "You can purchase services and apply for scholarships provided by Providers/Funders.";
                    }

                    return (
                      <div
                        key={index}
                        onClick={() => handleRoleSelection(roleId)}
                        className={`p-6 cursor-pointer border rounded-lg shadow-md transition-transform duration-300 hover:scale-105 ${selectedRole === roleId ? "bg-blue-100 border-blue-500" : "border-gray-300"
                          }`}
                      >
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">{role}</h3>
                        {selectedRole === roleId && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200 mt-2">
                            {roleDescription}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleNextStep}
                  disabled={!selectedRole}
                  className={`mt-6 py-3 px-5 rounded-xl w-full transition-all duration-300 ${selectedRole
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Next Step
                </button>

                <div className="w-full flex justify-center mt-3">
                  <p className="text-base text-black">
                    You already have an account?{" "}
                    <Link to="/login">
                      <span className="font-semibold underline cursor-pointer">
                        Login
                      </span>
                    </Link>
                  </p>
                </div>
              </div>

            )}

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Fill in Your Information</h2>
                  <div className="space-y-6 overflow-y-auto max-h-[270px]">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-black-600">📋</span>
                      <span className="text-black-600 text-2xl">Basic Information</span>
                    </h3>
                    <div className="space-y-1">
                      <label className="block text-gray-700 font-medium">
                        <FaUser className="inline text-blue-600 mr-2" /> Username
                      </label>
                      <div className="flex items-center border p-3 rounded-md border-gray-400">
                        <input
                          {...register("username")}
                          placeholder="Enter your username"
                          className="w-full text-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md"
                        />
                      </div>
                      {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-700 font-medium">
                        <FaEnvelope className="inline text-blue-600 mr-2" /> Email
                      </label>
                      <div className="flex items-center border p-3 rounded-md border-gray-400">
                        <input
                          {...register("email")}
                          placeholder="Enter your email"
                          className="w-full text-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-700 font-medium">
                        <FaPhoneAlt className="inline text-blue-600 mr-2" /> Phone Number
                      </label>
                      <div className="flex items-center border p-3 rounded-md border-gray-400">
                        <input
                          {...register("phoneNumber")}
                          placeholder="Enter your phone number"
                          className="w-full text-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md"
                        />
                      </div>
                      {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-700 font-medium">
                        <MdPersonPin className="inline text-blue-600 mr-2" /> Full Name
                      </label>
                      <div className="flex items-center border p-3 rounded-md border-gray-400">
                        <input
                          {...register("fullName")}
                          placeholder="Enter your full name"
                          className="w-full text-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md"
                        />
                      </div>
                      {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-700 font-medium">
                        <FaKey className="inline text-blue-600 mr-2" /> Password
                      </label>
                      <div className="flex items-center border p-3 rounded-md border-gray-400">
                        <input
                          {...register("password")}
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          className="w-full text-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md"
                        />
                        <div className="ml-3 cursor-pointer" onClick={togglePasswordVisibility}>
                          {showPassword ? (
                            <FaEyeSlash className="text-gray-500" />
                          ) : (
                            <FaEye className="text-gray-500" />
                          )}
                        </div>
                      </div>
                      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-700 font-medium">
                        <FaMapMarkedAlt className="inline text-blue-600 mr-2" /> Address
                      </label>
                      <div className="flex items-center border p-3 rounded-md border-gray-400">
                        <input
                          {...register("address")}
                          placeholder="Enter your address"
                          className="w-full text-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md"
                        />
                      </div>
                      {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-gray-700 font-medium">
                        <FaImage className="inline text-blue-600 mr-2" /> Upload Avatar
                      </label>
                      <div className="flex items-center border p-3 rounded-md border-gray-400">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="w-full text-gray-800 p-3 focus:outline-none"
                          accept="image/*"
                        />
                      </div>
                    </div>
                    {(selectedRole === 4 || selectedRole === 2) && (
                      <>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                          <span className="text-black-600">📋</span>
                          <span className="text-black-600 text-2xl">Necessary information</span>
                        </h3>
                        <div className="space-y-1">
                          <label className="block text-gray-700 font-medium">
                            Organization Name
                          </label>
                          <div className="flex items-center border p-3 rounded-md border-gray-400">
                            <input
                              {...register("organizationName")}
                              placeholder="Enter your organization name"
                              className="w-full text-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md"
                            />
                          </div>
                          {errors.organizationName && (
                            <p className="text-red-500 text-sm">{errors.organizationName.message}</p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="block text-gray-700 font-medium">
                            Contact Person Name
                          </label>
                          <div className="flex items-center border p-3 rounded-md border-gray-400">
                            <input
                              {...register("contactPersonName")}
                              placeholder="Enter contact person name"
                              className="w-full text-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md"
                            />
                          </div>
                          {errors.contactPersonName && (
                            <p className="text-red-500 text-sm">{errors.contactPersonName.message}</p>
                          )}
                        </div>

                        <div className="space-y-4">
                          <label className="block text-gray-700 font-medium">
                            Documents
                          </label>

                          <Button
                            type="button"
                            onClick={handleAddRow}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                          >
                            <HiOutlinePlusCircle className="text-2xl" />
                            <span className="font-medium">Add Extend Document</span>
                          </Button>

                          <div className="mt-4 p-4 rounded-lg border border-gray-300 bg-white shadow-md">
                            <TableContainer>
                              <Table>
                                <TableBody>
                                  {rows && rows.length > 0 && rows.map((row: any) => (
                                    <DocumentRows
                                      key={row.id}
                                      row={row}
                                      setRows={setRows}
                                      documentType={[
                                        "Provider’s Organizational Profile",
                                        "Quality Assurance Certificate",
                                        "Curriculum Vitae (CV) of Lead Instructor",
                                        "Proof of Financial Capacity",
                                        "Funder’s Organizational Profile",
                                        "Others"
                                      ]}
                                      handleDeleteRow={handleDeleteRow}
                                      handleInputChange={handleDocumentInputChange}
                                    />
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </div>

                          {/* Error Message */}
                          {errors.documents && (
                            <p className="text-red-500 text-sm mt-2">{errors.documents.message}</p>
                          )}
                        </div>

                      </>
                    )}

                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={handleBackStep}
                      className="bg-gray-200 text-gray-700 p-3 rounded-md w-1/4 hover:bg-gray-300 transition-colors duration-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={!selectedRole}
                      className="bg-blue-600 text-white p-3 rounded-md w-1/4 hover:bg-blue-700 transition-colors duration-300"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <div className="overflow-y-auto max-h-[300px]">
                    <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center ">Preview Your Details</h2>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-black-600">📋</span>
                      <span className="text-black-600 text-2xl">Basic Information</span>
                    </h3>
                    <div className="flex space-x-6 overflow-y-auto max-h-[270px]">
                      <div className="flex-1">
                        {selectedFile && (
                          <div className="mt-4 flex justify-center">
                            <div>
                              <p className="font-semibold text-lg text-gray-800 text-center">Avatar:</p>
                              <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Avatar Preview"
                                className="mt-2 w-32 h-32 object-cover rounded-full mx-auto"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="border-l border-gray-400 h-full "></div>
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center space-x-3">
                          <FaUsers className="text-blue-600 text-2xl" />
                          <p className="text-lg text-gray-800 font-medium">
                            <strong>Role:</strong> {selectedRole === 2 ? "Funder" : selectedRole === 4 ? "Provider" : "Applicant"}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <FaUser className="text-blue-600 text-2xl" />
                          <p className="text-lg text-gray-800 font-medium">
                            <strong>Username:</strong> {watch("username")}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <FaEnvelope className="text-blue-600 text-2xl" />
                          <p className="text-lg text-gray-800 font-medium">
                            <strong>Email:</strong> {watch("email")}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <FaPhoneAlt className="text-blue-600 text-2xl" />
                          <p className="text-lg text-gray-800 font-medium">
                            <strong>Phone Number:</strong> {watch("phoneNumber")}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <FaIdBadge className="text-blue-600 text-2xl" />
                          <p className="text-lg text-gray-800 font-medium">
                            <strong>Full Name:</strong> {watch("fullName")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <br></br>
                    {(selectedRole === 4 || selectedRole === 2) && (
                      <>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                          <span className="text-black-600">📋</span>
                          <span className="text-black-600 text-2xl">Necessary Information</span>
                        </h3>
                        <div className="space-y-4">
                          {/* Organization Name */}
                          <div className="flex items-center space-x-3">
                            <p className="text-lg text-gray-800 font-medium">
                              <strong>Organization Name:</strong> {watch("organizationName") || "Not provided"}
                            </p>
                          </div>

                          {/* Contact Person Name */}
                          <div className="flex items-center space-x-3">
                            <p className="text-lg text-gray-800 font-medium">
                              <strong>Contact Person Name:</strong> {watch("contactPersonName") || "Not provided"}
                            </p>
                          </div>

                          {/* Documents */}
                          <div className="flex items-center space-x-3">
                            <p className="text-lg text-gray-800 font-medium">
                              <strong>Documents:</strong>
                              {rows && rows.length > 0 ? (
                                rows.map((row: any, index: number) => (
                                  <div key={index} className="flex space-x-4">
                                    <div className="text-sm text-gray-700">
                                      <strong># {index + 1}</strong>
                                    </div>

                                    <div className="text-sm text-gray-700">
                                      <strong>Name:</strong> {row.name?.length > 10 ? `${row.name.substring(0, 10)}...` : row.name}
                                    </div>

                                    <div className="text-sm text-gray-700">
                                      <strong>Type:</strong> {row.type}
                                    </div>

                                    <div className="text-sm text-gray-700">
                                      <strong>URL:</strong> {row.fileName ? (
                                        <a target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                          {row.fileName.length > 20 ? `${row.fileName.substring(0, 20)}...` : row.fileName}
                                        </a>
                                      ) : (
                                        <span className="text-gray-500">No File provided</span>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <span className="text-sm text-gray-700">No documents uploaded</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                  </div>
                  <div className="mt-12 flex justify-between">
                    <button onClick={handleBackStep} className="bg-gray-200 text-gray-700 p-3 rounded-md w-1/4 hover:bg-gray-300 transition-colors duration-300">Back</button>
                    <button type="submit" className="bg-blue-600 text-white p-3 rounded">Confirm & Register</button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      {isLoading && <ScreenSpinner />}
    </div>
  );
};

export default Register;
