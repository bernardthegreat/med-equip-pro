import axios from "axios";

export const isEmpty = (arg) => {
  if (
    arg == null ||
    arg === "" ||
    (Array.isArray(arg) && arg.length === 0) ||
    (typeof arg === "object" && Object.keys(arg).length === 0)
  )
    return true;

  return false;
};

// Simple Query String builder
export const buildQueryStr = (query) => {
  return `?${Object.entries(query)
    .map((entry) => `${entry[0]}=${entry[1]}`)
    .join("&")}`;
};

export const request = async (arg) => {
  const { url, method, data, handler } = arg;

  let verb = "Fetching";
  if (method === "post") verb = "Adding";
  if (method === "put") verb = "Updating";
  if (method === "delete") verb = "Removing";

  // `process.env` vars which evaluate to `true` are tree-shaked during build/compilation
  if (process.env.DEV) console.log(`${verb} data...`);

  try {
    const response = await axios[method](url, data, { timeout: 5000 });

    // HTTP payload is automatically parsed by axios into JS object
    // HTTP Status Code 400 and up are error codes
    if (response.status >= 400)
      throw `HTTP Error code received: ${response.status}`;

    if (process.env.DEV) console.log("Response data: ", response.data);

    handler(response.data);
  } catch (err) {
    console.log(err);
    return false;
  }

  return true;
};
