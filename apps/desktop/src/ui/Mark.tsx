// The Rune mark: three strokes on a 4px grid, monochrome (docs/design.md, Identity).
export function Mark({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M8 2V14M8 8L12 4M8 8L4 12" />
    </svg>
  );
}
