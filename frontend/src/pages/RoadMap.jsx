import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiExternalLink } from "react-icons/fi";
import { FaReact, FaServer, FaRobot } from "react-icons/fa";
import { SiPython, SiKubernetes } from "react-icons/si";

const ITCareerRoadmaps = () => {
  const [activeTab, setActiveTab] = useState("frontend");
  const [expandedStages, setExpandedStages] = useState({});

  const toggleStage = (stageId) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  const getIcon = (tab) => {
    switch (tab) {
      case "frontend":
        return <FaReact className="text-blue-500" />;
      case "backend":
        return <FaServer className="text-green-500" />;
      case "devops":
        return <SiKubernetes className="text-purple-500" />;
      case "data":
        return <FaRobot className="text-red-500" />;
      default:
        return <FaReact className="text-blue-500" />;
    }
  };

  const roadmaps = {
    frontend: {
      title: "Frontend Development",
      icon: <FaReact className="text-blue-500" />,
      description: "Build interactive user interfaces and web applications",
      stages: [
        {
          id: "fundamentals",
          title: "Fundamentals (0-6 months)",
          skills: [
            "HTML5",
            "CSS3",
            "JavaScript ES6+",
            "Responsive Design",
            "Git",
          ],
          resources: [
            { name: "MDN Web Docs", url: "https://developer.mozilla.org" },
            { name: "FreeCodeCamp", url: "https://freecodecamp.org" },
          ],
        },
        {
          id: "frameworks",
          title: "Frameworks (6-12 months)",
          skills: [
            "React.js/Vue.js/Angular",
            "State Management",
            "CSS Frameworks (Tailwind/Bootstrap)",
            "API Integration",
          ],
          resources: [
            {
              name: "React Documentation",
              url: "https://reactjs.org/docs/getting-started.html",
            },
            { name: "Vue Mastery", url: "https://www.vuemastery.com" },
          ],
        },
        {
          id: "advanced",
          title: "Advanced (1-2 years)",
          skills: [
            "TypeScript",
            "Testing (Jest, Cypress)",
            "Performance Optimization",
            "Webpack/Vite",
            "SSR/SSG",
          ],
          resources: [
            {
              name: "TypeScript Handbook",
              url: "https://www.typescriptlang.org/docs",
            },
            { name: "Testing Library", url: "https://testing-library.com" },
          ],
        },
        {
          id: "expert",
          title: "Expert Level (2+ years)",
          skills: [
            "Architecture Design",
            "Micro Frontends",
            "Web Components",
            "CI/CD Pipelines",
            "Mentoring",
          ],
          resources: [
            { name: "Frontend Masters", url: "https://frontendmasters.com" },
            { name: "Patterns.dev", url: "https://www.patterns.dev" },
          ],
        },
      ],
    },
    backend: {
      title: "Backend Development",
      icon: <FaServer className="text-green-500" />,
      description: "Develop server-side logic, databases, and APIs",
      stages: [
        {
          id: "fundamentals",
          title: "Fundamentals (0-6 months)",
          skills: [
            "Programming (Node.js/Python/Java)",
            "REST APIs",
            "Databases (SQL/NoSQL)",
            "Authentication",
          ],
          resources: [
            { name: "Node.js Docs", url: "https://nodejs.org/en/docs" },
            { name: "SQLZoo", url: "https://sqlzoo.net" },
          ],
        },
        {
          id: "intermediate",
          title: "Intermediate (6-18 months)",
          skills: [
            "API Design",
            "ORM/ODM",
            "Caching",
            "Message Queues",
            "Docker Basics",
          ],
          resources: [
            { name: "Docker Docs", url: "https://docs.docker.com" },
            { name: "Redis University", url: "https://university.redis.com" },
          ],
        },
        {
          id: "advanced",
          title: "Advanced (1.5-3 years)",
          skills: [
            "Microservices",
            "Cloud Services (AWS/Azure/GCP)",
            "Kubernetes",
            "GraphQL",
            "Security",
          ],
          resources: [
            { name: "AWS Training", url: "https://aws.amazon.com/training" },
            { name: "Kubernetes Docs", url: "https://kubernetes.io/docs/home" },
          ],
        },
        {
          id: "expert",
          title: "Expert Level (3+ years)",
          skills: [
            "System Design",
            "DevOps Practices",
            "Performance Tuning",
            "Distributed Systems",
            "Tech Leadership",
          ],
          resources: [
            {
              name: "System Design Primer",
              url: "https://github.com/donnemartin/system-design-primer",
            },
            { name: "DevOps Roadmap", url: "https://roadmap.sh/devops" },
          ],
        },
      ],
    },
    devops: {
      title: "DevOps Engineering",
      icon: <SiKubernetes className="text-purple-500" />,
      description: "Bridge development and operations with automation",
      stages: [
        {
          id: "fundamentals",
          title: "Fundamentals (0-6 months)",
          skills: [
            "Linux Basics",
            "Networking",
            "Scripting (Bash/Python)",
            "Version Control",
          ],
          resources: [
            { name: "Linux Journey", url: "https://linuxjourney.com" },
            { name: "Bash Guide", url: "https://guide.bash.academy" },
          ],
        },
        {
          id: "core",
          title: "Core Skills (6-12 months)",
          skills: [
            "Docker",
            "CI/CD Pipelines",
            "Infrastructure as Code",
            "Monitoring",
          ],
          resources: [
            { name: "Terraform Docs", url: "https://www.terraform.io/docs" },
            { name: "Jenkins Handbook", url: "https://www.jenkins.io/doc" },
          ],
        },
        {
          id: "cloud",
          title: "Cloud Specialization (1-2 years)",
          skills: [
            "Cloud Providers (AWS/Azure/GCP)",
            "Kubernetes",
            "Security Practices",
            "Serverless",
          ],
          resources: [
            { name: "Kubernetes Docs", url: "https://kubernetes.io/docs/home" },
            {
              name: "AWS Well-Architected",
              url: "https://aws.amazon.com/architecture/well-architected",
            },
          ],
        },
        {
          id: "advanced",
          title: "Advanced (2+ years)",
          skills: [
            "SRE Practices",
            "Chaos Engineering",
            "Cost Optimization",
            "Multi-Cloud Strategies",
          ],
          resources: [
            {
              name: "Google SRE Book",
              url: "https://sre.google/sre-book/table-of-contents",
            },
            {
              name: "Chaos Engineering",
              url: "https://www.oreilly.com/library/view/chaos-engineering/9781492043850",
            },
          ],
        },
      ],
    },
    data: {
      title: "Data Science",
      icon: <FaRobot className="text-red-500" />,
      description: "Extract insights and build intelligent systems",
      stages: [
        {
          id: "fundamentals",
          title: "Fundamentals (0-6 months)",
          skills: ["Python/R", "Statistics", "SQL", "Data Visualization"],
          resources: [
            {
              name: "Python Data Science Handbook",
              url: "https://jakevdp.github.io/PythonDataScienceHandbook",
            },
            { name: "Kaggle Learn", url: "https://www.kaggle.com/learn" },
          ],
        },
        {
          id: "ml",
          title: "Machine Learning (6-18 months)",
          skills: [
            "Scikit-learn",
            "Feature Engineering",
            "Model Evaluation",
            "Deep Learning Basics",
          ],
          resources: [
            { name: "Fast.ai", url: "https://course.fast.ai" },
            {
              name: "Machine Learning Mastery",
              url: "https://machinelearningmastery.com",
            },
          ],
        },
        {
          id: "advanced",
          title: "Advanced (1.5-3 years)",
          skills: ["Big Data Tools", "MLOps", "NLP/CV", "Cloud ML Services"],
          resources: [
            { name: "TensorFlow", url: "https://www.tensorflow.org/learn" },
            { name: "Hugging Face", url: "https://huggingface.co/course" },
          ],
        },
        {
          id: "expert",
          title: "Expert Level (3+ years)",
          skills: [
            "Research",
            "Production Systems",
            "Ethical AI",
            "Team Leadership",
          ],
          resources: [
            {
              name: "Deep Learning Book",
              url: "https://www.deeplearningbook.org",
            },
            { name: "Papers With Code", url: "https://paperswithcode.com" },
          ],
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            IT Career Roadmaps
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 sm:mt-5">
            Structured learning paths to guide your tech career journey
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-8 gap-4">
          {Object.keys(roadmaps).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeTab === key
                  ? "bg-white shadow-lg border border-gray-200 transform scale-105"
                  : "bg-white/70 hover:bg-white shadow-md border border-gray-100"
              }`}
            >
              <span className="text-xl">{roadmaps[key].icon}</span>
              <span>{roadmaps[key].title}</span>
            </button>
          ))}
        </div>

        {/* Roadmap Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-lg bg-white shadow-sm">
                {roadmaps[activeTab].icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {roadmaps[activeTab].title} Roadmap
                </h2>
                <p className="text-gray-600">
                  {roadmaps[activeTab].description}
                </p>
              </div>
            </div>
          </div>

          {/* Roadmap Stages */}
          <div className="divide-y divide-gray-100">
            {roadmaps[activeTab].stages.map((stage, index) => (
              <div
                key={stage.id}
                className="px-6 py-5 hover:bg-gray-50 transition-colors duration-200"
              >
                <button
                  onClick={() => toggleStage(stage.id)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <span className="text-blue-600 font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {stage.title}
                    </h3>
                  </div>
                  {expandedStages[stage.id] ? (
                    <FiChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FiChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {expandedStages[stage.id] && (
                  <div className="mt-4 pl-14">
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                        <span className="w-4 h-0.5 bg-blue-500 mr-2"></span>
                        Key Skills to Master
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {stage.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                        <span className="w-4 h-0.5 bg-green-500 mr-2"></span>
                        Recommended Learning Resources
                      </h4>
                      <ul className="space-y-3">
                        {stage.resources.map((resource) => (
                          <li key={resource.name}>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                            >
                              <span className="text-blue-600 group-hover:text-blue-800 transition-colors">
                                {resource.name}
                              </span>
                              <FiExternalLink className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Career Tips */}
        {/* <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Career Advancement Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  "Build portfolio projects",
                  "Contribute to open source",
                  "Network with professionals",
                  "Stay updated with trends",
                  "Pursue certifications",
                ].map((tip, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all"
                  >
                    <div className="text-white font-medium">{tip}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> */}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
        </div>
      </div>
    </div>
  );
};

export default ITCareerRoadmaps;
