import mongoose from 'mongoose';
import Offer from './offer.interface';

const offerSchema = new mongoose.Schema({
    jobTitle: String,
    tech: String,
    salary: String,
    date: String,
    companyName: String,
    companyAddress: String,
    companyPlace: String,
    skills: [String],
    logoPath: String,
    companySize: String,
    employmentType: String,
    experienceLevel: String,
    techStack: [String],
    location: [Number],
});

const offerModel = mongoose.model<Offer & mongoose.Document>('Offer', offerSchema);

export default offerModel;
