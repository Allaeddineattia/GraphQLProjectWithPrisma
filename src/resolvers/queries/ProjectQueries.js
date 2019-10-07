import {getUserDataFromRequest} from '../../utils/resolversUtils'
const ProjectQuery = {
    async projects(parent, {query}, {prisma, request}, info){
        const userData = await getUserDataFromRequest(prisma, request)
        return prisma.query.projects({
            where:{
                AND: [
                    {
                        room:{
                            users_some:{
                                id : userData.userID
                            }
                        }
                    },
                    {
                        OR: [
                            {
                                title_contains: query
                            },
                            {
                                description_contains: query
                            }
                        ]
                    }
                ]
            }
        }, info)
    },  
    async deadlines(parent, args, {prisma, request}, info){
        const userData = await getUserDataFromRequest(prisma, request)
        return prisma.query.deadlines({
            where:{
                project:{
                    room:{
                        users_some:{
                            id : userData.userID
                        }
                    }
                } 
            }
        }, info)
    },
    async backlogs(parent, {query}, {prisma, request}, info){
        const userData = await getUserDataFromRequest(prisma, request)
        return prisma.query.backlogs({
            where:{
                AND: [
                    {
                        project:{
                            room:{
                                users_some:{
                                    id : userData.userID
                                }
                            }
                        } 
                    },
                    {
                        name_contains: query
                    }
                ]
            }
        })
    }
} 

export {ProjectQuery as default}