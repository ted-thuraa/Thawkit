// path: src/app/(main)/workspace/@modal/default.tsx

// Required by Next.js parallel routes: renders on any /workspace/* route
// that doesn't match the intercepted (.)campaigns/new segment below, so the
// modal slot is empty rather than undefined.
export default function Default() {
  return null;
}
