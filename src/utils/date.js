const extractDateFromInput = (string) => {
    try {
        console.log('String: ', string)
        const date = new Date(string)
        console.log(date)
        if(! isNaN(date.getDate())){
            console.log('hey')
            return date
        }
        throw new Error('Unvalid Date Format plz use mm/dd/yyyy')
    } catch (error) {
        throw new Error('Unvalid Date Format plz use mm/dd/yyyy')
    }
}

export {
    extractDateFromInput 
}