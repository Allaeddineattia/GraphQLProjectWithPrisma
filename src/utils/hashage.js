import {hash, compare} from 'bcrypt'

const hashPassword = async (password) => {
    return await hash(password, 8)
}

const checkPassword = async (password, hashedPassword) =>{
    if( await compare(password, hashedPassword)){
        return true
    }
    throw new Error ( 'Unvalid Password')
}

export {hashPassword as default, checkPassword}