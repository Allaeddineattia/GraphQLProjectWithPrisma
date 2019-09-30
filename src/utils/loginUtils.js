import * as jwt from 'jsonwebtoken'
const makeAJWT = (data) => {
    return jwt.sign(data, 'secret', {expiresIn: '7 days'})
}

const getDataFromJwt = (request)=> {
    const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization
    if (header) {
        const token = header.split(' ')[1]
        const decoded = jwt.verify(token, 'secret')
        return decoded
    }

    throw new Error('Authentication required')
}

export { makeAJWT, getDataFromJwt } 