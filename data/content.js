/**
 * SEED + FALLBACK ONLY — not the editable source of truth.
 *
 * These are the card/stat/image lists that used to be hardcoded as arrays
 * inside the public page files. They are now stored in MongoDB as
 * `ContentItem` documents and edited at /admin/content.
 *
 * This file is kept for two reasons:
 *   1. `scripts/seed-content.mjs` upserts it into the database, so the
 *      original content is never lost.
 *   2. `lib/content/read.js` falls back to it when a category has NO rows
 *      at all — a never-seeded or wiped database renders the original site
 *      rather than a blank page. Hiding items (isActive = false) is how an
 *      admin empties a section; deleting every row resets it to these.
 *
 * Edits here do nothing on a seeded site. Use the admin panel.
 */

export const impactStats = [
  { label: "25", title: "Senior citizens supported daily", icon: "HandHeart" },
  {
    label: "300",
    title: "Children cared for at our partner children's home",
    icon: "Home",
  },
  {
    label: "100",
    title: "Families aided after the Jammu & Kashmir calamity",
    icon: "LifeBuoy",
  },
  {
    label: "2017",
    title: "Registered as a society in Maharashtra",
    icon: "ShieldCheck",
  },
];

export const homeBreakthroughs = [
  {
    icon: "BookOpen",
    title: "A Balwadi in Sangli",
    body: "A day-care and pre-school for children from slum settlements, run by two part-time teachers focused on literacy, hygiene and habit-building.",
  },
  {
    icon: "Home",
    title: "A home for brick-kiln children",
    body: "We adopted a pre-school for deaf and hard-of-hearing children at Tasgaon, built for the children of migrant brick-kiln labourers who move too often to stay enrolled anywhere else.",
  },
  {
    icon: "HandHeart",
    title: "Orphanages & senior care",
    body: "Ongoing support for a residential children's home and for senior citizens with nowhere else to turn — not one-time gifts, but a standing commitment.",
  },
  {
    icon: "ShieldCheck",
    title: "Safety workshops for girls",
    body: "Seminars and discourses in colleges addressing the sexual harassment of girl students — practical, uncomfortable conversations that most institutions skip.",
  },
];

export const homeHeroSlides = [
  {
    image: "/images/hero-home.jpg",
    imageAlt:
      "Children from a Sangli community that Vrushahi Foundation works alongside",
  },
  {
    image: "/images/program-orphanage.jpg",
    imageAlt: "A group of smiling children with their arms around each other",
  },
  {
    image: "/images/program-women.jpg",
    imageAlt: "Women in colourful sarees at a self-help group meeting",
  },
  {
    image: "/images/events.jpg",
    imageAlt: "A crowded Ganesh festival celebration in Maharashtra",
  },
];

export const homeMarquee = [
  { label: "Education" },
  { label: "Medical Support" },
  { label: "Old Age Care" },
  { label: "Orphan Support" },
  { label: "Women Empowerment" },
  { label: "Disaster Relief" },
];

export const homeGalleryStrip = [
  {
    image: "/images/program-education.jpg",
    imageAlt: "Students studying at desks in a classroom",
  },
  {
    image: "/images/program-women.jpg",
    imageAlt: "Women in a self-help group meeting",
  },
  { image: "/images/events.jpg", imageAlt: "A festival celebration in Maharashtra" },
  { image: "/images/program-orphanage.jpg", imageAlt: "Children smiling together" },
  {
    image: "/images/program-oldage.jpg",
    imageAlt: "Hands resting on a walking cane",
  },
  {
    image: "/images/volunteer-hero.jpg",
    imageAlt: "Volunteers stacking hands together",
  },
];

export const missionPoints = [
  {
    body: "Promote education, food, health and clothing for underprivileged children and women, giving them appropriate opportunities.",
  },
  { body: "Improve the quality of life of the people we work alongside." },
  {
    body: "Promote sustainable social change by improving the living conditions of vulnerable populations.",
  },
  {
    body: "Identify and work with marginalised populations, especially underprivileged children.",
  },
  {
    body: "Give deserving youth an equal chance to become self-reliant, with a healthy, dignified and sustainable quality of life.",
  },
];

