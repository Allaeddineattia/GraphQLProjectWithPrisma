import {getDataFromJwt} from '../utils/loginUtils'
const Query = {
    users(parent, args, {prisma}, info){
        console.log(args)
        return prisma.query.users(null, info)
    },
    me ( parent, args, {prisma, request}, info){
        const data = getDataFromJwt(request)
        return prisma.query.login({
            where: {
                id: data.loginID
            }   
        }, info)
    },
    async logins (parent, args, {prisma, request}, info){
        const data = getDataFromJwt(request)
        const login = await prisma.query.login({
            where: {
                id: data.loginID
            }   
        }, '{user{id firstName lastName birthDate role} id email pseudo password }')
        console.log(login)
        if(login.user.role === "USER"){
            return [login]
        }
        if(login.user.role === "ADMIN"){
            return prisma.query.logins(null, info)
        }
    }

} 
export {Query as default}