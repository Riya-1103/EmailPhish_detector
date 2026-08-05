import { useState } from "react";

const SAMPLE_PHISHING = `Subject: Urgent: Your account has been compromised!

Dear Customer,

We have detected suspicious activity on your bank account. Your account has been temporarily suspended for security reasons.

Please click the link below immediately to verify your identity and restore access:
http://secure-bank-verify.xyz/login?ref=urgent

You must verify within 24 hours or your account will be permanently closed.

Enter your username, password, and Social Security Number on the verification page.

Regards,
Security Team
Bank of America Customer Support`;

const SAMPLE_LEGIT = `Subject: Team lunch this Friday

Hi everyone,

Just a reminder that we're doing a team lunch this Friday at 12:30pm at the Italian place on 5th Street.

Please let me know by Wednesday if you can make it so I can give the restaurant an accurate headcount.

Looking forward to seeing everyone!

Best,
Sarah`;

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f6fa",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    padding: "2rem 1rem",
  },
  container: {
    maxWidth: 720,
    margin: "0 auto",
  },
  header: {
    background: "#fff",
    borderRadius: 16,
    padding: "1.5rem 2rem",
    marginBottom: 20,
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    borderLeft: "5px solid #2563eb",
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  headerIcon: {
    fontSize: 36,
  },
  headerTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#1e293b",
    letterSpacing: "-0.3px",
  },
  headerSub: {
    margin: "4px 0 0",
    fontSize: 13,
    color: "#64748b",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "1.5rem",
    marginBottom: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: 10,
  },
  sampleBtns: {
    display: "flex",
    gap: 8,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  sampleBtn: {
    padding: "5px 14px",
    fontSize: 13,
    borderRadius: 8,
    border: "1.5px solid #e2e8f0",
    background: "#f8fafc",
    color: "#475569",
    cursor: "pointer",
    fontWeight: 500,
    transition: "all 0.15s",
  },
  textarea: {
    width: "100%",
    minHeight: 180,
    fontSize: 14,
    padding: "12px 14px",
    borderRadius: 10,
    border: "1.5px solid #e2e8f0",
    background: "#f8fafc",
    color: "#1e293b",
    resize: "vertical",
    boxSizing: "border-box",
    lineHeight: 1.7,
    outline: "none",
    fontFamily: "inherit",
    transition: "border 0.2s",
  },
  analyzeBtn: {
    width: "100%",
    padding: "12px 0",
    fontSize: 15,
    fontWeight: 600,
    background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    marginTop: 10,
    letterSpacing: "0.2px",
    boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
    transition: "opacity 0.2s",
  },
  analyzeBtnDisabled: {
    background: "#e2e8f0",
    color: "#94a3b8",
    boxShadow: "none",
    cursor: "not-allowed",
  },
  verdictCard: (verdict) => ({
    background: verdict === "Phishing" ? "#ffe5e5": verdict === "Suspicious" ? "#f8f8d4": "#d4f5e0",
    border: verdict === "Phishing" ? "1px solid red": verdict === "Suspicious"? "1px solid yellow": "1px solid green",
    borderRadius: 16,
    padding: "1.5rem",
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 18,
    boxShadow: verdict === "Phishing"
      ? "0 2px 16px rgba(239,68,68,0.08)"
      : "0 2px 16px rgba(195, 207, 199, 0.08)",
  }),
  verdictIcon: (verdict) => ({
    fontSize: 48,
    lineHeight: 1,
  }),
  verdictLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: 4,
  },
  verdictText: (verdict) => ({
    fontSize: 26,
    fontWeight: 700,
    color:verdict === "Phishing" ? "#fa4e4e" : verdict === "Suspicious" ? "#f7da39" : "green",
    margin: "0 0 4px",
  }),
  verdictSummary: {
    fontSize: 13,
    color: "#475569",
    margin: 0,
    lineHeight: 1.5,
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    background: "#fff",
    borderRadius: 12,
    padding: "1rem",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
  },
  metricVal: {
    fontSize: 18,
    fontWeight: 700,
    color: "#2563eb",
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: 600,
  },
  gaugeCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "1.25rem 1.5rem",
    marginBottom: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    display: "flex",
    alignItems: "center",
    gap: 24,
  },
  signalsCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "1.25rem 1.5rem",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },
  signalRow: (type) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "10px 14px",
    borderRadius: 10,
    marginBottom: 8,
    background:
      type === "danger" ? "#fff5f5" : type === "warning" ? "#fffbeb" : "#f0fdf4",
    border: `1px solid ${
      type === "danger" ? "#fecaca" : type === "warning" ? "#fde68a" : "#bbf7d0"
    }`,
  }),
  signalIcon: (type) => ({
    fontSize: 18,
    color:
      type === "danger" ? "#dc2626" : type === "warning" ? "#d97706" : "#16a34a",
    flexShrink: 0,
    marginTop: 1,
  }),
  signalLabel: (type) => ({
    fontSize: 13,
    fontWeight: 600,
    color:
      type === "danger" ? "#dc2626" : type === "warning" ? "#92400e" : "#15803d",
    marginBottom: 2,
  }),
  signalValue: {
    fontSize: 12,
    color: "#64748b",
  },
  error: {
    background: "#fff5f5",
    border: "1.5px solid #fca5a5",
    borderRadius: 10,
    padding: "12px 16px",
    color: "#dc2626",
    fontSize: 14,
    marginTop: 12,
  },
};

