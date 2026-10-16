import { chain, chainEnd, chainYears, type ChainRole } from "@/lib/sheet-data";

/**
 * Eight roles as bars on one axis, Jan 2021 to Dec 2026. Lengths are months,
 * so the chain is read, not decorated. Overlapping roles simply overlap. The
 * one running role ends in a marker cap. Bars fill as they scroll into view
 * (CSS scroll timeline only; browsers without it, or with reduced motion, see
 * the finished chain).
 */
export function CareerChain() {
  const vars = { "--years": chainYears.length, "--total": chainEnd } as React.CSSProperties;
  return (
    <div style={vars}>
      <div className="grid gap-y-2 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-x-10">
        <div className="hidden md:block" aria-hidden="true" />
        <div className="chain-axis" aria-hidden="true">
          {chainYears.map((year) => (
            <span key={year}>{year}</span>
          ))}
        </div>
      </div>
      <ol className="mt-2">
        {chain.map((role) => (
          <ChainRow key={`${role.title}-${role.org}`} role={role} />
        ))}
      </ol>
    </div>
  );
}

function ChainRow({ role }: { role: ChainRole }) {
  const barVars = { "--start": role.start, "--end": role.end } as React.CSSProperties;
  const hasPoints = role.points.length > 0;
  return (
    <li className="grid gap-3 border-b border-[var(--sh-rule)] py-5 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:grid-rows-[auto_auto] md:gap-x-10 md:py-6">
      {/* Phones read bar, then the role, then its bullets; desktop puts the role beside the bar and bullets. */}
      <div className="chain-track order-1 md:col-start-2 md:row-start-1" role="img" aria-label={`${role.dates}: ${role.title} at ${role.org}`}>
        <span className="chain-bar" style={barVars} data-current={role.current ? "" : undefined} />
      </div>
      <div className="order-2 md:col-start-1 md:row-start-1 md:row-span-2">
        <h3 className="text-xl font-bold leading-6 md:text-[1.375rem]">{role.title}</h3>
        <p className="mt-1 text-base leading-6 text-[var(--sh-graphite)]">
          <span className="text-[var(--sh-ink)]">{role.org}</span>, {role.place}
        </p>
        <p className="mt-1 text-[0.95rem] font-semibold">
          {role.dates}
          {role.current && <span className="sr-only"> (running)</span>}
        </p>
      </div>
      {hasPoints && (
        <ul className="order-3 mt-1 grid max-w-[62ch] gap-2 text-[1.0625rem] leading-7 md:col-start-2 md:row-start-2 md:mt-2">
          {role.points.map((point) => (
            <li key={point} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3">
              <span aria-hidden="true" className="mt-[0.85rem] h-px bg-[var(--sh-ink)]" />
              {point}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
