import RouteNames from "@/constants/routeNames";
import { setToken, setUser } from "@/reducers/tokenSlice";
import { RegisterUser } from "@/services/ApiServices/authenticationService";
import parseJwt from "@/services/parseJwt";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import RegisterImage from "../../../assets/login-image.jpg";
import { FaBook, FaBuilding, FaCalendarAlt, FaEnvelope, FaEye, FaEyeSlash, FaFileAlt, FaFlag, FaGraduationCap, FaImage, FaInfoCircle, FaKey, FaMapMarkedAlt, FaPhoneAlt, FaUniversity, FaUser, FaUserAlt, FaUsers, FaUserTie, FaVenusMars } from "react-icons/fa";
import ScreenSpinner from "../../../components/ScreenSpinner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotifyNewUser } from "@/services/ApiServices/notification";
import { Modal, notification } from "antd";
import { uploadFile } from "@/services/ApiServices/fileUploadService";
import { addProviderDetails } from "@/services/ApiServices/providerService";
import { addFunderDetails } from "@/services/ApiServices/funderService";
import { Table, TableBody, TableContainer } from "@mui/material";
import DocumentRows from "./DocumentRows";
import { Button } from "@/components/ui/button";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { sendOtp, verifyOtp } from "@/services/ApiServices/accountService";
import { addApplicantProfile } from "@/services/ApiServices/applicantProfileService";
import { getAllUniversities } from "@/services/ApiServices/universityService";

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
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  major: z.string().optional(),
  gpa: z.number().optional(),
  school: z.string().optional(),
  nationality: z.string().optional(),
  ethnicity: z.string().optional()
});


