import 'graphql-import-node'
import {print} from 'graphql'
import * as schema from './schema.graphql'
import * as project from './Project.graphql'
import * as room from './Room.graphql'
import * as user from './User.graphql'

const typeDefs = [
    print(room),
    print(schema),
    print(user),
    print(project)
]

export {typeDefs as default}