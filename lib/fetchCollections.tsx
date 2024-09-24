async function fetchCollections(creatorAddress: string) {
    const response = await fetch(
      `https://api.myco.wtf/api/zora/collections?creator=${creatorAddress}`,
    )
    const data = await response.json()
    return data
}

export default fetchCollections