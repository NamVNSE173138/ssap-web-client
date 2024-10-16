import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import RouteNames from "@/constants/routeNames";
import { getMajor } from "@/services/ApiServices/majorService";
import { Container } from "@mui/material";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { FaMicroscope } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { text } from "stream/consumers";

const Major = () => {
  const { id } = useParams<{ id: string}>();
  const [major, setMajor] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<any>(null);

  const fetchMajor = async () => {
    try {
      if(!id) return;
      let majors = await getMajor(id);
      setMajor(majors.data);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    }
  };

  const transformToMarkdown = (text: string) => {
      return text.replace(/\\n/gi, "\n").replace(/\n/gi, "<br/>");
  }

  const CustomLink = ({ children, href }: any) => {
      return (
        <Link to={href} className="text-blue-400 no-underline">
          {children}
        </Link>
      );
  };

  useEffect(() => {
    fetchMajor();
  }, []);

  if(!major){ 
     return <Spin size="large" />
  }

  return (
    <>
    <div className="my-8 w-full px-12 py-5 bg-white">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link
              to={RouteNames.HOME}
              className="md:text-xl text-lg"
            >
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link
              to={RouteNames.HOME}
              className="md:text-xl text-lg"
            >
              Major
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <p className="text-black md:text-xl text-lg">
              {major.name}
            </p>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div
        className="flex justify-center items-center"
      >
        <FaMicroscope size={75} className="ml-3 mt-3" />
      </div>
      <div
        className="flex justify-center items-center"
      >
        <h1 className="text-3xl font-bold mb-4">{major.name}</h1>
      </div>
      
    </div>
    <Container className="w-full p-15 bg-white mb-8" maxWidth="lg">
        {/*<p className="text-lg">{major.description}</p>*/}
        <ReactMarkdown 
            components={{ a: CustomLink }}
            children={transformToMarkdown(major.description)}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
        ></ReactMarkdown>
    </Container>
    </>
  )
}

export default Major;
