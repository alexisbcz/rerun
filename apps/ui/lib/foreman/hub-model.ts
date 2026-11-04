import 'server-only'

// The key the onboarding foreman runs on, here on the hub. A self-hosted install without one walks
// no onboarding: its workspaces go straight to the foreman on their engine, which runs on whatever
// the workspace connects, a Claude or ChatGPT subscription included.
export function hubForemanApiKey(): string | undefined {
    return process.env.RERUN_MAX_API_KEY || process.env.OPENROUTER_API_KEY || undefined
}
