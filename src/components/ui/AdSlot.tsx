import { ADSENSE_CLIENT_ID } from '@/lib/constants';

interface AdSlotProps {
  slot: 'top' | 'middle' | 'result' | 'bottom' | 'inline';
  className?: string;
}

const AD_SLOT_IDS: Partial<Record<AdSlotProps['slot'], string>> = {};

export default function AdSlot({ slot, className = '' }: AdSlotProps) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 text-center py-4 my-4 text-sm rounded ${className}`}>
        [AdSlot: {slot}]
      </div>
    );
  }

  const slotId = AD_SLOT_IDS[slot];

  if (!slotId) {
    return null;
  }

  return (
    <aside className={`my-4 ${className}`} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
