
import { useEffect, useState } from 'react';
import ScreenSpinner from '@/components/ScreenSpinner';
import { Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { getAllScholarshipProgram } from '@/services/ApiServices/scholarshipProgramService';
import ScholarshipProgramSkeleton from '@/router/clientRoutes/ScholarshipProgram/ScholarshipProgramSkeleton';

const ITEMS_PER_PAGE = 5;

const TableThree = () => {
    const [scholarships, setScholarships] = useState<any>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchServices = async () => {
        try {
            const response = await getAllScholarshipProgram();
            if (response.data.statusCode == 200) {
                setScholarships(response.data.data.items);
                console.log(response.data.data.items)
            } else {
                setError("Failed to get scholarships");
            }
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const totalPages = Math.ceil(scholarships?.length / ITEMS_PER_PAGE);
    const paginatedScholarships = scholarships?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            {error && <p className='text-red-500'>{error}</p>}
            {loading && <ScreenSpinner />}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    Scholarships
                </h4>

                <Paper
                    elevation={3}
                    style={{ padding: "20px", borderRadius: "10px" }}
                >
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr
                                    style={{
                                        backgroundColor: "#419f97",
                                        color: "white",
                                        textAlign: "left",
                                    }}
                                >
                                    <th style={{ padding: "12px", fontWeight: "600" }}>#</th>
                                    <th style={{ padding: "12px", fontWeight: "600" }}>Name</th>
                                    <th style={{ padding: "12px", fontWeight: "600" }}>
                                        Description
                                    </th>
                                    <th style={{ padding: "12px", fontWeight: "600" }}>Funder Id</th>
                                    <th style={{ padding: "12px", fontWeight: "600" }}>
                                        Deadline
                                    </th>
                                    <th style={{ padding: "12px", fontWeight: "600" }}>
                                        Value of Award
                                    </th>
                                    <th style={{ padding: "12px", fontWeight: "600" }}>
                                        Number of Scholarships
                                    </th>
                                    <th style={{ padding: "12px", fontWeight: "600" }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={8}>
                                            <ScholarshipProgramSkeleton />
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            style={{
                                                textAlign: "center",
                                                padding: "20px",
                                                fontSize: "18px",
                                                color: "#888",
                                            }}
                                        >
                                            Error loading scholarship programs
                                        </td>
                                    </tr>
                                ) : (scholarships && scholarships.length === 0) ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            style={{
                                                textAlign: "center",
                                                padding: "20px",
                                                fontSize: "18px",
                                                color: "#888",
                                            }}
                                        >
                                            No scholarship programs found
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedScholarships?.map((item: any, index: any) => (
                                        <tr
                                            key={item.id}
                                            style={{
                                                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                                                transition: "background-color 0.3s ease",
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.backgroundColor = "#f1f1f1")
                                            }
                                            onMouseLeave={(e) =>
                                            (e.currentTarget.style.backgroundColor =
                                                index % 2 === 0 ? "#f9f9f9" : "#fff")
                                            }
                                        >
                                            <td
                                                style={{
                                                    padding: "12px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {item.name}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {item.description.length > 30
                                                    ? item.description.slice(0, 30) + "..."
                                                    : item.description}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {item.funderId}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {new Date(item.deadline).toLocaleDateString("en-US", {
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                ${item.scholarshipAmount}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {item.numberOfScholarships}
                                            </td>
                                            <td style={{ padding: "12px", textAlign: "center" }}>
                                                <Link
                                                    to={`/scholarship-program/${item.id}`}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "5px",
                                                        fontSize: "14px",
                                                        padding: "6px 12px",
                                                        borderRadius: "5px",
                                                        textDecoration: "none",
                                                        color: "#007bff",
                                                        backgroundColor: "#f0f8ff",
                                                        transition:
                                                            "background-color 0.3s ease, color 0.3s ease",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = "#007bff";
                                                        e.currentTarget.style.color = "#fff";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = "#f0f8ff";
                                                        e.currentTarget.style.color = "#007bff";
                                                    }}
                                                >
                                                    <FaEye /> View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Paper>
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
            </div>
        </>
    );
};

export default TableThree;
