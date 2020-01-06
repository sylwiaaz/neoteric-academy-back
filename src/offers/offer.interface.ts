interface Offer {
    _id: string;
    jobTitle: string;
    tech: string;
    salary: string;
    date: string;
    companyName: string;
    companyAddress: string;
    companyPlace: string;
    skills: string[];
    logoPath: string;
    companySize: string;
    employmentType: string;
    experienceLevel: string;
    techStack: string[];
    location: number[];
    remote: string;
    premium: boolean;
}

export default Offer;
