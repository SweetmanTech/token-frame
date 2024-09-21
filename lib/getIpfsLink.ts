const IPFS_GATEWAY = "https://ipfs.decentralized-content.com/ipfs/"

export function getIpfsLink(ipfsHash: string): string {
  if (!(ipfsHash && ipfsHash.includes("ipfs"))) return ipfsHash

  // Remove 'ipfs://' prefix if present
  const cleanHash = ipfsHash.replace(/^ipfs:\/\//, "")

  // Encode the CID (Content Identifier)
  const encodedCID = encodeURIComponent(cleanHash)

  // Construct the full URL
  return `${IPFS_GATEWAY}${encodedCID}`
}
