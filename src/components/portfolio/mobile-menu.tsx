"use client";

import { useRef } from "react";

/**
 * Native <details> menu: it opens and closes without JS. With JS, it also
 * closes after a link is chosen, so an in-page jump is not left under the
 * open panel.
 */
export function MobileMenu({
  summary,
  children,
}: {
  summary: React.ReactNode;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={ref} className="st-menu relative lg:hidden">
      {summary}
      <div
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a") && ref.current) ref.current.open = false;
        }}
      >
        {children}
      </div>
    </details>
  );
}
