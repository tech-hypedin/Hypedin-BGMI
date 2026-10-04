import mongoose from "mongoose";

interface INomination extends mongoose.Document {
    userId: mongoose.Types.ObjectId,
    MVPUID: string,
    playerName: string,
    playerEmail: string,
    playerNumber: string,
    playerUID: string,
    reasoning: string,
    proofURL: string[],
    season: "1" | "2" | "3"
}

const nominationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    MVPUID: { type: String, required: true },
    playerName: { type: String, required: true },
    playerEmail: { type: String, required: true },
    playerNumber: { type: String, required: true },
    playerUID: { type: String, required: true },
    reasoning: { type: String },
    proofURL: [{ type: String, required: true }],
    season: { type: String, enum: ["1","2","3"], required: true }
},{ timestamps: true });

const NominationModel = mongoose.model<INomination>("Nomination", nominationSchema);

export default NominationModel;