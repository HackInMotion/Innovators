import React, { useState, useEffect, useRef } from 'react';
import { FaTrophy, FaMedal, FaAward, FaClock, FaPercentage, FaShareAlt, FaVolumeUp } from 'react-icons/fa';
import { FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';

// Sound effects
const correctSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
const wrongSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3');

const QuizContest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState('');
  const [discountEarned, setDiscountEarned] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [category, setCategory] = useState('javascript');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [questions, setQuestions] = useState([]);
  const progressRef = useRef(null);

  // Question database by category and difficulty
  const questionDatabase = {
    javascript: {
      easy: [
        {
          question: "What does 'DOM' stand for in web development?",
          options: [
            "Document Object Model",
            "Data Object Management",
            "Digital Output Module",
            "Display Object Matrix"
          ],
          answer: "Document Object Model",
          points: 10
        },
        {
          question: "Which keyword is used to declare variables in JavaScript?",
          options: ["var", "let", "const", "All of the above"],
          answer: "All of the above",
          points: 10
        }
      ],
      medium: [
        {
          question: "What is the output of 'console.log(typeof [])' in JavaScript?",
          options: ["array", "object", "undefined", "null"],
          answer: "object",
          points: 20
        },
        {
          question: "Which method removes the last element from an array?",
          options: ["pop()", "push()", "shift()", "unshift()"],
          answer: "pop()",
          points: 20
        }
      ],
      hard: [
        {
          question: "What does the 'this' keyword refer to in JavaScript?",
          options: [
            "The current function",
            "The global object",
            "The object that owns the executing code",
            "Always refers to window in browsers"
          ],
          answer: "The object that owns the executing code",
          points: 30
        },
        {
          question: "What is a closure in JavaScript?",
          options: [
            "A function that has access to its outer function's scope",
            "A way to close browser tabs",
            "A JavaScript built-in method",
            "A type of variable declaration"
          ],
          answer: "A function that has access to its outer function's scope",
          points: 30
        }
      ]
    },
    python: {
      easy: [
        {
          question: "Which keyword is used to define a function in Python?",
          options: ["func", "def", "function", "define"],
          answer: "def",
          points: 10
        }
      ],
      medium: [
        {
          question: "What does the 'zip()' function do in Python?",
          options: [
            "Compresses files",
            "Combines two lists into a list of tuples",
            "Creates a ZIP archive",
            "Encrypts data"
          ],
          answer: "Combines two lists into a list of tuples",
          points: 20
        }
      ],
      hard: [
        {
          question: "What is the difference between 'deep copy' and 'shallow copy'?",
          options: [
            "Deep copy creates a new object but shallow doesn't",
            "Shallow copy creates a new object but deep doesn't",
            "Deep copy duplicates nested objects, shallow copy doesn't",
            "There is no difference"
          ],
          answer: "Deep copy duplicates nested objects, shallow copy doesn't",
          points: 30
        }
      ]
    }
  };

  useEffect(() => {
    // Load questions based on selected category and difficulty
    const selectedQuestions = [...questionDatabase[category][difficulty]];
    // Shuffle questions
    setQuestions(selectedQuestions.sort(() => 0.5 - Math.random()).slice(0, 5));
  }, [category, difficulty]);

  useEffect(() => {
    // Fetch leaderboard from backend
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('https://your-api-endpoint.com/leaderboard');
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        // Fallback to sample data
        setLeaderboard([
          { id: 1, name: "CodeMaster", score: 95, time: 25, difficulty: 'hard' },
          { id: 2, name: "DevPro", score: 90, time: 28, difficulty: 'medium' },
          { id: 3, name: "JavaScriptKing", score: 85, time: 30, difficulty: 'easy' }
        ]);
      }
    };
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !showScore) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      // Update progress bar
      if (progressRef.current) {
        progressRef.current.style.width = `${(timeLeft / 30) * 100}%`;
      }
    } else if (timeLeft === 0 && !showScore) {
      handleFinish();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, showScore]);

  const startQuiz = () => {
    if (username.trim() === '') {
      alert('Please enter your name to start the quiz!');
      return;
    }
    setQuizStarted(true);
    setTimeLeft(30);
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
  };

  const handleAnswer = (selectedAnswer) => {
    // Play sound effect
    if (soundEnabled) {
      if (selectedAnswer === questions[currentQuestion].answer) {
        correctSound.play();
      } else {
        wrongSound.play();
      }
    }

    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore(score + questions[currentQuestion].points);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(30);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setShowScore(true);
    const finalScore = score + Math.floor(timeLeft); // Bonus points for time left
    
    // Calculate discount (10% per 20 points, max 50%)
    const discount = Math.min(50, Math.floor(finalScore / 20) * 10);
    setDiscountEarned(discount);

    // Generate discount code (in a real app, this would come from your backend)
    const discountCode = `CODE${discount}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Update leaderboard via API
    try {
      const newEntry = {
        name: username,
        score: finalScore,
        time: 30 - timeLeft,
        difficulty,
        category,
        date: new Date().toISOString()
      };

      const response = await axios.post('https://your-api-endpoint.com/leaderboard', newEntry);
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Error updating leaderboard:", error);
      // Fallback to client-side update
      const updatedLeaderboard = [...leaderboard, {
        id: leaderboard.length + 1,
        ...newEntry
      }].sort((a, b) => b.score - a.score || a.time - b.time)
        .slice(0, 10);
      setLeaderboard(updatedLeaderboard);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setUsername('');
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out my quiz results!',
        text: `I scored ${score} points on the ${difficulty} ${category} quiz and earned ${discountEarned}% off coding courses!`,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      alert(`Share your results: I scored ${score} points and earned ${discountEarned}% off!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Code Challenge Quiz
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Test your {category} knowledge at {difficulty} level, earn discounts, and compete!
          </p>
        </div>

        {!quizStarted ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Quiz Setup</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(questionDatabase).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-lg ${category === cat 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['easy', 'medium', 'hard'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`px-4 py-2 rounded-lg ${difficulty === diff 
                        ? diff === 'easy' ? 'bg-green-600 text-white' :
                          diff === 'medium' ? 'bg-yellow-600 text-white' :
                          'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${soundEnabled 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300'}`}
                >
                  <FaVolumeUp />
                  <span>Sound {soundEnabled ? 'On' : 'Off'}</span>
                </button>

                <button
                  onClick={startQuiz}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        ) : !showScore ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quiz Area */}
            <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <div className="text-white font-medium">
                  Question {currentQuestion + 1}/{questions.length}
                </div>
                <div className="flex items-center text-yellow-400">
                  <FaClock className="mr-2" />
                  <span>{timeLeft}s left</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                <div 
                  ref={progressRef}
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: '100%' }}
                ></div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {questions[currentQuestion]?.question}
                </h2>
                <div className="space-y-4">
                  {questions[currentQuestion]?.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="w-full text-left px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 text-white font-medium transition-all hover:translate-x-1"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-white">
                  Current Score: <span className="font-bold">{score}</span>
                </div>
                <button
                  onClick={handleFinish}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
                >
                  Finish Early
                </button>
              </div>
            </div>

            {/* Leaderboard Preview */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <FaTrophy className="text-yellow-400 mr-2" /> Top Coders
              </h3>
              <div className="space-y-4">
                {leaderboard.slice(0, 5).map((user, index) => (
                  <div key={user.id} className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                      index === 0 ? 'bg-yellow-500 text-black' : 
                      index === 1 ? 'bg-gray-400 text-black' : 
                      index === 2 ? 'bg-amber-700 text-white' : 'bg-gray-800 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-sm text-gray-400">
                        {user.score} pts ({user.difficulty})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Results Card */}
            <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Quiz Results</h2>
              
              <div className="flex flex-col md:flex-row justify-around items-center mb-8">
                <div className="text-center mb-6 md:mb-0">
                  <div className="text-5xl font-bold text-white mb-2">{score + Math.floor(timeLeft)}</div>
                  <div className="text-gray-400">Total Points</div>
                </div>
                
                <div className="text-center mb-6 md:mb-0">
                  <div className="text-5xl font-bold text-green-400 mb-2 flex items-center justify-center">
                    {discountEarned}% <FaPercentage className="ml-1" />
                  </div>
                  <div className="text-gray-400">Course Discount Earned</div>
                </div>
                
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-400 mb-2">{30 - timeLeft}s</div>
                  <div className="text-gray-400">Completion Time</div>
                </div>
              </div>

              {discountEarned > 0 ? (
                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-6 rounded-lg border border-green-500/30 mb-8">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                    <FaAward className="text-yellow-400 mr-2" /> Congratulations!
                  </h3>
                  <p className="text-gray-300 mb-4">
                    You've earned a {discountEarned}% discount on all our premium coding courses! 
                    Use code <span className="font-mono bg-black/30 px-2 py-1 rounded">CODE{discountEarned}</span> at checkout.
                  </p>
                  <div className="flex space-x-4">
                    <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all">
                      Browse Courses
                    </button>
                    <button 
                      onClick={shareResults}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all flex items-center"
                    >
                      <FaShareAlt className="mr-2" /> Share
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-6 rounded-lg border border-blue-500/30 mb-8">
                  <h3 className="text-xl font-bold text-white mb-3">Keep Practicing!</h3>
                  <p className="text-gray-300 mb-4">
                    You didn't earn a discount this time, but don't worry! Try again after brushing up on your skills.
                  </p>
                  <div className="flex space-x-4">
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all">
                      Learning Resources
                    </button>
                    <button 
                      onClick={shareResults}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all flex items-center"
                    >
                      <FaShareAlt className="mr-2" /> Share
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setCategory('javascript');
                    setDifficulty('medium');
                    resetQuiz();
                  }}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-all"
                >
                  Change Settings
                </button>
              </div>
            </div>

            {/* Full Leaderboard */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <FaMedal className="text-yellow-400 mr-2" /> Leaderboard
              </h3>
              <div className="space-y-3">
                {leaderboard.map((user, index) => (
                  <div 
                    key={user.id} 
                    className={`flex items-center p-3 rounded-lg ${
                      user.name === username 
                        ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/50' 
                        : 'bg-gray-700/50'
                    }`}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                      index === 0 ? 'bg-yellow-500 text-black font-bold' : 
                      index === 1 ? 'bg-gray-400 text-black font-bold' : 
                      index === 2 ? 'bg-amber-700 text-white font-bold' : 'bg-gray-800 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        user.name === username ? 'text-white font-bold' : 'text-white'
                      }`}>
                        {user.name} {user.name === username && "(You)"}
                      </div>
                      <div className="text-sm text-gray-400 flex justify-between">
                        <span>{user.score} points ({user.difficulty})</span>
                        <span>{user.time}s</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizContest;