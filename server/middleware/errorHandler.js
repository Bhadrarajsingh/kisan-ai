export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`❌ [Error]: ${err.message}`, {
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    url: req.originalUrl,
    method: req.method
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? 'Server Error' : err.stack,
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`API Endpoint Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
