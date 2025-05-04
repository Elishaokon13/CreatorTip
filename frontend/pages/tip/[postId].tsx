import React, { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const TipPage: NextPage = () => {
  const router = useRouter();
  const { postId } = router.query;

  const [amount, setAmount] = useState<string>("");
  const [token, setToken] = useState<string>("MATIC");
  const [status, setStatus] = useState<string | null>(null);

  const handleTip = async () => {
    if (!postId) return;
    setStatus("Submitting tip...");
    try {
      const res = await fetch('/api/open-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, amount, token })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('Tip successful! Transaction: ' + data.txHash);
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

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4">Tip Post: {postId}</h2>

      <div className="flex flex-col gap-3 w-full max-w-md">
        <label className="font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded px-3 py-2"
          placeholder="Enter amount"
        />

        <label className="font-medium">Token</label>
        <select
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="MATIC">MATIC (native)</option>
          <option value="BONSAI">BONSAI (ERC20)</option>
        </select>

        <button
          onClick={handleTip}
          className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Tip Now
        </button>

        {status && <p className="mt-2 text-center">{status}</p>}
      </div>
    </div>
  );
};

export default TipPage; 