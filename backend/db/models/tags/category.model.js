import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    categoryImage: {
      type: String,
      default: "default.jpg",
    },
  },
  {
    timestamps: true,
    virtuals: true,
  }
);

categorySchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "categoryId",
  justOne: false,
});

const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;
