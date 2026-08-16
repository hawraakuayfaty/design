export default function AccessDenied({ t, message }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "90px 20px",
        textAlign: "center",
        height: "100%",
        flex: 1,
      }}
    >
      <div style={{ fontSize: 42, marginBottom: 14 }}>🔒</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: t.text }}>
        {message || "عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة"}
      </div>
    </div>
  );
}
