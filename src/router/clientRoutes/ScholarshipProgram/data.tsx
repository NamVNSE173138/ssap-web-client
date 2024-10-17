export type ScholarshipProgramType = {
  id: string;
  name: string;
  description: string;
  scholarshipAmount: number;
  numberOfScholarships: number;
  deadline: Date;
  numberOfRenewals: number;
  funderId: number;
  providerId: number;
  createAt: Date;
  updateAt: Date;
  status: string;
  categories: [
    {
      id: string;
      name: string;
      description: string;
      status: string;
    }
  ]
};

export const scholarshipProgram: ScholarshipProgramType[] = [
  // {
  //   id: "1",
  //   name: "SAIBT Early Bird Bursary (Vietnam)",
  //   description:
  //     "South Australian Institute of Business and Technology (SAIBT)",
  //   scholarshipAmount: 100000,
  //   numberOfScholarships: 5,
  //   deadline: new Date(),
  //   numberOfRenewals: 2,
  //   funderId: 1,
  //   providerId: 1,
  //   createAt: new Date(),
  //   updateAt: new Date(),
  //   status: "active",
  //   image: [],
  // },
  // {
  //   id: "2",
  //   name: "Vice Chancellor's International Excellence Scholarship ",
  //   description: "Description of the program",
  //   scholarshipAmount: 100000,
  //   numberOfScholarships: 5,
  //   deadline: new Date(),
  //   numberOfRenewals: 2,
  //   funderId: 1,
  //   providerId: 1,
  //   createAt: new Date(),
  //   updateAt: new Date(),
  //   status: "active",
  //   image: [],
  // },
  // {
  //   id: "3",
  //   name: "MSc Merit Based Scholarships open to Vietnamese Students",
  //   description: "Description of the program",
  //   scholarshipAmount: 100000,
  //   numberOfScholarships: 5,
  //   deadline: new Date(),
  //   numberOfRenewals: 2,
  //   funderId: 1,
  //   providerId: 1,
  //   createAt: new Date(),
  //   updateAt: new Date(),
  //   status: "active",
  //   image: [],
  // },
];

export default scholarshipProgram;
