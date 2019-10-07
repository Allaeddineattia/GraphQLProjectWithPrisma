import {getDataFromJwt} from './loginUtils'
export const getUserDataFromRequest = async (prisma , request) => {
    const data = getDataFromJwt(request)
    if(! await prisma.exists.Login({id: data.loginID}) ){
        throw new Error ('Unvalid Token plz relogin')
    }
    return data
} 

export const getAdminDataFromRequest = async (prisma , request) => {
    const data = getDataFromJwt(request)
    if(
        ! await prisma.exists.Login({
            id: data.loginID,
            user: {
                role: "ADMIN"
            }
        })
    ){
        throw new Error ('Unvalid Token plz Relogin')
    }
    return data
} 

export const checkUserBelongToRoom = async (userId, roomId, prisma) => {
    if (! await prisma.exists.Room({
            id: roomId,
            users_some:{
                id: userId
            }
        })
    ){
        throw new Error(" authenicated user is not a member of this room")
    }
    return true
}

export const checkMasterOfRoom = async (masterId, roomId, prisma) => {
    if( ! await prisma.exists.Room({
        id: roomId,
        master:{
                id: masterId
        }
    })){
        throw new Error (" authenicated user is not the master of this room ")
    }
    return true
}

export const checkMasterOfRoomOfProject = async (masterId, projectId, prisma) => {
    if( ! await prisma.exists.Project({
        id: projectId,
        room:{
            master:{id: masterId} 
        }
    })){
        throw new Error (" authenicated user is not the master of the room of this project")
    }
    return true
}
