import React from 'react';

const coursesData = [
  {
    id: 1,
    title: 'Introduction to Web Development',
    content: 'Learn the fundamentals of HTML, CSS, and JavaScript to build responsive websites.',
    duration: '8 weeks',
    instructor: 'John Doe',
    image: 'https://th.bing.com/th/id/OIP.-CfH3st6XCVIstCink8mXwHaEK?rs=1&pid=ImgDetMain',
    link: '#',
    details: 'This course covers the basics of front-end web development, including responsive design techniques and JavaScript basics.',
  },
  {
    id: 2,
    title: 'Python for Beginners',
    content: 'Master the basics of Python programming and start your coding journey.',
    duration: '10 weeks',
    instructor: 'Jane Smith',
    image: 'https://i.ytimg.com/vi/m0LdKZ-prto/maxresdefault.jpg',
    link: '#',
    details: 'Learn Python from scratch, including data types, functions, and simple projects to solidify your skills.',
  },
  {
    id: 3,
    title: 'JavaScript Essentials',
    content: 'Understand the core concepts of JavaScript for dynamic web applications.',
    duration: '12 weeks',
    instructor: 'Michael Johnson',
    image: 'https://i.ytimg.com/vi/xc3a_CJhjCc/maxresdefault.jpg',
    link: '#',
    details: 'Dive deep into JavaScript fundamentals, asynchronous programming, and build interactive web apps.',
  },
];

const Courses = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold text-center text-indigo-800 mb-8">Our Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesData.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-2">{course.content}</p>
              <p className="text-gray-500 text-sm">Instructor: {course.instructor}</p>
              <p className="text-gray-500 text-sm">Duration: {course.duration}</p>
              <p className="text-gray-600 mt-2">{course.details}</p>
              <div className="mt-4 flex justify-between items-center">
                <a
                  href={course.link}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                >
                  Go to Course
                </a>
                <button
                  className="bg-gray-100 text-indigo-600 px-3 py-1 rounded-md hover:bg-gray-200 transition duration-300"
                  onClick={() => alert(`More about ${course.title}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
