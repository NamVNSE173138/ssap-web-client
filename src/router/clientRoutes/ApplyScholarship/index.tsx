import React, { useState } from "react";
import { useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "@/constants/api";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const applicationData = {
      applicantId: isApplicant,
      scholarshipProgramId: id,
      appliedDate: new Date().toISOString(),
      status: "PENDING",
    };

    try {
      const response = await fetch(
        `${BASE_URL}/api/applications/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(applicationData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Application submitted:", result);
      } else {
        console.error("Failed to submit application");
      }
      navigate("/");
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  return (
    <section>
      <div className="max-w-[1100px] mx-auto grid lg:grid-cols-12">
        <div className="lg:py-[80px] py-[40px] lg:col-span-8 xl:col-span-7 px-[16px] xsm:px-[24px] 2xl:pl-0 lg:pr-[16px] xl:pr-[60px]">
          <h2>
            SSAP
            <span className=" block bg-blue-500 w-[24px] h-[6px] rounded-[8px] mt-[4px]"></span>
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
                <label htmlFor="first_name" className="mb-[4px] block">
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
                <label htmlFor="last_name" className="mb-[4px] block">
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
                <label htmlFor="email" className="mb-[4px] block">
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
                <label htmlFor="phone_number" className="mb-[4px] block">
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
            <div className="flex gap-[12px] flex-col lg:col-span-2 ">
              <div className="flex items-center">
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
                ></label>
                <span>
                  I agree to SSAP{" "}
                  <a href="#" className="mx-[4px] underline hover:no-underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="mx-[4px] underline hover:no-underline">
                    Privacy
                  </a>
                </span>
              </div>
            </div>

            <div className="mt-[20px] lg:mt-[16px]">
              <button
                type="submit"
                className="text-white bg-blue-500 w-full lg:w-auto px-[20px] py-[12px] leading-6 rounded-[108px] border-2"
              >
                <span>Apply now</span>
              </button>
            </div>
          </form>
        </div>
        <div className="order-1 lg:order-2 hidden lg:block lg:col-span-4 xl:col-span-5">
          <img src="" alt="abc" className="h-full object-contain w-full" />
        </div>
      </div>
    </section>
  );
};

export default ApplyScholarship;
