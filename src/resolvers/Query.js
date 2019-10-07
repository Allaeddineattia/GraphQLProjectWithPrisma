import LoginQueries from './queries/LoginQueries'
import EventQuery from './queries/EventQueries'
import ProjectQuery from './queries/ProjectQueries'
import RoomQuery from './queries/RoomQueries'

const Query = {
    ...LoginQueries,
    ...RoomQuery,
    ...EventQuery,
    ...ProjectQuery
} 
export {Query as default}