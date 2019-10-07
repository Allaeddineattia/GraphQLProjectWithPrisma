import hashPassword, {checkPassword} from '../../utils/hashage'
import { makeAJWT} from '../../utils/loginUtils'
import { extractDateFromInput } from '../../utils/date'
import { getAdminDataFromRequest, getUserDataFromRequest } from '../../utils/resolversUtils'

const userMutations = {
    async signUp(parent, args, {prisma}, info) {
        const password = await hashPassword(args.data.password)
        const {firstName, lastName, birthDate, email, pseudo} = args.data
        const login = await prisma.mutation.createLogin({
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
        },'{user{id firstName lastName birthDate} id email pseudo password }')
        const jwt = makeAJWT({
            loginID: login.id,
            userID: login.user.id
        })
        return ({
            token: jwt,
            user: login
        })
    },
    async login ( parent, args, {prisma}, info){
        const {pseudo, email, password} = args.data
        let login 

        if(email){
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
    async updateMe(parent, {data}, {prisma, request}, info){
        const userData = await getUserDataFromRequest(prisma, request)
        console.log(userData)
        let {email, password, firstName, lastName, birthDate} = data
        password = hashPassword(password)

        return prisma.mutation.updateLogin({
            where: {
                id: userData.loginID
            },
            data: {
                email,
                password,
                user:{
                    update:{
                        firstName,
                        lastName,
                        birthDate

                    }
                }
            }
        }, info)
    },
    async makeMeAdmin(parent, args, {prisma, request}, info){
        const data = await getUserDataFromRequest(prisma, request)
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
        await getAdminDataFromRequest(prisma, request)
        return prisma.mutation.updateUser({
            where: {
                id: args.userID
            },
            data:{
                role: "ADMIN"
            }
        }, info)

    },
    
}

export {userMutations as default}
