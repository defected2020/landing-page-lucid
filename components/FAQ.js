import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './ui/accordion';
import { ContentSection, Container, SectionTitle, SectionDescription } from './ServicePageLayout';

// Renders the questions and answers as real page text so the FAQPage structured
// data has visible content backing it. Radix unmounts a closed panel by default,
// which would leave the marked-up answers absent from the HTML — `forceMount`
// keeps every answer in the document and lets the `hidden` attribute do the
// collapsing.
const FAQ = ({
  faqs,
  title = 'Frequently asked questions',
  description,
  $alt = false,
}) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <ContentSection $alt={$alt}>
      <Container>
        <SectionTitle>{title}</SectionTitle>
        {description && <SectionDescription>{description}</SectionDescription>}
        {/* `forceMount` keeps closed answers in the DOM, but Radix does not emit
            the `hidden` attribute during server rendering, so collapse them here
            by state. Scoped to this list to leave other accordions untouched. */}
        <div className="mx-auto max-w-[760px] [&_[role=region][data-state=closed]]:hidden">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent forceMount>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </ContentSection>
  );
};

export default FAQ;
