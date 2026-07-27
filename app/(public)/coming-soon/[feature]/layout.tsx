/** Required for `output: 'export'` with dynamic segments. */
export function generateStaticParams() {
  return [{ feature: "_" }];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
