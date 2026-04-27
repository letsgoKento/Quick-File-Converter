type AdSlotProps = {
  label?: string;
};

export default function AdSlot({ label = "Advertisement" }: AdSlotProps) {
  return (
    <aside className="ad-slot" aria-label={label}>
      <span>{label}</span>
    </aside>
  );
}
