export default function AlertBox({ items, t }) {
  if (!items || !items.length) return null;
  return (
    <div
      style={{
        background: t.pending.bg,
        border: `0.5px solid ${t.pending.text}30`,
        borderRadius: 10,
        padding: "12px 16px",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: t.pending.text,
          marginBottom: 8,
        }}
      >
        تنبيهات تحتاج متابعة
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            fontSize: 13,
            color: t.text,
            padding: "3px 0",
            display: "flex",
            gap: 8,
          }}
        >
          <span style={{ color: t.pending.text }}>&#x2022;</span> {item}
        </div>
      ))}
    </div>
  );
}
