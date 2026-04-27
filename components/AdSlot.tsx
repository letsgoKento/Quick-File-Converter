type AdSlotProps = {
  label?: string;
  className?: string;
};

export default function AdSlot({ label = "Advertisement", className = "" }: AdSlotProps) {
  return (
    <aside className={`ad-slot ${className}`.trim()} aria-label={label}>
      <span>{label}</span>
    </aside>
  );
}
