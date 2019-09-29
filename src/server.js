import prisma from './prisma'
import typeDefs from './schemas/index'
import { GraphQLServer, PubSub } from 'graphql-yoga'
import {fragmentReplacements, resolvers} from './resolvers/index'

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context(request) {
        return {
            pubsub,
            prisma,
            request
        }
    },
    fragmentReplacements
})

export { server as default }