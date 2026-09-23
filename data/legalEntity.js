// Legal identity of the operator, used by /impressum and /privacy-policy.
//
// German law (§5 DDG, formerly §5 TMG) requires a full postal address, a named
// person and direct contact details on every commercial website — a locality
// alone is not enough, and an incomplete Impressum is the usual trigger for an
// Abmahnung. Nothing here may be guessed: fill the nulls in and both pages stop
// showing their "details pending" banner and become indexable.
//
// `vatId`, `registerCourt` and `registerNumber` are legitimately null for a
// sole trader (Einzelunternehmen) with no VAT registration — leave them null if
// they genuinely do not apply and set `legalForm` accordingly.

export const LEGAL_ENTITY = {
  /** Registered name, exactly as it appears on the trade registration. */
  name: 'Lucid Code Labs',
  /** e.g. 'Einzelunternehmen', 'UG (haftungsbeschränkt)', 'GmbH'. */
  legalForm: null,
  /** Person responsible for the site and its content (§18 Abs. 2 MStV). */
  responsiblePerson: null,
  street: null,
  postalCode: null,
  city: 'Berlin',
  country: 'Germany',
  email: 'info@lucidcodelabs.com',
  phone: '+49 176 8141 7544',
  /** Umsatzsteuer-Identifikationsnummer (§27a UStG), or null if not registered. */
  vatId: null,
  /** Registergericht, e.g. 'Amtsgericht Charlottenburg'. Null if not registered. */
  registerCourt: null,
  /** e.g. 'HRB 123456'. Null if not registered. */
  registerNumber: null,
};

/** Fields that legally must be present before these pages should go public. */
const REQUIRED = ['legalForm', 'responsiblePerson', 'street', 'postalCode'];

export function missingLegalDetails() {
  return REQUIRED.filter((key) => !LEGAL_ENTITY[key]);
}

export function isLegalEntityComplete() {
  return missingLegalDetails().length === 0;
}

/** Single-line postal address, or null while the address is incomplete. */
export function postalAddress() {
  const { street, postalCode, city, country } = LEGAL_ENTITY;
  if (!street || !postalCode) return null;
  return `${street}, ${postalCode} ${city}, ${country}`;
}
