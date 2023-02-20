import makeUser from "../user/index.js";

export default function makeEditUserPassword({ usersDb, passwordValidator }) {
	return async function editUserPassword({
		id,
		oldPassword,
		newPassword,
		...rest
	}) {
		if (!id) {
			throw new Error("You must supply an id.");
		}
		if (!oldPassword || !newPassword) {
			throw new Error("You must supply old and new password.");
		}

		const existing = await usersDb.findById({ id });

		if (!existing) {
			throw new RangeError("User not found.");
		}
		const oldHashedPassword = existing.hashedPassword;

		const isPasswordMatched = await passwordValidator({
			oldPassword,
			oldHashedPassword,
		});

		if (!isPasswordMatched) {
			throw new Error("Wrong Old Password.");
		}

		const user = makeUser({ id, password: newPassword, ...rest });

		const updated = await usersDb.updatePassword({
			id: user.getId(),
			firstName: user.getFirstName(),
			lastName: user.getLastName(),
			email: user.getEmail(),
			hashedPassword: user.getHashedPassword(),
		});

		return updated;
	};
}
