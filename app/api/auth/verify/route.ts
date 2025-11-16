import { NextRequest, NextResponse } from "next/server";

/**
 * Verify GitHub OAuth token and check if user is authorized.
 * POST /api/auth/verify
 * Body: { token: string } (GitHub OAuth access token)
 * Returns: { authorized: boolean, username: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { authorized: false, error: "Missing token" },
        { status: 400 }
      );
    }

    // Verify token with GitHub API and get user info
    const githubRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!githubRes.ok) {
      return NextResponse.json(
        { authorized: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const user = await githubRes.json();
    const username = user.login;

    // List of authorized GitHub usernames (from environment or hardcoded)
    // For security, store in environment variable in production
    const authorizedUsers = (
      process.env.AUTHORIZED_GITHUB_USERS || "59n"
    )
      .split(",")
      .map((u) => u.trim());

    console.log(
      `[Auth] Verifying user "${username}" against authorized list: ${authorizedUsers.join(", ")}`
    );

    const isAuthorized = authorizedUsers.includes(username);

    return NextResponse.json({
      authorized: isAuthorized,
      username,
    });
  } catch (error) {
    console.error("Auth verification error:", error);
    return NextResponse.json(
      { authorized: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
