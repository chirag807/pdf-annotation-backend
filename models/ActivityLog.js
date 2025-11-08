import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    action: String,
    entity: String,
    entityId: mongoose.Types.ObjectId,
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", ActivityLogSchema);
