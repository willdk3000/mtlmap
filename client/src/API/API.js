export async function getSecteurs() {
    const response = await fetch('/api/getsecteurs')
    return response.json();
};

export async function uniqueListings(codesm) {
    const response = await fetch('/api/uniqueListings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "codesm": codesm })
    });
    return response.json()
}