export const Payload = (rawPayload: RawPayload, meta?: PayloadMetaConfig): PayloadInstance => {
    const { data = {}, query = {} } = rawPayload

    const payload = {
        query,
        data,
        meta: meta || {},
    }

    const payloadProxy = new Proxy(payload, {}) as unknown as PayloadInstance
    return payloadProxy
}