import {getUserDataFromRequest , checkUserBelongToRoom} from '../../utils/resolversUtils'
const extractDataFromCreatePostInput = (data) => {
    console.log(data)
    let {content, images} = data
    if ( ! images){
        images = []
    }
    return { content, images}
}

const postMutations = {
    async createPost( parent, {roomId, data}, {prisma, request}, info ){
        const userData = await getUserDataFromRequest(prisma, request)
        await checkUserBelongToRoom(userData.userID, roomId, prisma)
        const {content, images} = extractDataFromCreatePostInput(data)
        return prisma.mutation.createPost({
            data:{
                content,
                room: {
                    connect: {
                        id: roomId
                    }
                },
                author: {
                    connect:{
                        id: userData.userID
                    }
                },
                images: {
                    create: images
                }
            }
            
        }, info)
    }
}
export {postMutations as default}