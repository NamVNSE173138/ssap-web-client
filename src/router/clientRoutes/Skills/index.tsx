import { useEffect, useState } from "react";
import { Alert, Spin, message } from "antd";
import { useParams } from "react-router-dom";
import { updateApplicantSkills, deleteApplicantSkill, getApplicantProfileById } from "@/services/ApiServices/applicantProfileService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Sidebar } from "@/components/AccountInfo";
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';


const SkillInformation = () => {
    const user = useSelector((state: RootState) => state.token.user);
    const { id } = useParams<{ id: string }>();
    const [skills, setSkills] = useState<any[]>([]);
    const [hasProfile, setHasProfile] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [formValues, setFormValues] = useState({
        name: "",
        type: "",
        description: "",
        skillId: null,
        applicantId: user?.id,
    });

    useEffect(() => {
        let isMounted = true;

        const fetchSkills = async () => {
            try {
                const data = await getApplicantProfileById(Number(id || user?.id));
                if (isMounted) {
                    setSkills(data.data.applicantSkills || []);
                    if (data.data.applicantSkills.length > 0) {
                        setFormValues({ ...formValues, ...data.data.applicantSkills[0], skillId: data.data.applicantSkills[0].id });
                    }
                }
            } catch (error: any) {

                if (isMounted) {
                    setSkills([]);
                    setError("Failed to load skills.");
                }
                if (error.response.data.detail.includes('applicantId')) {
                    setHasProfile(false);
                    setError(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchSkills();
        return () => {
            isMounted = false;
        };
    }, [id, user?.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleAdd = async () => {
        try {
            if (!user) return;

            const isDuplicate = skills.some(skill => skill.name.toLowerCase() === formValues.name.toLowerCase());
            if (isDuplicate) {
                message.error(`Skill name '${formValues.name}' already exists.`);
                return;
            }

            await updateApplicantSkills(Number(user.id), [formValues]);
            message.success("Skill added successfully!");
            setSkills([...skills, formValues]);
            setFormValues({ name: "", type: "", description: "", skillId: null, applicantId: user?.id });
        } catch (error) {
            message.error("Failed to add skill.");
        }
    };

    const handleUpdate = async () => {
        try {
            if (!user || formValues.skillId === null) return;

            const updatedSkills = skills.map(skill =>
                skill.id === formValues.skillId ? { ...skill, ...formValues } : skill
            );

            await updateApplicantSkills(Number(user.id), updatedSkills);
            message.success("Skill updated successfully!");
            setSkills(updatedSkills);
        } catch (error) {
            message.error("Failed to update skill.");
        }
    };

    const handleEdit = (skill: any) => {
        setFormValues({ ...skill, skillId: skill.id });
    };

    const handleDelete = async (skillId: number) => {
        try {
            if (!user) return;
            await deleteApplicantSkill(Number(user.id), skillId);
            message.success("Skill deleted successfully!");
            setSkills(skills.filter(skill => skill.id !== skillId));
        } catch (error) {
            message.error("Failed to delete skill.");
        }
    };

    if (loading) {
        return <Spin size="large" />;
    }

    if (error) {
        return <Alert message={error} type="error" />;
    }
    if (!hasProfile) {
        return <Alert message={"You have to add profile before adding skills"} type="error" />;
    }

    return (
        <div className="grid grid-cols-12 ">
            <Sidebar className="col-start-2 col-end-4 h-auto self-start" />

            <div className="mt-15 mb-2 col-span-8 flex flex-col justify-start gap-1 p-5">
                <div className="lg:px-28 flex flex-col gap-9">

                    {/* Skill Name */}
                    <div className="columns-1">
                        <label htmlFor="name" className="font-semibold text-lg">Skill Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="lg:w-full w-[95%] h-12 lg:h-16 indent-4 border border-gray-300 rounded-full p-3 bg-white text-base lg:text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formValues.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Skill Type */}
                    <div className="columns-1">
                        <label htmlFor="type" className="font-semibold text-lg">Type:</label>
                        <input
                            type="text"
                            id="type"
                            name="type"
                            className="lg:w-full w-[95%] h-12 lg:h-16 indent-4 border border-gray-300 rounded-full p-3 bg-white text-base lg:text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formValues.type}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="columns-1">
                        <label htmlFor="description" className="font-semibold text-lg">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            className="lg:w-full w-[80%] h-32 lg:h-40 indent-4 border border-gray-300 rounded-lg p-3 bg-white text-base lg:text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formValues.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-5">
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="lg:mb-7 mb-5 bg-blue-600 text-white lg:h-16 h-12 lg:w-64 w-48 rounded-full flex items-center justify-center gap-3 lg:text-xl text-base hover:bg-blue-700 transition-all"
                        >
                            <FaPlus size={20} /> Add Skill
                        </button>
                        <button
                            type="button"
                            onClick={handleUpdate}
                            className="ml-[10px] lg:mb-7 mb-5 bg-blue-600 text-white lg:h-16 h-12 lg:w-64 w-48 rounded-full flex items-center justify-center gap-3 lg:text-xl text-base hover:bg-blue-700 transition-all"
                        >
                            <FaEdit size={20} /> Update Skill
                        </button>
                    </div>

                    {/* Table to Display Skills */}
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-200 text-lg">
                                <th className="border border-gray-300 text-center py-4">Skill Name</th>
                                <th className="border border-gray-300 text-center py-4">Type</th>
                                <th className="border border-gray-300 text-center py-4">Description</th>
                                <th className="border border-gray-300 text-center py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {skills.map((skill, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="border border-gray-300 text-center py-3">{skill.name}</td>
                                    <td className="border border-gray-300 text-center py-3">{skill.type}</td>
                                    <td className="border border-gray-300 text-center py-3">{skill.description}</td>
                                    <td className="border border-gray-300 text-center py-3">
                                        <button
                                            onClick={() => handleEdit(skill)}
                                            className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
                                        >
                                            <FaEdit size={18} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(skill.id)}
                                            className="text-red-500 hover:text-red-700 ml-4 flex items-center gap-2"
                                        >
                                            <FaTrashAlt size={18} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SkillInformation;