export const objectives = [
  {
    body: "Provide for basic needs — food, shelter, clothing, education and medical care — for women, senior citizens and children.",
  },
  {
    body: "Secure the rights of children, adults and women by ensuring real opportunity, not just intention.",
  },
  {
    body: "Support a healthy childhood through quality education, nutrition and health services for marginalised children.",
  },
  { body: "Help enrol underprivileged children in municipal schools." },
  {
    body: "Provide youth with vocational training to improve their employment prospects.",
  },
  { body: "Provide medical support for children who need critical surgeries." },
  {
    body: "Promote unity amongst diverse groups within the communities we serve.",
  },
];

// `label` is the year shown in the Timeline component. The 2017 entry's body
// is seeded with the registration details interpolated from data/site.js —
// see scripts/seed-content.mjs.
export const timelineEntries = [
  {
    label: "2016",
    title: "Groundwork",
    body: "A team of social workers already active in health, education and child welfare around Sangli begin organising formally as Vrushahi Foundation.",
  },
  {
    label: "2017",
    title: "Registered as a society",
    body: "Vrushahi Foundation is registered under the {{registration.act}} (Reg. No. {{registration.number}}), incorporated on {{registration.incorporated}}.",
  },
  {
    label: "Since 2017",
    title: "Six programmes, one district",
    body: "Education, medical support, old-age care, orphan care, women's empowerment and disaster relief grow from a single Balwadi into standing commitments across Sangli district.",
  },
];

export const eventCards = [
  {
    icon: "Heart",
    title: "Entertainment & Festivals",
    body: "Entertainment is an activity which provides a diversion or permits people to amuse themselves in their leisure time, and may also provide fun, enjoyment and laughter. Vrushahi Foundation provides a platform to the underprivileged children during various events. Vrushahi Foundation celebrates all festivals with less fortunate children for bringing smile and motivates them in various extracurricular activities.",
  },
  {
    icon: "Users",
    title: "Dahi Handi celebrations",
    body: "Vrushahi Foundation celebrated Dahi Handi on the occasion of Janmashtami with 25 volunteers for creating awareness on team spirit skills, patience, hard work, confidence and honesty for success.",
  },
  {
    icon: "CalendarDays",
    title: "Children's Day (Bal Diwas)",
    body: "Children's day, in Hindi known as 'Bal Diwas', in India falls on November 14th every year and for good reason. In India it is celebrated on Pandit Nehru's birthday as a day of fun and frolic, a celebration of childhood, children and Nehruji's love for them. Chacha Nehru as the children fondly referred to him, was fond of both children and roses. They should be carefully and lovingly nurtured, as they are the future of the nation and the citizens of tomorrow. He felt that children are the real strength of a country and the very foundation of society. As a tribute to this great man and his love for the children, his birthday is celebrated all over India as 'Children's Day'. Vrushahi Foundation celebrates Children's Day with underprivileged children.",
  },
  {
    icon: "Stethoscope",
    title: "Training & Workshops",
    body: "Vrushahi Foundation provides training/workshops and campaigns to schools, colleges, hospitals for awareness on better living, health and hygiene and motivating them to live a healthy life.",
  },
  {
    icon: "Landmark",
    title: "Exhibitions & Trade Fairs",
    body: "Exhibitions and trade fairs are great places to network and forge good business relationships. Face-to-face contact with NGO's and Corporate make the wheels turn more smoothly. We can meet new prospects and find new sources of revenue. Vrushahi Foundation participates in various exhibitions held in Mumbai, Pune & Nearby Sangli location for promoting the activities conducted by the organization.",
  },
];

