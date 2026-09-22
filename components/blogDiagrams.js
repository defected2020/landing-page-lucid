import React from 'react';

// Diagrams for blog posts, keyed by id and referenced from data/blogPosts.js as
// { type: 'figure', diagram: '<id>', caption: '...' }.
//
// Every diagram is hand-authored inline SVG using `currentColor` and the theme's
// own CSS variables, so it reads correctly in light and dark without a second
// asset or any JavaScript. Keep text around 12px at the drawn scale, label the
// arrows, and reserve --accent for the one element carrying the argument.

const Arrowhead = ({ id }) => (
  <defs>
    <marker id={id} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L8,4 L0,8 z" fill="currentColor" />
    </marker>
  </defs>
);

const boxFill = 'var(--bg-elevated)';
const line = 'currentColor';

// --- Offline: the three things people call "offline" ------------------------
const OfflineModes = () => {
  const rows = [
    {
      label: 'Read-only cache',
      truth: 'server',
      arrows: [
        { from: 'store', to: 'ui', text: 'read' },
        { from: 'server', to: 'store', text: 'hydrate' },
      ],
    },
    {
      label: 'Queued writes',
      truth: 'server',
      arrows: [
        { from: 'ui', to: 'store', text: 'queue' },
        { from: 'store', to: 'server', text: 'flush later' },
      ],
    },
    {
      label: 'Offline-first',
      truth: 'store',
      arrows: [
        { from: 'both', to: 'both', text: 'read / write' },
        { from: 'both2', to: 'both2', text: 'sync' },
      ],
    },
  ];

  return (
    <svg
      viewBox="0 0 580 300"
      role="img"
      aria-label="Three architectures called offline: a read-only cache and queued writes both keep the server as the source of truth, while offline-first moves the source of truth onto the device."
      style={{ width: '100%', height: 'auto' }}
    >
      <Arrowhead id="arrow-offline" />
      {rows.map((row, i) => {
        const top = 16 + i * 96;
        const boxY = top + 22;
        const mid = boxY + 23;
        const truthStroke = (which) => (row.truth === which ? 'var(--accent)' : line);
        const truthWidth = (which) => (row.truth === which ? 2 : 1);
        return (
          <g key={row.label}>
            <text x="4" y={top + 10} fontSize="12.5" fill={line} fontWeight="600">
              {row.label}
            </text>

            <rect x="4" y={boxY} width="96" height="46" rx="6" fill={boxFill} stroke={line} strokeWidth="1" />
            <text x="52" y={mid + 4} fontSize="12" fill={line} textAnchor="middle">Interface</text>

            <rect x="190" y={boxY} width="150" height="46" rx="6" fill={boxFill}
                  stroke={truthStroke('store')} strokeWidth={truthWidth('store')} />
            <text x="265" y={mid + 4} fontSize="12" fill={line} textAnchor="middle">Local store</text>

            <rect x="430" y={boxY} width="120" height="46" rx="6" fill={boxFill}
                  stroke={truthStroke('server')} strokeWidth={truthWidth('server')} />
            <text x="490" y={mid + 4} fontSize="12" fill={line} textAnchor="middle">Server</text>

            {/* left gap */}
            <line
              x1={row.arrows[0].from === 'store' ? 188 : 102}
              y1={mid}
              x2={row.arrows[0].from === 'store' ? 104 : 186}
              y2={mid}
              stroke={line}
              strokeWidth="1.25"
              markerEnd="url(#arrow-offline)"
              markerStart={i === 2 ? 'url(#arrow-offline)' : undefined}
            />
            <text x="145" y={mid - 8} fontSize="11" fill={line} textAnchor="middle" opacity="0.75">
              {row.arrows[0].text}
            </text>

            {/* right gap */}
            <line
              x1={row.arrows[1].from === 'server' ? 428 : 342}
              y1={mid}
              x2={row.arrows[1].from === 'server' ? 344 : 426}
              y2={mid}
              stroke={line}
              strokeWidth="1.25"
              markerEnd="url(#arrow-offline)"
              markerStart={i === 2 ? 'url(#arrow-offline)' : undefined}
            />
            <text x="385" y={mid - 8} fontSize="11" fill={line} textAnchor="middle" opacity="0.75">
              {row.arrows[1].text}
            </text>
          </g>
        );
      })}
      <text x="4" y="296" fontSize="11" fill="var(--accent)">
        Outlined in accent: where the source of truth lives.
      </text>
    </svg>
  );
};

