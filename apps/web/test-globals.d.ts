// test-globals.d.ts
export { }

declare global {
    function mockFetchResponse(args?: {
        status?: number
        ok?: boolean
        data?: any
        headers?: Record<string, string>
    }): Promise<any>
}
