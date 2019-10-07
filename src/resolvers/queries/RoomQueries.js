import {getUserDataFromRequest} from '../../utils/resolversUtils'
const RoomQuery = {
    async rooms(parent, {query, id}, {prisma, request}, info){
        const userData = await getUserDataFromRequest(prisma, request)
        let selector = {}
        if(id){
            selector = {id}
        }else if (query){
            selector = {
                OR: [
                    {
                        name_contains: query
                    },
                    {
                        project:{
                            title_contains: query
                        }
                    }
                ]
            }
        }
        return prisma.query.rooms({
            where: {
                AND:[
                    {
                        users_some:{
                            id: userData.userID
                        }
                    },
                    selector
                ]
            }
            
        }, info)
    },
    async posts(parent, {query, id}, {prisma, request}, info){
        const userData = await getUserDataFromRequest(prisma, request)
        let selector = {}
        if(id){
            selector = {id}
        }else if (query){
            selector = {
                OR:[
                    {
                        content_contains: query
                    },
                    {
                        author:{
                            OR:[
                                {
                                    firstName_contains: query
                                },
                                {
                                    lastName_contains: query
                                }
                            ]
                        }
                    }
                ]
            }
        }
        return prisma.query.posts({
            where:{
                AND: [
                    {
                        room:{
                            users_some:{ id: userData.userID}
                        }
                    },
                    selector
                ]
                
            }
        }, info)
    },
    async images(parent, {}, {prisma, request}, info){
        const userData = await getUserDataFromRequest(prisma, request)
        return prisma.query.images({
            where:{
                post: {
                    room:{
                        users_some:{ id: userData.userID}
                    }
                }
            }
        }, info)
        
    },
    async room(parent, {name, id}, {prisma, request}, info){
        const userData = await getUserDataFromRequest(prisma, request)
        let selector = {}
        if(id){
            selector = {id}
        }else if (name){
            selector = {
                name
            }
        }else { 
            throw new Error (" you must provide the id or the name of the room")
        }
        return prisma.query.rooms({
            where: selector
        }, info)
    },
    async post(parent, {id}, {prisma, request}, info){
        await getUserDataFromRequest(prisma, request)
        return prisma.query.prisma({
            where:{
                id
            }
        }, info)
    },
}

export {RoomQuery as default}