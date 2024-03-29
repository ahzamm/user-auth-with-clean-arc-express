import makeDeleteUser from "./delete-user.js";
import makeIssueToken from "./issue-token.js";
import makeLoginUser from "./login-user.js";
import makePatchUserPassword from "./patch-user-password.js";
import makePostUser from "./post-user.js";
import verifyUser from "./verify-user.js";
import makeUserProfile from "./user-profile.js";

import deleteUserDependencies from "../controller-helper/delete-user.helper.js";
import issueTokenDependencies from "../controller-helper/issue-token.helper.js";
import loginUserDependencies from "../controller-helper/login-user.helper.js";
import patchUserPasswordDependencies from "../controller-helper/patch-user-password.heper.js";
import postUserDependencies from "../controller-helper/post-user.helper.js";
import patchUserNameDependencies from "../controller-helper/patch-user-name.helper.js";
import userProfileDependencies from "../controller-helper/user-profile.helper.js";

import userService from "../use-cases/index.js";
import makePatchUserName from "./patch-user-name.js";

const { editUserPassword, authenticateUser, removeUser, editUserName } =
  userService;

const userController = Object.freeze({
  postUser: makePostUser(postUserDependencies),
  loginUser: makeLoginUser({ authenticateUser, ...loginUserDependencies }),
  deleteUser: makeDeleteUser({ removeUser, ...deleteUserDependencies }),
  verifyUser,
  issueToken: makeIssueToken(issueTokenDependencies),
  patchPassword: makePatchUserPassword({
    editUserPassword,
    ...patchUserPasswordDependencies,
  }),
  patchUserName: makePatchUserName({
    editUserName,
    ...patchUserNameDependencies,
  }),
  userProfile: makeUserProfile(userProfileDependencies)
});

export default userController;
