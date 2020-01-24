const { getUser, pool } = require('../Postgres/index.js');
const bcrypt = require('bcryptjs');

module.exports = {
	checkPasswordMiddleware: async (req, res, next) => {
		if (req.body.username) {
			const response = await getUser(req.body.username);
			if (response.rows.length === 0) {
				res.statusMessage = "User doesn't exist";
				await res.status(401).end("User doesn't exist");
			} else {
				const hash = await bcrypt.compare(req.body.password, response.rows[0].password)
				if (hash === true) {
					await next()
				}
				if (hash === false) {
					res.statusMessage = 'Wrong Password';
					await res.status(401).end('Wrong Password');
				}
			}
		} else {
			console.log('Need to provide username and password')
		}
	},
}