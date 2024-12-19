
// middleware.ts
import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const isOnboardingRoute = createRouteMatcher(['/onboarding']);
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/', '/api/webhooks(.*)', '/profile/(.*)']);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();


  // Allow access to the onboarding route itself
  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  // If the user is not signed in and tries to access a protected route, redirect to sign-in
  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  if (userId) {
    const userPublicData = (await (await clerkClient()).users.getUser(userId)).publicMetadata.onboardingComplete
    if (!userPublicData) {
      const onboardingUrl = new URL('/onboarding', req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }
  

  // Check if onboarding is complete via metadata; if not, redirect to onboarding
  // if (userId && !sessionClaims?.metadata?.onboardingComplete) {
  //   const onboardingUrl = new URL('/onboarding', req.url);
  //   return NextResponse.redirect(onboardingUrl);
  // }

  // Allow access to protected routes if user is logged in and has completed onboarding
  if (userId && !isPublicRoute(req)) {
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    '/((?!_next|(?:[^?]*\\.(?:html?|css|js|jpe?g|png|svg|ico))).*)',
    '/(api|trpc)(.*)',
  ],
}