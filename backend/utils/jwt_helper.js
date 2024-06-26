const JWT = require('jsonwebtoken')
const createError = require('http-errors')
require('dotenv').config()

module.exports = {
    signAccessToken: (userId, role, userEmail) => {
        return new Promise((resolve, reject) => {

            const payload = {
                role: role,
                userId: userId
            }

            const secret = process.env.ACCESS_TOKEN_SECRET

            const options = {
                expiresIn: '1y',
                issuer: 'OXIUM',
                audience: userEmail
            }

            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log("ERROR HERE ", err.message)
                    return reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
    },

    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) {
            return next(createError.Unauthorized())
        }

        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
            }

            req.payload = payload
            next();
        })

    },

    signRefreshToken: (userId, role) => {
        return new Promise((resolve, reject) => {

            const payload = {
                role: role
            }

            const secret = process.env.REFRESH_TOKEN_SECRET

            const options = {
                expiresIn: '1y',
                issuer: 'ict-academy.com',
                audience: userId
            }



            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    return reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
    },

    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (err) return (createError.Unauthorized())

                const userId = payload.aud

                resolve(userId)
            })
        })
    }



}