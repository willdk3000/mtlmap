export async function averagePrice(listings) {

    if (!listings.length) {
        return 'Aucune donnée'
    }

    const avg = listings.reduce((sum, listing) => {
        return sum + listing.last_price
    }, 0) / listings.length

    return avg;

}