# Zora Token Frame

This project is a Farcaster Frame that displays Zora token profiles for verified addresses. It's built using Next.js and the Frog framework.

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000/api](http://localhost:3000/api) in your browser to see the frame.

## Project Structure

- `app/api/[[...routes]]/route.tsx`: Main frame logic
- `app/api/[[...routes]]/ui.ts`: UI components from Frog
- `app/page.tsx`: Next.js page component
- `app/layout.tsx`: Root layout component

## Key Features

1. Fetches verified Farcaster addresses
2. Retrieves Zora token data for each address
3. Displays profile information and token counts
4. Supports profile pictures from Zora or ENS

## Customization

To customize the frame:

1. Modify the UI in `app/api/[[...routes]]/route.tsx`
2. Update API endpoints in `fetchTokens` and `fetchZoraProfile` functions
3. Adjust styling using Frog UI components

## Deployment

Deploy your frame to Vercel:
