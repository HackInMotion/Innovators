import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subcategoryImage: {
    type: String,
    default: 'default.jpg',
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
}, {
  timestamps: true,
});

subcategorySchema.index({ name: 1, categoryId: 1 }, { unique: true });

const SubCategoryModel = mongoose.model('Subcategory', subcategorySchema);

export default SubCategoryModel;
