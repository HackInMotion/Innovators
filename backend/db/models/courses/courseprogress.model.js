import mongoose from 'mongoose';

const courseProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    modulesCompleted: [
      {
        moduleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Module',
        },
        totalLessons: {
          type: Number,
          default: 0,
        },
        completedLessons: {
          type: Number,
          default: 0,
        },
        lessonsCompleted: [
          {
            lessonId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Lesson',
            },
            completedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        isCompleted: {
          type: Boolean,
          default: false,
        },
        completionDate: {
          type: Date,
          default: null,
        },
      },
    ],
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'COMPLETED', 'NOT_STARTED'],
      default: 'NOT_STARTED',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const CourseProgressModel = mongoose.model('CourseProgress', courseProgressSchema);
export default CourseProgressModel;
