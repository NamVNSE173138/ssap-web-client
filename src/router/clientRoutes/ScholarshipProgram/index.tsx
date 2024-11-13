import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import ScholarshipProgramSkeleton from "./ScholarshipProgramSkeleton";
import { Card } from "@/components/ScholarshipProgram";
import axios from "axios";
import scholarshipProgram, { ScholarshipProgramType } from "./data";
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import { BASE_URL } from "@/constants/api";
import { getAllCountries } from "@/services/ApiServices/countryService";
import { getAllMajors } from "@/services/ApiServices/majorService";
import { getAllCategories } from "@/services/ApiServices/categoryService";
const ScholarshipProgram = () => {
  const [data, setData] =
    useState<ScholarshipProgramType[]>(scholarshipProgram);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [countries, setCountries] = useState<{ name: string }[]>([]);
  const [majors, setMajors] = useState<{ name: string }[]>([]);
  const [categories, setCategories] = useState<{ name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/scholarship-programs`
        );
        const countryDatas = await getAllCountries();
        const majorDatas = await getAllMajors();
        const categoriesDatas = await getAllCategories();
        if (response.data.statusCode === 200) {
          setData(response.data.data.items);
          setCountries(countryDatas.data);
          setMajors(majorDatas.data.items);
          setCategories(categoriesDatas.data);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchCountriesData = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}/api/countries`);
  //       console.log("Countries API Response:", response.data);
  //       if (response.data.statusCode === 200) {
  //         const countryNames = response.data.data.map(
  //           (country: { name: string }) => ({
  //             name: country.name,
  //           })
  //         );
  //         setCountries(countryNames);
  //       } else {
  //         setError("Failed to fetch countries data");
  //       }
  //     } catch (err) {
  //       setError((err as Error).message);
  //     }
  //   };

  //   fetchCountriesData();
  // }, []);

  return (
    <div>
      <div className="relative">
        <ScholarshipProgramBackground />
        <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-between items-start p-[70px] z-10">
          <div>
            <Breadcrumb className=" ">
              <BreadcrumbList className="text-white">
                <BreadcrumbItem>
                  <Link to="/" className="md:text-xl text-lg">
                    Home
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <p className="text-white md:text-xl text-lg">
                    Scholarship Program
                  </p>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <form action="" className="w-full">
            <div className="grid gap-[16px] grid-cols-1 lg:grid-cols-[1fr_120px]">
              <div className="flex gap-[16px] flex-col lg:flex-row">
                <div className="border border-zinc-950 rounded-sm py-[13px] pl-[16px] pr-[32px] relative after:absolute after:right-[16px] after:top-[22px] bg-white after:w-[12px] after:h-[7px] w-full  cursor-pointer ">
                  <label hidden>Study Major</label>
                  <select className="">
                    <option>Select study major</option>
                    {majors.map((major, index) => (
                      <option key={index} value={major.name}>
                        {major.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="border border-zinc-950 rounded-sm py-[13px] pl-[16px] pr-[32px] relative  after:absolute after:right-[16px] after:top-[22px] bg-white after:w-[12px] after:h-[7px] w-full cursor-pointer">
                  <label hidden>Study destination</label>
                  <select>
                    <option>Select a study destination</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="border border-zinc-950 rounded-sm py-[13px] pl-[16px] pr-[32px] relative  after:absolute after:right-[16px] after:top-[22px] bg-white after:w-[12px] after:h-[7px] w-full cursor-pointer">
                  <label hidden>Scholarship Categories</label>
                  <select>
                    <option>Select a scholarship categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className=" flex w-full text-white bg-blue-500 justify-center rounded-full">
                <button>Search</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <menu className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-between items-start gap-10 mt-10 my-8  px-12">
        {loading ? (
          <ScholarshipProgramSkeleton />
        ) : error ? (
          <p className="text-center text-[2rem] font-semibold md:col-span-3 lg:col-span-4">
            Error loading scholarship programs.
          </p>
        ) : data.length == 0 ? (
          <p className="text-center text-[2rem] font-semibold md:col-span-3 lg:col-span-4">
            No scholarship programs found.
          </p>
        ) : (
          data.map((service: any) => (
            <li key={service.id}>
              <Card {...service} />
            </li>
          ))
        )}
      </menu>
    </div>
  );
};

export default ScholarshipProgram;
