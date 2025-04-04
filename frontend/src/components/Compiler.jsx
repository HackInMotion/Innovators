import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { SiCplusplus, SiPython } from "react-icons/si";
import { FiCopy, FiPlay } from "react-icons/fi";

const CodeCompiler = () => {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [executionTime, setExecutionTime] = useState(0);

  // Default code templates
  const defaultCodes = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++ World!";
    return 0;
}`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java World!");
    }
}`,
    python: `print("Hello, Python World!")`,
  };

  // Set default code when language changes
  useEffect(() => {
    setCode(defaultCodes[language]);
    setOutput("");
  }, [language]);

  // Handle code execution
  const handleRun = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setOutput("Executing...");

    try {
      const startTime = performance.now();

      // In a real app, replace with your backend API call
      // This example uses a mock response
      const response = await mockCompile(language, code, input);

      const endTime = performance.now();
      setExecutionTime((endTime - startTime) / 1000);

      if (response.error) {
        setOutput(`Error: ${response.error}\n${response.stderr || ""}`);
      } else {
        setOutput(response.stdout || "Execution completed with no output");
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock compilation function - replace with real API calls
  const mockCompile = async (lang, sourceCode, userInput) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock responses for different languages
    const mockResponses = {
      cpp: {
        stdout: "Hello, C++ World!",
        stderr: "",
      },
      python: {
        stdout: "Hello, Python World!",
        stderr: "",
      },
    };

    // Simulate errors for demonstration
    if (sourceCode.includes("error")) {
      return {
        error: "Compilation error",
        stderr: "Error on line 3: expected ';' after expression",
      };
    }

    return mockResponses[lang] || { stdout: "", stderr: "" };
  };

  // Copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">Online Code Compiler</h1>
        <div className="flex items-center mt-2 space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setLanguage("cpp")}
              className={`px-3 py-1 rounded-md flex items-center ${
                language === "cpp" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              <SiCplusplus className="mr-1" /> C++
            </button>
            {/* <button
              onClick={() => setLanguage("java")}
              className={`px-3 py-1 rounded-md flex items-center ${
                language === "java" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              <SiJava className="mr-1" /> Java
            </button> */}
            <button
              onClick={() => setLanguage("python")}
              className={`px-3 py-1 rounded-md flex items-center ${
                language === "python" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              <SiPython className="mr-1" /> Python
            </button>
          </div>
          <div className="flex items-center space-x-2 ml-auto">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-gray-700 text-white px-2 py-1 rounded"
            >
              <option value="vs">Light</option>
              <option value="vs-dark">Dark</option>
              <option value="hc-black">High Contrast</option>
            </select>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="bg-gray-700 text-white px-2 py-1 rounded"
            >
              {[12, 14, 16, 18, 20].map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col border-r border-gray-300">
          <div className="bg-gray-200 p-2 flex justify-between items-center">
            <h2 className="font-semibold">Editor</h2>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 bg-gray-600 text-white rounded flex items-center"
                title="Copy code"
              >
                <FiCopy className="mr-1" /> Copy
              </button>
              <button
                onClick={handleRun}
                disabled={isLoading}
                className={`px-3 py-1 rounded flex items-center ${
                  isLoading
                    ? "bg-gray-500"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <FiPlay className="mr-1" /> {isLoading ? "Running..." : "Run"}
              </button>
            </div>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              theme={theme}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Input/Output */}
        <div className="w-1/3 flex flex-col">
          {/* Input */}
          <div className="flex-1 border-b border-gray-300 flex flex-col">
            <div className="bg-gray-200 p-2">
              <h2 className="font-semibold">Input</h2>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 font-mono text-sm resize-none outline-none"
              placeholder="Enter input here..."
            />
          </div>

          {/* Output */}
          <div className="flex-1 flex flex-col">
            <div className="bg-gray-200 p-2 flex justify-between items-center">
              <h2 className="font-semibold">Output</h2>
              {executionTime > 0 && (
                <span className="text-sm text-gray-600">
                  Executed in {executionTime.toFixed(2)}s
                </span>
              )}
            </div>
            <pre className="flex-1 p-2 bg-white overflow-auto font-mono text-sm whitespace-pre-wrap">
              {output || "Output will appear here..."}
            </pre>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-2 text-center text-sm">
        Online Code Compiler - Supports C++, Java, and Python
      </footer>
    </div>
  );
};

export default CodeCompiler;
