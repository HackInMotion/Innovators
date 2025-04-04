import React from 'react';

// Contact Form Component
const ContactForm = () => (
  <div className="lg:w-1/2 bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send us a message</h2>
    <form className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input type="text" id="name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Your name" required />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input type="email" id="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="your@email.com" required />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject (Optional)</label>
        <input type="text" id="subject" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="What's this about?" />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
        <textarea id="message" rows="5" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Tell us how we can help..." required></textarea>
      </div>

      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200">
        Send Message
      </button>
    </form>
  </div>
);

// Contact Info Component
const ContactInfo = () => (
  <div className="lg:w-1/2 space-y-8">
    <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h2>
      <div className="space-y-5">
        <div className="flex items-start">
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <i className="fas fa-envelope text-indigo-600"></i>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Email Support</h3>
            <p className="text-gray-600">support@studydoorstep.com</p>
            <p className="text-gray-600">admissions@studydoorstep.com</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <i className="fas fa-phone text-indigo-600"></i>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Phone (Optional)</h3>
            <p className="text-gray-600">+1 (800) 123-4567</p>
            <p className="text-sm text-gray-500">Mon-Fri, 9AM-5PM EST</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <i className="fas fa-map-marker-alt text-indigo-600"></i>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Headquarters</h3>
            <p className="text-gray-600">123 Education Boulevard</p>
            <p className="text-gray-600">Boston, MA 02115, USA</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-medium text-gray-800 mb-3">Follow Us</h3>
        <div className="flex space-x-4">
          {["twitter", "linkedin-in", "instagram", "youtube", "github"].map((icon) => (
            <a key={icon} href="#" className="bg-gray-100 hover:bg-indigo-100 p-3 rounded-full text-gray-700 hover:text-indigo-600 transition">
              <i className={`fab fa-${icon}`}></i>
            </a>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Quick Support Options Component
const SupportOptions = () => (
  <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
    <h3 className="text-xl font-semibold text-indigo-800 mb-4">Quick Support Options</h3>
    <ul className="space-y-3">
      {[
        { icon: "robot", title: "24/7 AI Chatbot", description: "Instant answers to your learning questions", link: "#" },
        { icon: "users", title: "Community Forum", description: "Reddit-style discussions with peers", link: "#" },
        { icon: "book-open", title: "Course Reviews", description: "Read expert reviews before enrolling", link: "#" },
      ].map((item) => (
        <li key={item.title} className="flex items-start">
          <i className={`fas fa-${item.icon} text-indigo-600 mt-1 mr-3`}></i>
          <div>
            <p className="font-medium text-gray-800">{item.title}</p>
            <p className="text-gray-600 text-sm">{item.description}</p>
            <a href={item.link} className="text-indigo-600 text-sm font-medium hover:underline">Learn More →</a>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

// Map Section Component
const MapSection = () => (
  <div className="mt-16 bg-white rounded-xl shadow-md overflow-hidden">
    <h2 className="text-2xl font-semibold text-gray-800 p-8 pb-0">Find Us</h2>
    <div className="p-8 pt-4">
      <p className="text-gray-600 mb-4">Visit our headquarters or connect virtually - we're always available to support your learning journey.</p>
      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.66583439952!2d-71.0997257241646!3d42.3458473713886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e379f0a8a5198d%3A0x9e8415e7866b404!2s123%20Education%20Boulevard%2C%20Boston%2C%20MA%2002115!5e0!3m2!1sen!2sus!4v1623862343964!5m2!1sen!2sus"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Map"
          className="rounded-lg"
        ></iframe>
      </div>
    </div>
  </div>
);

// Courses Call-to-Action Component
const CoursesCTA = () => (
  <div className="mt-16 bg-gradient-to-r from-indigo-700 to-purple-600 rounded-xl p-8 text-white">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Explore Our In-House Coding Courses</h2>
      <p className="text-lg mb-6">Master in-demand skills with our expert-led courses in HTML, CSS, JavaScript, C++, Python, and more.</p>
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {["HTML/CSS", "JavaScript", "Python", "C++", "Web Development"].map((course) => (
          <span key={course} className="bg-white bg-opacity-20 px-4 py-2 rounded-full">{course}</span>
        ))}
      </div>
      <a href="#" className="inline-block bg-white text-indigo-700 font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition">Browse All Courses</a>
    </div>
  </div>
);

// Main Contact Us Component
const ContactUs = () => (
  <div className="container mx-auto px-4 py-12 max-w-6xl">
    <header className="text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">Get in Touch</h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        We're here to help with your learning journey! Whether you have questions about our courses, need technical support, or want to collaborate, our team is ready to assist.
      </p>
    </header>

    <div className="flex flex-col lg:flex-row gap-12">
      <ContactForm />
      <ContactInfo />
    </div>

    <SupportOptions />
    <MapSection />
    <CoursesCTA />
  </div>
);

export default ContactUs;
