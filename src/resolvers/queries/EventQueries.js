
import {getUserDataFromRequest} from '../../utils/resolversUtils'

const EventQuery = {
    async events(parent, {query, type}, {prisma, request}, info) {
        const userData = await getUserDataFromRequest(prisma, request)
        let selector = {
            AND: [
                {
                    type
                },
                {
                    title_contains: !! query ? query : ""
                }
            ]
        }
        return prisma.query.events({
            where: selector
        }, info)

    }
}

export {EventQuery as default}