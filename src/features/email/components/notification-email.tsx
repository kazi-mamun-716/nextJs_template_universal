/**
 * NotificationEmail — generic transactional notification.
 *
 * Can be reused for account updates, security alerts, feature announcements,
 * or any other system notification that doesn't have its own dedicated template.
 *
 * @example
 * <NotificationEmail
 *   userName="John"
 *   userEmail="john@example.com"
 *   title="Security Alert"
 *   message="A new login was detected from an unrecognized device."
 *   cta={{ label: "Review Activity", url: "https://app.example.com/security" }}
 * />
 */

import React from "react";
import { EMAIL_BRANDING } from "../constants";
import type { NotificationEmailProps } from "../types";

export function NotificationEmail({
  userName,
  title,
  message,
  cta,
}: NotificationEmailProps) {
  return (
    <div>
      <h1 style={headingStyle}>{title}</h1>

      <p style={paragraphStyle}>Hi {userName},</p>

      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={messageBoxStyle}
      >
        <tbody>
          <tr>
            <td style={messageCellStyle}>
              <p style={messageTextStyle}>{message}</p>
            </td>
          </tr>
        </tbody>
      </table>

      {cta && (
        <table width="100%" cellPadding="0" cellSpacing="0" style={ctaTableStyle}>
          <tbody>
            <tr>
              <td align="center">
                <a href={cta.url} style={buttonStyle} target="_blank">
                  {cta.label}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      <hr style={dividerStyle} />

      <p style={helpTextStyle}>
        This is an automated notification from {EMAIL_BRANDING.APP_NAME}. If you
        have questions, please contact support.
      </p>
    </div>
  );
}

// ─── Inline Styles ─────────────────────────────────

const headingStyle: React.CSSProperties = {
  color: "#18181b",
  fontSize: "22px",
  fontWeight: 700,
  lineHeight: "30px",
  margin: "0 0 16px",
};

const paragraphStyle: React.CSSProperties = {
  color: "#3f3f46",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const messageBoxStyle: React.CSSProperties = {
  margin: "16px 0",
};

const messageCellStyle: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  borderRadius: "6px",
  padding: "16px",
};

const messageTextStyle: React.CSSProperties = {
  color: "#3f3f46",
  fontSize: "15px",
  lineHeight: "22px",
  margin: 0,
  whiteSpace: "pre-wrap",
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
