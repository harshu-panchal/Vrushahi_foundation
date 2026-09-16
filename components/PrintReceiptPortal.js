"use client";

import { createPortal } from "react-dom";
import DonationReceipt from "./DonationReceipt";

/**
 * Renders a print-only copy of the receipt as a direct child of <body>,
 * outside the page's own layout tree. Printing straight from the inline
 * receipt produced a blank page/PDF because it sits inside several
 * positioned/overflow-hidden sections — putting it here sidesteps all of
 * that. Paired with the print rules in globals.css that hide every other
 * top-level element on the page during print.
 *
 * Safe to call document.body directly here (no mount-check needed): this
 * component only ever renders after a client-side payment success, never
 * during the initial server-rendered/hydration pass.
 */
export default function PrintReceiptPortal({ receipt, amountWords }) {
  return createPortal(
    <div id="donation-receipt-print" className="hidden print:block">
      <DonationReceipt receipt={receipt} amountWords={amountWords} />
    </div>,
    document.body
  );
}