// --- Push: what you measure vs what matters ---------------------------------
const PushFunnel = () => {
  const stages = ['Your server\nsends', 'Provider\naccepts', 'Device\nreceives', 'Notification\nshown', 'User\nopens'];
  const W = 88;
  const STEP = 118;
  const x0 = 10;
  return (
    <svg
      viewBox="0 0 580 178"
      role="img"
      aria-label="A push notification passes through five stages. Only the first two happen on your side of the boundary, so a send recorded as successful says nothing about whether the notification was received, shown or opened."
      style={{ width: '100%', height: 'auto' }}
    >
      <Arrowhead id="arrow-push" />

      <line x1="231" y1="30" x2="231" y2="122" stroke="var(--accent)" strokeWidth="1.25" strokeDasharray="5 4" />
      <text x="223" y="22" fontSize="11.5" fill={line} textAnchor="end" fontWeight="600">your infrastructure</text>
      <text x="239" y="22" fontSize="11.5" fill="var(--accent)" textAnchor="start" fontWeight="600">outside your control</text>

      {stages.map((label, i) => {
        const x = x0 + i * STEP;
        const measurable = i < 2;
        return (
          <g key={i}>
            <rect
              x={x}
              y="44"
              width={W}
              height="56"
              rx="6"
              fill={boxFill}
              stroke={measurable ? line : 'var(--accent)'}
              strokeWidth={measurable ? 1 : 1.5}
              strokeDasharray={measurable ? undefined : '4 3'}
            />
            {label.split('\n').map((l, j) => (
              <text key={j} x={x + W / 2} y={68 + j * 16} fontSize="12" fill={line} textAnchor="middle">
                {l}
              </text>
            ))}
            {i < stages.length - 1 && (
              <line
                x1={x + W + 6}
                y1="72"
                x2={x + STEP - 6}
                y2="72"
                stroke={line}
                strokeWidth="1.25"
                markerEnd="url(#arrow-push)"
              />
            )}
          </g>
        );
      })}

      <text x="113" y="140" fontSize="11.5" fill={line} textAnchor="middle" opacity="0.8">what dashboards report</text>
      <text x="408" y="140" fontSize="11.5" fill="var(--accent)" textAnchor="middle">what the feature depends on</text>
      <text x="10" y="168" fontSize="11" fill={line} opacity="0.75">
        Measuring only the solid stages is measuring your own outbound traffic.
      </text>
    </svg>
  );
};

