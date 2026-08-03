export default function PlaceholderImage({ width = '100%', height = 200, label = 'Image Placeholder', className = '' }) {
  return (
    <div
      className={`placeholder-img ${className}`}
      style={{ width, height }}
    >
      <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <span>{label}</span>
    </div>
  );
}
