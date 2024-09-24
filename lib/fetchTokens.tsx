async function fetchTokens(creatorAddress: string) {
    const response = await fetch(
      `https://api.myco.wtf/api/zora/tokens?creatorAddress=${creatorAddress}`
    );
    const data = await response.json();
    return data;
}

export default fetchTokens