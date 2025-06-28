import React from 'react';

interface PrizeScaleProps {
  prize: string;
}

const tiers = [
  { value: 1000, label: '$1K' },
  { value: 5000, label: '$5K' },
  { value: 10000, label: '$10K' },
  { value: 25000, label: '$25K' },
  { value: 50000, label: '$50K' },
  { value: 100000, label: '$100K' },
  { value: 500000, label: '$500K' },
  { value: 1000000, label: '$1M' }
];

function parsePrize(prizeStr: string): number {
  // Remove the $ symbol and any spaces
  const cleaned = prizeStr.replace(/[$\s]/g, '').toLowerCase();
  
  // Check if it ends with 'k' or 'm'
  if (cleaned.endsWith('k')) {
    return parseFloat(cleaned.slice(0, -1)) * 1000;
  }
  if (cleaned.endsWith('m')) {
    return parseFloat(cleaned.slice(0, -1)) * 1000000;
  }
  
  // If no suffix, just parse the number
  return parseFloat(cleaned);
}

export function PrizeScale({ prize }: PrizeScaleProps) {
  // Convert prize string to number
  const prizeAmount = parsePrize(prize);
  
  // Find which segment the prize falls into
  const segment = tiers.findIndex((tier, index) => {
    const nextTier = tiers[index + 1];
    return prizeAmount >= tier.value && (!nextTier || prizeAmount < nextTier.value);
  });

  return (
    <div className="w-full">
      <div className="relative w-full h-2 bg-gray-200 rounded-full mb-6">
        {/* Colored bar up to the prize amount */}
        <div 
          className="absolute h-full bg-pink-500 rounded-full"
          style={{ 
            width: `${((segment + 1) / tiers.length) * 100}%`,
            transition: 'width 0.3s ease-in-out'
          }}
        />
        
        {/* Markers for each tier */}
        <div className="absolute w-full flex justify-between -mt-1">
          {tiers.map((tier, index) => (
            <div 
              key={tier.value}
              className={`h-4 w-1 ${index <= segment ? 'bg-pink-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>

        {/* Labels */}
        <div className="absolute w-full flex justify-between -mt-6">
          {tiers.map((tier, index) => (
            <div 
              key={tier.value}
              className={`text-sm ${index <= segment ? 'text-pink-500 font-medium' : 'text-gray-500'}`}
              style={{ transform: 'translateX(-50%)' }}
            >
              {tier.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 