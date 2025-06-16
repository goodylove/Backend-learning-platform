function notFound(req, res, next) {
  const error = new Error(`Route ${req.originalUrl} doesn't exist`);
  error.status = 404;
  next(error);
}

export default notFound;
