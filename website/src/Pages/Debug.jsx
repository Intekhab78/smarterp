export default function Debug() {
    const logs = JSON.parse(localStorage.getItem("debugLogs") || "[]");

    return (
        <div style={{ padding: 20 }}>
            <h2>Debug Logs</h2>

            <button onClick={() => localStorage.removeItem("debugLogs")}>
                Clear Logs
            </button>

            {logs.length === 0 && <p>No logs yet</p>}

            {logs.map((l, i) => (
                <pre key={i}>{JSON.stringify(l, null, 2)}</pre>
            ))}
        </div>
    );
}