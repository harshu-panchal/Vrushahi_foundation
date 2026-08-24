export const legalPages = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    updated: "2026",
    body: [
      {
        heading: "What we collect",
        text: "When you donate, volunteer, or contact us, we may collect your name, email address, phone number, postal address, and payment-related information solely to process your request and stay in touch with you.",
      },
      {
        heading: "How we use it",
        text: "Your information is used internally — to process donations, respond to enquiries, and share updates about our work if you've opted in. We do not sell, rent, or share your personal data with third parties for marketing purposes.",
      },
      {
        heading: "Content ownership",
        text: "All text, photographs, and design elements on this website are the property of Vrushahi Foundation unless otherwise credited, and may not be reproduced without permission.",
      },
      {
        heading: "Contact",
        text: "Questions about this policy or your data can be sent to info@vrushahifoundation.org.",
      },
    ],
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    updated: "2026",
    body: [
      {
        heading: "Acceptable use",
        text: "This website is provided for information about Vrushahi Foundation and its programmes, and to facilitate donations and volunteer sign-ups. You agree not to misuse the site, attempt unauthorised access, or use its content for commercial purposes without consent.",
      },
      {
        heading: "Donations",
        text: "Donations made through this website are directed to the cause selected at the time of donation. Where a specific programme is already fully funded or no longer active, Vrushahi Foundation reserves the right to redirect surplus funds to another programme with a comparable purpose.",
      },
      {
        heading: "Changes to these terms",
        text: "We may update these terms from time to time to reflect changes in our operations or legal requirements. Continued use of the site after changes are posted constitutes acceptance of the revised terms.",
      },
      {
        heading: "Liability",
        text: "While we take reasonable care to keep information on this site accurate and up to date, Vrushahi Foundation is not liable for losses arising from reliance on this website's content, or from third-party payment processing issues outside our control.",
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    updated: "2026",
    body: [
      {
        heading: "General",
        text: "By accessing and using www.vrushahifoundation.org, you accept these Terms & Conditions in full. If you disagree with any part of these terms, please do not use this website. These terms take precedence over any other agreements or communications regarding your use of this site.",
      },
    ],
  },
  {
    slug: "refund-policy",
    title: "Cancellation & Refund Policy",
    updated: "2026",
    body: [
      {
        heading: "Correcting a donation",
        text: "If you've made an error while donating online — an incorrect amount, cause, or contact detail — write to us at info@vrushahifoundation.org and we'll help correct it.",
      },
      {
        heading: "Cancellations & refunds",
        text: "If you'd like to cancel a donation and request a refund, please notify us within 24 hours of the transaction at info@vrushahifoundation.org, along with your payment reference. Requests made after this window will be reviewed on a case-by-case basis.",
      },
    ],
  },
];

export function getLegalBySlug(slug) {
  return legalPages.find((p) => p.slug === slug);
}
