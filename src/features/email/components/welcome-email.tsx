/**
 * WelcomeEmail — sent after a user successfully registers.
 *
 * @example
 * <WelcomeEmail
 *   userName="John"
 *   userEmail="john@example.com"
 *   loginUrl="https://app.example.com/login"
 * />
 */

import React from "react";
import { EMAIL_BRANDING } from "../constants";
import type { WelcomeEmailProps } from "../types";

export function WelcomeEmail({
  userName,
  userEmail,
  loginUrl,
}: WelcomeEmailProps) {
  return (
    <div>
      <h1 style={headingStyle}>
        Welcome, {userName}!
      </h1>

      <p style={paragraphStyle}>
        We&rsquo;re thrilled to have you on board. Your account has been created
        successfully, and you can now start exploring everything{" "}
        {EMAIL_BRANDING.APP_NAME} has to offer.
      </p>

      <table width="100%" cellPadding="0" cellSpacing="0" style={ctaTableStyle}>
        <tbody>
          <tr>
            <td align="center">
              <a href={loginUrl} style={buttonStyle} target="_blank">
                Get Started
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <p style={paragraphStyle}>
        If the button above doesn&rsquo;t work, copy and paste the following
        URL into your browser:
      </p>

      <p style={urlStyle}>{loginUrl}</p>

      <hr style={dividerStyle} />

      <p style={helpTextStyle}>
        If you didn&rsquo;t create an account, please ignore this email.
      </p>

      <p style={detailStyle}>
        <strong>Email:</strong> {userEmail}
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
  margin: "0 0 8px",
};

const detailStyle: React.CSSProperties = {
  color: "#71717a",
  fontSize: "14px",
  lineHeight: "20px",
  margin: 0,
};
