import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    default: null,
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  duration: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: null,
  },
  order: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true, 
});

lessonSchema.index({ moduleId: 1, order: 1 }, { unique: true });

const LessonModel = mongoose.model('Lesson', lessonSchema);

export default LessonModel;
