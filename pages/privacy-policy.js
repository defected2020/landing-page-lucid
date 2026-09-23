import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import { PageContainer, ContentSection } from '../components/ServicePageLayout';
import {
  LegalContainer,
  LegalHeading,
  LegalSubheading,
  LegalText,
  LegalList,
  LegalNote,
  PendingDetailsBanner,
} from '../components/LegalProse';
import { LEGAL_ENTITY, missingLegalDetails, isLegalEntityComplete } from '../data/legalEntity';

const LAST_UPDATED = '23 September 2026';

export default function PrivacyPolicyPage() {
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
        title="Privacy Policy | Lucid Code Labs"
        description="How Lucid Code Labs collects and uses personal data on lucidcodelabs.com, including analytics, advertising and the contact form."
        path="/privacy-policy"
        noindex={!complete}
      />

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Privacy Policy"
        subtitle={`How we handle personal data on this website · Last updated ${LAST_UPDATED}`}
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Privacy Policy' }]}
      />

      <ContentSection>
        <LegalContainer>
          {!complete && <PendingDetailsBanner missing={missing} />}

          <LegalText>
            This policy covers lucidcodelabs.com. It does not cover the products we build for
            clients, or the InnerSphere app, which has{' '}
            <a href="https://www.inner-sphere.net/privacy-policy" target="_blank" rel="noopener noreferrer">
              its own privacy policy
            </a>
            .
          </LegalText>

          <LegalHeading>1. Who is responsible</LegalHeading>
          <LegalText>
            The controller for the purposes of the GDPR is {LEGAL_ENTITY.name}
            {LEGAL_ENTITY.legalForm ? `, ${LEGAL_ENTITY.legalForm}` : ''}, {LEGAL_ENTITY.street || '[street]'},{' '}
            {LEGAL_ENTITY.postalCode || '[postcode]'} {LEGAL_ENTITY.city}, {LEGAL_ENTITY.country}. You can
            reach us at <a href={`mailto:${LEGAL_ENTITY.email}`}>{LEGAL_ENTITY.email}</a>. Full provider
            details are in our <a href="/impressum">Impressum</a>.
          </LegalText>
          <LegalText>
            We have not appointed a Data Protection Officer, as we are not required to.
          </LegalText>

          <LegalHeading>2. What we collect, and why</LegalHeading>

          <LegalSubheading>2.1 Server logs</LegalSubheading>
          <LegalText>
            Our host records the usual technical information when you load a page: your IP address,
            the page requested, the time, your browser and operating system, and the referring page.
            This is what makes serving the site and defending it against abuse possible.
          </LegalText>

          <LegalSubheading>2.2 Analytics</LegalSubheading>
          <LegalText>
            We use Vercel Analytics and Vercel Speed Insights to see which pages are visited and how
            quickly they load. Vercel states that these products do not use cookies and do not track
            visitors across sites; measurements are aggregated rather than tied to a person.
          </LegalText>

          <LegalSubheading>2.3 Advertising</LegalSubheading>
          <LegalText>
            We use the Meta pixel to measure advertising we run on Facebook and Instagram, and to
            build audiences for it. On every page of this site it records the page you viewed, your
            IP address, your browser and device type, and sets two cookies belonging to Meta:{' '}
            <code>_fbp</code>, and <code>_fbc</code> if you arrived by clicking one of our ads. Meta
            may combine this with data it already holds about you.
          </LegalText>
          <LegalText>
            The pixel loads on every page and we do not currently ask for your consent before it
            does. Section 6 explains how to stop it.
          </LegalText>

          <LegalSubheading>2.4 Contact form and email</LegalSubheading>
          <LegalText>
            Our contact form is provided by Tally, and is embedded from their servers. Whatever you
            enter — typically your name, email address and your message — is submitted to Tally and
            forwarded to us. If you email or call us directly instead, we hold that correspondence in
            our mailbox in order to answer you and keep a record of what was agreed.
          </LegalText>

          <LegalHeading>3. Legal bases</LegalHeading>
          <LegalList>
            <li>
              <strong>Serving the site and keeping it secure</strong> — our legitimate interest in
              operating a functioning, defended website (Art. 6(1)(f) GDPR).
            </li>
            <li>
              <strong>Answering your enquiry</strong> — taking steps at your request before entering
              into a contract, or our legitimate interest in responding to you (Art. 6(1)(b) and (f)).
            </li>
            <li>
              <strong>Analytics and advertising</strong> — see the note below.
            </li>
          </LegalList>
          <LegalText>
            Under the ePrivacy rules, storing or reading cookies for advertising normally requires
            your prior consent, and this site does not currently ask for it. We are reviewing that.
            In the meantime you can block the pixel using the methods in Section 6, and you may
            object to this processing at any time.
          </LegalText>

          <LegalHeading>4. Who receives your data</LegalHeading>
          <LegalList>
            <li>
              <strong>Vercel</strong> — hosting, server logs, analytics and performance measurement.
            </li>
            <li>
              <strong>Meta Platforms Ireland</strong> — advertising measurement and audiences.
            </li>
            <li>
              <strong>Tally</strong> — the contact form and its submissions.
            </li>
            <li>
              <strong>Zoho</strong> — our email, so anything you send us by email passes through it.
            </li>
          </LegalList>
          <LegalText>
            We do not sell your personal data, and we do not share it with anyone else except where
            the law requires it.
          </LegalText>

          <LegalHeading>5. Transfers outside the EU</LegalHeading>
          <LegalText>
            Some of these providers are based in, or transfer data to, the United States. Those
            transfers rely on the EU Standard Contractual Clauses and, where the provider is
            certified, the EU–US Data Privacy Framework. You can ask us for details of the safeguards
            that apply.
          </LegalText>

          <LegalHeading>6. Your choices</LegalHeading>
          <LegalList>
            <li>
              Blocking third-party scripts or cookies in your browser, or using a tracking blocker,
              stops the Meta pixel loading.
            </li>
            <li>
              You can limit how Meta uses your data for advertising in your Meta account settings,
              including its off-Facebook activity controls.
            </li>
            <li>
              You can contact us by phone or email instead of using the contact form, which avoids
              Tally entirely.
            </li>
          </LegalList>

          <LegalHeading>7. How long we keep things</LegalHeading>
          <LegalList>
            <li>Server logs: a short period, for security and troubleshooting.</li>
            <li>Analytics: aggregated, and retained per Vercel&apos;s own retention periods.</li>
            <li>
              Enquiries and correspondence: as long as needed to deal with your enquiry, and
              afterwards where commercial or tax law requires us to keep records.
            </li>
            <li>Advertising data held by Meta: subject to Meta&apos;s own retention policy.</li>
          </LegalList>

          <LegalHeading>8. Your rights</LegalHeading>
          <LegalText>
            You have the right to access the personal data we hold about you, to have it corrected or
            erased, to restrict or object to how we process it, and to receive it in a portable form.
            Where processing is based on consent, you may withdraw it at any time without affecting
            what was done beforehand. Write to{' '}
            <a href={`mailto:${LEGAL_ENTITY.email}`}>{LEGAL_ENTITY.email}</a> and we will respond
            within one month.
          </LegalText>
          <LegalText>
            You also have the right to complain to a supervisory authority. For us that is the
            Berliner Beauftragte für Datenschutz und Informationsfreiheit, though you may complain to
            the authority where you live instead.
          </LegalText>

          <LegalHeading>9. Changes</LegalHeading>
          <LegalText>
            If we change how we handle personal data we will update this page and the date at the top
            of it.
          </LegalText>

          <LegalNote>
            This policy describes what the site actually does today rather than what it might do. If
            you spot something here that does not match your experience of the site, please tell us.
          </LegalNote>
        </LegalContainer>
      </ContentSection>

      <Footer />
    </PageContainer>
  );
}
