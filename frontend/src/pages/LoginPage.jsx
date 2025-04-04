import React, { useState } from "react";

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Add login validation logic here
    alert(`Login attempted with username: ${formData.username}`);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Add registration validation logic here
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    alert(`Registration attempted for: ${formData.email}`);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 bg-cover bg-center bg-fixed flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl shadow-violet-900/30 rounded-2xl overflow-hidden transition-all duration-500">
        <div className="relative">
          {/* Animated background elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-violet-600/30 rounded-full filter blur-xl"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-600/30 rounded-full filter blur-xl"></div>
          
          <div className="p-8 relative">
            {/* Toggle between login/register */}
            <div className="flex mb-8 bg-white/10 rounded-full p-1">
              <button
                onClick={() => setIsRegistering(false)}
                className={`flex-1 py-2 px-4 rounded-full transition-all ${!isRegistering ? 'bg-white/20 font-medium' : 'opacity-70 hover:opacity-100'}`}
              >
                Login
              </button>
              <button
                onClick={() => setIsRegistering(true)}
                className={`flex-1 py-2 px-4 rounded-full transition-all ${isRegistering ? 'bg-white/20 font-medium' : 'opacity-70 hover:opacity-100'}`}
              >
                Register
              </button>
            </div>

            {!isRegistering ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <h1 className="text-3xl font-bold text-center text-white">Welcome Back</h1>
                <p className="text-center text-white/70 mb-6">Please enter your credentials</p>
                
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      required
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 pl-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                    <svg className="absolute left-4 top-3.5 h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 pl-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                    <svg className="absolute left-4 top-3.5 h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-white/80 text-sm">
                    <input type="checkbox" className="rounded bg-white/10 border-white/20 text-violet-500 focus:ring-violet-500 mr-2" />
                    Remember me
                  </label>
                  <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Forgot password?</a>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-violet-700 hover:to-pink-700 transition-all transform hover:scale-[1.01] shadow-lg shadow-violet-500/20"
                >
                  Sign In
                </button>
                
                <div className="text-center text-white/70 text-sm">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className="text-white font-medium hover:underline focus:outline-none"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <h1 className="text-3xl font-bold text-center text-white">Create Account</h1>
                <p className="text-center text-white/70 mb-6">Join us today</p>
                
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      required
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 pl-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                    <svg className="absolute left-4 top-3.5 h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      required
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 pl-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                    <svg className="absolute left-4 top-3.5 h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      required
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 pl-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                    <svg className="absolute left-4 top-3.5 h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 pl-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                    <svg className="absolute left-4 top-3.5 h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      required
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 pl-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                    <svg className="absolute left-4 top-3.5 h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-violet-700 hover:to-pink-700 transition-all transform hover:scale-[1.01] shadow-lg shadow-violet-500/20"
                >
                  Create Account
                </button>
                
                <div className="text-center text-white/70 text-sm">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="text-white font-medium hover:underline focus:outline-none"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;