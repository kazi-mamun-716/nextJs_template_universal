/**
 * EmailWrapper — base layout for all transactional emails.
 *
 * Provides a consistent structure: header banner, main content area,
 * and footer with branding, social info, and unsubscribe hint.
 *
 * Rendered to HTML via ReactDOMServer.renderToString at send-time.
 *
 * @example
 * ```tsx
 * <EmailWrapper>
 *   <WelcomeEmail {...props} />
 * </EmailWrapper>
 * ```
 */

import React from "react";
import { EMAIL_BRANDING } from "../constants";

export interface EmailWrapperProps {
  children: React.ReactNode;
  /** Optional preview text shown in email clients. */
  previewText?: string;
}

export function EmailWrapper({ children, previewText }: EmailWrapperProps) {
  const year = new Date().getFullYear();

  return (
    <html>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        {previewText && (
          <meta name="description" content={previewText} />
        )}
      </head>
      <body style={bodyStyle}>
        {previewText && (
          <div style={previewTextStyle}>
            {previewText}
            &zwnj;&nbsp;&zwnj;
          </div>
        )}

        <table
          align="center"
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={outerTableStyle}
        >
          <tbody>
            <tr>
              <td align="center" style={outerCellStyle}>
                {/* Container */}
                <table
                  width="600"
                  cellPadding="0"
                  cellSpacing="0"
                  style={containerStyle}
                >
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td style={headerStyle}>
                        <table width="100%" cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td style={headerTitleStyle}>
                                {EMAIL_BRANDING.APP_NAME}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Main Content */}
                    <tr>
                      <td style={contentStyle}>{children}</td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td style={footerStyle}>
                        <table width="100%" cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td style={footerTextStyle}>
                                <p style={footerTaglineStyle}>
                                  {EMAIL_BRANDING.TAGLINE}
                                </p>
                                <p style={footerCopyStyle}>
                                  &copy; {year} {EMAIL_BRANDING.APP_NAME}.
                                  All rights reserved.
                                </p>
                                <p style={footerDisclaimerStyle}>
                                  If you did not request this email, you can
                                  safely ignore it.
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

// ─── Inline Styles ─────────────────────────────────
// React Email components typically use inline styles
// for maximum email client compatibility.

const bodyStyle: React.CSSProperties = {
  backgroundColor: "#f4f5f7",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: 0,
  padding: 0,
  WebkitFontSmoothing: "antialiased",
};

const previewTextStyle: React.CSSProperties = {
  display: "none",
  fontSize: "1px",
  lineHeight: "1px",
  maxHeight: "0px",
  maxWidth: "0px",
  opacity: 0,
  overflow: "hidden",
  // @ts-expect-error: mso-hide is an Outlook-specific CSS property
  "msoHide": "all",
};

const outerTableStyle: React.CSSProperties = {
  backgroundColor: "#f4f5f7",
  width: "100%",
};

const outerCellStyle: React.CSSProperties = {
  padding: "40px 16px",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "600px",
  borderCollapse: "separate",
  borderSpacing: 0,
};

const headerStyle: React.CSSProperties = {
  backgroundColor: "#18181b",
  borderRadius: "8px 8px 0 0",
  padding: "32px 40px",
};

const headerTitleStyle: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: 700,
  lineHeight: "28px",
};

const contentStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "32px 40px",
};

const footerStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  borderRadius: "0 0 8px 8px",
  padding: "24px 40px",
};

const footerTextStyle: React.CSSProperties = {
  textAlign: "center" as const,
};

const footerTaglineStyle: React.CSSProperties = {
  color: "#71717a",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 8px",
  fontStyle: "italic",
};

const footerCopyStyle: React.CSSProperties = {
  color: "#a1a1aa",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 4px",
};

const footerDisclaimerStyle: React.CSSProperties = {
  color: "#a1a1aa",
  fontSize: "12px",
  lineHeight: "18px",
  margin: 0,
};
