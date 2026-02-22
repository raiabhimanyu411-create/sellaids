const noCache = (req, res, next) => {
  delete req.headers["if-none-match"];
  delete req.headers["if-modified-since"];

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  res.removeHeader("ETag");

  res.status(200);

  next();
};

export default noCache;
