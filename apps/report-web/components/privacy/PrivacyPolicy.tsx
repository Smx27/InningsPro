const POLICY_SECTIONS = [
  {
    title: 'Introduction',
    body: [
      'Innings Pro Analytics is built as an offline-first cricket analytics experience. This Privacy Policy explains what data is handled by the app, how it is used, and the controls available to users.',
      'By using Innings Pro, you agree to this policy and the data practices described below.',
    ],
  },
  {
    title: 'Information We Collect',
    body: [
      'Innings Pro stores match-related data that you enter while scoring and reporting. This can include tournament names, team names, player names, match scores, and ball-by-ball events.',
      'The app does not require account registration to use core functionality and does not intentionally collect sensitive personal information for analytics reports.',
    ],
  },
  {
    title: 'Local Data Storage',
    body: [
      'Innings Pro is designed to work offline first. Match and tournament data is stored locally on your device so you can continue using the app without an internet connection.',
      'Local data remains under your device-level controls. Removing app data or uninstalling the app may permanently delete locally stored records.',
    ],
  },
  {
    title: 'Data Sharing',
    body: [
      'Innings Pro does not transmit your scoring or report data to our servers. Tournament details, player details, and ball events remain on your device unless you choose to export them.',
      'You can manually export match reports and share them through channels you control. Any sharing performed after export is governed by the destination platform or tool you choose.',
    ],
  },
  {
    title: 'Data Security',
    body: [
      'We aim to protect data by minimizing network exposure through an offline-first approach and by keeping report content local by default.',
      'Device security (such as screen lock, backups, and storage protection) plays an important role in safeguarding your information. Please secure your device and exported files appropriately.',
    ],
  },
  {
    title: 'User Rights',
    body: [
      'You control your data in Innings Pro. You may view, edit, export, or delete match and tournament data stored in the app.',
      'Because the app stores data locally and does not sync personal data to our servers, data access and deletion are handled directly on your device.',
    ],
  },
  {
    title: 'Changes to Policy',
    body: [
      'We may update this Privacy Policy from time to time to reflect app improvements, legal requirements, or new optional features.',
      'If optional analytics are introduced in the future, they may include anonymous diagnostics such as crash reports to improve app reliability. Any such changes will be reflected in an updated policy.',
    ],
  },
  {
    title: 'Contact',
    body: [
      'If you have questions about this Privacy Policy or data handling in Innings Pro, contact the team through the website contact page.',
    ],
  },
] as const;

export function PrivacyPolicy() {
  return (
    <article className="mx-auto max-w-3xl py-16">
      <header className="mb-10 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: March 14, 2026</p>
      </header>

      <div className="space-y-10">
        {POLICY_SECTIONS.map((section) => (
          <section key={section.title} className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{section.title}</h2>
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
