import React, { useState } from "react";
import { useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";
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
    contactConsent: false,
    receiveUpdates: false,
  });


  const [applyLoading, setApplyLoading] = useState<boolean>(false)

  const [rowId, setRowId] = useState<number>(0);
  const [rows, setRows] = useState<any[]>([
    //{ id: 1, name: 'CV', type: "PDF", file: null, isNew: false },
    //{ id: 2, name: 'IELTS', type: "PDF", file: null, isNew: false }
  ]);
  const [isContractOpen, setContractOpen] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyLoading(true);
    if (!formData.agreeTerms) {
      notification.error({ message: "You must agree to the terms." });
      setApplyLoading(false);
      return;
    }
    const program = await getScholarshipProgram(Number(id));

    if (!program) {
      alert("Program not found");
      setApplyLoading(false);
      return;
    }
    if (program.data.status == "FINISHED") {
      alert("Program is finished");
      setApplyLoading(false);
      return;
    }

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

    const applicationDocuments = [];
    for (const row of rows) {
      if (!row.name || !row.type || !row.file) {
        setApplyLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("File", row.file);
      const name = await uploadFile(formData);

      const documentData = {
        name: row.name,
        type: row.type,
        fileUrl: name.urls[0],
      };
      applicationDocuments.push(documentData);
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
        const result = await response.data;
        notification.success({ message: "Application submitted successfully" });
      } else {
        console.error("Failed to submit application");
      }
      navigate("/");
      if (id) await NotifyFunderNewApplicant(isApplicant, parseInt(id));
    } catch (error) {
      console.error("Error submitting application:", error);
    }
    finally {
      setApplyLoading(false)
    }
  };

  return (
    <section className="p-10">
      <div className="max-w-[1500px] mx-auto grid lg:grid-cols-12">
        <div className="lg:py-[80px] py-[40px] lg:col-span-7 xl:col-span-6 px-[16px] xsm:px-[24px] 2xl:pl-0 lg:pr-[16px] xl:pr-[60px]">
          <h2 className="text-4xl text-black">
            APPLY FOR SCHOLARSHIP
            <span className=" block bg-[#1eb2a6] w-[24px] h-[6px] rounded-[8px] mt-[4px]"></span>
          </h2>
          <p className="text-grey mt-[16px]">
            Enter your details and get a free counselling session with our
            experts so they can connect you to the right course, country,
            university – and even scholarships!
          </p>
          <form
            className="grid gap-[20px] lg:grid-cols-2 mt-[24px] lg:mt-[32px]"
            onSubmit={handleSubmit}
          >
            <div className="flex gap-[20px] flex-row">
              <div className="flex-1">
                <label htmlFor="first_name" className="mb-[4px] block text-black">
                  First name*
                </label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  className="w-full rounded-md border-2 py-[12px] px-[16px] bg-white"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex gap-[20px] flex-row">
              <div className="flex-1">
                <label htmlFor="last_name" className="mb-[4px] block text-black">
                  Last name*
                </label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  className="w-full rounded-md border-2 py-[12px] px-[16px] bg-white"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex lg:col-span-2 gap-[20px] flex-row">
              <div className="flex-1">
                <label htmlFor="email" className="mb-[4px] block text-black">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full rounded-md border-2 py-[12px] px-[16px] bg-white"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex gap-[20px] lg:col-span-2">
              <div className="flex-1">
                <label htmlFor="phone_number" className="mb-[4px] block text-black">
                  Phone number*
                </label>
                <div className="flex gap-[20px]">
                  <input
                    type="text"
                    disabled
                    name="dialCode"
                    id="dialCode"
                    className="max-w-[100px] rounded-md border-2 cursor-not-allowed outline-2"
                    value="+86"
                  />
                  <input
                    type="text"
                    name="phone_number"
                    id="phone_number"
                    className="w-full rounded-md border-2 py-[12px] px-[16px] bg-white"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-[20px] lg:col-span-2">
              <div className="flex justify-between w-full">
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="flex justify-start items-center hover:bg-[#1eb2a6] transition-all duration-200 gap-4 px-4 py-2 bg-white rounded-lg active:scale-95 group"
                >
                  <IoIosAddCircleOutline className="text-3xl text-black group-hover:text-white" />
                  <p className="text-xl text-black group-hover:text-white">
                    Add Document
                  </p>
                </button>
              </div>
            </div>
            <div className="flex gap-[20px] lg:col-span-2">
              <EditableTable
                rows={rows}
                setRows={setRows}
                handleDeleteRow={handleDeleteRow}
                handleInputChange={handleDocumentInputChange}
              />
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
                  className="relative cursor-pointer flex items-center text-sm before:content-[''] before:block before:min-w-[20px] before:h-[20px] before:mr-[12px] before:rounded-[4px] before:bg-white before:border before:border-gray-500 peer-checked:before:bg-blue-500 peer-checked:before:border-blue-500 after:content-[''] after:absolute after:top-[50%] after:left-[4px] after:translate-y-[-50%] after:w-[12px] after:h-[12px] after:border-r-2 after:border-b-2 after:border-transparent peer-checked:after:border-white peer-checked:after:rotate-45"
                />
                <span className="text-black">
                  I agree to SSAP{" "}
                  <a
                    href="#"
                    className="mx-[4px] underline hover:no-underline"
                    onClick={() => setContractOpen(true)}
                  >
                    Terms and Privacy
                  </a>
                  {" "}and proceed to read the scholarship contract.
                </span>
              </div>

              <ScholarshipContractDialog isOpen={isContractOpen} onClose={() => setContractOpen(false)} />
            </div>


            <div className="mt-[20px] lg:mt-[16px]">
              <button
                disabled={applyLoading}
                type="submit"
                className="text-white bg-[#1eb2a6] w-full lg:w-auto px-[20px] py-[12px] leading-6 rounded-[108px] border-2"
              >
                {applyLoading ? (<div
                  className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin"
                  aria-hidden="true"
                ></div>) :
                  (<span>Apply now</span>)}
              </button>
            </div>
          </form>
        </div>
        <div className="order-1 lg:order-2 hidden lg:block lg:col-span-5 xl:col-span-6 h-[110vh] mt-[5%]">
          <img
            src={Background}
            alt="abc"
            className="h-full w-full object-cover object-right shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default ApplyScholarship;
