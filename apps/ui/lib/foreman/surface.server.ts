import 'server-only'

import { ensureWorkspaceEngine, findWorkspaceEngine } from '@/app/api/_services/workspace-engine.service'
import { hubForemanApiKey } from './hub-model'
import type { ForemanState } from './phase'
import { foremanSurface, type ForemanSurface } from './surface'

export async function resolveForemanSurface(workspaceId: number, state: Pick<ForemanState, 'phase'>): Promise<ForemanSurface> {
    if (state.phase !== 'companion') return 'onboarding'
    if (await findWorkspaceEngine(workspaceId)) return 'engine'
    // The build is what claims the machine, and an install with no onboarding foreman never runs
    // one: the machine is claimed here instead, or the workspace would be left with no foreman at all.
    if (hubForemanApiKey()) return foremanSurface(state.phase, false)
    const claimed = await ensureWorkspaceEngine(workspaceId).catch(err => {
        console.error('[foreman] failed to claim an engine:', err)
        return { ok: false as const }
    })
    return foremanSurface(state.phase, claimed.ok)
}
