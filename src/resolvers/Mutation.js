import hashPassword from '../utils/hashage'
const Mutation = {
    async signUp(parent, args, {prisma}, info) {
        const password = await hashPassword(args.data.password)
        const {firstName, lastName, birthDate, email, pseudo} = args.data
        return prisma.mutation.createLogin({
            data: {
                email,
                pseudo,
                password,
                user: {
                    create: {
                        firstName,
                        lastName,
                        birthDate: new Date(),
                        role: "USER"
                    }
                }
            }
        }, info)


    }
}

export {Mutation as default}