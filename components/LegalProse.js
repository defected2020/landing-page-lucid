import React from 'react';

/**
 * Typography for the legal pages. They are long, plain and read top to bottom,
 * so they get a narrower measure than the marketing sections and none of the
 * animation — someone checking who runs this site should not have to wait for
 * anything to fade in.
 */
export const LegalContainer = ({ children }) => (
  <div className="mx-auto max-w-[760px] px-container">{children}</div>
);

export const LegalHeading = ({ children }) => (
  <h2 className="mb-4 mt-12 font-display text-[1.375rem] font-semibold text-text first:mt-0">
    {children}
  </h2>
);

export const LegalSubheading = ({ children }) => (
  <h3 className="mb-3 mt-8 font-display text-[1.0625rem] font-semibold text-text">{children}</h3>
);

export const LegalText = ({ children }) => (
  <p className="mb-4 text-[0.9375rem] leading-[1.75] text-text-muted">{children}</p>
);

export const LegalList = ({ children }) => (
  <ul className="mb-5 list-disc space-y-2 pl-5 text-[0.9375rem] leading-[1.75] text-text-muted">
    {children}
  </ul>
);

export const LegalNote = ({ children }) => (
  <p className="mb-8 text-[0.8125rem] leading-[1.7] text-text-subtle">{children}</p>
);

/**
 * Shown while data/legalEntity.js still has nulls. Deliberately loud: a
 * published Impressum missing its required fields is worse than an obvious
 * draft, because it looks like a real one.
 */
export const PendingDetailsBanner = ({ missing }) => (
  <div className="mb-10 rounded-lg border border-amber-500/40 bg-amber-500/[0.07] p-5">
    <p className="mb-2 font-display text-[0.9375rem] font-semibold text-text">
      Details pending — not yet legally complete
    </p>
    <p className="text-[0.875rem] leading-[1.7] text-text-muted">
      This page is a draft. The following required details are still missing from{' '}
      <code className="text-text">data/legalEntity.js</code>:{' '}
      <span className="text-text">{missing.join(', ')}</span>. Until they are filled in, the page is
      excluded from search engines.
    </p>
  </div>
);
