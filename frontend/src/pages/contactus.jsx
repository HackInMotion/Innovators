import React from 'react';
import { Linkedin, Instagram, Github } from 'lucide-react';

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
        <div className="flex items-center space-x-4">
          <img src="https://img.icons8.com/ios/50/000000/email.png" alt="Email" className="w-8 h-8" />
          <div>
            <h3 className="font-medium text-gray-800">Email Support</h3>
            <p className="text-gray-600">support@studydoorstep.com</p>
            <p className="text-gray-600">hacakthongndec@gmail.com</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <img src="https://img.icons8.com/ios/50/000000/phone.png" alt="Phone" className="w-8 h-8" />
          <div>
            <h3 className="font-medium text-gray-800">Phone (Optional)</h3>
            <p className="text-gray-600">+91 70090 79926</p>
            <p className="text-sm text-gray-500">Mon-Fri, 9AM-5PM EST</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <img src="https://img.icons8.com/ios/50/000000/marker.png" alt="Headquarters" className="w-8 h-8" />
          <div>
            <h3 className="font-medium text-gray-800">Headquarters</h3>
            <p className="text-gray-600">Guru Nanak Dev Engineering College</p>
            <p className="text-gray-600">Ludhiana, 141108, India</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-medium text-gray-800 mb-3">Follow Us</h3>
        <div className="flex space-x-4">
          <a
            href="https://www.linkedin.com/in/aryan-pandey084/"
            className="bg-gray-100 hover:bg-indigo-100 p-3 rounded-full text-gray-700 hover:text-indigo-600 transition"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://www.instagram.com/aryanpandey.7077/"
            className="bg-gray-100 hover:bg-indigo-100 p-3 rounded-full text-gray-700 hover:text-indigo-600 transition"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/Aryan02006"
            className="bg-gray-100 hover:bg-indigo-100 p-3 rounded-full text-gray-700 hover:text-indigo-600 transition"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6919.283599793432!2d75.8569916!3d30.8606954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a828f09011b15%3A0xbf3f5b51dcc81b12!2sGuru%20Nanak%20Dev%20Engineering%20College!5e0!3m2!1sen!2sus!4v1588957985324!5m2!1sen!2sus"
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

    <MapSection />
  </div>
);

export default ContactUs;