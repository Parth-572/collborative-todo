const errorHandler = (err, req, res, next) => {
  console.log(`Error at: ${req.path}`, err);

  res.status(500).json({ message: "Internal server Error" });
};

export default errorHandler;
