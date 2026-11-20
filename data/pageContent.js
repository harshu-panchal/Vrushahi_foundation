/**
 * SEED + FALLBACK ONLY — not the editable source of truth.
 *
 * Every hero line, section heading and CTA that used to be written inline
 * in the public page files. Now stored as `PageContent` documents and
 * edited at /admin/pages.
 *
 * Unlike the list content in `data/content.js`, these are per-block
 * fallbacks: if a block is missing from the database, or an admin blanks a
 * field, the page falls back to the wording below rather than rendering an
 * empty heading. That makes a blanked field a no-op instead of a visible
 * hole, which is the right trade-off for structural copy.
 *
 * `{{...}}` placeholders are filled at render time:
 *   {{program}} — the current programme's title (lowercased)
 */

export const pageContentSeed = {
  home: [
    {
      key: "hero",
      // The *asterisked* run renders italic + terracotta in AnimatedHeadline.
      title:
        "Small acts, sustained for years, *change* what a family believes is possible.",
      description:
        "Vrushahi Foundation works alongside underprivileged children, women, senior citizens and disaster-affected families across Sangli district — through education, healthcare, elder care and vocational training built to outlast a single donation.",
      primaryLabel: "Donate Now",
      primaryHref: "/donate",
      secondaryLabel: "See our programs",
      secondaryHref: "/programs",
    },
    {
      key: "heroCard",
      title: "300+",
      description:
        "children supported through our care and education programmes",
    },
    {
      key: "heroBadge",
      title: "REGISTERED NGO · SINCE 2017 ·",
    },
    {
      key: "whoWeAre",
      eyebrow: "Who we are",
      title: "A team of social workers, not a fundraising brand.",
      description:
        "Vrushahi Foundation was founded by social workers already active in health, education, sustainability, vocational training and child development around Sangli. We work among migrants, abused women, neglected children, senior citizens, school drop-outs and Self-Help Groups — because the underprivileged don't just need resources, they need to be given a real opportunity and the motivation to use it.",
    },
    {
      key: "programs",
      eyebrow: "Where the work happens",
      title: "Six programmes, one goal: dignity that doesn't depend on charity.",
      description:
        "Each programme is run as a standing commitment, not a seasonal campaign.",
    },
    {
      key: "galleryStrip",
      eyebrow: "A glimpse of the work",
    },
    {
      key: "eventsTeaser",
      eyebrow: "On the ground",
      title: "Festivals, workshops and exhibitions — not just donation drives.",
      description:
        "From a 25-volunteer Dahi Handi celebration to Children's Day festivities and hygiene workshops in local schools and hospitals, our events are where the community actually meets the mission.",
      image: "/images/events.jpg",
      imageAlt:
        "A festival gathering in Maharashtra that Vrushahi Foundation volunteers take part in",
      primaryLabel: "See our events",
      primaryHref: "/events",
    },
    { key: "cta" },
  ],

  about: [
    {
      key: "hero",
      eyebrow: "History",
      title: "A life not lived for others is not a life.",
      description:
        "Vrushahi Foundation is a non-profit registered under the Societies Registration Act, 1860, founded by a team already working in health, education, sustainability, vocational training and child development around Sangli.",
    },
    {
      key: "intro",
      eyebrow: "Who we are ?",
      title:
        "Working among migrants, abused women, neglected children and senior citizens.",
      // Paragraphs separated by a blank line.
      body: [
        "Vrushahi Foundation is a non-profit NGO established under society Registration Act, 1860 (Registration No: Maharashtra/349/2017).",
        "Vrushahi Foundation was established by a team of social workers who are working in the field of health, education, sustainability, vocational training, empowering women and child development.",
        "Vrushahi Foundation works among migrants, poor and abused women, neglected children, senior citizens, school drop outs, Self Help Groups, and awareness on various social, health and current issues. The underprivileged need to be given the appropriate opportunities and they need to be motivated. Vrushahi Foundation works with a view to help the poor community through various welfare activities.",
      ].join("\n\n"),
      image: "/images/hands-together.jpg",
      imageAlt: "Hands clasped together in a gesture of support",
    },
    {
      key: "vision",
      eyebrow: "Our vision",
      body: "To ensure that the needy women, children and senior citizens we work with regain their human rights and are able to sustain themselves in society.",
    },
    {
      key: "mission",
      eyebrow: "Our mission",
      title: "What we're working toward.",
    },
    {
      key: "objectives",
      eyebrow: "Our objectives",
      title: "How we get there.",
    },
    { key: "milestones", eyebrow: "Milestones", title: "How we got here." },
    { key: "cta" },
  ],

  founder: [
    {
      key: "hero",
      eyebrow: "Founder",
      title: "The person behind the paperwork.",
      description:
        "Vrushahi Foundation was registered in 2017 by a founding trustee already active in social work across Sangli district.",
    },
    {
      key: "cta",
      title: "Meet the people carrying this work forward.",
      description:
        "Our Board of Trustees oversees how every rupee and every hour of volunteer time is put to work.",
      primaryLabel: "Meet the Trustees",
      primaryHref: "/about/trustees",
      secondaryLabel: "Get in Touch",
      secondaryHref: "/contact",
    },
  ],

  programs: [
    {
      key: "hero",
      eyebrow: "Programs",
      title: "Six commitments, run as standing programmes.",
      description:
        "Each of these grew out of a need our team saw directly in Sangli district — not a template borrowed from elsewhere.",
    },
    { key: "detailOthers", title: "Other programmes" },
    {
      key: "detailCta",
      title: "Help us do more for {{program}}.",
      description:
        "Every donation to this programme goes directly toward the activities described above.",
    },
    { key: "cta" },
  ],

  trustees: [
    {
      key: "hero",
      eyebrow: "Governance",
      title: "A Board of Trustees, not a single decision-maker.",
      description:
        "Vrushahi Foundation is governed by a Board of Trustees responsible for how the Foundation's programmes and funds are directed.",
    },
    {
      key: "empty",
      body: "We're updating this page with the current Board's names, designations and photographs. Reach out via our contact page if you need trustee details sooner.",
    },
    { key: "cta" },
  ],

  events: [
    {
      key: "hero",
      eyebrow: "Events",
      title: "Where the community and the mission actually meet.",
      description:
        "Our events aren't fundraising theatre — they're the same programmes, made visible.",
    },
    {
      key: "heroImage",
      image: "/images/events.jpg",
      imageAlt: "A crowded Ganesh festival celebration in Maharashtra",
    },
    {
      key: "cta",
      title: "Want to volunteer at our next event?",
      description:
        "We put out a call for volunteers ahead of every major festival and workshop.",
      primaryLabel: "Volunteer With Us",
      primaryHref: "/volunteer",
      secondaryLabel: "Contact Us",
      secondaryHref: "/contact",
    },
  ],

  gallery: [
    {
      key: "hero",
      eyebrow: "Gallery",
      title: "A look at the work, category by category.",
      description:
        "Our photo library is growing alongside our programmes — this is a first look.",
    },
    { key: "cta" },
  ],

  stories: [
    {
      key: "hero",
      eyebrow: "Stories",
      title: "We'd rather publish real stories late than invented ones on time.",
      description:
        "This page is being built alongside our beneficiaries and partners, with their consent — not written for them in advance.",
    },
    {
      key: "stats",
      eyebrow: "What we can show today",
      title: "The shape of our impact so far.",
    },
    {
      key: "testimonials",
      title: "Testimonials, done properly",
      description:
        "We're collecting first-hand accounts from the families, volunteers and partner institutions we work with — each one published only with explicit consent. If you've worked with Vrushahi Foundation and are willing to share your experience, we'd like to hear it.",
    },
    {
      key: "form",
      title: "Share your story",
      description:
        "Volunteer, donor, partner or beneficiary — tell us what you'd like to share.",
      primaryLabel: "Share Your Story",
    },
  ],

  donors: [
    {
      key: "hero",
      eyebrow: "Transparency",
      title: "Our Donors",
      description:
        "Every gift, acknowledged — and the programme it was put toward once we allocated it.",
    },
    {
      key: "byProgram",
      eyebrow: "Where it went",
      title: "Contributions by programme.",
    },
    { key: "list", eyebrow: "Donor list", title: "Thank you, all of you." },
    {
      key: "privacyNote",
      // The contact email is appended as a mailto link after this sentence.
      body: "We list donor names and amounts as a record of transparency. If you'd rather your name not appear here, write to us and we'll remove it —",
    },
  ],

  volunteer: [
    {
      key: "hero",
      eyebrow: "Volunteer",
      title: "Roles tied to real programmes, not generic 'help out' shifts.",
      description:
        "Every volunteer role below maps to something we're already running — you're joining existing work, not inventing a task for yourself.",
    },
    {
      key: "heroImage",
      image: "/images/volunteer-hero.jpg",
      imageAlt:
        "A group of volunteers stacking their hands together in a show of teamwork",
    },
    {
      key: "roles",
      eyebrow: "Where you fit in",
      title: "Six ways to get involved.",
    },
    {
      key: "signup",
      eyebrow: "Sign up",
      title: "Tell us where you'd like to help.",
      description:
        "Share a little about yourself and we'll get back to you about current openings.",
      primaryLabel: "Send Sign-Up",
    },
  ],

  donate: [
    {
      key: "hero",
      eyebrow: "Donate",
      title: "Your donation reaches a person, not a processing fee.",
      description:
        "Vrushahi Foundation is a registered society — every donation is acknowledged and tracked against the programme it supports.",
    },
    { key: "ways", eyebrow: "Ways to give", title: "Pick what fits." },
    {
      key: "heroImage",
      image: "/images/donate-hero.jpg",
      imageAlt: "A group of volunteers stacking their hands together",
    },
    {
      key: "online",
      eyebrow: "Give online",
      title: "Donate securely online.",
      body: "Payments are processed through a secure, encrypted gateway. We never store your card or bank details.",
    },
    {
      key: "bank",
      title: "Donate by Cheque, DD, RTGS, NEFT",
      description:
        "Prefer a direct transfer? Use the account details below, then email or call us so we can confirm receipt.",
    },
    {
      key: "contactBand",
      eyebrow: "Questions about your donation?",
      title: "We're happy to confirm a transfer or talk through CSR giving.",
      description:
        "Call or email us any time — our team will confirm receipt of a bank transfer, send an acknowledgement, or help set up a corporate partnership.",
    },
    {
      key: "legal",
      eyebrow: "Trust & transparency",
      title: "The legal basics.",
    },
  ],

  contact: [
    {
      key: "hero",
      eyebrow: "Contact",
      title: "Questions, partnerships, press — reach us directly.",
      description:
        "No call centre, no ticket queue — messages go to the team running these programmes.",
    },
    {
      key: "form",
      title: "Send us a message",
      description:
        "We'll get back to you at the email or phone number you provide.",
      primaryLabel: "Send Message",
    },
  ],
};

/** CtaBand copy used wherever a page doesn't override it. */
export const ctaDefaults = {
  title: "Your support reaches people directly.",
  description:
    "No middle layers, no overhead theatre — donations and volunteer hours go straight into the programmes above.",
  primaryLabel: "Donate Now",
  primaryHref: "/donate",
  secondaryLabel: "Volunteer With Us",
  secondaryHref: "/volunteer",
};
