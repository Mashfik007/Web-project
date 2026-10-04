import * as React from "react";

export type FolioEmailType =
  | "welcome"
  | "account_suspended"
  | "borrow_cancelled"
  | "payment_verification";

export type PaymentEmailDetails = {
  transactionId?: string;
  orderNumber?: string;
  amount?: string;
  paymentMethod?: string;
  paymentPhone?: string;
  buyerName?: string;
  buyerEmail?: string;
};

interface EmailTemplateProps extends PaymentEmailDetails {
  firstName: string;
  type?: FolioEmailType;
  bookTitle?: string;
  reason?: string;
}

function contentFor(
  type: FolioEmailType,
  firstName: string,
  bookTitle?: string,
  reason?: string,
  payment?: PaymentEmailDetails,
) {
  if (type === "account_suspended") {
    return {
      headline: `Hi ${firstName}, your account was deactivated`,
      intro:
        "Your Folio account has been suspended by an administrator. You will not be able to borrow or reserve books until it is reactivated.",
      detail:
        "If you think this was a mistake, reply to this email or contact the library staff for help.",
      payment: null as PaymentEmailDetails | null,
    };
  }

  if (type === "borrow_cancelled") {
    const bookLine = bookTitle ? `"${bookTitle}"` : "your book request";
    return {
      headline: `Hi ${firstName}, your book was cancelled`,
      intro: `Your request for ${bookLine} was cancelled by an administrator.`,
      detail: reason
        ? `Reason: ${reason}`
        : "You can browse Folio anytime and request another copy when available.",
      payment: null as PaymentEmailDetails | null,
    };
  }

  if (type === "payment_verification") {
    const bookLine = bookTitle ? `"${bookTitle}"` : "a book";
    const buyer =
      payment?.buyerName || payment?.buyerEmail
        ? ` Buyer: ${[payment.buyerName, payment.buyerEmail].filter(Boolean).join(" · ")}.`
        : "";
    return {
      headline: `Hi ${firstName}, payment verification`,
      intro: `A Folio purchase for ${bookLine} needs verification.${buyer}`,
      detail:
        "Use the Transaction ID below to confirm this payment in bKash/Rocket, then process the order.",
      payment: {
        transactionId: payment?.transactionId,
        orderNumber: payment?.orderNumber,
        amount: payment?.amount,
        paymentMethod: payment?.paymentMethod,
        paymentPhone: payment?.paymentPhone,
        buyerName: payment?.buyerName,
        buyerEmail: payment?.buyerEmail,
      },
    };
  }

  return {
    headline: `Welcome, ${firstName}!`,
    intro:
      "Discover, borrow, and connect with a community of passionate readers.",
    detail:
      "Your Folio account is ready. Sign in anytime and start building your shelf.",
    payment: null as PaymentEmailDetails | null,
  };
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td
        style={{
          padding: "8px 0",
          fontSize: "13px",
          color: "#64748b",
          width: "40%",
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: "8px 0",
          fontSize: "14px",
          fontWeight: 600,
          color: "#0f172a",
          textAlign: "right" as const,
        }}
      >
        {value}
      </td>
    </tr>
  );
}

export function EmailTemplate({
  firstName,
  type = "welcome",
  bookTitle,
  reason,
  transactionId,
  orderNumber,
  amount,
  paymentMethod,
  paymentPhone,
  buyerName,
  buyerEmail,
}: EmailTemplateProps) {
  const copy = contentFor(type, firstName, bookTitle, reason, {
    transactionId,
    orderNumber,
    amount,
    paymentMethod,
    paymentPhone,
    buyerName,
    buyerEmail,
  });

  return (
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={{
        margin: 0,
        padding: "32px 16px",
        backgroundColor: "#f8fafc",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#0f172a",
      }}
    >
      <tbody>
        <tr>
          <td align="center">
            <table
              width="480"
              cellPadding="0"
              cellSpacing="0"
              role="presentation"
              style={{
                width: "100%",
                maxWidth: "480px",
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "28px 32px",
                      backgroundColor: "#0ea5e9",
                      color: "#ffffff",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 20px",
                        fontSize: "20px",
                        fontWeight: 700,
                        fontFamily: "Georgia, Times New Roman, serif",
                      }}
                    >
                      Folio
                    </p>
                    <h1
                      style={{
                        margin: 0,
                        fontSize: "26px",
                        lineHeight: "1.3",
                        fontWeight: 700,
                        fontFamily: "Georgia, Times New Roman, serif",
                        color: "#0f172a",
                      }}
                    >
                      {copy.headline}
                    </h1>
                    <p
                      style={{
                        margin: "12px 0 0",
                        fontSize: "15px",
                        lineHeight: "1.6",
                        color: "#ffffff",
                      }}
                    >
                      {copy.intro}
                    </p>
                  </td>
                </tr>
                {copy.payment?.transactionId ? (
                  <tr>
                    <td style={{ padding: "24px 32px 0" }}>
                      <table
                        width="100%"
                        cellPadding="0"
                        cellSpacing="0"
                        role="presentation"
                        style={{
                          backgroundColor: "#f0f9ff",
                          border: "1px solid #bae6fd",
                          borderRadius: "8px",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td style={{ padding: "16px 20px" }}>
                              <p
                                style={{
                                  margin: "0 0 6px",
                                  fontSize: "12px",
                                  color: "#0284c7",
                                  textTransform: "uppercase" as const,
                                  letterSpacing: "0.04em",
                                }}
                              >
                                Transaction ID
                              </p>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "22px",
                                  fontWeight: 700,
                                  fontFamily: "Courier New, monospace",
                                  color: "#0f172a",
                                  letterSpacing: "0.06em",
                                }}
                              >
                                {copy.payment.transactionId}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table
                        width="100%"
                        cellPadding="0"
                        cellSpacing="0"
                        role="presentation"
                        style={{ marginTop: "16px" }}
                      >
                        <tbody>
                          {copy.payment.orderNumber ? (
                            <DetailRow
                              label="Order"
                              value={copy.payment.orderNumber}
                            />
                          ) : null}
                          {copy.payment.amount ? (
                            <DetailRow
                              label="Amount"
                              value={copy.payment.amount}
                            />
                          ) : null}
                          {copy.payment.paymentMethod ? (
                            <DetailRow
                              label="Method"
                              value={copy.payment.paymentMethod}
                            />
                          ) : null}
                          {copy.payment.paymentPhone ? (
                            <DetailRow
                              label="Paid from"
                              value={copy.payment.paymentPhone}
                            />
                          ) : null}
                          {copy.payment.buyerName ? (
                            <DetailRow
                              label="Buyer"
                              value={copy.payment.buyerName}
                            />
                          ) : null}
                          {copy.payment.buyerEmail ? (
                            <DetailRow
                              label="Buyer email"
                              value={copy.payment.buyerEmail}
                            />
                          ) : null}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <td style={{ padding: "28px 32px" }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        lineHeight: "1.6",
                        color: "#64748b",
                      }}
                    >
                      {copy.detail}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
