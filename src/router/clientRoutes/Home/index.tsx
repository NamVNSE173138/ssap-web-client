import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdAgriculture, MdArchitecture, MdFormatPaint } from "react-icons/md";
import {
  FaCamera,
  FaHotel,
  FaMedkit,
  FaMicroscope,
  FaUser,
} from "react-icons/fa";
import { BsFillSuitcaseLgFill, BsRulers, BsTerminal } from "react-icons/bs";
import { GoLaw } from "react-icons/go";
import { getAllMajors } from "@/services/ApiServices/majorService";
import BackgroundImage from "./components/Carousel";
import { Button } from "@/components/ui/button";

const Home = () => {
  const [majors, setMajors] = useState<any>(null);
  const navigate = useNavigate();

  const popularScholarships = [
    {
      id: 1,
      name: "Global Leaders Scholarship",
      country: "USA",
      amount: "$10,000",
    },
    { id: 2, name: "STEM Excellence Grant", country: "UK", amount: "$8,000" },
    {
      id: 3,
      name: "Women in Tech Scholarship",
      country: "Canada",
      amount: "$12,000",
    },
  ];

  const blogs = [
    {
      id: 1,
      title: "Top 10 Scholarships for 2025",
      author: "Admin",
      date: "Jan 10, 2025",
    },
    {
      id: 2,
      title: "How to Write a Winning Application",
      author: "Admin",
      date: "Jan 5, 2025",
    },
    {
      id: 3,
      title: "Scholarships for Women in STEM",
      author: "Admin",
      date: "Jan 2, 2025",
    },
  ];

  const majorIcons: any = [
    <MdAgriculture size={45} />,
    <FaMicroscope size={45} />,
    <MdArchitecture size={45} />,
    <BsFillSuitcaseLgFill size={45} />,
    <BsTerminal size={45} />,
    <MdFormatPaint size={45} />,
    <BsRulers size={45} />,
    <FaMedkit size={45} />,
    <FaUser size={45} />,
    <GoLaw size={45} />,
    <FaCamera size={45} />,
    <FaHotel size={45} />,
  ];

  const fetchMajors = async () => {
    try {
      const response = await getAllMajors();
      setMajors(response.data.items);
    } catch (error) {
      console.error("Failed to fetch majors", error);
    }
  };

  useEffect(() => {
    fetchMajors();
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative">
        <BackgroundImage />
        <div className="absolute inset-0 flex flex-col justify-center text-white px-6 md:px-12 lg:px-20">
          <div className="container w-[50%]">
            <h1 className="text-left text-3xl md:text-5xl font-bold mb-6">
              Your Gateway to Global Scholarships
            </h1>
            <p className="text-left text-lg md:text-xl font-medium mb-8">
              Discover thousands of scholarships and start building your future
              today!
            </p>
          </div>
          <div className="pt-8 md:pt-10">
            <Link to="/scholarship-program">
              <Button
                className="h-14 w-full md:w-auto text-white font-semibold text-md md:text-base lg:text-xl py-3 px-6 rounded-full transition"
                style={{
                  background: "linear-gradient(45deg, #1eb2a6, #12d7b5)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                onMouseOver={(e: any) => {
                  e.target.style.background =
                    "linear-gradient(45deg, #0d9d87, #10bba1)";
                }}
                onMouseOut={(e: any) => {
                  e.target.style.background =
                    "linear-gradient(45deg, #1eb2a6, #12d7b5)";
                }}
              >
                Find Scholarship
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            variants={sectionVariants}
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Wide Range of Scholarships",
                  description: "Over 10,000 opportunities available.",
                },
                {
                  title: "Easy Application Process",
                  description: "Apply with just a few clicks.",
                },
                {
                  title: "Global Opportunities",
                  description: "Find scholarships from around the world.",
                },
                {
                  title: "Expert Guidance",
                  description: "Get support every step of the way.",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-lg shadow-lg text-center"
                >
                  <h3 className="text-xl font-semibold mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            variants={sectionVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-4xl font-bold text-left mb-12">About Us</h2>
                <p className="text-gray-600 text-xl mb-6">
                  At Scholarship, we are passionately committed to bridging the
                  gap between students and scholarship opportunities across the
                  globe. Our mission is to empower students by providing them
                  with the resources and support they need to achieve their
                  academic dreams.
                </p>
                <p className="text-gray-600 text-xl mb-6">
                  We understand that every student's journey is unique, which is
                  why we offer personalized guidance and expert advice. Our team
                  of experienced advisors is dedicated to helping students at
                  every step of the way, from identifying suitable scholarships
                  to preparing compelling applications. We provide valuable
                  resources, including tips on writing effective essays, acing
                  interviews, and meeting application deadlines.
                </p>
                <button
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold"
                  onClick={() => navigate("/about")}
                >
                  Learn More
                </button>
              </div>
              <img
                src="https://www.shutterstock.com/image-photo/happy-young-students-taking-vertical-600nw-2430940381.jpg"
                alt="About Us"
                className="rounded-lg shadow-lg lg:w-[600px] h-[100%]"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* The Team Behind Essentials Section */}
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            variants={sectionVariants}
          >
            <h2 className="text-3xl font-bold text-center mb-4">
              The Team Behind Essentials
            </h2>
            <p className="lg:px-70 text-lg text-gray-600 text-center mb-12">
              Meet the passionate individuals who brought this platform to life.
              From developers to designers, our team works tirelessly to provide
              you with the best scholarship experience.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member 1"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">John Doe</h3>
                <p className="text-teal-500 mb-4">Lead Developer</p>
                <p className="text-gray-600">
                  John is the mastermind behind the website's functionality and
                  performance, ensuring a seamless user experience for all
                  visitors.
                </p>
              </div>
              {/* Team Member 2 */}
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member 2"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Jane Smith</h3>
                <p className="text-teal-500 mb-4">UI/UX Designer</p>
                <p className="text-gray-600">
                  Jane designs the intuitive interface and ensures the website
                  is both visually appealing and user-friendly.
                </p>
              </div>
              {/* Team Member 3 */}
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member 3"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Sarah Lee</h3>
                <p className="text-teal-500 mb-4">Content Strategist</p>
                <p className="text-gray-600">
                  Sarah is responsible for the content strategy and writing the
                  copy that engages and informs users.
                </p>
              </div>
              {/* Team Member 4 */}
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member 4"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Michael Wong</h3>
                <p className="text-teal-500 mb-4">Marketing Lead</p>
                <p className="text-gray-600">
                  Michael handles the marketing efforts to spread the word about
                  the platform and engage with our global audience.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-teal-500 text-white py-16">
        <div className="container mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            variants={sectionVariants}
          >
            <h2 className="text-3xl font-bold mb-8">Our Community</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <p className="text-4xl font-semibold">3,000+</p>
                <p className="text-lg text-gray-100">Scholarships Available</p>
              </div>
              <div>
                <p className="text-4xl font-semibold">1,000,000+</p>
                <p className="text-lg text-gray-100">Applications Applied</p>
              </div>
              <div>
                <p className="text-4xl font-semibold">200+</p>
                <p className="text-lg text-gray-100">Partner Universities</p>
              </div>
              <div>
                <p className="text-4xl font-semibold">74+</p>
                <p className="text-lg text-gray-100">Countries Covered</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Popular Scholarships Section */}
      <div className="bg-white py-16">
        <motion.div
          className="container mx-auto px-6 md:px-12 lg:px-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          variants={sectionVariants}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Explore Scholarships
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularScholarships.map((scholarship: any) => (
              <div
                key={scholarship.id}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
              >
                <h3 className="text-xl font-semibold mb-3">
                  {scholarship.name}
                </h3>
                <p className="text-gray-600">{scholarship.country}</p>
                <p className="text-teal-500 text-lg font-semibold">
                  {scholarship.amount}
                </p>
                <Link
                  to={`/scholarship/${scholarship.id}`}
                  className="mt-4 inline-block text-teal-600"
                >
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Browse by Discipline Section */}
      <div className="py-16 bg-white">
        <section className="relative">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            variants={sectionVariants}
          >
            <h2 className="text-3xl font-bold mb-8">Multiple Majors</h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-8 px-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              delayChildren: 0.3,
              staggerChildren: 0.2,
            }}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 },
            }}
          >
            {majors &&
              majors.map((major: any, idx: any) => (
                <Link
                  to={`/major/${major.id}`}
                  key={major.id}
                  className="bg-white h-[100px] p-4 rounded-lg shadow-lg hover:shadow-xl transition"
                >
                  <div className="flex items-center justify-left mb-3">
                    <div className="mr-6 text-teal-500">
                      {majorIcons[idx % majorIcons.length]}
                    </div>
                    <p className="font-semibold text-lg truncate">
                      {major.name}
                    </p>
                  </div>
                </Link>
              ))}
          </motion.div>
        </section>
      </div>

      {/* Call to Action Section (added) */}
      <div className="relative bg-teal-500 text-white py-12 mt-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            variants={sectionVariants}
          >
            <p className="text-3xl font-semibold mb-4">
              Ready to Apply for Scholarships?
            </p>
            <p className="text-xl mb-6">
              Start your journey towards a brighter future now!
            </p>
            <button
              className="bg-white text-teal-500 px-6 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-teal-100 transition"
              onClick={() => (window.location.href = "/scholarship-program")}
            >
              Apply Now
            </button>
          </motion.div>
        </div>
      </div>

      {/* Blogs Section */}
      <div className="py-16 bg-white">
        <motion.div
          className="container mx-auto px-6 md:px-12 lg:px-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          variants={sectionVariants}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Latest Blogs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold mb-4">{blog.title}</h3>
                <p className="text-gray-600 mb-4">
                  By {blog.author} | {blog.date}
                </p>
                <Link
                  to={`/blog/${blog.id}`}
                  className="text-teal-600 font-semibold"
                >
                  Read More
                </Link>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            variants={sectionVariants}
          >
            <h2 className="text-3xl font-bold text-center mb-12">FAQs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">What is a scholarship?</h3>
                <p className="text-gray-600">
                  A scholarship is a financial aid awarded to support your
                  education, usually based on academic achievement or other
                  criteria.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">
                  How do I apply for scholarships?
                </h3>
                <p className="text-gray-600">
                  Register on our platform, browse scholarships that match your
                  profile, and apply directly through our website.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Home;
