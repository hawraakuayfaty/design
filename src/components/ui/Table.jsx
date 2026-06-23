import Badge from "./Badge";

const BADGE_STATUSES = [
  "مؤكد", "بانتظار العربون", "ملغي", "تم الإثبات", "مكتمل",
  "منتهي", "لم يحضر", "جاري", "نشط", "غير نشط", "في إجازة",
  "متاحة", "في الصيانة", "غير متاحة", "مقبول", "راسب",
  "قيد المتابعة", "مدفوع", "معلق", "داخلي", "خارجي",
  "عادي", "أوتوماتيك", "ذكر", "أنثى",
];

export default function Table({ headers, rows, t }) {
  return (
    <div
      style={{
        borderRadius: 10,
        border: `0.5px solid ${t.border}`,
        overflow: "hidden",
      }}
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
      >
        <thead>
          <tr style={{ background: t.bgElevated }}>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: "10px 14px",
                  textAlign: "right",
                  color: t.textMuted,
                  fontWeight: 600,
                  fontSize: 12,
                  borderBottom: `0.5px solid ${t.border}`,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              style={{
                background: ri % 2 === 0 ? t.bgSurface : t.bgPage,
                borderBottom: `0.5px solid ${t.border}`,
              }}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{ padding: "10px 14px", color: t.text, fontSize: 14 }}
                >
                  {typeof cell === "string" && BADGE_STATUSES.includes(cell) ? (
                    <Badge status={cell} t={t} />
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
