import React from "react";
import type { Chain } from "wagmi/chains";

interface ChainSelectorProps {
  chains: Chain[];
  selectedChain: Chain;
  onChainChange: (chain: Chain) => void;
}

export function ChainSelector({ chains, selectedChain, onChainChange }: ChainSelectorProps) {
  return (
    <div className="w-64">
      <label htmlFor="chain-select" className="block text-sm font-medium text-gray-700">
        Network
      </label>
      <select
        id="chain-select"
        value={selectedChain.id}
        onChange={(e) => {
          const selectedId = Number(e.target.value);
          const next = chains.find((c) => c.id === selectedId);
          if (next) {
            onChainChange(next);
          }
        }}
        className="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      >
        {chains.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
} 