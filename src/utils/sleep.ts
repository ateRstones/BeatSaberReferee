export default function sleep(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
        try { setTimeout(resolve, ms) }
        catch (err) { reject(err) }
    })
}