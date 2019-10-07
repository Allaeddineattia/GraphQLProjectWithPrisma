import userMutations from './mutations/UserMutations'
import roomMutations from './mutations/RoomMutations'
import postMutations from './mutations/PostMutations'
import ProjectMutations from './mutations/ProjectMutations'
import EventMutations from './mutations/EventMutations'

const Mutation = {
    ...userMutations,
    ...roomMutations,
    ...postMutations,
    ...ProjectMutations,
    ...EventMutations
}

export {Mutation as default}