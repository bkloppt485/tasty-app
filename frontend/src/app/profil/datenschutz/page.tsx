"use client";

import SubPageHeader from "@/components/SubPageHeader";

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-xl text-text-cream mt-8 mb-3">{children}</h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-serif text-[0.95rem] text-text-cream/90 leading-[1.7] mb-3">
      {children}
    </p>
  );
}

export default function DatenschutzPage() {
  return (
    <div>
      <SubPageHeader title="Datenschutz" />

      <div className="px-7 pt-6 pb-12">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft">
          Datenschutzerklärung gemäß DSGVO
        </p>

        <H>1. Verantwortlicher</H>
        <P>
          Verantwortlich für die Verarbeitung personenbezogener Daten ist:<br />
          Tasty Restaurant GmbH, Königsstraße 50, 34117 Kassel,
          E-Mail: kontakt@tasty-kassel.de
        </P>

        <H>2. Erhobene Daten</H>
        <P>
          Bei der Nutzung unserer App verarbeiten wir folgende Daten:
          Name, E-Mail-Adresse, Bestellhistorie sowie ggf. Lieferadresse.
          Diese Daten erheben wir ausschließlich zur Vertragserfüllung
          (Art. 6 Abs. 1 lit. b DSGVO).
        </P>

        <H>3. Zweck der Verarbeitung</H>
        <P>
          Ihre Daten werden zur Abwicklung Ihrer Bestellungen, zur Kommunikation
          mit Ihnen sowie zur Verbesserung unseres Services verwendet. Eine
          Weitergabe an Dritte erfolgt ausschließlich, soweit dies zur
          Vertragserfüllung erforderlich ist.
        </P>

        <H>4. Speicherdauer</H>
        <P>
          Personenbezogene Daten werden nur so lange gespeichert, wie es zur
          Erfüllung des jeweiligen Zwecks oder aufgrund gesetzlicher
          Aufbewahrungsfristen (z. B. handels- und steuerrechtlich) erforderlich
          ist.
        </P>

        <H>5. Ihre Rechte</H>
        <P>
          Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung
          (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung
          (Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch
          (Art. 21). Sie können diese Rechte per E-Mail an
          kontakt@tasty-kassel.de geltend machen.
        </P>

        <H>6. Cookies & Tracking</H>
        <P>
          Wir verwenden ausschließlich technisch notwendige Cookies bzw.
          lokalen Speicher des Browsers, um Ihren Login und Ihren Warenkorb
          während der Sitzung vorzuhalten. Tracking-Cookies setzen wir nicht
          ein.
        </P>

        <H>7. Beschwerderecht</H>
        <P>
          Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde
          (Hessischer Beauftragter für Datenschutz und Informationsfreiheit)
          über die Verarbeitung Ihrer Daten zu beschweren.
        </P>

        <P>Stand: April 2026</P>
      </div>
    </div>
  );
}
