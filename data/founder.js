/**
 * SEED + FALLBACK ONLY — not the editable source of truth. Stored as the
 * `FounderProfile` singleton and edited at /admin/founder.
 *
 * Content note carried over from the old page: the name below was read from
 * the Foundation's registration paperwork and has never been confirmed, and
 * the bio is deliberately role-based rather than biographical because no
 * verified personal history or photograph existed. Both are now editable in
 * the admin panel — this is the first thing worth correcting there.
 */
export const founderSeed = {
  name: "Sudhir Nandkumar Deshpande",
  role: "Founder & Managing Trustee",
  initials: "SD",
  photoUrl: "",
  bio: [
    "Vrushahi Foundation grew out of work already underway — a founding trustee and a small team of social workers active in health, education and child welfare around Sangli, who formalised that work into a registered society in 2017.",
    "That founding decision shapes how the Foundation still operates today: programmes are run as long-term commitments — a Balwadi, a partner children's home, ongoing support for senior citizens — rather than campaigns built around a single fundraising moment.",
  ].join("\n\n"),
  note: "A fuller founder profile — background, photograph and a first-person note — is on its way. If you're reading this from within the Foundation, this section is ready for that content.",
};
