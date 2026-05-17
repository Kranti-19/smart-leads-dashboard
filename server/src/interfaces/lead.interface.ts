import mongoose from "mongoose";

export interface ILead {
  name: string;

  email: string;

  status: "new" | "contacted" | "qualified" | "lost";

  source: "website" | "instagram" | "referral";

  createdBy: mongoose.Types.ObjectId;
}