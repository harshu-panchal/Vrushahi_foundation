export const programs = [
  {
    slug: "education",
    icon: "BookOpen",
    title: "Education Support",
    short: "Balwadi classes, girls' education, and scholarships for children in Sangli's slum settlements.",
    stat: { value: "7.1M", label: "children in India are out of school (UNICEF)" },
    image: "/images/program-education.jpg",
    imageAlt: "Students seated at wooden desks in an Indian classroom, writing in notebooks",
    sections: [
      {
        heading: "Balwadi & day care",
        body: "We run a Balwadi (pre-school day-care) in a slum settlement in Sangli, staffed by two part-time teachers. Children are taught basic English, cleanliness and good habits, alongside informal mentoring and counselling — often the first structured learning environment they've had access to.",
      },
      {
        heading: "Educating girls",
        body: "Girls are disproportionately pulled out of school in the communities we work in. We support vocational education, run community workshops, and track drop-outs so we can intervene early. Life-skills sessions cover reproductive health, gender equality and legal rights, backed by local education committees that keep families involved.",
      },
      {
        heading: "Scholarship programme",
        body: "Students who score 80% or above in their 10th or 12th standard board exams are considered for a Vrushahi Foundation scholarship, paired with ongoing monitoring and counselling so the support translates into results, not just a one-time grant.",
      },
      {
        heading: "Educational tours",
        body: "We organise educational and picnic tours for children who would otherwise never leave their neighbourhood — a deliberate part of broadening what they believe is possible for themselves.",
      },
    ],
  },
  {
    slug: "medical-support",
    icon: "Stethoscope",
    title: "Medical Support",
    short: "Health camps, nutrition support, and funding for critical surgeries for families who can't afford them.",
    stat: { value: "24/7", label: "coordination with partner hospitals for BPL families" },
    image: "/images/program-medical.jpg",
    imageAlt: "A stethoscope and blood pressure gauge resting on a white cloth",
    sections: [
      {
        heading: "Health awareness",
        body: "We run health-awareness programmes in schools, colleges and slum communities around Sangli — practical sessions on hygiene, nutrition and preventive care aimed at catching problems before they become emergencies.",
      },
      {
        heading: "Nutritional support",
        body: "Malnutrition remains one of the most treatable and most overlooked risks for children in the communities we serve. We provide direct nutritional support to at-risk children and their families as part of our ongoing programme, not as one-off relief.",
      },
      {
        heading: "Critical surgery support",
        body: "For families Below the Poverty Line facing a surgery they cannot afford, we coordinate with partner hospitals to arrange treatment and help bridge the financial gap — the difference, in many cases, between a treatable condition and a permanent one.",
      },
    ],
  },
  {
    slug: "old-age-support",
    icon: "HandHeart",
    title: "Old Age Support",
    short: "Nutrition, shelter and companionship for senior citizens with nowhere else to turn.",
    stat: { value: "25", label: "senior citizens supported" },
    image: "/images/program-oldage.jpg",
    imageAlt: "Close-up of wrinkled hands resting on a walking cane",
    sections: [
      {
        heading: "Why this matters",
        body: "Many of the seniors we support have no family able to care for them, or have been left without support after a lifetime of manual labour. Old age in that situation isn't just financially precarious — it's isolating.",
      },
      {
        heading: "What we provide",
        body: "Vrushahi Foundation currently supports 25 senior citizens with nutrition, shelter and medical care, alongside efforts that go beyond the physical — regular visits and activities aimed at their mental, emotional and spiritual well-being, so growing old doesn't mean growing invisible.",
      },
    ],
  },
  {
    slug: "orphanage-support",
    icon: "Home",
    title: "Orphanage Support",
    short: "Food, shelter, clothing and medical care for orphaned and semi-orphaned children.",
    stat: { value: "300", label: "children supported at our partner children's home" },
    image: "/images/program-orphanage.jpg",
    imageAlt: "A group of smiling children with their arms around each other",
    sections: [
      {
        heading: "Who we support",
        body: "We work with children who have lost one or both parents, providing consistent support rather than one-time donations. This includes a partner residential home for children who are deaf and hard of hearing, alongside general orphan-care support.",
      },
      {
        heading: "What we provide",
        body: "Food, shelter, clothing, medical care and nutrition — the basics that let a child's home function as a home rather than a shortfall to be managed week to week.",
      },
    ],
  },
  {
    slug: "women-empowerment",
    icon: "Scissors",
    title: "Women Empowerment",
    short: "Self-Help Groups and vocational training in tailoring, beautician skills, and leatherwork.",
    stat: { value: "3", label: "vocational skills taught: tailoring, beautician work, leatherwork" },
    image: "/images/program-women.jpg",
    imageAlt: "A group of women in colourful sarees smiling together at a community centre",
    sections: [
      {
        heading: "Self-Help Groups",
        body: "We support women's Self-Help Groups (SHGs) — small collectives that pool savings, extend credit to members, and build the kind of financial independence that doesn't depend on a single earner or a single stroke of luck.",
      },
      {
        heading: "Vocational training",
        body: "Hands-on training in mattress-making, beautician skills and leather bag-making gives women a direct route to income generation, alongside counselling for members navigating social stigma, discrimination or trauma.",
      },
    ],
  },
  {
    slug: "disaster-relief",
    icon: "LifeBuoy",
    title: "Disaster Relief",
    short: "Emergency aid for families affected by natural calamities, including our J&K relief effort.",
    stat: { value: "100", label: "families supported after the Jammu & Kashmir calamity" },
    image: "/images/program-disaster.jpg",
    imageAlt: "Two pairs of hands clasped together in a supportive gesture",
    sections: [
      {
        heading: "Rapid response",
        body: "Natural disasters don't wait for donors to organise, and neither do we. When calamity strikes, our priority is getting essential support — food, shelter materials, and basic necessities — to affected families as quickly as we can mobilise.",
      },
      {
        heading: "Jammu & Kashmir relief",
        body: "Vrushahi Foundation supported 100 families during the calamity disaster in Jammu & Kashmir, coordinating with local volunteers on the ground to make sure aid reached the households that needed it most.",
      },
    ],
  },
];

export function getProgramBySlug(slug) {
  return programs.find((p) => p.slug === slug);
}
