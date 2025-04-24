const { asyncHandler } = require("../service/asyncHandler.js");
const { User } = require("../models/user.model.js");
let signUp = asyncHandler(async (req, res) => {
	const { name, address, phone, email, userName, password } = req.body;
	console.log(name, address, phone, email, userName, password);
	let user = new User({
		name,
		address,
		phone,
		email,
		userName,
		password,
		role: "user",
	});
	await user.save();
	res.json({ status: true });
});
module.exports = { signUp };