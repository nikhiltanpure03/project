import CardNumberField from "../fields/CardNumberField";
import BillSummary from "../fields/BillSummary";

function PaymentFields({
  card,
  onChange,
  currency,
  nightlyPrice,
  nights,
  advance,
}) {
  return (
    <section className="payment-form-section" aria-label="Payment details">
      <BillSummary
        currency={currency}
        nightlyPrice={nightlyPrice}
        nights={nights}
        advance={advance}
      />
      <CardNumberField value={card} onChange={onChange} />
    </section>
  );
}

export default PaymentFields;
