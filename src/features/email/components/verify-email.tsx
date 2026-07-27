/**
 * VerifyEmail — sent after registration to confirm the user's email address.
 *
 * @example
 * <VerifyEmail
 *   userName="John"
 *   userEmail="john@example.com"
 *   verifyUrl="https://app.example.com/verify-email?token=abc123"
 *   expiresInMinutes={1440}
 * />
 */

import React from "react";
import { EMAIL_BRANDING, EMAIL_EXPIRY_TEXT } from "../constants";
import type { VerifyEmailProps } from "../types";

export function VerifyEmail({
  userName,
  userEmail,
  verifyUrl,
  expiresInMinutes = 1440,
}: VerifyEmailProps) {
  const expiresDisplay =
    expiresInMinutes >= 1440
      ? `${expiresInMinutes / 1440} day(s)`
      : `${expiresInMinutes} minute(s)`;

  return (
    <div>
      <h1 style={headingStyle}>Verify your email address</h1>

      <p style={paragraphStyle}>Hi {userName},</p>

      <p style={paragraphStyle}>
        Thanks for creating an account with {EMAIL_BRANDING.APP_NAME}! Please
        verify your email address by clicking the button below.
      </p>

      <table width="100%" cellPadding="0" cellSpacing="0" style={ctaTableStyle}>
        <tbody>
          <tr>
            <td align="center">
              <a href={verifyUrl} style={buttonStyle} target="_blank">
                Verify Email
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={warningBoxStyle}
      >
        <tbody>
          <tr>
            <td style={warningCellStyle}>
              <p style={warningTextStyle}>
                ⏳ {EMAIL_EXPIRY_TEXT.VERIFY_LINK}{" "}
                <strong>{expiresDisplay}</strong>.
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <p style={paragraphStyle}>
        If the button doesn&rsquo;t work, copy and paste this URL into your
        browser:
      </p>

      <p style={urlStyle}>{verifyUrl}</p>

      <hr style={dividerStyle} />

      <p style={helpTextStyle}>
        If you didn&rsquo;t create an account, you can safely ignore this
        email. No further action is needed.
      </p>
    </div>
  );
}

// ─── Inline Styles ─────────────────────────────────

const headingStyle: React.CSSProperties = {
  color: "#18181b",
  fontSize: "24px",
  fontWeight: 700,
  lineHeight: "32px",
  margin: "0 0 16px",
};

const paragraphStyle: React.CSSProperties = {
  color: "#3f3f46",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const ctaTableStyle: React.CSSProperties = {
  margin: "24px 0",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#18181b",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: "48px",
  padding: "0 32px",
  textAlign: "center" as const,
  textDecoration: "none",
};

const warningBoxStyle: React.CSSProperties = {
  margin: "24px 0",
};

const warningCellStyle: React.CSSProperties = {
  backgroundColor: "#dbeafe",
  borderRadius: "6px",
  padding: "12px 16px",
};

const warningTextStyle: React.CSSProperties = {
  color: "#1e40af",
  fontSize: "14px",
  lineHeight: "20px",
  margin: 0,
};

const urlStyle: React.CSSProperties = {
  color: "#71717a",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 16px",
  wordBreak: "break-all",
};

const dividerStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #e4e4e7",
  margin: "24px 0",
};

const helpTextStyle: React.CSSProperties = {
  color: "#a1a1aa",
  fontSize: "14px",
  lineHeight: "20px",
  margin: 0,
};
