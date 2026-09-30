import * as React from "react";

export type FolioEmailType =
  | "welcome"
  | "account_suspended"
  | "borrow_cancelled";

interface EmailTemplateProps {
  firstName: string;
  type?: FolioEmailType;
  bookTitle?: string;
  reason?: string;
}

function contentFor(type: FolioEmailType, firstName: string, bookTitle?: string, reason?: string) {
  if (type === "account_suspended") {
    return {
      headline: `Hi ${firstName}, your account was deactivated`,
      intro:
        "Your Folio account has been suspended by an administrator. You will not be able to borrow or reserve books until it is reactivated.",
      detail:
        "If you think this was a mistake, reply to this email or contact the library staff for help.",
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
    };
  }

  return {
    headline: `Welcome, ${firstName}!`,
    intro:
      "Discover, borrow, and connect with a community of passionate readers.",
    detail:
      "Your Folio account is ready. Sign in anytime and start building your shelf.",
  };
}

export function EmailTemplate({
  firstName,
  type = "welcome",
  bookTitle,
  reason,
}: EmailTemplateProps) {
  const copy = contentFor(type, firstName, bookTitle, reason);

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
