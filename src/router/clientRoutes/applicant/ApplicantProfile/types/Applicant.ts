export default interface Applicant {
  avatar: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  nationality: string;
  ethnicity: string;
  bio: any;
  applicantId: number;
  applicantEducations: any[];
  applicantSkills: ApplicantSkill[];
  applicantCertificates: ApplicantCertificate[];
  applicantExperience: ApplicantExperience[];
}

export interface ApplicantSkill {
  id: number;
  name: string;
  type: string;
  description: string;
}

export interface ApplicantCertificate {
  id: number;
  name: string;
  description: string;
  achievedYear: number;
  url: any;
}

export interface ApplicantExperience {
  id: number;
  name: string;
  description: string;
  fromYear: number;
  toYear: number;
}