export const volunteerRoles = [
  {
    icon: "BookOpen",
    title: "Teaching support at our Balwadi",
    body: "Help our two part-time teachers with basic English, reading and activity sessions for pre-schoolers in Sangli's slum settlements.",
  },
  {
    icon: "Stethoscope",
    title: "Health & hygiene workshops",
    body: "Assist in running our hygiene and health-awareness sessions in schools, colleges and hospitals around Sangli.",
  },
  {
    icon: "Scissors",
    title: "Vocational training mentors",
    body: "Share tailoring, beautician or leatherwork skills with women in our Self-Help Groups, or simply help run a session.",
  },
  {
    icon: "CalendarDays",
    title: "Event volunteers",
    body: "Join our Dahi Handi celebration, Children's Day festivities, or one of our exhibition stalls in Mumbai, Pune or Sangli.",
  },
  {
    icon: "HandHeart",
    title: "Companionship visits",
    body: "Spend time with the senior citizens we support — conversation and company matter as much as the material support does.",
  },
  {
    icon: "Landmark",
    title: "Corporate & CSR partners",
    body: "Organisations looking to contribute funding, materials or employee volunteering hours at scale — we'll work out a programme that fits.",
  },
];

export const donateWays = [
  {
    icon: "Heart",
    title: "One-time gift",
    body: "A single donation directed to the programme of your choice, or to wherever the need is greatest that month.",
  },
  {
    icon: "CalendarDays",
    title: "Monthly giving",
    body: "Recurring support that lets us plan — a Balwadi teacher's salary or a senior citizen's care doesn't stop after one good month.",
  },
  {
    icon: "BookOpen",
    title: "In-kind donations",
    body: "Books, clothing, learning materials, or hygiene and medical supplies — useful directly, no conversion required.",
  },
  {
    icon: "Landmark",
    title: "Corporate & CSR",
    body: "Structured partnerships for organisations directing CSR funds or employee giving toward a specific programme.",
  },
];

// `group` is the category heading rendered above each Lightbox grid;
// `flag` is the old `tall: true` flag that doubles a tile's height.
export const galleryImages = [
  {
    group: "Education",
    image: "/images/program-education.jpg",
    imageAlt: "Students studying at desks in an Indian classroom",
    flag: true,
  },
  {
    group: "Education",
    image: "/images/gallery-3.jpg",
    imageAlt: "Close-up of hands working at a sewing machine",
    flag: false,
  },
  {
    group: "Women's empowerment",
    image: "/images/program-women.jpg",
    imageAlt:
      "A group of women in colourful sarees at a self-help group meeting",
    flag: true,
  },
  {
    group: "Old age & orphan care",
    image: "/images/program-oldage.jpg",
    imageAlt: "Close-up of wrinkled hands resting on a walking cane",
    flag: false,
  },
  {
    group: "Old age & orphan care",
    image: "/images/program-orphanage.jpg",
    imageAlt: "A group of smiling children with their arms around each other",
    flag: true,
  },
  {
    group: "Festivals & events",
    image: "/images/events.jpg",
    imageAlt: "An aerial view of a crowded Ganesh festival celebration",
    flag: true,
  },
  {
    group: "Community & volunteers",
    image: "/images/hero-home.jpg",
    imageAlt: "Children from a Sangli community smiling together",
    flag: true,
  },
  {
    group: "Community & volunteers",
    image: "/images/hands-together.jpg",
    imageAlt: "Hands clasped together in a gesture of support",
    flag: false,
  },
  {
    group: "Community & volunteers",
    image: "/images/volunteer-hero.jpg",
    imageAlt: "A group of volunteers stacking their hands together",
    flag: false,
  },
];

/** Maps a ContentItem category to its seed/fallback list. */
export const contentSeed = {
  impactStat: impactStats,
  homeBreakthrough: homeBreakthroughs,
  homeHeroSlide: homeHeroSlides,
  homeMarquee: homeMarquee,
  homeGalleryStrip: homeGalleryStrip,
  missionPoint: missionPoints,
  objective: objectives,
  timelineEntry: timelineEntries,
  eventCard: eventCards,
  volunteerRole: volunteerRoles,
  donateWay: donateWays,
  galleryImage: galleryImages,
};
