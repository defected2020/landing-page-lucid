import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import { PageContainer, ContentSection } from '../components/ServicePageLayout';
import {
  LegalContainer,
  LegalHeading,
  LegalText,
  LegalNote,
  PendingDetailsBanner,
} from '../components/LegalProse';
import { LEGAL_ENTITY, missingLegalDetails, isLegalEntityComplete } from '../data/legalEntity';

export default function ImpressumPage() {
  const [scrolled, setScrolled] = useState(false);
  const missing = missingLegalDetails();
  const complete = isLegalEntityComplete();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <PageContainer>
      <SEO
        title="Impressum | Lucid Code Labs"
        description="Legal notice and provider identification for Lucid Code Labs, as required under § 5 DDG."
        path="/impressum"
        noindex={!complete}
      />

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Impressum"
        subtitle="Anbieterkennzeichnung gemäß § 5 DDG · Provider identification"
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Impressum' }]}
      />

      <ContentSection>
        <LegalContainer>
          {!complete && <PendingDetailsBanner missing={missing} />}

          <LegalHeading>Angaben gemäß § 5 DDG</LegalHeading>
          <LegalText>
            {LEGAL_ENTITY.name}
            {LEGAL_ENTITY.legalForm ? ` (${LEGAL_ENTITY.legalForm})` : ''}
            <br />
            {LEGAL_ENTITY.street || '[Straße und Hausnummer]'}
            <br />
            {LEGAL_ENTITY.postalCode || '[PLZ]'} {LEGAL_ENTITY.city}
            <br />
            {LEGAL_ENTITY.country}
          </LegalText>

          <LegalHeading>Vertreten durch</LegalHeading>
          <LegalText>{LEGAL_ENTITY.responsiblePerson || '[Name der vertretungsberechtigten Person]'}</LegalText>

          <LegalHeading>Kontakt</LegalHeading>
          <LegalText>
            Telefon: <a href={`tel:${LEGAL_ENTITY.phone.replace(/\s/g, '')}`}>{LEGAL_ENTITY.phone}</a>
            <br />
            E-Mail: <a href={`mailto:${LEGAL_ENTITY.email}`}>{LEGAL_ENTITY.email}</a>
          </LegalText>

          {LEGAL_ENTITY.vatId && (
            <>
              <LegalHeading>Umsatzsteuer-Identifikationsnummer</LegalHeading>
              <LegalText>
                Gemäß § 27a Umsatzsteuergesetz: {LEGAL_ENTITY.vatId}
              </LegalText>
            </>
          )}

          {LEGAL_ENTITY.registerCourt && LEGAL_ENTITY.registerNumber && (
            <>
              <LegalHeading>Registereintrag</LegalHeading>
              <LegalText>
                Registergericht: {LEGAL_ENTITY.registerCourt}
                <br />
                Registernummer: {LEGAL_ENTITY.registerNumber}
              </LegalText>
            </>
          )}

          <LegalHeading>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</LegalHeading>
          <LegalText>
            {LEGAL_ENTITY.responsiblePerson || '[Name]'}
            <br />
            {LEGAL_ENTITY.street || '[Straße und Hausnummer]'}
            <br />
            {LEGAL_ENTITY.postalCode || '[PLZ]'} {LEGAL_ENTITY.city}
          </LegalText>

          <LegalHeading>EU-Streitschlichtung</LegalHeading>
          <LegalText>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
              ec.europa.eu/consumers/odr
            </a>
            . Unsere E-Mail-Adresse finden Sie oben.
          </LegalText>

          <LegalHeading>Verbraucherstreitbeilegung</LegalHeading>
          <LegalText>
            Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </LegalText>

          <LegalHeading>Haftung für Inhalte</LegalHeading>
          <LegalText>
            Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen
            Gesetzen verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder
            gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf
            eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
            Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          </LegalText>

          <LegalHeading>Haftung für Links</LegalHeading>
          <LegalText>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
            oder Betreiber verantwortlich. Bei Bekanntwerden von Rechtsverletzungen werden wir
            derartige Links umgehend entfernen.
          </LegalText>

          <LegalHeading>Urheberrecht</LegalHeading>
          <LegalText>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.
          </LegalText>

          <LegalNote>
            English summary: this page is the provider identification required of commercial websites
            in Germany. For how we handle personal data, see our{' '}
            <a href="/privacy-policy">Privacy Policy</a>.
          </LegalNote>
        </LegalContainer>
      </ContentSection>

      <Footer />
    </PageContainer>
  );
}
