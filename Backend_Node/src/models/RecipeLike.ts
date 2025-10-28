import mongoose from "mongoose";

const recipeLikeSchema = new mongoose.Schema({
  recipeId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const RecipeLike = mongoose.model("RecipeLike", recipeLikeSchema);
