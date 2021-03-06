const jwt = require('jsonwebtoken')
const PassportLocalStrategy = require('passport-local').Strategy
const User = require('../models/User')

module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const userToLogin = {
    email: email.trim(),
    password: password.trim()
  }

  User
    .findOne({email: userToLogin.email})
    .then(user => {
      if (!user || !user.authenticate(userToLogin.password)) {
        const error = new Error('Incorrect email or password')
        error.name = 'IncorrectCredentialsError'
        return done(error)
      }

      if (user.isBanned) {
        const error = new Error('Sorry, you are banned. Contact Admin.')
        error.name = 'BannedError'
        return done(error)
      }

      const payload = {
        sub: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.roles.includes('Admin'),
        isBanned: user.isBanned
      }
      const token = jwt.sign(payload, 's0m3 r4nd0m str1ng', {expiresIn: '1h'})

      return done(null, token)
    })
})
