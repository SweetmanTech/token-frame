/** @jsxImportSource frog/jsx */

import { getFarcasterUserAddress } from "@coinbase/onchainkit/farcaster";
import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { Box, Heading, HStack, Image, Text, VStack, vars } from "./ui";
import { getIpfsLink } from "@/lib/getIpfsLink";

async function fetchTokens(creatorAddress: string) {
  const response = await fetch(
    `https://api.myco.wtf/api/zora/tokens?creatorAddress=${creatorAddress}`
  );
  const data = await response.json();
  return data;
}

async function fetchZoraProfile(address: string) {
  const response = await fetch(`https://api.zora.co/discover/user/${address}`);
  const data = await response.json();
  return data;
}

const app = new Frog({
  assetsPath: "/",
  ui: { vars },
  basePath: "/api",
  title: "Frog Frame",
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", (c) => {
  return c.res({
    image: (
      <Box
        grow
        alignHorizontal="center"
        backgroundColor="background"
        padding="32"
      >
        <VStack gap="4">
          <Heading>Token Frame</Heading>
          <Text color="text200" size="20">
            View your token profiles
          </Text>
        </VStack>
      </Box>
    ),
    intents: [<Button action="/results">View Profiles</Button>],
  });
});

app.frame("/results", async (c) => {
  const { frameData } = c;
  const fid = frameData?.fid;
  const result = await getFarcasterUserAddress(fid ?? 0);
  const verifiedAddresses = result?.verifiedAddresses ?? [];

  const allTokens = await Promise.all(
    verifiedAddresses.map(async (address) => {
      const { tokens } = await fetchTokens(address);
      const profileData = await fetchZoraProfile(address);
      console.log("SWEETS profileData", profileData);
      return { address, tokens, profileData };
    })
  );

  const totalTokenCount = allTokens.reduce(
    (sum, { tokens }) => sum + tokens.length,
    0
  );

  const shareUrl = `https://token-frame-one.vercel.app/api/${fid}`;

  return c.res({
    image: (
      <Box
        grow
        alignHorizontal="center"
        backgroundColor="background"
        padding="32"
      >
        <VStack gap="4">
          <Heading>Your Zora Profiles</Heading>
          {allTokens.map(({ address, tokens, profileData }, index) => {
            const pfp = getIpfsLink(
              profileData.user_profile.avatar ||
                profileData?.ens_record?.text_records?.avatar
            );
            return (
              <Box
                key={index}
                gap="2"
                alignVertical="center"
                alignItems="center"
                flexDirection="row"
                justifyContent="center"
              >
                {pfp && (
                  <Box>
                    <Image
                      height="48"
                      objectFit="none"
                      borderRadius="256"
                      src={pfp}
                    />
                  </Box>
                )}
                <Text align="center">
                  {profileData.user_profile.display_name ||
                    profileData.ens_record?.ens_name ||
                    `${address.slice(0, 6)}...${address.slice(-4)}`}
                  : {tokens.length || "0"} tokens
                </Text>
              </Box>
            );
          })}
          <Text size="20" weight="300" align="center">
            Total Tokens: {totalTokenCount}
          </Text>
        </VStack>
      </Box>
    ),
    intents: [
      <Button action="/">Back</Button>,
      <Button.Redirect
        location={`https://warpcast.com/~/compose?text=Check%20out%20my%20Zora%20tokens!&embeds[]=${encodeURIComponent(
          shareUrl
        )}`}
      >
        Share results
      </Button.Redirect>,
    ],
  });
});

app.frame("/:fid", async (c) => {
  const fid = c.req.param("fid");
  const result = await getFarcasterUserAddress(parseInt(fid));
  const verifiedAddresses = result?.verifiedAddresses ?? [];

  const allTokens = await Promise.all(
    verifiedAddresses.map(async (address) => {
      const { tokens } = await fetchTokens(address);
      const profileData = await fetchZoraProfile(address);
      return { address, tokens, profileData };
    })
  );

  const totalTokenCount = allTokens.reduce(
    (sum, { tokens }) => sum + tokens.length,
    0
  );

  return c.res({
    image: (
      <Box
        grow
        alignHorizontal="center"
        backgroundColor="background"
        padding="32"
      >
        <VStack gap="4">
          <Heading>Zora Profiles</Heading>
          {allTokens.map(({ address, tokens, profileData }, index) => {
            const pfp = getIpfsLink(
              profileData.user_profile.avatar ||
                profileData?.ens_record?.text_records?.avatar
            );
            return (
              <Box
                key={index}
                gap="2"
                alignVertical="center"
                alignItems="center"
                flexDirection="row"
                justifyContent="center"
              >
                {pfp && (
                  <Box>
                    <Image
                      height="48"
                      objectFit="none"
                      borderRadius="256"
                      src={pfp}
                    />
                  </Box>
                )}
                <Text align="center">
                  {profileData.user_profile.display_name ||
                    profileData.ens_record?.ens_name ||
                    `${address.slice(0, 6)}...${address.slice(-4)}`}
                  : {tokens.length || "0"} tokens
                </Text>
              </Box>
            );
          })}
          <Text size="20" weight="300" align="center">
            Total Tokens: {totalTokenCount}
          </Text>
        </VStack>
      </Box>
    ),
    intents: [<Button action="/results">View My Profiles</Button>],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

// NOTE: That if you are using the devtools and enable Edge Runtime, you will need to copy the devtools
// static assets to the public folder. You can do this by adding a script to your package.json:
// ```json
// {
//   scripts: {
//     "copy-static": "cp -r ./node_modules/frog/_lib/ui/.frog ./public/.frog"
//   }
// }
// ```
// Next, you'll want to set up the devtools to use the correct assets path:
// ```ts
// devtools(app, { assetsPath: '/.frog' })
// ```
