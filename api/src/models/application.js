import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        phone: String,
        skills: String,
        hours: String,
        redditUsername: String
    },
    {
        timestamps: true
    }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
