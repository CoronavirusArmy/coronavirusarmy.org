import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const initiativeSchema = new mongoose.Schema(
    {
        leader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String,
        description: String,
        github: String,
        callTime: String,
        callLink: String,
        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                joined: Date
            }
        ]
    },
    {
        timestamps: true
    }
);

initiativeSchema.plugin(mongoosePaginate);

const Initiative = mongoose.model("Initiative", initiativeSchema);

export default Initiative;
