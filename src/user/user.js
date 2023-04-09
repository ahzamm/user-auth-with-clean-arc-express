import logger from "../logger.js";

export default function buildMakeUser({ Id, hashPassword }) {
  return function makeUser({
    id = Id.makeId(),
    firstName,
    lastName,
    email,
    password,
    modifiedOn = new Date(Date.now()).toUTCString(),
    createdOn = new Date(Date.now()).toUTCString(),
  }) {
    if (!Id.isValidId(id)) {
      throw new Error("User must have a valid id.");
    }
    if (![firstName, lastName, email, password].every(Boolean)) {
      throw new Error("Please provide complete information");
    }
    if (!isValidEmail(email)) {
      throw new Error(`${email} is not a valid email`);
    }

    if (!isValidPassword(password)) {
      const errorMessage =
        "Password must contains min 8 letter password, with at least a symbol, upper and lower case letters and a number";
      const logData = {
        password: password,
        functionName: "isValidPassword",
        fileName: __filename,
      };
      logger.error(JSON.stringify(logData));
      throw new Error(errorMessage);
    }

    return Object.freeze({
      getId: () => id,
      getFirstName: () => firstName,
      getLastName: () => lastName,
      getEmail: () => email,
      getModifiedOn: () => modifiedOn,
      getCreatedOn: () => createdOn,
      getHashedPassword: async () => await hashPassword({ password }),
    });

    function isValidEmail(email) {
      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/;
      return emailRegex.test(email.toLowerCase());
    }

    function isValidPassword(password) {
      var passwordRegex =
        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      return passwordRegex.test(password);
    }
  };
}
