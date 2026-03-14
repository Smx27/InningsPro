const TERMS_SECTIONS = [
  {
    title: 'Introduction',
    body: [
      'These Terms of Service govern your use of Innings Pro Analytics across our web platform and companion mobile app experiences.',
      'Innings Pro enables users to record cricket matches and generate detailed reports for teams, tournaments, and player performance analysis.',
    ],
  },
  {
    title: 'Use of Service',
    body: [
      'You may use Innings Pro for lawful cricket scoring, reporting, and analytics purposes only.',
      'You agree not to misuse the platform, attempt unauthorized access, or interfere with normal operation of the service.',
    ],
  },
  {
    title: 'User Responsibilities',
    body: [
      'You are responsible for the accuracy, completeness, and legality of all match, player, and tournament data you enter.',
      'You should review scorecards and summaries before distributing reports to teams, officials, or third parties.',
    ],
  },
  {
    title: 'Data Ownership',
    body: [
      'You retain ownership of the match and tournament data you create in Innings Pro.',
      "All match data is stored locally on your device unless you intentionally export and share it through channels you control.",
    ],
  },
  {
    title: 'Exported Data',
    body: [
      'Innings Pro allows users to export match reports manually in supported formats.',
      'Innings Pro does not guarantee the accuracy, completeness, or compatibility of exported data once it is shared or opened in third-party tools.',
    ],
  },
  {
    title: 'Limitation of Liability',
    body: [
      'The service is provided "as is" and "as available" without warranties of any kind, express or implied.',
      'To the fullest extent permitted by law, Innings Pro is not liable for indirect, incidental, special, consequential, or punitive damages arising from use of the service or exported reports.',
    ],
  },
  {
    title: 'Changes to Terms',
    body: [
      'We may update these Terms of Service from time to time to reflect product updates, legal requirements, or operational changes.',
      'Continued use of Innings Pro after updates are published constitutes acceptance of the revised terms.',
    ],
  },
  {
    title: 'Contact',
    body: [
      'If you have questions regarding these Terms of Service, contact us at support@inningspro.app.',
    ],
  },
] as const;

export function TermsOfService() {
  return (
    <article className="mx-auto max-w-3xl py-16">
      <header className="mb-10 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: March 14, 2026</p>
      </header>

      <div className="space-y-10">
        {TERMS_SECTIONS.map((section) => (
          <section key={section.title} className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{section.title}</h2>
            <div className="space-y-3 text-base leading-7 text-muted-foreground">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
