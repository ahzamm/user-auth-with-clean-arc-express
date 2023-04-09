export default function makeLoginUser({ authenticateUser, makeTokens }) {
  return async function loginUser(httpRequest) {
    const accessTokenKey = process.env.ACCESS_KEY;
    const accessTokenExpTime = process.env.ACCESS_EXP_TIME;
    const refreshTokenKey = process.env.REFRESH_KEY;
    const refreshTokenExpTime = process.env.REFRESH_EXP_TIME;

    try {
      const credentials = httpRequest.body;
      const userInfo = await authenticateUser(credentials);

      // Generate access token and calculate its expiration time
      const accessPayload = { userId: userInfo.id, email: userInfo.email };

      const accessToken = await makeTokens.generateToken({
        payload: accessPayload,
        tokenKey: accessTokenKey,
        tokenExpTime: accessTokenExpTime,
      });
      const accessTokenExpTimeInSeconds = await makeTokens.getExpirationTime({
        tokenExpTime: accessTokenExpTime,
      });

      // Generate refresh token and calculate its expiration time
      const refreshPayload = { userId: userInfo.id };

      const refreshToken = await makeTokens.generateToken({
        payload: refreshPayload,
        tokenKey: refreshTokenKey,
        tokenExpTime: refreshTokenExpTime,
      });
      const refreshTokenExpTimeInSeconds = await makeTokens.getExpirationTime({
        tokenExpTime: refreshTokenExpTime,
      });

      const { modifiedOn, hashedPassword, ...userWithoutSensitiveData } =
        userInfo;
      const responseBody = {
        success: true,
        user: userWithoutSensitiveData,
        tokens: {
          access: {
            token: accessToken,
            expiresIn: accessTokenExpTimeInSeconds,
          },
          refresh: {
            token: refreshToken,
            expiresIn: refreshTokenExpTimeInSeconds,
          },
        },
      };

      // Return success response
      return {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date(modifiedOn).toUTCString(),
        },
        statusCode: 201,
        body: responseBody,
      };
    } catch (error) {
      console.error(`Error: ${error}`);
      // Return error response
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 400,
        body: {
          success: false,
          error: error.message,
        },
      };
    }
  };
}
