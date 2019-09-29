import {hash} from 'bcrypt'

const hashPassword = async (password) => {
    return await hash(password, 8)
}

export {hashPassword as default}