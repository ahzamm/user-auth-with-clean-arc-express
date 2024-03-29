import makeAuthUser from "../../src/middleware/auth-user.js";

describe("makeAuthUser middleware", () => {
  const verifyToken = jest.fn();
  const findUser = () => {
    return {
      id: "1234",
      firstName: "jhon",
      lastName: "adward",
    };
  };
  const nextFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return 401 error when authorization header is missing", async () => {
    const httpRequest = {
      headers: {},
    };
    const httpResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await makeAuthUser({ verifyToken, findUser })(
      httpRequest,
      httpResponse,
      nextFunction
    );

    expect(httpResponse.status).toHaveBeenCalledWith(401);
    expect(httpResponse.json).toHaveBeenCalledWith({
      success: false,
      error: "Authorization header is missing or invalid.",
    });
    expect(nextFunction).not.toHaveBeenCalled();
    expect(verifyToken).not.toHaveBeenCalled();
  });

  test("should return 401 error when authorization header is invalid", async () => {
    const httpRequest = {
      headers: {
        authorization: "InvalidToken",
      },
    };
    const httpResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await makeAuthUser({ verifyToken, findUser })(
      httpRequest,
      httpResponse,
      nextFunction
    );

    expect(httpResponse.status).toHaveBeenCalledWith(401);
    expect(httpResponse.json).toHaveBeenCalledWith({
      success: false,
      error: "Authorization header is missing or invalid.",
    });
    expect(nextFunction).not.toHaveBeenCalled();
    expect(verifyToken).not.toHaveBeenCalled();
  });

  test("should return 401 error when token is not valid", async () => {
    const httpRequest = {
      headers: {
        authorization: "Bearer InvalidToken",
      },
    };
    const httpResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    verifyToken.mockResolvedValueOnce(false);

    await makeAuthUser({ verifyToken, findUser })(
      httpRequest,
      httpResponse,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(verifyToken).toHaveBeenCalledWith({
      token: "InvalidToken",
      tokenKey: process.env.ACCESS_KEY,
    });
  });

  test("should set the user in the request and call nextFunction when token is valid", async () => {
    const httpRequest = {
      headers: {
        authorization: "Bearer ValidToken",
      },
    };
    const httpResponse = {};
    verifyToken.mockResolvedValueOnce({ name: "John" });

    await makeAuthUser({ verifyToken, findUser })(
      httpRequest,
      httpResponse,
      nextFunction
    );

    expect(httpRequest.user).toMatchObject({
      firstName: "jhon",
      id: "1234",
      lastName: "adward",
    });
    expect(nextFunction).toHaveBeenCalled();
    expect(verifyToken).toHaveBeenCalledWith({
      token: "ValidToken",
      tokenKey: process.env.ACCESS_KEY,
    });
  });
});
