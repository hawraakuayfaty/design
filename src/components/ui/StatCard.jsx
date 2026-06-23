export default function StatCard({ label, value, color, icon, t }) {
  const shadow =
    t.bgPage === "#020817"
      ? "0 18px 40px rgba(2, 8, 23, 0.34)"
      : "0 18px 24px rgba(15, 23, 42, 0.08)";

  return (
    <div
      style={{
        background: t.bgSurface,
        borderRadius: 18,
        border: `1px solid ${t.borderCard}`,
        padding: "18px 18px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        boxShadow: shadow,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          display: "grid",
          placeItems: "center",
          background: t.accentGradientSoft,
          color: t.accent,
          fontSize: 20,
          lineHeight: 1,
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: t.textMuted }}>{label}</div>
    </div>
  );
}
