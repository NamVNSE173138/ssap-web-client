import { useEffect, useState } from "react";
import { Alert, Spin, message } from "antd";
import { useParams } from "react-router-dom";
import { updateApplicantSkills, deleteApplicantSkill, getApplicantProfileById } from "@/services/ApiServices/applicantProfileService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Sidebar } from "@/components/AccountInfo";

const SkillInformation = () => {
    const user = useSelector((state: RootState) => state.token.user);
    const { id } = useParams<{ id: string }>();
    const [skills, setSkills] = useState<any[]>([]);
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
                console.log(data.applicantSkills);
                if (isMounted) {
                    setSkills(data.data.applicantSkills || []);
                    if (data.data.applicantSkills.length > 0) {
                        setFormValues({ ...formValues, ...data.data.applicantSkills[0], skillId: data.data.applicantSkills[0].id });
                    }
                }
            } catch (error) {
                if (isMounted) {
                    setSkills([]);
                    setError("Failed to load skills.");
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

    return (
        <div className="grid grid-cols-12 h-full">
            <Sidebar className="col-start-1 col-end-3" />
            <div className="mt-15 mb-2 col-start-3 col-end-13 flex flex-col justify-start gap-1 p-5">
                <div className="lg:px-28 flex flex-col gap-9">
                    <div className="columns-1">
                        <label htmlFor="name">Skill Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
                            value={formValues.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="columns-1">
                        <label htmlFor="type">Type:</label>
                        <input
                            type="text"
                            id="type"
                            name="type"
                            className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
                            value={formValues.type}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="columns-1">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            className="lg:w-full lg:h-15 w-[95%] h-9 lg:indent-6 indent-1 border border-gray-300 rounded-[3rem] p-2 bg-white text-base lg:text-xl"
                            value={formValues.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="lg:mb-7 mb-5 bg-[#067CEB] text-primary-foreground lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base"
                        >
                            Add Skill
                        </button>
                        <button
                            type="button"
                            onClick={handleUpdate}
                            className="ml-[10px] lg:mb-7 mb-5 bg-[#067CEB] text-primary-foreground lg:h-16 h-12 lg:w-64 w-48 rounded-[2rem] lg:text-xl text-base"
                        >
                            Update Skill
                        </button>
                    </div>
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 text-center py-3">Skill Name</th>
                                <th className="border border-gray-300 text-center py-3">Type</th>
                                <th className="border border-gray-300 text-center py-3">Description</th>
                                <th className="border border-gray-300 text-center py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {skills.map((skill, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                                    <td className="border border-gray-300 text-center py-2">{skill.name}</td>
                                    <td className="border border-gray-300 text-center py-2">{skill.type}</td>
                                    <td className="border border-gray-300 text-center py-2">{skill.description}</td>
                                    <td className="border border-gray-300 text-center py-2">
                                        <button onClick={() => handleEdit(skill)} className="text-blue-500 hover:text-blue-700">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(skill.id)} className="text-red-500 hover:text-red-700 ml-2">
                                            Delete
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