const polarToXY = (deg, r) => {
  const rad = (deg - 180) * Math.PI / 180;
  return { x: 110 + r * Math.cos(rad), y: 100 + r * Math.sin(rad) };
};
const arc = (startDeg, endDeg, r) => {
  const s = polarToXY(startDeg, r);
  const e = polarToXY(endDeg, r);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
};

export default function App() {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!emailText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const resp = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_text: emailText }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError("Analysis failed: " + e.message);
    }
    setLoading(false);
  };

  const verdict = result?.verdict;
  const isPhishing = verdict === "Phishing";
  const isSuspicious = verdict === "Suspicious";
  const isLegitimate = verdict === "Legitimate";
  const gauge = result ? result.confidence : 0;
  const arcColor = result ? (isPhishing ? "#dc2626" :isSuspicious? "#fdd831": "#16a34a") : "#cbd5e1";
  const needleAngle = gauge * 1.8;
  const needleTip = polarToXY(needleAngle, 62);

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.headerIcon}>🛡️</span>
          <div>
            <h1 style={styles.headerTitle}>Phishing Email Detector</h1>
            <p style={styles.headerSub}>
              Logistic Regression · TF-IDF (5,000 features) · Adaptive confidence Threshold  · 98% Accuracy
            </p>
          </div>
        </div>

        {/* Input Card */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>Email Input</div>
          <div style={styles.sampleBtns}>
            <button style={styles.sampleBtn} onClick={() => setEmailText(SAMPLE_PHISHING)}>
              🎣 Load Phishing Sample
            </button>
            <button style={styles.sampleBtn} onClick={() => setEmailText(SAMPLE_LEGIT)}>
              ✉️ Load Legitimate Sample
            </button>
            <button style={styles.sampleBtn} onClick={() => { setEmailText(""); setResult(null); setError(null); }}>
              🗑 Clear
            </button>
          </div>
          <textarea
            value={emailText}
            onChange={e => setEmailText(e.target.value)}
            placeholder="Paste the full email here (subject line, body, sender info)..."
            style={styles.textarea}
          />
          <button
            onClick={analyze}
            disabled={loading || !emailText.trim()}
            style={{ ...styles.analyzeBtn, ...(loading || !emailText.trim() ? styles.analyzeBtnDisabled : {}) }}
          >
            {loading ? "⏳ Analyzing..." : "🔍 Analyze Email"}
          </button>
          {error && <div style={styles.error}>⚠ {error}</div>}
        </div>

        {/* Results */}
        {result && (
          <>
            {/* Verdict */}
            <div style={styles.verdictCard(verdict)}>
              <span style={styles.verdictIcon(verdict)}>
                {isPhishing ? "🚨" :isSuspicious ? "⚠️": "✅"}
              </span>
              <div>
                <div style={styles.verdictLabel}>Verdict</div>
                <div style={styles.verdictText(verdict)}>
                  {isPhishing ? "Phishing Detected" :isSuspicious ? "Suspicious Email" : "Legitimate Email"}
                </div>
                <p style={styles.verdictSummary}>{result.summary}</p>
              </div>
            </div>

            {/* Metrics */}
            <div style={styles.metricsGrid}>
              {[
                { label: "Confidence", val: `${result.confidence}%` },
                { label: "Threshold", val: result.threshold },
                { label: "Risk level", val: result.risk_level },
                { label: "Model", val: "Log. Reg." },
              ].map(m => (
                <div key={m.label} style={styles.metricCard}>
                  <div style={styles.metricVal}>{m.val}</div>
                  <div style={styles.metricLabel}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Gauge */}
            <div style={styles.gaugeCard}>
              <svg viewBox="0 0 220 120" width={200} aria-label={`Confidence: ${gauge}%`}>
                <path d={arc(0, 180, 72)} fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round" />
                <path d={arc(0, gauge * 1.8, 72)} fill="none" stroke={arcColor} strokeWidth="14" strokeLinecap="round" />
                <line x1="110" y1="100" x2={needleTip.x} y2={needleTip.y} stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="110" cy="100" r="5" fill="#334155" />
                <text x="110" y="86" textAnchor="middle" fontSize="22" fontWeight="700" fill={arcColor}>{gauge}%</text>
                <text x="28" y="114" fontSize="10" fill="#94a3b8">0%</text>
                <text x="178" y="114" fontSize="10" textAnchor="end" fill="#94a3b8">100%</text>
              </svg>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Confidence Score</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>
                  <div> Model: <strong>Logistic Regression</strong></div>
                  <div> Features: <strong>TF-IDF (5,000)</strong></div>
                  <div> Threshold: <strong>{result.threshold}</strong></div>
                  <div> Training set: <strong>70,000 emails</strong></div>
                </div>
              </div>
            </div>

            {/* Signals */}
            <div style={styles.signalsCard}>
              <div style={styles.cardTitle}>Detected Signals</div>
              {result.signals?.map((s, i) => (
                <div key={i} style={styles.signalRow(s.type)}>
                  <span style={styles.signalIcon(s.type)}>
                    {s.type === "danger" ? "⚠" : s.type === "warning" ? "◆" : "✓"}
                  </span>
                  <div>
                    <div style={styles.signalLabel(s.type)}>{s.label}</div>
                    <div style={styles.signalValue}>{s.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}