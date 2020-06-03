export async function getSecteurs() {
    const response = await fetch('/api/getsecteurs')
    return response.json();
};