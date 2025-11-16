import { NextRequest, NextResponse } from "next/server";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "Ov23lirlZfaNhvVDjECH";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

/**
 * Exchange GitHub OAuth code for access token.
 * POST /api/auth/github-token
 * Body: { code: string }
 * Returns: { token: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 }
      );
    }

    if (!GITHUB_CLIENT_SECRET) {
      console.error(
        "GITHUB_CLIENT_SECRET not set. Token exchange will fail in production."
      );
      return NextResponse.json(
        { error: "Server not configured for OAuth token exchange" },
        { status: 500 }
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      console.error("GitHub token exchange failed:", tokenResponse.status);
      return NextResponse.json(
        { error: "Failed to exchange token with GitHub" },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("GitHub OAuth error:", tokenData.error);
      return NextResponse.json(
        { error: tokenData.error_description || "GitHub OAuth failed" },
        { status: 401 }
      );
    }

    const token = tokenData.access_token;

    if (!token) {
      console.error("No access token in GitHub response");
      return NextResponse.json(
        { error: "No access token received" },
        { status: 500 }
      );
    }

    console.log("[GitHub OAuth] Successfully exchanged code for token");

    return NextResponse.json({ token });
  } catch (error) {
    console.error("[GitHub OAuth] Error:", error);
    return NextResponse.json(
      { error: "Token exchange failed" },
      { status: 500 }
    );
  }
}