const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const error = null
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(5);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [rowId, setRowId] = useState<number>(0);
  const [rows, setRows] = useState<any[]>([]);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [schools, setSchools] = useState<string[]>([]);
  const [customSchool, setCustomSchool] = useState<boolean>(false);
  const [selectedSchool, setSelectedSchool] = useState<string>("");

  const getSchool = async () => {
    try {
      const response = await getAllUniversities();
      const schoolNames = response.data.map((school: any) => school.name);
      console.log(schoolNames)
      setSchools(schoolNames);
    } catch (error) {
      console.log("Error fetching universities:", error);
    }
  };

  useEffect(() => {
    getSchool();
  }, []);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "Other") {
      setCustomSchool(true);
      setSelectedSchool("");
    } else {
      setCustomSchool(false);
      setSelectedSchool(value);
    }
  };

  const handleAddRow = () => {
    setRowId(rowId + 1);
    const newRow = { id: rowId + 1, name: "", type: "" };
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
      password: "",
      address: "",
      roleId: selectedRole,
      status: selectedRole === 5 ? "Active" : "Pending",
      organizationName: selectedRole === 5 ? "" : "",
      contactPersonName: selectedRole === 5 ? "" : "",
      documents: selectedRole === 5 ? null : [],
      firstName: selectedRole === 4 || selectedRole === 2 ? "" : "",
      lastName: selectedRole === 4 || selectedRole === 2 ? "" : "",
      birthDate: selectedRole === 4 || selectedRole === 2 ? "" : "",
      gender: selectedRole === 4 || selectedRole === 2 ? "" : "",
      major: selectedRole === 4 || selectedRole === 2 ? "" : "",
      gpa: selectedRole === 4 || selectedRole === 2 ? "" : 0,
      school: selectedRole === 4 || selectedRole === 2 ? "" : "",
      nationality: selectedRole === 4 || selectedRole === 2 ? "" : "",
      ethnicity: selectedRole === 4 || selectedRole === 2 ? "" : "",
    },
  });

  const onError = () => {
    if (Object.keys(errors).length > 0) {
      notification.error({
        message: "Something's wrong in the previous step!",
        description: "Please check the errors in the form and try again.",
      });
    }
    console.log(errors);
  };

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
    } else if (selectedRole === 5) {
      setValue("firstName", "");
      setValue("lastName", "");
      setValue("birthDate", "");
      setValue("gender", "");
      setValue("major", "");
      setValue("gpa", 0);
      setValue("school", "");
      setValue("nationality", "");
      setValue("ethnicity", "");
    } else {
      setValue("organizationName", "");
      setValue("contactPersonName", "");
      setValue("documents", []);
    }
  }, [selectedRole, setValue]);


  useEffect(() => {
    if (currentStep === 3) {
      setValue("email", email);
    }
  }, [currentStep, email, setValue]);

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
      const userId = userInfo.id;
      dispatch(setUser(userInfo));
      navigate(RouteNames.LOGIN);

      notification.success({
        message: "Registration Successful",
        description: "You can now log in.",
        duration: 5,
      });

      await NotifyNewUser(userInfo.id);
      await handleApplicantData(userId, data);

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

  const handleApplicantData = async (userId: number, data: any) => {
    const applicantData = {
      userId,
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: data.birthDate,
      gender: data.gender,
      major: data.major,
      gpa: data.gpa,
      school: data.school,
      nationality: data.nationality,
      ethnicity: data.ethnicity,
    };

    try {
      await addApplicantProfile(userId, applicantData);
    } catch (error: any) {
      console.log("Error adding Applicant data:", error);
      notification.error({
        message: "Failed to Add Applicant Data",
        description:
          error?.response?.data?.message || "An error occurred while adding applicant details.",
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
    if (currentStep === 2) {
      setOtp("");
    }

    setCurrentStep(currentStep + 1);
  };


  const handleBackStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSendOtp = () => {
    setIsDialogVisible(true);
  };

  const confirmSendOtp = async () => {
    try {
      setIsDialogVisible(false);
      await sendOtp(email);
      notification.success({
        message: "We have sent an email to verify",
      });
      setIsOtpSent(true);
    } catch (error: any) {
      notification.error({
        message: "Failed to send OTP",
        description: error.response?.data?.message || "Please try again later.",
      });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsVerifyingOtp(true);
      await verifyOtp(email, otp);
      notification.success({ message: "OTP verified successfully! Now you can next step" });
      setIsOtpVerified(true);
    } catch (error: any) {
      notification.error({
        message: "Invalid OTP",
        description: "The OTP you entered is incorrect. Please try again.",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
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
              <div className="h-1 w-20 bg-gray-300 mx-2"></div>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${currentStep === 4 ? "bg-blue-600" : "bg-gray-300"}`}>
                4
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
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                  Verify Step
                </h2>
                <div className="space-y-6 overflow-y-auto max-h-[270px]">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="text-black-600 text-2xl">Enter your email</span>
                  </h3>

                  <div className="flex justify-center">
                    <div className="space-y-1 w-3/4">
                      <div className="flex items-center border p-3 rounded-md border-gray-400">
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full text-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="bg-blue-600 text-white p-2 rounded ml-5"
                      onClick={handleSendOtp}
                    >
                      Send OTP
                    </button>
                  </div>

                  <Modal
                    title="Confirm Email"
                    open={isDialogVisible}
                    onOk={confirmSendOtp}
                    onCancel={() => setIsDialogVisible(false)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <p>Are you sure you want to use this email: <strong>{email}</strong> for our website?</p>
                  </Modal>

                  {isOtpSent && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <span className="text-black-600 text-2xl">Enter OTP</span>
                      </h3>
                      <div className="flex justify-center">
                        <div className="space-y-1 w-3/4">
                          <div className="flex items-center border p-3 rounded-md border-gray-400">
                            <input
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Enter your OTP"
                              className="w-full text-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="bg-blue-600 text-white p-2 rounded ml-5"
                          onClick={handleVerifyOtp}
                          disabled={isVerifyingOtp}
                        >
                          {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                        </button>
                      </div>
                    </div>
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
                    disabled={!isOtpVerified || !selectedRole}
                    className={`bg-blue-600 text-white p-3 rounded-md w-1/4 hover:bg-blue-700 transition-colors duration-300 ${!isOtpVerified || !selectedRole ? 'bg-gray-400 cursor-not-allowed' : ''
                      }`}
                  >
                    Next Step
                  </button>

                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Fill in Your Information</h2>
                  <div className="space-y-6 overflow-y-auto max-h-[270px]">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-black-600">📋</span>
                      <span className="text-black-600 text-2xl">Basic Information</span>
                    </h3>
                    <div className="max-w-5xl mx-auto p-6 bg-[rgba(255,255,255,0.75)] shadow-lg rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Username */}
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            <FaUser className="inline text-blue-600 mr-2" /> Username
                          </label>
                          <div className="relative">
                            <input
                              {...register("username")}
                              placeholder="Enter your username"
                              className="w-full text-gray-800 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {errors.username && (
                            <p className="text-red-500 text-sm mt-2">{errors.username.message}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            <FaEnvelope className="inline text-blue-600 mr-2" /> Email
                          </label>
                          <div className="relative">
                            <input
                              {...register("email")}
                              value={email?.length > 18 ? `${email.substring(0, 15)}...` : email}
                              disabled
                              placeholder="Enter your email"
                              className="w-full text-gray-800 p-3 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
                          )}
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            <FaPhoneAlt className="inline text-blue-600 mr-2" /> Phone
                          </label>
                          <div className="relative">
                            <input
                              {...register("phoneNumber")}
                              placeholder="Enter your phone number"
                              className="w-full text-gray-800 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {errors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-2">{errors.phoneNumber.message}</p>
                          )}
                        </div>

                        {/* Password */}
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            <FaKey className="inline text-blue-600 mr-2" /> Password
                          </label>
                          <div className="flex items-center">
                            <input
                              {...register("password")}
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="w-full text-gray-800 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="ml-3 text-gray-500 hover:text-blue-500"
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>
                          )}
                        </div>

                        {/* Address */}
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            <FaMapMarkedAlt className="inline text-blue-600 mr-2" /> Address
                          </label>
                          <div className="relative">
                            <input
                              {...register("address")}
                              placeholder="Enter your address"
                              className="w-full text-gray-800 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {errors.address && (
                            <p className="text-red-500 text-sm mt-2">{errors.address.message}</p>
                          )}
                        </div>

                        {/* Avatar Upload */}
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            <FaImage className="inline text-blue-600 mr-2" /> Upload Avatar
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              onChange={handleFileChange}
                              className="w-full text-gray-800 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                              accept="image/*"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {(selectedRole === 5) && (
                      <>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                          <span className="text-black-600">📋</span>
                          <span className="text-black-600 text-2xl flex items-center gap-2">
                            Profile Information
                            <FaInfoCircle
                              className="text-gray-600 cursor-pointer"
                              title="You must provide more information for us"
                            />
                          </span>
                        </h3>
                        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">First Name</label>
                              <input
                                {...register("firstName")}
                                placeholder="Enter your first name"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                            </div>

                            {/* Last Name */}
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                              <input
                                {...register("lastName")}
                                placeholder="Enter your last name"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                            </div>

                            {/* Birth Date */}
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">Birth Date</label>
                              <input
                                {...register("birthDate")}
                                type="date"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>}
                            </div>

                            {/* Gender */}
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">Gender</label>
                              <select
                                {...register("gender")}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select your gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                            </div>

                            {/* Major */}
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">Major (Optional)</label>
                              <input
                                {...register("major")}
                                placeholder="Enter your major"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {errors.major && <p className="text-red-500 text-sm mt-1">{errors.major.message}</p>}
                            </div>

                            {/* GPA */}
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">GPA (Optional)</label>
                              <input
                                {...register("gpa", {
                                  setValueAs: (value) => (value === "" ? undefined : Number(value)),
                                  onChange: (e) => {
                                    setValue("gpa", Number(e.target.value), {
                                      shouldValidate: true,
                                    });
                                  },
                                })}
                                type="number"
                                placeholder="Enter your GPA"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {errors.gpa && <p className="text-red-500 text-sm mt-1">{errors.gpa.message}</p>}
                            </div>

                            {/* School */}
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">University</label>
                              {customSchool ? (
                                <input
                                  {...register("school")}
                                  placeholder="Enter your school"
                                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : (
                                <select
                                  {...register("school")} // Đảm bảo rằng trường "school" được đăng ký vào react-hook-form
                                  value={selectedSchool}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    handleSelectionChange(e); // Giữ logic xử lý
                                    setValue("school", value, { shouldValidate: true }); // Đồng bộ giá trị với react-hook-form
                                    setSelectedSchool(value); // Cập nhật giá trị vào state selectedSchool
                                  }}
                                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select a school</option>
                                  {schools.map((school: string, index: number) => (
                                    <option key={index} value={school}>
                                      {school}
                                    </option>
                                  ))}
                                  <option value="Other">Other</option>
                                </select>
                              )}
                              {errors.school && <p className="text-red-500 text-sm mt-1">{errors.school.message}</p>}
                            </div>

                            {/* Nationality */}
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">Nationality (Optional)</label>
                              <input
                                {...register("nationality")}
                                placeholder="Enter your nationality"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality.message}</p>}
                            </div>

                            {/* Ethnicity */}
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">Ethnicity (Optional)</label>
                              <input
                                {...register("ethnicity")}
                                placeholder="Enter your ethnicity"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {errors.ethnicity && <p className="text-red-500 text-sm mt-1">{errors.ethnicity.message}</p>}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {(selectedRole === 4 || selectedRole === 2) && (
                      <>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                          <span className="text-black-600">📋</span>
                          <span className="text-black-600 text-2xl flex items-center gap-2">
                            Necessary Information
                            <FaInfoCircle
                              className="text-gray-600 cursor-pointer"
                              title="You must provide more information for us to check your business"
                            />
                          </span>
                        </h3>

                        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Organization Name and Contact Person Name (Same Row) */}
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">Organization Name</label>
                              <div className="flex items-center border p-3 rounded-md border-gray-400">
                                <input
                                  {...register("organizationName")}
                                  placeholder="Enter your organization name"
                                  className="w-full text-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md"
                                />
                              </div>
                              {errors.organizationName && (
                                <p className="text-red-500 text-sm mt-1">{errors.organizationName.message}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-gray-700 font-medium mb-2">Contact Person Name</label>
                              <div className="flex items-center border p-3 rounded-md border-gray-400">
                                <input
                                  {...register("contactPersonName")}
                                  placeholder="Enter contact person name"
                                  className="w-full text-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md"
                                />
                              </div>
                              {errors.contactPersonName && (
                                <p className="text-red-500 text-sm mt-1">{errors.contactPersonName.message}</p>
                              )}
                            </div>
                          </div>

                          {/* Documents Section */}
                          <div className="mt-8">
                            <label className="block text-gray-700 font-medium mb-2">Documents</label>
                            <div>
                              <Button
                                type="button"
                                onClick={handleAddRow}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                              >
                                <HiOutlinePlusCircle className="text-2xl" />
                                <span className="font-medium">Add Extend Document</span>
                              </Button>
                            </div>

                            <div className="mt-4 p-4 rounded-lg border border-gray-300 bg-white shadow-md">
                              <div className="overflow-x-auto">
                                <TableContainer>
                                  <Table className="min-w-full">
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
                            </div>

                            {errors.documents && (
                              <p className="text-red-500 text-sm mt-2">{errors.documents.message}</p>
                            )}
                          </div>
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

              {currentStep === 4 && (
                <div>
                  <div className="overflow-y-auto max-h-[300px]">
                    <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center ">Preview Your Details</h2>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-black-600">📋</span>
                      <span className="text-black-600 text-2xl">Basic Information</span>
                    </h3>

                    <div className="max-w-5xl mx-auto p-6 bg-[rgba(255,255,255,0.75)] shadow-lg rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Avatar Preview */}
                        <div className="flex items-center space-x-3">
                          {selectedFile && (
                            <div className="mt-4 flex justify-center">
                              <div>
                                <p className="font-semibold text-lg text-gray-800 text-center">Avatar:</p>
                                <img
                                  src={URL.createObjectURL(selectedFile)}
                                  alt="Avatar Preview"
                                  className="mt-2 ml-9 w-32 h-32 object-cover rounded-full mx-auto"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-4">
                          {/* Role */}
                          <div className="flex items-center space-x-3">
                            <FaUsers className="text-blue-600 text-2xl" />
                            <p className="text-lg text-gray-800 font-medium">
                              <strong>Role:</strong> {selectedRole === 2 ? "Funder" : selectedRole === 4 ? "Provider" : "Applicant"}
                            </p>
                          </div>

                          {/* Username */}
                          <div className="flex items-center space-x-3">
                            <FaUser className="text-blue-600 text-2xl" />
                            <p className="text-lg text-gray-800 font-medium">
                              <strong>Username:</strong> {watch("username")?.length > 13 ? `${watch("username").substring(0, 10)}...` : watch("username") || "Not provided"}
                            </p>
                          </div>

                          {/* Email */}
                          <div className="flex items-center space-x-3">
                            <FaEnvelope className="text-blue-600 text-2xl" />
                            <p className="text-lg text-gray-800 font-medium">
                              <strong>Email:</strong> {watch("email") || "Not provided"}
                            </p>
                          </div>

                          {/* Phone Number */}
                          <div className="flex items-center space-x-3">
                            <FaPhoneAlt className="text-blue-600 text-2xl" />
                            <p className="text-lg text-gray-800 font-medium">
                              <strong>Phone:</strong> {watch("phoneNumber") || "Not provided"}
                            </p>
                          </div>

                          {/* Password */}
                          <div className="flex items-center space-x-3">
                            <FaKey className="text-blue-600 text-2xl" />
                            <p className="text-lg text-gray-800 font-medium">
                              <strong>Password:</strong> {watch("password") ? "••••••••" : "Not provided"}
                            </p>
                          </div>

                          {/* Address */}
                          <div className="flex items-center space-x-3">
                            <FaMapMarkedAlt className="text-blue-600 text-2xl" />
                            <p className="text-lg text-gray-800 font-medium">
                              <strong>Address:</strong> {watch("address") || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <br></br>
                    {(selectedRole === 5) && (
                      <>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                          <span className="text-black-600">📋</span>
                          <span className="text-black-600 text-2xl flex items-center gap-2">
                            Profile Information
                          </span>
                        </h3>

                        <div className="max-w-5xl mx-auto p-6 bg-[rgba(255,255,255,0.75)] shadow-lg rounded-md">
                          <div className="flex space-x-6">
                            {/* Left Section */}
                            <div className="flex-1 space-y-4">
                              {/* First Name */}
                              <div className="flex items-center space-x-3">
                                <FaUserAlt className="text-blue-600 text-2xl" />
                                <p className="text-lg text-gray-800 font-medium">
                                  <strong>First Name:</strong> {watch("firstName") || "Not provided"}
                                </p>
                              </div>

                              {/* GPA */}
                              <div className="flex items-center space-x-3">
                                <FaGraduationCap className="text-blue-600 text-2xl" />
                                <p className="text-lg text-gray-800 font-medium">
                                  <strong>GPA:</strong> {watch("gpa") !== undefined ? watch("gpa") : "Not provided"}
                                </p>
                              </div>

                              {/* Birth Date */}
                              <div className="flex items-center space-x-3">
                                <FaCalendarAlt className="text-blue-600 text-2xl" />
                                <p className="text-lg text-gray-800 font-medium">
                                  <strong>Birth Date:</strong> {
                                    watch("birthDate") ? new Date(watch("birthDate")).toLocaleDateString("en-US") : "Not provided"
                                  }
                                </p>
                              </div>


                              {/* Gender */}
                              <div className="flex items-center space-x-3">
                                <FaVenusMars className="text-blue-600 text-2xl" />
                                <p className="text-lg text-gray-800 font-medium">
                                  <strong>Gender:</strong> {watch("gender") || "Not provided"}
                                </p>
                              </div>

                              {/* Major */}
                              <div className="flex items-center space-x-3">
                                <FaBook className="text-blue-600 text-2xl" />
                                <p className="text-lg text-gray-800 font-medium">
                                  <strong>Major:</strong> {watch("major") || "Not provided"}
                                </p>
                              </div>
                            </div>

                            {/* Vertical Divider */}
                            <div className="border-l border-gray-400 h-full"></div>

                            {/* Right Section */}
                            <div className="flex-1 space-y-4">
                              {/* Last Name */}
                              <div className="flex items-center space-x-3">
                                <FaUserAlt className="text-blue-600 text-2xl" />
                                <p className="text-lg text-gray-800 font-medium">
                                  <strong>Last Name:</strong> {watch("lastName") || "Not provided"}
                                </p>
                              </div>

                              {/* University */}
                              <div className="flex items-center space-x-3">
                                <FaUniversity className="text-blue-600 text-2xl" />
                                <p className="text-lg text-gray-800 font-medium">
                                  <strong>University:</strong> {watch("school") || "Not provided"}
                                </p>
                              </div>

                              {/* Nationality */}
                              <div className="flex items-center space-x-3">
                                <FaFlag className="text-blue-600 text-2xl" />
                                <p className="text-lg text-gray-800 font-medium">
                                  <strong>Nationality:</strong> {watch("nationality") || "Not provided"}
                                </p>
                              </div>

                              {/* Ethnicity */}
                              <div className="flex items-center space-x-3">
                                <FaUsers className="text-blue-600 text-2xl" />
                                <p className="text-lg text-gray-800 font-medium">
                                  <strong>Ethnicity:</strong> {watch("ethnicity") || "Not provided"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {(selectedRole === 4 || selectedRole === 2) && (
                      <>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="text-blue-600">📋</span>
                          <span className="text-2xl">Necessary Information</span>
                        </h3>

                        <div className="max-w-5xl mx-auto p-6 bg-white bg-opacity-75 shadow-lg rounded-lg">
                          {/* Combined Section for Organization and Contact Person */}
                          <div className="grid grid-cols-2 gap-6 mb-6">
                            {/* Organization Name */}
                            <div className="flex items-center space-x-3 p-4 border rounded-lg border-gray-300 shadow-sm">
                              <FaBuilding className="text-blue-600 text-2xl" />
                              <p className="text-lg text-gray-800 font-medium">
                                <strong>Organization Name:</strong> {watch("organizationName") || "Not provided"}
                              </p>
                            </div>

                            {/* Contact Person Name */}
                            <div className="flex items-center space-x-3 p-4 border rounded-lg border-gray-300 shadow-sm">
                              <FaUserTie className="text-blue-600 text-2xl" />
                              <p className="text-lg text-gray-800 font-medium">
                                <strong>Contact Person Name:</strong> {watch("contactPersonName") || "Not provided"}
                              </p>
                            </div>
                          </div>

                          {/* Documents Section */}
                          <div className="flex items-center space-x-3 mb-4">
                            <FaFileAlt className="text-blue-600 text-2xl" />
                            <span className="text-lg text-gray-800 font-medium">
                              <strong>Documents:</strong>
                            </span>
                          </div>
                          <div className="space-y-2">
                            {rows && rows.length > 0 ? (
                              rows.map((row: any, index: number) => (
                                <div key={index} className="flex items-center p-4 border rounded-lg border-gray-300 shadow-sm bg-gray-50">
                                  <div className="text-sm text-gray-700 mr-4">
                                    <strong>#{index + 1}</strong>
                                  </div>
                                  <div className="text-sm text-gray-700 mr-4">
                                    <strong>Name:</strong> {row.name?.length > 10 ? `${row.name.substring(0, 15)}...` : row.name}
                                  </div>
                                  <div className="text-sm text-gray-700">
                                    <strong>Type:</strong> {row.type}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-lg text-gray-800 font-medium p-4 border rounded-lg border-gray-300 shadow-sm bg-gray-50">
                                No documents uploaded
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                  </div>
                  <div className="mt-12 flex justify-between">
                    <button onClick={handleBackStep} className="bg-gray-200 text-gray-700 p-3 rounded-md w-1/4 hover:bg-gray-300 transition-colors duration-300">Back</button>
                    <button onClick={onError} type="submit" className="bg-blue-600 text-white p-3 rounded">Confirm & Register</button>
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