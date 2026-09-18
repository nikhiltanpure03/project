function BillSummary({ currency, nightlyPrice, nights, advance }) {
  if (!nights) return null;

  return (
    <div className="bill-summary">
      <span>
        {currency}
        {nightlyPrice.toLocaleString()} x {nights} nights
      </span>
      <strong>
        Advance bill: {currency}
        {advance.toLocaleString()}
      </strong>
    </div>
  );
}

// Nikhil Tanpure

export default BillSummary;
