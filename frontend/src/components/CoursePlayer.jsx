import React, { useState, useEffect } from "react";
import {
  Play,
  ChevronDown,
  ChevronUp,
  Check,
  Lock,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import { useQuery } from "@apollo/client";
import { GET_ENROLLED_COURSE } from "../apiClient/Queries";

const BASE_IMG_URL = "http://localhost:5000";

const getFullImageUrl = (url) => `${BASE_IMG_URL}${url}`;

const CoursePlayer = () => {
  const [expandedModule, setExpandedModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState({
    moduleIndex: 0,
    lessonIndex: 0,
  });
  const [completedLessons, setCompletedLessons] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTab, setActiveTab] = useState("about");

  const { courseId } = useParams();
  const { data, error, loading } = useQuery(GET_ENROLLED_COURSE, {
    variables: { id: parseInt(courseId) },
  });

  if (loading)
    return <div className="text-center py-20">Loading course...</div>;
  if (error) return <p>Error: {error.message}</p>;

  const course = data?.getCourseById?.course;
  if (!course) return <div className="text-center py-20">Course not found</div>;

  const toggleModule = (moduleIndex) => {
    setExpandedModule(expandedModule === moduleIndex ? null : moduleIndex);
  };

  const handleLessonSelect = (moduleIndex, lessonIndex) => {
    if (course.modules[moduleIndex].lessons[lessonIndex].locked) return;
    setActiveLesson({ moduleIndex, lessonIndex });
    setPlaying(true);
    setProgress(0);
  };

  const markLessonComplete = () => {
    const lessonKey = `${activeLesson.moduleIndex}-${activeLesson.lessonIndex}`;
    if (!completedLessons.includes(lessonKey)) {
      setCompletedLessons([...completedLessons, lessonKey]);
    }
  };

  const handleProgress = (state) => {
    setProgress(state.played);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");

    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const navigateLesson = (direction) => {
    const { moduleIndex, lessonIndex } = activeLesson;
    const currentModule = course.modules[moduleIndex];

    if (direction === "prev") {
      // If not first lesson in current module
      if (lessonIndex > 0) {
        handleLessonSelect(moduleIndex, lessonIndex - 1);
      }
      // If first lesson in current module but not first module
      else if (moduleIndex > 0) {
        const prevModule = course.modules[moduleIndex - 1];
        handleLessonSelect(moduleIndex - 1, prevModule.lessons.length - 1);
      }
    } else if (direction === "next") {
      // If not last lesson in current module
      if (lessonIndex < currentModule.lessons.length - 1) {
        handleLessonSelect(moduleIndex, lessonIndex + 1);
      }
      // If last lesson in current module but not last module
      else if (moduleIndex < course.modules.length - 1) {
        handleLessonSelect(moduleIndex + 1, 0);
      }
    }
  };

  const currentLesson =
    course.modules[activeLesson.moduleIndex].lessons[activeLesson.lessonIndex];
  const progressPercentage =
    (completedLessons.length /
      course.modules.reduce((acc, module) => acc + module.lessons.length, 0)) *
    100;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">{course.title}</h2>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <span>Progress: {Math.round(progressPercentage)}%</span>
            <div className="ml-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {course.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="py-2">
              <button
                onClick={() => toggleModule(moduleIndex)}
                className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <span className="font-medium">{module.title}</span>
                  <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {module.lessons.length}{" "}
                    {module.lessons.length === 1 ? "lesson" : "lessons"}
                  </span>
                </div>
                {expandedModule === moduleIndex ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {expandedModule === moduleIndex && (
                <div className="pl-8 pr-4">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const isCompleted = completedLessons.includes(
                      `${moduleIndex}-${lessonIndex}`
                    );
                    const isActive =
                      activeLesson.moduleIndex === moduleIndex &&
                      activeLesson.lessonIndex === lessonIndex;

                    return (
                      <div
                        key={lessonIndex}
                        onClick={() =>
                          handleLessonSelect(moduleIndex, lessonIndex)
                        }
                        className={`flex items-center justify-between py-2 px-2 rounded cursor-pointer ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : lesson.locked
                            ? "text-gray-400"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center">
                          {isCompleted ? (
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                          ) : (
                            <Play className="w-4 h-4 text-gray-400 mr-2" />
                          )}
                          <span className={lesson.locked ? "opacity-75" : ""}>
                            {lesson.title}
                          </span>
                          {lesson.locked && <Lock className="w-3 h-3 ml-2" />}
                        </div>
                        <span className="text-xs text-gray-500">
                          {lesson.duration}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white overflow-auto">
        {/* Video Player */}
        <VideoPlayer
          key={currentLesson.id}
          url={currentLesson.videoUrl}
          thumbnail="https://marketingaccesspass.com/wp-content/uploads/2015/10/Podcast-Website-Design-Background-Image.jpg"
          locked={currentLesson.locked}
          playing={playing}
          onPlayToggle={() => setPlaying(!playing)}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={markLessonComplete}
          onPrev={() => navigateLesson("prev")}
          onNext={() => navigateLesson("next")}
          onSeek={(seconds) => console.log(`Seeked to ${seconds}`)}
          progress={progress}
          duration={duration}
          qualities={[
            { label: "HD", url: currentLesson.hdUrl },
            { label: "SD", url: currentLesson.sdUrl },
          ]}
        />

        {/* Lesson Content */}
        <div className="flex-1 p-6">
          <div className="max-w-full mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
              {!currentLesson.locked && (
                <button
                  onClick={markLessonComplete}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                >
                  Mark as Complete
                </button>
              )}
            </div>

            {currentLesson.locked ? (
              <div className="text-center py-12">
                <Lock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  This lesson is locked
                </h3>
                <p className="text-gray-500">
                  Please complete the previous lessons to unlock this content.
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                  <button
                    className={`px-4 py-3 font-medium text-sm ${
                      activeTab === "about"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("about")}
                  >
                    About
                  </button>
                  <button
                    className={`px-4 py-3 font-medium text-sm ${
                      activeTab === "resources"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("resources")}
                  >
                    Resources
                  </button>
                  <button
                    className={`px-4 py-3 font-medium text-sm ${
                      activeTab === "transcript"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("transcript")}
                  >
                    Transcript
                  </button>
                  <button
                    className={`px-4 py-3 font-medium text-sm ${
                      activeTab === "notes"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("notes")}
                  >
                    Notes
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "about" && (
                    <div className="prose max-w-none">
                      <h3>About This Lesson</h3>
                      <p>
                        This lesson covers the fundamental concepts of{" "}
                        {currentLesson.title.toLowerCase()}.
                      </p>
                      <p className="mt-4">{currentLesson.content}.</p>
                    </div>
                  )}

                  {activeTab === "resources" && (
                    <div className="prose max-w-none">
                      <h3>Lesson Resources</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <a
                            href="#"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            Download Slides (PDF)
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Source Code Files
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            Exercise Files
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}

                  {activeTab === "transcript" && (
                    <div className="prose max-w-none">
                      <h3>Transcript</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-700">
                          [Video transcript would appear here]
                        </p>
                        <p className="mt-2 text-gray-700">
                          Instructor: "Welcome to this lesson on{" "}
                          {currentLesson.title}. Today we'll be covering..."
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "notes" && (
                    <div className="prose max-w-none">
                      <h3>Your Notes</h3>
                      <textarea
                        className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add your personal notes here..."
                      ></textarea>
                      <button className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                        Save Notes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigateLesson("prev")}
                className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Lesson
              </button>
              <button
                onClick={() => navigateLesson("next")}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
              >
                Next Lesson
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
