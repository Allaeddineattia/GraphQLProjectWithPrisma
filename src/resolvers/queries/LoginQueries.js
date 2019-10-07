import {getUserDataFromRequest} from '../../utils/resolversUtils'
const LoginQuery = {
    async users(parent, {query, id}, {prisma}, info){
        await getUserDataFromRequest(prisma, request)
        let selection = null
        if(id){
            selection = {id}
        }else {
            if (query){
                selection = {
                    OR: [
                        {
                            firstName_contains: query
                        },
                        {
                            lastName_contains: query
                        }
                    ]
                }
            }
        }
        return prisma.query.users({
            where:selection
        }, info)
    },
    async me ( parent, args, {prisma, request}, info){
        const data = await getUserDataFromRequest(prisma, request)
        return prisma.query.login({
            where: {
                id: data.loginID
            }   
        }, info)
    },
    async logins (parent, {query, id}, {prisma, request}, info){
        const data = await getUserDataFromRequest(prisma, request)
        let selection = null
        if(id){
            selection = {id}
        }else {
            if (query){
                selection = {
                    OR: [
                        {
                            pseudo_contains: query
                        },
                        {
                            email_contains: query
                        }
                    ]
                }
            }
        }
        const {role} = await prisma.query.user({
            where: {
                id: data.userID
            }   
        }, '{role}')
        if(role === "USER"){
            return [login]
        }
        if(role === "ADMIN"){
            return prisma.query.logins({where: selection}, info)
        }
    },

}
export {LoginQuery as default}