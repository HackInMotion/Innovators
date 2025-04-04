import React, { useState } from 'react';

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Add login validation logic here
    alert('Login clicked');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Add registration validation logic here
    alert('Register clicked');
  };

  return (
    <div className="bg-cover bg-center bg-fixed flex justify-center items-center min-h-screen" style={{ backgroundImage: "url('img.jpg')" }}>
      <div className="w-full max-w-md bg-gradient-to-br from-black/50 to-transparent border-2 border-white/20 backdrop-blur-lg shadow-xl text-white rounded-xl p-8 relative">
        {!isRegistering ? (
          <form className="opacity-100 transition-opacity duration-500" id="loginCard" onSubmit={handleLogin}>
            <h1 className="text-4xl text-center mb-6">Login</h1>
            <div className="relative w-full h-12 mb-6">
              <input
                type="text"
                placeholder="Username"
                required
                title="Please enter your username"
                className="w-full h-full bg-transparent border-2 border-white/40 rounded-full text-white text-lg pl-6 pr-12 focus:border-white"
              />
              <i className="fas fa-user absolute right-4 top-1/2 transform -translate-y-1/2 text-xl"></i>
            </div>
            <div className="relative w-full h-12 mb-6">
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full h-full bg-transparent border-2 border-white/40 rounded-full text-white text-lg pl-6 pr-12 focus:border-white"
              />
              <i className="fas fa-lock absolute right-4 top-1/2 transform -translate-y-1/2 text-xl"></i>
            </div>
            <div className="flex justify-between text-sm mb-6">
              <label>
                <input type="checkbox" className="accent-white mr-2" /> Remember me
              </label>
              <a href="#" className="hover:underline">Forgot Password?</a>
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-red-600 to-red-400 rounded-full text-white font-semibold hover:from-red-400 hover:to-red-600 transition-all mb-6"
            >
              Login
            </button>
            <div className="text-sm text-center">
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="text-white font-semibold hover:underline"
                  onClick={() => setIsRegistering(true)}
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        ) : (
          <form className="opacity-100 transition-opacity duration-500" id="registerCard" onSubmit={handleRegister}>
            <h1 className="text-4xl text-center mb-6">Register</h1>
            <div className="relative w-full h-12 mb-6">
              <input
                type="text"
                placeholder="Username"
                required
                title="Please enter your username"
                className="w-full h-full bg-transparent border-2 border-white/40 rounded-full text-white text-lg pl-6 pr-12 focus:border-white"
              />
              <i className="fas fa-user absolute right-4 top-1/2 transform -translate-y-1/2 text-xl"></i>
            </div>
            <div className="relative w-full h-12 mb-6">
              <input
                type="text"
                placeholder="Name"
                required
                title="Please enter your full name"
                className="w-full h-full bg-transparent border-2 border-white/40 rounded-full text-white text-lg pl-6 pr-12 focus:border-white"
              />
              <i className="fas fa-user absolute right-4 top-1/2 transform -translate-y-1/2 text-xl"></i>
            </div>
            <div className="relative w-full h-12 mb-6">
              <input
                type="email"
                placeholder="Email"
                required
                title="Please enter your Email Id"
                className="w-full h-full bg-transparent border-2 border-white/40 rounded-full text-white text-lg pl-6 pr-12 focus:border-white"
              />
              <i className="fas fa-envelope absolute right-4 top-1/2 transform -translate-y-1/2 text-xl"></i>
            </div>
            <div className="relative w-full h-12 mb-6">
              <input
                type="password"
                placeholder="Password"
                required
                title="Create a New Password"
                className="w-full h-full bg-transparent border-2 border-white/40 rounded-full text-white text-lg pl-6 pr-12 focus:border-white"
              />
              <i className="fas fa-lock absolute right-4 top-1/2 transform -translate-y-1/2 text-xl"></i>
            </div>
            <div className="relative w-full h-12 mb-6">
              <input
                type="password"
                placeholder="Confirm Password"
                required
                title="Confirm your Password"
                className="w-full h-full bg-transparent border-2 border-white/40 rounded-full text-white text-lg pl-6 pr-12 focus:border-white"
              />
              <i className="fas fa-lock absolute right-4 top-1/2 transform -translate-y-1/2 text-xl"></i>
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-red-600 to-red-400 rounded-full text-white font-semibold hover:from-red-400 hover:to-red-600 transition-all mb-6"
            >
              Register
            </button>
            <div className="text-sm text-center">
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-white font-semibold hover:underline"
                  onClick={() => setIsRegistering(false)}
                >
                  Login here
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
