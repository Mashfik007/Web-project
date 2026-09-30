import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
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
                        fontSize: "28px",
                        lineHeight: "1.3",
                        fontWeight: 700,
                        fontFamily: "Georgia, Times New Roman, serif",
                        color: "#0f172a",
                      }}
                    >
                      Welcome, {firstName}!
                    </h1>
                    <p
                      style={{
                        margin: "12px 0 0",
                        fontSize: "15px",
                        lineHeight: "1.6",
                        color: "#ffffff",
                      }}
                    >
                      Discover, borrow, and connect with a community of
                      passionate readers.
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
                      Your Folio account is ready. Sign in anytime and start
                      building your shelf.
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
