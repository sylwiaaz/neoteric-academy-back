interface Offer {
    _id: string;
    jobTitle: string;
    tech: string;
    salary: string;
    minSal: number;
    maxSal: number;
    date: string | Date;
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
    description: string;
    applyWay: string;
    authorId: string;
}

export default Offer;