// --- React Native: files shared vs effort spent ------------------------------
const SharedVsEffort = () => {
  const X = 4;
  const BAR_W = 552;
  // A label only sits inside its segment when the segment is wide enough for it;
  // otherwise it goes above the bar, right-aligned, opposite the row label.
  const MIN_INSIDE = 96;

  const bar = (y, label, sharedPct, note) => {
    const sharedW = BAR_W * sharedPct;
    const forkedW = BAR_W - sharedW;
    const forkedFits = forkedW >= MIN_INSIDE;
    return (
      <g>
        <text x={X} y={y - 9} fontSize="12.5" fill={line} fontWeight="600">{label}</text>
        {!forkedFits && (
          <text x={X + BAR_W} y={y - 9} fontSize="11.5" fill={line} textAnchor="end" opacity="0.8">
            per platform &#8594;
          </text>
        )}
        <rect x={X} y={y} width={BAR_W} height="38" rx="5" fill={boxFill} stroke={line} strokeWidth="1" />
        <rect x={X} y={y} width={sharedW} height="38" rx="5" fill="var(--accent-muted)" stroke="var(--accent)" strokeWidth="1.25" />
        <text x={X + sharedW / 2} y={y + 24} fontSize="12" fill={line} textAnchor="middle">shared</text>
        {forkedFits && (
          <text x={X + sharedW + forkedW / 2} y={y + 24} fontSize="12" fill={line} textAnchor="middle">
            per platform
          </text>
        )}
        <text x={X + BAR_W} y={y + 56} fontSize="11" fill={line} textAnchor="end" opacity="0.75">{note}</text>
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 580 224"
      role="img"
      aria-label="Most files in a cross-platform codebase are shared, but the small platform-specific portion consumes a disproportionate share of the effort."
      style={{ width: '100%', height: 'auto' }}
    >
      {bar(30, 'Share of files', 0.88, 'widgets, background work, platform APIs')}
      {bar(130, 'Share of effort', 0.55, 'the slowest and least predictable work')}
      <text x={X} y="214" fontSize="11" fill="var(--accent)">
        The forked portion is not proportional to the effort it consumes.
      </text>
    </svg>
  );
};

// --- AI: nothing unreviewed reaches a production table -----------------------
const StagingGate = () => {
  const boxes = ['Model output', 'Staging table', 'Review /\nvalidation', 'Production table'];
  const W = 118;
  const STEP = 150;
  const x0 = 6;
  return (
    <svg
      viewBox="0 0 580 196"
      role="img"
      aria-label="Model output is written to a staging table and passes a validation step before anything reaches the production table. The direct path from model to production is the one to design out."
      style={{ width: '100%', height: 'auto' }}
    >
      <Arrowhead id="arrow-gate" />

      {/* the path that must not exist */}
      <path
        d="M 65 76 C 65 24, 515 24, 515 76"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.25"
        strokeDasharray="5 4"
        opacity="0.85"
      />
      <g stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
        <line x1="283" y1="26" x2="297" y2="40" />
        <line x1="297" y1="26" x2="283" y2="40" />
      </g>
      <text x="290" y="18" fontSize="11.5" fill="var(--accent)" textAnchor="middle" fontWeight="600">
        never write straight through
      </text>

      {boxes.map((label, i) => {
        const x = x0 + i * STEP;
        const isGate = i === 2;
        return (
          <g key={i}>
            <rect
              x={x}
              y="76"
              width={W}
              height="54"
              rx="6"
              fill={boxFill}
              stroke={isGate ? 'var(--accent)' : line}
              strokeWidth={isGate ? 1.75 : 1}
            />
            {label.split('\n').map((l, j) => (
              <text key={j} x={x + W / 2} y={label.includes('\n') ? 98 + j * 15 : 107} fontSize="12" fill={line} textAnchor="middle">
                {l}
              </text>
            ))}
            {i < boxes.length - 1 && (
              <line x1={x + W + 6} y1="103" x2={x + STEP - 6} y2="103" stroke={line} strokeWidth="1.25" markerEnd="url(#arrow-gate)" />
            )}
          </g>
        );
      })}

      <text x="6" y="158" fontSize="11" fill={line} opacity="0.75">
        The staging table is what lets a bad generation be discarded instead of rolled back.
      </text>
      <text x="6" y="182" fontSize="11" fill={line} opacity="0.75">
        The review step can be a person, a schema check, or both — but it is never nothing.
      </text>
    </svg>
  );
};

// --- Loyalty: a QR code identifies, it does not authorise --------------------
const QrIdentifies = () => {
  const rows = [
    { label: 'QR carries the grant', wrong: true, a: '"add 500 points"', b: 'Server applies\nwhat it was told', c: 'Ledger' },
    { label: 'QR carries identity', wrong: false, a: '"member 4172"', b: 'Server decides\nwhat is owed', c: 'Ledger' },
  ];
  return (
    <svg
      viewBox="0 0 580 250"
      role="img"
      aria-label="If a QR code carries the reward itself, anyone who copies it can mint points. If it carries only an identifier, the server decides what the member is owed and a copied code grants nothing."
      style={{ width: '100%', height: 'auto' }}
    >
      <Arrowhead id="arrow-qr" />
      {rows.map((row, i) => {
        const top = 14 + i * 118;
        const boxY = top + 24;
        const mid = boxY + 28;
        const stroke = row.wrong ? line : 'var(--accent)';
        return (
          <g key={row.label}>
            <text x="4" y={top + 12} fontSize="12.5" fill={row.wrong ? line : 'var(--accent)'} fontWeight="600">
              {row.label}
            </text>

            <rect x="4" y={boxY} width="150" height="56" rx="6" fill={boxFill} stroke={stroke}
                  strokeWidth={row.wrong ? 1 : 1.5} strokeDasharray={row.wrong ? '4 3' : undefined} />
            <text x="79" y={mid + 4} fontSize="12" fill={line} textAnchor="middle">{row.a}</text>

            <rect x="216" y={boxY} width="176" height="56" rx="6" fill={boxFill} stroke={stroke}
                  strokeWidth={row.wrong ? 1 : 1.5} strokeDasharray={row.wrong ? '4 3' : undefined} />
            {row.b.split('\n').map((l, j) => (
              <text key={j} x={304} y={mid - 4 + j * 15} fontSize="12" fill={line} textAnchor="middle">{l}</text>
            ))}

            <rect x="454" y={boxY} width="122" height="56" rx="6" fill={boxFill} stroke={stroke}
                  strokeWidth={row.wrong ? 1 : 1.5} strokeDasharray={row.wrong ? '4 3' : undefined} />
            <text x="515" y={mid + 4} fontSize="12" fill={line} textAnchor="middle">{row.c}</text>

            <line x1="160" y1={mid} x2="210" y2={mid} stroke={line} strokeWidth="1.25" markerEnd="url(#arrow-qr)" />
            <line x1="398" y1={mid} x2="448" y2={mid} stroke={line} strokeWidth="1.25" markerEnd="url(#arrow-qr)" />

            <text x="4" y={boxY + 76} fontSize="11" fill={line} opacity="0.75">
              {row.wrong
                ? 'A screenshot of the code is a licence to mint points.'
                : 'A screenshot proves nothing; entitlement is decided server-side.'}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export const BLOG_DIAGRAMS = {
  'offline-modes': OfflineModes,
  'push-funnel': PushFunnel,
  'shared-vs-effort': SharedVsEffort,
  'staging-gate': StagingGate,
  'qr-identifies': QrIdentifies,
};

export default BLOG_DIAGRAMS;
