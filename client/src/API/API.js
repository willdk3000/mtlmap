export async function getSecteurs() {
    const response = await fetch('/api/getsecteurs')
    return response.json();
};

export async function uniqueListingsPrice(codesm) {
    const response = await fetch('/api/uniqueListings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "codesm": codesm })
    });
    return response.json()
}

export async function monthlyStats(codesm) {
    const response = await fetch('/api/monthlyStats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "codesm": codesm })
    });
    return response.json()
}

export async function typeMonthlyStats(codesm) {
    const response = await fetch('/api/typeMonthlyStats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "codesm": codesm })
    });
    return response.json()
}