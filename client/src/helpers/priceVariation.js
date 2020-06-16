export function priceVariation(data) {

    if (!data.length) {
        return data;
    }

    if (data[0].mean_price - data[1].mean_price >= 0) {
        return (
            '+' + (Math.round((data[0].mean_price - data[1].mean_price) / 1000) * 1000).toLocaleString() + '$'
            + ' (+' + ((data[0].mean_price - data[1].mean_price) / data[1].mean_price * 100).toFixed(1) + '%)'
        )
    }
    else {
        return (
            Math.round((data[0].mean_price - data[1].mean_price) / 1000) * 1000).toLocaleString() + '$'
            + ' (' + ((data[0].mean_price - data[1].mean_price) / data[1].mean_price * 100).toFixed(1) + '%)'
    }
}


export function type_priceVariation(data) {

    if (!data.length) {
        return data;
    }

    const variations = [];

    data.forEach((e, index) => {

        if (e.rn === "1") {
            if (e.mean_price - data[index + 1].mean_price >= 0) {
                variations.push({
                    type: e.type,
                    meanPrice: e.mean_price,
                    meanPriceVar: '+' + (Math.round((e.mean_price - data[index + 1].mean_price) / 1000) * 1000).toLocaleString() + '$',
                    meanPriceVarPct: '+' + ((e.mean_price - data[index + 1].mean_price) / e.mean_price * 100).toFixed(1) + '%'
                })
            } else {
                variations.push({
                    type: e.type,
                    meanPrice: e.mean_price,
                    meanPriceVar: (Math.round((e.mean_price - data[index + 1].mean_price) / 1000) * 1000).toLocaleString() + '$',
                    meanPriceVarPct: ((e.mean_price - data[index + 1].mean_price) / e.mean_price * 100).toFixed(1) + '%'
                })
            }
        }
    })

    return variations

}