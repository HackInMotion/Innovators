import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  }],
  assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
  }],
  order: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

moduleSchema.index({ courseId: 1, order: 1 }, { unique: true });

const ModuleModel = mongoose.model('Module', moduleSchema);

export default ModuleModel;
