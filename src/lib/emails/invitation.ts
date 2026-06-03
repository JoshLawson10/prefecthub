export function getInvitationEmailTemplate(params: {
  inviterName: string;
  workspaceName: string;
  role: string;
  inviteUrl: string;
  expiresIn: number;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>You're invited to join PrefectHub</title>
        <style>
          /* Your styles here - same as above */
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">PrefectHub</div>
            <div class="tagline">Event Management for Prefect Teams</div>
          </div>
          <div class="content">
            <div class="greeting">You're invited! 🎉</div>
            <p class="message">
              <strong>${params.inviterName}</strong> has invited you to join their team on 
              PrefectHub — a modern platform built specifically for school prefect teams 
              to organize events, manage tasks, and track RSVPs.
            </p>
            <div class="highlight">
              <p style="margin: 0; color: #d4d4d8; font-size: 14px;">
                <strong style="color: #f4f4f5;">Workspace:</strong> ${params.workspaceName}<br/>
                <strong style="color: #f4f4f5;">Role:</strong> ${params.role}<br/>
                <strong style="color: #f4f4f5;">Expires:</strong> ${params.expiresIn} days
              </p>
            </div>
            <div style="text-align: center; margin: 36px 0;">
              <a href="${params.inviteUrl}" class="cta-button">
                Accept Invitation & Set Up Account
              </a>
            </div>
            <p class="message" style="font-size: 14px; color: #71717a;">
              If the button doesn't work, copy and paste this link into your browser:<br/>
              <span style="color: #006645; word-break: break-all;">${params.inviteUrl}</span>
            </p>
          </div>
          <div class="footer">
            <p>© 2026 PrefectHub. All rights reserved.</p>
            <p style="margin-top: 8px;">
              You received this email because you were invited to join PrefectHub. 
              If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
