import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Header */}
      <header className="text-center mb-20 animate__animated animate__fadeIn">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          <span className="gradient-text">About Study Doorstep</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Empowering learners worldwide with accessible, community-driven
          education through innovative technology.
        </p>
      </header>

      {/* Who We Are */}
      <section className="mb-20 animate__animated animate__fadeInUp">
        <div className="highlight-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Who We Are</h2>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-lg">
              We're a passionate collective of educators, developers, and
              lifelong learners committed to democratizing education. At Study
              Doorstep, we're building more than a platform—we're creating a
              movement that brings quality learning to anyone with curiosity and
              an internet connection.
            </p>
            <p className="text-lg">
              Recognizing the challenges faced by self-learners—especially those
              without access to coding communities or mentors—we've designed a
              smart ecosystem that combines cutting-edge technology with human
              connection. Our team comes from diverse backgrounds but shares one
              unifying belief: education should adapt to the learner, not the
              other way around.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        {/* Mission */}
        <div className="highlight-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 animate__animated animate__fadeInLeft">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-lg">
              To dismantle educational barriers by merging AI-powered tools with
              authentic human connection. We enable learners to solve doubts
              instantly, find their tribe, and navigate personalized learning
              paths that align with their aspirations.
            </p>
            <p className="text-lg">
              We measure our success by the confidence gained by each student
              who transitions from "I can't" to "I did it!"—regardless of their
              starting point.
            </p>
          </div>
        </div>

        {/* Vision */}
        <div className="highlight-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 animate__animated animate__fadeInRight">
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-lg">
              To cultivate the world's most adaptive learning ecosystem—where
              education molds itself around each learner's unique rhythm, goals,
              and circumstances. We see a future where geography and resources
              no longer determine educational quality.
            </p>
            <p className="text-lg">
              As we grow, we're expanding our course library, integrating live
              mentorship, and developing AI that doesn't just answer
              questions—but anticipates learning needs before they arise.
            </p>
          </div>
        </div>
      </div>

      {/* What We Offer */}

      {/* The Problem */}
      <section className="mb-20 animate__animated animate__fadeInUp">
        <div className="highlight-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="bg-red-100 p-3 rounded-lg mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.75 15L4.5 9m10.5 0l-5.25 6m7.5-3a9 9 0 11-9-9 9 9 0 019 9z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">The Problem</h2>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-lg">
              Despite the abundance of online resources, learners face
              challenges in finding the right materials, staying motivated, and
              accessing real-time support. Traditional educational platforms
              often lack personalization and community-driven feedback.
            </p>
            <p className="text-lg">
              Without mentorship, learners can feel isolated, struggling to find
              their path amid the noise of inconsistent content quality and
              confusing information hierarchies.
            </p>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="text-center mb-20 animate__animated animate__fadeIn">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Join the Movement
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Whether you're a student eager to learn, an educator passionate about
          teaching, or a developer excited to contribute—Study Doorstep welcomes
          you to join our growing community.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Get Started
        </a>
      </section>
    </div>
  );
};

export default AboutUs;
