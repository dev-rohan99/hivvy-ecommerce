import errorHandler from "../utilities/errorHandler.js";

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Something went wrong!";

  // wrong mongodb id error
  if (err.name === "CastError") {
    const message = "Resources not found!";
    err = new errorHandler(message, 400);
  }

  // duplicate key error
  if (err.code === "11000") {
    const message = `Duplicate key ${Object.keys(err.keyValue)} entered!`;
    err = new errorHandler(message, 400);
  }

  // wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Your URL is invalid! Please try again latter.`;
    err = new errorHandler(message, 400);
  }

  // jwt expired error
  if (err.name === "TokenExpiredError") {
    const message = `Your URL is expired! Please try again latter.`;
    err = new errorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
