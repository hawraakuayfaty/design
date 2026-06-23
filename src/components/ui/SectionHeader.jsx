export default function SectionHeader({ title, subtitle, action, onAction, t }) {
  const shadow =
    t.bgPage === "#020817"
      ? "0 18px 40px rgba(2, 8, 23, 0.34)"
      : "0 18px 24px rgba(15, 23, 42, 0.08)";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            color: t.text,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ margin: "6px 0 0", fontSize: 14, color: t.textSec }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <button
          onClick={onAction}
          style={{
            background: "#778a3b",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: shadow,
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}
