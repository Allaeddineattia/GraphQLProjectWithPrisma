import hashPassword, {checkPassword} from '../utils/hashage'
import {makeAJWT, getUserId} from '../utils/loginUtils'
import { extractDateFromInput } from '../utils/date'
import {getDataFromJwt} from '../utils/loginUtils'
const Mutation = {
    async signUp(parent, args, {prisma}, info) {
        const password = await hashPassword(args.data.password)
        const {firstName, lastName, birthDate, email, pseudo} = args.data
        return prisma.mutation.createLogin({
            data: {
                email,
                pseudo,
                password,
                user: {
                    create: {
                        firstName,
                        lastName,
                        birthDate: extractDateFromInput(birthDate),
                        role: "USER"
                    }
                }
            }
        }, info)
    },
    async login ( parent, args, {prisma}, info){
        const {pseudo, email, password} = args.data
        let login

        if(email){
            console.log("rahou dkhal")
            login = await prisma.query.login({
                where: {
                    email
                }
            }, null)
        } else {
            if(!pseudo){
                throw new Error ('please set pseudo or email')
            }
            login = await prisma.query.login({
                where: {
                    pseudo
                }
            }, '{user{id firstName lastName birthDate} id email pseudo password }')
        }
        console.log(login)
        await checkPassword(password, login.password)
        const jwt = makeAJWT({ 
            loginID: login.id,
            userID: login.user.id
        })
        console.log('jwt: ',jwt)
        return (
            {
                token: jwt,
                user: login
            }
        )
    },
    async makeMeAdmin(parent, args, {prisma, request}, info){
        const data = getDataFromJwt(request)
        if(! await prisma.exists.Login({id: data.loginID}) ){
            throw new Error ('Unvalid Token plz relogin')
        }
        
        if(! await prisma.exists.User({role: "ADMIN"}))
        {
            return prisma.mutation.updateUser({
                where: {
                    id: data.userID
                },
                data:{
                    role: "ADMIN"
                }
            }, info)
        }
        throw new Error ('you can\'t be an Admin' )
    },
    async makeUserAdmin(parent, args, {prisma, request}, info){
        const data = getDataFromJwt(request)
        console.log(data)
        if(! await prisma.exists.Login({
            id: data.loginID,
            user: {
                role: "ADMIN"
            }
        }) ){
            throw new Error ('Unvalid Token plz relogin')
        }
        
        return prisma.mutation.updateUser({
            where: {
                id: args.userID
            },
            data:{
                role: "ADMIN"
            }
        }, info)

    }
    
}

export {Mutation as default}