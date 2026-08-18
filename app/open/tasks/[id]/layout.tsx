/** Required for `output: 'export'` with dynamic segments. */
export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
