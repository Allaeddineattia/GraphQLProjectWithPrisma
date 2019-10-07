import {getUserDataFromRequest, checkMasterOfRoom, checkMasterOfRoomOfProject} from '../../utils/resolversUtils'
import {extractDateFromInput} from '../../utils/date'


const projectMutations = {
    async createProject(parent , {roomId, data}, {prisma, request}, info){
        const userData = await getUserDataFromRequest(prisma, request)
        await checkMasterOfRoom(userData.userID, roomId, prisma)
        data.technologies = !!data.technologies? data.technologies : []
        const {title, description, technologies} = data
        return prisma.mutation.createProject({
            data: {
                title,
                room:{
                    connect:{
                        id : roomId
                    }
                },
                description,
                technologies
            }
        }, info)
        
    },
    async createDeadLine(parent , {projectId, data}, {prisma, request}, info){
        const userData = await getUserDataFromRequest(prisma, request)
        await checkMasterOfRoomOfProject(userData.userID, projectId, prisma)
        data.date = extractDateFromInput(data.date)
        const {date, goals} = data
        return prisma.mutation.createDeadline({
            data:{
                date,
                project:{
                    connect:{
                        id: projectId
                    }
                },
                goals: {
                    set: goals
                }  
            }
        }, info)
    },
    async createBacklog(parent , {projectId, data}, {prisma, request}, info){
        const userData = await getUserDataFromRequest(prisma, request)
        await checkMasterOfRoomOfProject(userData.userID, projectId, prisma)
        const {name, tasks} = data
        return prisma.mutation.createBacklog({
            data:{
                name,
                project: {
                    connect:{
                        id: projectId
                    }
                },
                tasks: {
                    create: tasks
                }
            }
        }, info)
    },
    async addTasks(parent , {backlogId, data}, {prisma, request}, info){
        const userData = await getUserDataFromRequest(prisma, request)
        if( ! await prisma.exists.Backlog({
            id: backlogId,
            project:{
                room:{
                    master:{id: userData.userID} 
                }
            }
        })){
            throw new Error (" authenicated user is not the master of the room of this project")
        }
        return prisma.mutation.updateBacklog({
            where: {
                id: backlogId
            },
            data: {
                tasks:{
                    create: data
                }
            }
        }, info)
        
    },
    async updateTask(parent , {taskId, data}, {prisma, request}, info){
        const userData = await getUserDataFromRequest(prisma, request)
        if( ! await prisma.exists.Task({
            id: taskId,
            backlog: {
                project:{
                    room:{
                        master:{id: userData.userID} 
                    }
                }
            }
        })){
            throw new Error (" authenicated user is not the master of the project of this task")
        }
        return prisma.mutation.updateTask({
            where:{
                id: taskId
            },
            data
        }, info)
    },
}

export {projectMutations as default}