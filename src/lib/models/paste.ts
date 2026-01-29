import mongoose, { Schema } from "mongoose";

const PasteSchema = new Schema(
  {
    pasteId: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    expiresAt: { type: Date, default: null },
    maxViews: { type: Number, default: null },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.paste || mongoose.model("paste", PasteSchema);
