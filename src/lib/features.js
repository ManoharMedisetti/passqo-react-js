// MVP feature flags — checked at render time to conditionally hide already-built
// features rather than removing their code/routes. Flip back to `true` to re-enable.
export const FEATURES = {
  // Resale marketplace: fully built & tested, hidden pending Stripe Connect for individual payouts.
  resale: false,
  // Blockchain / on-chain-verified badges and claims.
  blockchain: false,
};

