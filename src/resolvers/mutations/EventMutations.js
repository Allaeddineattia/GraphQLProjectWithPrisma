import { getAdminDataFromRequest } from '../../utils/resolversUtils'
import {extractDateFromInput} from '../../utils/date'
const eventMutations = {
    async createEvent(parent , {data}, {prisma, request}, info){
        await getAdminDataFromRequest(prisma, request)
        data.beginDate = extractDateFromInput(data.beginDate)
        data.endDate = extractDateFromInput(data.endDate)
        return prisma.mutation.createEvent({
            data
        },info)
    },
    async updateEvent(parent , {eventId, data}, {prisma, request}, info){
        await getAdminDataFromRequest(prisma, request)
        data.beginDate = !!data.beginDate? extractDateFromInput(data.beginDate) : data.beginDate
        data.endDate = !!data.endDate? extractDateFromInput(data.endDate) : data.endDate
        return prisma.mutation.updateEvent({
            where : {
                id: eventId
            },
            data
        }, info)
    }
}
export {eventMutations as default}