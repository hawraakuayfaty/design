const STATUS_MAP_KEYS = {
  "مؤكد": "confirmed",
  "بانتظار العربون": "pending",
  "ملغي": "cancelled",
  "تم الإثبات": "submitted",
  "مكتمل": "completed",
  "منتهي": "expired",
  "لم يحضر": "noshow",
  "جاري": "inprogress",
  "عادي": "confirmed",
  "أوتوماتيك": "submitted",
  "نشط": "confirmed",
  "غير نشط": "expired",
  "في إجازة": "pending",
  "متاحة": "confirmed",
  "في الصيانة": "pending",
  "غير متاحة": "cancelled",
  "مقبول": "completed",
  "راسب": "cancelled",
  "قيد المتابعة": "pending",
  "مدفوع": "completed",
  "معلق": "pending",
  "داخلي": "confirmed",
  "خارجي": "submitted",
  "ذكر": "confirmed",
  "أنثى": "submitted",
};

export default function Badge({ status, t }) {
  const key = STATUS_MAP_KEYS[status] || "expired";
  const color = t[key] || t.expired;
  return (
    <span
      style={{
        background: color.bg,
        color: color.text,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {status}
    </span>
  );
}
