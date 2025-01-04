import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Link, useNavigate, useParams } from "react-router-dom";
import {
  NotifyFunderNewApplicant,

} from "@/services/ApiServices/notification";
import { IoIosAddCircleOutline } from "react-icons/io";
import EditableTable from "./application-document-table";
import { uploadFile } from "@/services/ApiServices/testService";
import Background from "../../../assets/back.webp";
import { getScholarshipProgram } from "@/services/ApiServices/scholarshipProgramService";
import { notification } from "antd";
import { addApplication } from "@/services/ApiServices/applicationService";
import ScholarshipContractDialog from "./ScholarshipContractDialog";
import { getApplicantProfileById } from "@/services/ApiServices/applicantProfileService";
import { z } from 'zod';
import { Button, CircularProgress } from "@mui/material";
import { FaEnvelope, FaFileAlt, FaPhoneAlt, FaUser } from "react-icons/fa";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

const ApplyScholarship = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: any) => state.token.user);
  const isApplicant = user?.id;
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    agreeTerms: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const handleNextStep = () => {
    if (currentStep < 4) {
      if (currentStep === 1) {
        const schema = z.object({
          first_name: z.string().min(1, 'First name is required'),
          last_name: z.string().min(1, 'Last name is required'),
          email: z.string().email('Invalid email format'),
          phone_number: z.string().regex(/^\d+$/, 'Invalid phone number'),
        });
        const validation = schema.safeParse(formData);
        if (!validation.success) {
          notification.error({ message: 'Please fill in all required fields correctly.' });
          return;
        }
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const [applyLoading, setApplyLoading] = useState<boolean>(false)
  const [scholarship, setScholarship] = useState<any>(null)

  const [rowId, setRowId] = useState<number>(0);
  const [rows, setRows] = useState<any[]>([]);
  const [rowIdOther, setRowIdOther] = useState<number>(0);
  const [rowsOther, setRowsOther] = useState<any[]>([]);

  const [isContractOpen, setContractOpen] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    const [profile, scholarship] = await Promise.all([
      getApplicantProfileById(user.id),
      getScholarshipProgram(Number(id))]);

    if (profile.statusCode !== 200) return;
    setScholarship(scholarship.data);
    let rowId = 0;
    setRows(
      scholarship.data.documents.filter((item: any) => item.isRequired).map((item: any) => (
        { id: ++rowId, name: item.type, type: item.type, file: null, isRequired: item.isRequired }
      ))
    )

    setRowId(rowId + 1);
    setFormData({ ...formData, first_name: profile.data.firstName, last_name: profile.data.lastName, email: profile.data.email, phone_number: profile.data.phone });
  };

  const handleAddRow = () => {
    setRowIdOther(rowId + 1);
    const newRow = { id: rowIdOther + 1, name: "", type: "Other" };
    setRowsOther([...rowsOther, newRow]);
  };

  const handleDeleteRow = (id: number) => {
    setRowsOther(rowsOther.filter((row) => row.id !== id));
  };

  const handleDocumentInputChange = (id: number, field: any, value: any) => {
    setRowsOther((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleRequiredDocumentInputChange = (id: number, field: any, value: any) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
    console.log(rows)
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      notification.error({ message: "You must agree to the terms." });
      setApplyLoading(false);
      return;
    }

    setApplyLoading(true);

    if (!scholarship) {
      notification.error({ message: "Program not found" });
      setApplyLoading(false);
      return;
    }
    if (scholarship.status == "FINISHED") {
      notification.error({ message: "Program is finished" });
      setApplyLoading(false);
      return;
    }

    setRows(
      rows.map((row) => ({
        ...row,
        errors: row.isRequired ? {
          name: !row.name,
          type: !row.type,
          file: !row.file,
        } : {},
      }))
    );
    const submitForm = new FormData();
    for (const row of rows) {
      submitForm.append("Files", row.file);
    }
    const name = await uploadFile(submitForm);
    const files = name.urls;

    const applicationDocuments = [];

    let uploadedFileId = 0;
    for (const row of rows) {
      if (row.isRequired && (!row.name || !row.type || !row.file)) {
        setApplyLoading(false);
        return;
      }
      if (row.file) {
        const documentData = {
          name: row.name == "" ? row.type : row.name,
          type: row.type,
          fileUrl: files[uploadedFileId],
        };
        uploadedFileId++;
        applicationDocuments.push(documentData);
      }
    }

    const applicationData = {
      applicantId: isApplicant,
      scholarshipProgramId: id,
      appliedDate: new Date().toISOString(),
      status: "PENDING",
      documents: applicationDocuments,
    };

    try {
      const response = await addApplication(applicationData);

      if (response.statusCode === 200) {
        await response.data;
        notification.success({ message: "Application submitted successfully" });
      } else {
        console.error("Failed to submit application");
        notification.error({ message: "Failed to submit application" });
      }
      navigate("/applicant/profile?tab=application-history");
      if (id) await NotifyFunderNewApplicant(isApplicant, parseInt(id));
    } catch (error) {
      console.error("Error submitting application:", error);
    }
    finally {
      setApplyLoading(false)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (

    <div className="md:p-[30px] p-2 top-1/2 left-1/2 bg-[rgba(255,255,255,0.75)] z-20 rounded-md">
      <div className="w-full h-full bg-transparent md:px-10 px-5 flex flex-col justify-top">
        <div className="w-full">
          {scholarship && <div className="mb-5">
            <Link className="text-blue-500 underline" to={`/scholarship-program/${id}`}>
              {`Back to ${scholarship.name}`}
            </Link>
          </div>}
          <h3 className="text-3xl mb-7 md:mb-7 md:text-4xl text-black font-bold text-center">
            SCHOLARSHIP APPLICATION
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

        {/* Step Subtitles */}
        <div className="flex justify-center">
          <div className="text-center w-32">
            <p className={`text-sm font-medium ${currentStep === 1 ? "text-blue-600" : "text-gray-500"}`}>Basic Details</p>
          </div>
          <div className="text-center w-32">
            <p className={`text-sm font-medium ${currentStep === 2 ? "text-blue-600" : "text-gray-500"}`}>Required Documents</p>
          </div>
          <div className="text-center w-32">
            <p className={`text-sm font-medium ${currentStep === 3 ? "text-blue-600" : "text-gray-500"}`}>Optional Documents</p>
          </div>
          <div className="text-center w-32">
            <p className={`text-sm font-medium ${currentStep === 4 ? "text-blue-600" : "text-gray-500"}`}>Confirm Application</p>
          </div>
        </div>

        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <div className="flex items-center justify-center bg-[rgba(255,255,255,0.75)] p-6">
            <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-2xl opacity-90">
              <h2 className="text-3xl font-semibold text-blue-600 text-center mb-6">
                Enter Your Basic Details
              </h2>

              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* First Name */}
                  <div className="mb-6">
                    <label className="text-gray-700 font-medium">First Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full p-4 pl-12 border rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter First Name"
                      />
                      <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="mb-6">
                    <label className="text-gray-700 font-medium">Last Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full p-4 pl-12 border rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Last Name"
                      />
                      <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-6">
                    <label className="text-gray-700 font-medium">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-4 pl-12 border rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Email"
                      />
                      <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="mb-6">
                    <label className="text-gray-700 font-medium">Phone Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full p-4 pl-12 border rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Phone Number"
                      />
                      <FaPhoneAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    className="bg-gray-200 text-gray-700 p-4 rounded-md w-1/4 hover:bg-gray-300 transition-colors duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="bg-blue-600 text-white p-4 rounded-md w-1/4 hover:bg-blue-700 transition-colors duration-300"
                  >
                    Next Step
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <div className="max-w-6xl mx-auto p-6 bg-[rgba(255,255,255,0.75)] shadow-lg rounded-md">

              <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Upload Required Documents</h2>

              <div className="mb-4">
                The documents with the
                <span style={{ color: 'red', marginLeft: 4, marginRight: 4 }}>*</span>
                are required by this scholarship
              </div>

              {scholarship && (
                <div className="flex gap-[20px] lg:col-span-2">
                  <EditableTable
                    documents={scholarship.documents}
                    rows={rows}
                    setRows={setRows}
                    handleInputChange={handleRequiredDocumentInputChange}
                  />
                </div>
              )}
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handlePrevStep}
                  className="bg-gray-200 text-gray-700 p-3 rounded-md w-1/4 hover:bg-gray-300 transition-colors duration-300"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className={`bg-blue-600 text-white p-3 rounded-md w-1/4 hover:bg-blue-700 transition-colors duration-300"
                      }`}
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>)}

        {currentStep === 3 && (
          <div>
            <div className="max-w-6xl mx-auto p-6 bg-[rgba(255,255,255,0.75)] shadow-lg rounded-md">

              <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Upload Additional Documents</h2>

              {/* Add Document Button */}
              <div className="flex gap-[20px] lg:col-span-2 mb-6">
                <div className="flex justify-between w-full">
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="flex justify-start items-center hover:bg-[#1eb2a6] transition-all duration-200 gap-4 px-4 py-2 bg-white rounded-lg shadow-md hover:scale-105"
                  >
                    <IoIosAddCircleOutline className="text-3xl text-black group-hover:text-white" />
                    <p className="text-xl text-black group-hover:text-white">Add Document</p>
                  </button>
                </div>
              </div>

              <div className="flex gap-[20px] lg:col-span-2">
                <EditableTable
                  documents={scholarship.documents.filter((doc: any) => !doc.isRequired)}
                  rows={rowsOther}
                  setRows={setRowsOther}
                  handleDeleteRow={handleDeleteRow}
                  handleInputChange={handleDocumentInputChange}
                />
              </div>

              {/* Navigation Buttons */}
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handlePrevStep}
                  className="bg-gray-200 text-gray-700 p-3 rounded-md w-1/4 hover:bg-gray-300 transition-colors duration-300"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="bg-blue-600 text-white p-3 rounded-md w-1/4 hover:bg-blue-700 transition-colors duration-300"
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <div className="max-w-5xl mx-auto p-6 bg-[rgba(255,255,255,0.75)] shadow-lg rounded-md">
              <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Review Your Application</h2>

              {/* Personal Information */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="flex justify-between items-center mb-4 mr-10">
                      <div className="flex items-center">
                        <FaUser className="text-gray-600 mr-2" />
                        <strong className="text-lg text-gray-700">First Name:</strong>
                      </div>
                      <span className="text-gray-600">{formData.first_name}</span>
                    </div>

                    {/* Last Name */}
                    <div className="flex justify-between items-center mb-4 mr-10">
                      <div className="flex items-center">
                        <FaUser className="text-gray-600 mr-2" />
                        <strong className="text-lg text-gray-700">Last Name:</strong>
                      </div>
                      <span className="text-gray-600">{formData.last_name}</span>
                    </div>

                    {/* Email */}
                    <div className="flex justify-between items-center mb-4 mr-10">
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-600 mr-2" />
                        <strong className="text-lg text-gray-700">Email:</strong>
                      </div>
                      <span className="text-gray-600">{formData.email}</span>
                    </div>

                    {/* Phone Number */}
                    <div className="flex justify-between items-center mb-4 mr-10">
                      <div className="flex items-center">
                        <FaPhoneAlt className="text-gray-600 mr-2" />
                        <strong className="text-lg text-gray-700">Phone:</strong>
                      </div>
                      <span className="text-gray-600">{formData.phone_number}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Required and Additional Documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Required Documents */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Required Documents</h3>
                  {scholarship && scholarship.documents && scholarship.documents.length > 0 ? (
                    <div className="space-y-4">
                      {rows.filter((doc: any) => doc.isRequired).map((doc: any, index: number) => (
                        <div key={index} className="flex items-center p-4 border rounded-lg border-gray-300 shadow-sm bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                          <FaFileAlt className="text-blue-600 text-2xl mr-3" />
                          <div className="flex-grow">
                            <strong className="text-gray-800">Name:</strong> {doc.name?.length > 10 ? `${doc.name.substring(0, 15)}...` : doc.name}
                            <div className="text-sm text-gray-600">
                              <strong>Type:</strong> {doc.type}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-lg text-gray-800 font-medium p-4 border rounded-lg border-gray-300 shadow-sm bg-gray-50">
                      No required documents uploaded
                    </div>
                  )}
                </div>

                {/* Additional Documents */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Documents</h3>
                  {rowsOther && rowsOther.length > 0 ? (
                    <div className="space-y-4">
                      {rowsOther.map((row: any, index: number) => (
                        <div key={index} className="flex items-center p-4 border rounded-lg border-gray-300 shadow-sm bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                          <FaFileAlt className="text-blue-600 text-2xl mr-3" />
                          <div className="flex-grow">
                            <strong className="text-gray-800">Name:</strong> {row.name?.length > 10 ? `${row.name.substring(0, 15)}...` : row.name}
                            <div className="text-sm text-gray-600">
                              <strong>Type:</strong> {row.type}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-lg text-gray-800 font-medium p-4 border rounded-lg border-gray-300 shadow-sm bg-gray-50">
                      No additional documents uploaded
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-[12px] flex-col lg:col-span-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    id="agreeTerms"
                    className="sr-only peer"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="relative cursor-pointer flex items-center text-sm text-gray-700 before:content-[''] before:block before:min-w-[20px] before:h-[20px] before:mr-[12px] before:rounded-[4px] before:bg-white before:border before:border-gray-500 peer-checked:before:bg-blue-500 peer-checked:before:border-blue-500 after:content-[''] after:absolute after:top-[50%] after:left-[4px] after:translate-y-[-50%] after:w-[12px] after:h-[12px] after:border-r-2 after:border-b-2 after:border-transparent peer-checked:after:border-white peer-checked:after:rotate-45"
                  />
                  <span className="text-gray-700">
                    I agree to SSAP{" "}
                    <a
                      href="#"
                      className="mx-[4px] underline text-blue-600 hover:no-underline"
                      onClick={() => setContractOpen(true)}
                    >
                      Terms and Privacy
                    </a>
                    {" "}and proceed to read the scholarship contract.
                  </span>
                </div>

                <ScholarshipContractDialog isOpen={isContractOpen} onClose={() => setContractOpen(false)} />
              </div>

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={handlePrevStep}
                  className="bg-gray-200 text-gray-700 p-4 rounded-md w-1/4 hover:bg-gray-300 transition-colors duration-300"
                  disabled={applyLoading}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white p-4 rounded-md w-1/4 hover:bg-blue-700 transition-colors duration-300"
                  disabled={applyLoading}
                >
                  {applyLoading ? (
                    <CircularProgress size={24} style={{ color: "white" }} />
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default ApplyScholarship;
