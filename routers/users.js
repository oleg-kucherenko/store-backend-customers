const { Router } = require('express')
const { guest } = require('../models/guest')
const { user } = require('../models/user')
const { checkToken } = require('../middleware/auth')

// router /api/users[/route]
const router = Router()

router.route('/login').post(user.login)
router.route('/profile')
    .get(checkToken, user.getProfileDetails)
    .put(checkToken, user.updateProfile)
    .delete(checkToken, user.deleteProfile)
router.route('/').post(guest.register)

module.exports = {
    usersRouter: router
}
