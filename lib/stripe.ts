import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-08-16' });

/**
 * Create a Stripe Express connected account for a new advisor.
 * 
 * @param email - The advisor's email address
 * @returns The created Stripe account object
 */
// export async function createConnectedAccount(email: string) {
//   try {
//     const account = await stripe.accounts.create({
//       type: 'express',
//       email: email,
//       business_type: 'individual',
//       capabilities: {
//         transfers: { requested: true },  // Enable transfers for payouts
//       },
//     });

//     return account;
//   } catch (error) {
//     console.error("Error creating Stripe connected account:", error);
//     throw new Error("Unable to create connected account.");
//   }
// }

/**
 * Generate an account link for onboarding or managing a Stripe account.
 * This link allows advisors to complete their Stripe onboarding.
 * 
 * @param accountId - The Stripe connected account ID
 * @param refreshUrl - URL to refresh the onboarding session
 * @param returnUrl - URL to return to after completing the onboarding
 * @returns The URL for the onboarding session
 */
export async function generateAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,  // If onboarding fails, this is where the user will be redirected to retry
      return_url: returnUrl,    // Where the user will be sent after completing the onboarding
      type: 'account_onboarding',
    });

    return accountLink;
  } catch (error) {
    console.error("Error generating account link:", error);
    throw new Error("Unable to generate account link.");
  }
}

/**
 * Create a payment intent for assessing an advisor. This is the charge
 * that users will pay when they request an assessment from an advisor.
 * 
 * @param amount - The amount to be charged (in cents)
 * @param currency - The currency in which to charge (e.g., 'usd')
 * @param connectedAccountId - The advisor's connected Stripe account ID
 * @returns The payment intent object
 */
export async function createPaymentIntent(amount: number, currency: string, connectedAccountId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method_types: ['card'],
      transfer_data: {
        destination: connectedAccountId,  // Send the payment to the advisor's connected account
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw new Error("Unable to create payment intent.");
  }
}

/**
 * Retrieve a connected Stripe account's details.
 * 
 * @param accountId - The Stripe connected account ID
 * @returns The account object with detailed information
 */
export async function retrieveAccount(accountId: string) {
  try {
    const account = await stripe.accounts.retrieve(accountId);
    return account;
  } catch (error) {
    console.error("Error retrieving Stripe account:", error);
    throw new Error("Unable to retrieve account.");
  }
}

export default stripe;
