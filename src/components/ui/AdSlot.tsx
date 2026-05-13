interface AdSlotProps {
  slot: 'top' | 'middle' | 'result' | 'bottom' | 'inline';
  className?: string;
}

export default function AdSlot({ slot, className = '' }: AdSlotProps) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 text-center py-4 my-4 text-sm rounded ${className}`}>
        [AdSlot: {slot}]
      </div>
    );
  }

  return (
    <div className={`my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID || ''}
        data-ad-slot={slot}
        data-full-width-responsive="true"
      />
    </div>
  );
}
