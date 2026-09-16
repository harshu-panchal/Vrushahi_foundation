import Counter from "@/lib/models/Counter";

export { amountInWords } from "@/lib/utils/numberToWords";

/**
 * Assigns a sequential, year-scoped receipt number (e.g. VF/2026/00042) to a
 * donation the first time it is called for that donation. Uses an atomic
 * $inc on a Counter document so concurrent payments never collide.
 */
export async function assignReceiptNumber(donation) {
  if (donation.receiptNumber) return donation;

  const year = new Date(donation.date || Date.now()).getFullYear();
  const counter = await Counter.findByIdAndUpdate(
    `receipt-${year}`,
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );

  donation.receiptNumber = `VF/${year}/${String(counter.seq).padStart(5, "0")}`;
  return donation;
}
