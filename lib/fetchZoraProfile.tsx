async function fetchZoraProfile(address: string) {
    const response = await fetch(`https://api.zora.co/discover/user/${address}`);
    const data = await response.json();
    return data;
}

export default fetchZoraProfile