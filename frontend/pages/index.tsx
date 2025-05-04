import React from "react";
import type { NextPage } from "next";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">CreatorTip</h1>
      <ConnectButton />

      {isConnected && (
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled>
          Sign in with Lens (TODO)
        </button>
      )}

      {/* TODO: display authentication status or profile info */}
    </div>
  );
};

export default Home;
