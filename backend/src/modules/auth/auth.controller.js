import UserModel from "../../../db/models/user.model.js";
import asyncHandler from "../../utils/AsyncWrapper.js";
import ApiResponse from "../../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../../utils/AppError.js";

// Password Validation Function
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Create User
const createUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, role, profilePicture } = req.body;

  // Validate password
  if (!validatePassword(password)) {
    return next(new AppError(400, "Password must be at least 8 characters long and contain a number, a letter, and a special character."));
  }

  const allowedRoles = ["student", "admin", "teacher"];
  if (role && !allowedRoles.includes(role)) {
    return next(
      new AppError(
        400,
        `Invalid role. Allowed roles are: ${allowedRoles.join(", ")}`
      )
    );
  }

  const userRole = role || "student";

  const existingUserByEmail = await UserModel.findOne({ email });
  if (existingUserByEmail) {
    return next(new AppError(400, "User with this email already exists"));
  }

  const existingUserByUsername = await UserModel.findOne({ username });
  if (existingUserByUsername) {
    return next(new AppError(400, "Username is already taken"));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new UserModel({
    username,
    email,
    password: hashedPassword,
    profilePicture: profilePicture || "",
    role: userRole,
  });

  await newUser.save();

  res.status(201).json(new ApiResponse(201, null, "User created successfully"));
});

// Login User
const loginUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });
  if (!user) {
    return next(new AppError(404, "User not found"));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError(400, "Invalid credentials"));
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "your_jwt_secret",
    {
      expiresIn: process.env.JWT_EXPIRY || "1h",
    }
  );

  res.status(200).json(new ApiResponse(200, { token }, "Login successful"));
});

// Refresh JWT Token
const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError(400, "No refresh token provided"));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return next(new AppError(404, "User not found"));
    }

    const newToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      {
        expiresIn: process.env.JWT_EXPIRY || "1h",
      }
    );

    res.status(200).json(new ApiResponse(200, { token: newToken }, "Token refreshed successfully"));
  } catch (err) {
    return next(new AppError(401, "Invalid refresh token"));
  }
});

// Get User by ID
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id).select("-password");
  if (!user) {
    return next(new AppError(404, "User not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, "User retrieved successfully"));
});

// Protected Routes Middleware
const protectedRoutes = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(401, "Token was not provided!"));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new AppError(401, "Invalid token format!"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;
    user = await UserModel.findById(decoded.id);

    if (!user) {
      return next(new AppError(404, "User not found!"));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return next(new AppError(401, "Invalid token!"));
    } else if (err.name === "TokenExpiredError") {
      return next(new AppError(401, "Token has expired! Please log in again."));
    } else {
      return next(new AppError(500, "Something went wrong with token verification"));
    }
  }
});

// Role-based Access Control
const allowedTo = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          `Access denied. You do not have permission to perform this action. Required roles: ${roles.join(
            ", "
          )}. Your role: ${req.user.role}`
        )
      );
    }
    next();
  });
};

export { createUser, loginUser, getUserById, refreshToken, protectedRoutes, allowedTo };
