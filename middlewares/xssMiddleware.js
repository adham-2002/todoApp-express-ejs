import xss from "xss";

const sanitize = (data) => {
  if (typeof data === "string") {
    return xss(data);
  } else if (typeof data === "object" && data !== null) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        data[key] = sanitize(data[key]);
      }
    }
  }
  return data;
};

const xssMiddleware = (req, res, next) => {
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
};
export default xssMiddleware;
