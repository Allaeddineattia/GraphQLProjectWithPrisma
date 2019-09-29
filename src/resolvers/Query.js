const Query = {
    async users(parent, args, {prisma}, info){
        console.log(args)
        const result = await prisma.query.users(null, info)
        console.log(result)
        if(! result){
            return []
        }
        return result

    }
} 
export {Query as default}