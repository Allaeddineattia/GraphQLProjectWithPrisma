import {getUserDataFromRequest, checkUserBelongToRoom, checkMasterOfRoom } from '../../utils/resolversUtils'
const roomMutations = {
    async createRoom(parent, args, {prisma, request}, info){
        const userData = await getUserDataFromRequest(prisma, request)
        let {name, membersIds} = args.data
        if (! membersIds){
            membersIds = []
        }
        if(! membersIds.includes(userData.userID))
        membersIds.push(userData.userID)
        const memberSelectionArray = membersIds.map(id => {return {id}})
        return prisma.mutation.createRoom({
            data: {
                name,
                master: {
                    connect: {id: userData.userID}
                },
                users: {
                    connect: memberSelectionArray
                }
            }
        }, '{id name master{id firstName lastName} users{id firstName lastName}}')
    },
    async updateRoom (parent, {id, data}, {prisma, request}, info){
        const userData = await getUserDataFromRequest(prisma, request)
        await checkUserBelongToRoom(userData.userID, id, prisma)
        const {masterId, name, members} = data
        if ( masterId || name || members.action === "REMOVE") {
            await checkMasterOfRoom(userData.userID, id, prisma)
        }
        if(! members.Ids){
            members.Ids = []
        } 

        return prisma.mutation.updateRoom({
            where: {
                id
            },
            data: {
                name,
                master: {
                    connect: masterId
                },
                users: {
                    connect: members.action === "ADD" ? members.Ids.map(id => {return {id}}) : [],
                    disconnect: members.action === "REMOVE" ? members.Ids.map(id => {return {id}}) : []
                }

            }
        }, info)
    },
}

export {roomMutations as default}