import {extractFragmentReplacements} from 'prisma-binding'
import Query from './Query'
import Mutation from './Mutation'
import Login from './Login'
const resolvers = {
    Query,
    Mutation,
    Login
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }