'use client'

import { RERUN_CONNECTION_ID } from '@rerun/contracts'
import { useEffect, useState } from 'react'

import { rerunModelsServedAction } from '@/app/api/_actions/workspace-connection.actions'
import { Button } from '@/components/ui/button'
import { useWorkspaceConnections } from '@/hooks/useWorkspaceConnections'
import { ProviderIcon } from '@/lib/engine/provider-icons'
import { useWorkspaceSettingsStore } from '@/stores/workspace-settings.store'

// A workspace with nothing but the Rerun models, on an install that cannot serve them: whatever is
// sent to the foreman fails, so the composer gives way to connecting a model of its own.
export function useForemanNeedsConnection(onEngine: boolean): boolean {
    const [rerunServed, setRerunServed] = useState<boolean | null>(null)
    const { connections, loading } = useWorkspaceConnections()

    useEffect(() => {
        if (!onEngine) return
        let cancelled = false
        void rerunModelsServedAction().then(served => {
            if (!cancelled) setRerunServed(served)
        })
        return () => {
            cancelled = true
        }
    }, [onEngine])

    if (!onEngine || loading || rerunServed !== false) return false
    return !connections.some(connection => connection.id !== RERUN_CONNECTION_ID && connection.connected)
}

export function ForemanConnectGate() {
    const addAiProvider = useWorkspaceSettingsStore(state => state.addAiProvider)
    const openAiProviders = useWorkspaceSettingsStore(state => state.openAiProviders)

    return (
        <div className="pb-2">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-sm font-medium text-foreground">Connect an AI to get started</p>
                <p className="mt-1 text-xs text-muted-foreground">This install has no key for the Rerun models. Run the Foreman and your coworkers on your Claude Pro or Max plan instead, or on another provider.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => addAiProvider('claude')}>
                        <ProviderIcon provider="claude" />
                        Connect Claude Code
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openAiProviders()}>
                        Other providers
                    </Button>
                </div>
            </div>
        </div>
    )
}
