export function ProsperHiveLogo({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={`h-6 w-6 text-primary-600 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 110-1 .5.5 0 010 1zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 110-1 .5.5 0 010 1z"
      />
    </svg>
  );
}