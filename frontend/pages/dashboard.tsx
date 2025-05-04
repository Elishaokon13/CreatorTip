import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

interface TipAnalytics {
  totalTips: string;
  topTippers: { address: string; amount: string }[];
  supporters: { address: string; tokenId: string; metadataURI: string }[];
}
const Dashboard: NextPage = () => {
  const { isConnected } = useAccount(); // Removed unused address variable
  const [analytics, setAnalytics] = useState<TipAnalytics | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (!isConnected) return;
    setStatus("Loading analytics...");
    const fetchData = async () => {
      try {
        const res = await fetch('/api/tips');
        const data = await res.json();
        if (res.ok) {
          setAnalytics(data);
          setStatus("");
        } else {
          setStatus('Error: ' + data.error);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setStatus('Network error: ' + err.message);
        } else {
          setStatus('Network error');
        }
      }
    };
    fetchData();
  }, [isConnected]);

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">CreatorTip Dashboard</h1>
      <ConnectButton />

      {!isConnected && <p className="mt-4">Please connect your wallet to view dashboard.</p>}

      {isConnected && analytics && (
        <div className="mt-6 space-y-4">
          <p className="text-lg">Total Tips: {analytics.totalTips}</p>
          <div>
            <h2 className="text-xl font-semibold">Top Tippers</h2>
            <ul className="list-disc list-inside">
              {analytics.topTippers.map((tipper, idx) => (
                <li key={idx}>{tipper.address}: {tipper.amount}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Supporters (NFT holders)</h2>
            <ul className="list-disc list-inside">
              {analytics.supporters.map((s, idx) => (
                <li key={idx}>Address: {s.address}, Token ID: {s.tokenId}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {status && <p className="mt-4 text-red-600">{status}</p>}
    </div>
  );
};

export default Dashboard; 