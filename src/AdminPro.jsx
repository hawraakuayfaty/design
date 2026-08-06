import { useState, useEffect } from "react";
import { todayStr, firstOfMonthStr, currentYearMonth } from "./utils/dateUtils";
import { TbBus } from "react-icons/tb";
import { TbReceiptTax } from "react-icons/tb";
import { PiChartLineDown } from "react-icons/pi";
import { PiChartLineUp } from "react-icons/pi";
import { IoIosCalendar } from "react-icons/io";
import { FaRegAddressCard } from "react-icons/fa";
import { GiAutoRepair } from "react-icons/gi";
import { FaUserTie } from "react-icons/fa";
import { IoIosUnlock } from "react-icons/io";
import { TbReportMoney } from "react-icons/tb";
import { PiUsersThin } from "react-icons/pi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineAttachMoney } from "react-icons/md";
import { PiMedalFill } from "react-icons/pi";
import { employeesService, settingsService, employeeAccountingService } from "./api";
import { FiTrash2 } from "react-icons/fi";
import { LuEye, LuEyeOff } from "react-icons/lu";



const T = {
  light: {
    bgApp: "#F8F9F5",
    bgSurface: "#FFFFFF",
    bgElevated: "#EEF2E4",
    bgSidebar: "linear-gradient(180deg,#778A3B 0%,#6B7C35 52%,#5F702D 100%)",
    bgSidebarActive: "#5F702D",
    text: "#1C1F18",
    textSec: "#4F5548",
    textMuted: "#747A70",
    textSidebar: "#F8F9F5",
    textSidebarActive: "#FFFFFF",
    border: "#DDE1D7",
    borderCard: "rgba(119,124,59,0.14)",
    accent: "#715317",
    accentLight: "#EEF2E4",
    accentText: "#715317",
    grad: "linear-gradient(135deg,#778A3B 0%,#5F702D 100%)",
    completed: { bg: "rgba(63,107,58,0.14)", text: "#3F6B3A", dot: "#3F6B3A" },
    pending: { bg: "rgba(201,124,40,0.14)", text: "#C98A28", dot: "#C98A28" },
    cancelled: { bg: "rgba(199,72,72,0.12)", text: "#C74848", dot: "#C74848" },
    confirmed: { bg: "rgba(119,124,59,0.12)", text: "#5F702D", dot: "#778A3B" },
    expired: { bg: "rgba(183,189,178,0.16)", text: "#747A70", dot: "#B7BDB2" },
    admin: { bg: "rgba(119,124,59,0.10)", text: "#5F702D", dot: "#778A3B" },
    shadow: "0 12px 28px rgba(119,124,59,0.10)",
    shadowLg: "0 20px 48px rgba(119,124,59,0.16)",
  },
  dark: {
    bgApp: "#18181b",
    bgSurface: "#27272a",
    bgElevated: "#2d2d32",
    bgSidebar: "#1f1f23",
    bgSidebarActive: "#778A3B",
    text: "#F4F4F5",
    textSec: "#D4D4D8",
    textMuted: "#A1A1AA",
    textSidebar: "#F4F4F5",
    textSidebarActive: "#FFFFFF",
    border: "rgba(255,255,255,0.08)",
    borderCard: "rgba(255,255,255,0.10)",
    accent: "#A3C45A",
    accentLight: "rgba(119,138,59,0.22)",
    accentText: "#D4EDAA",
    grad: "linear-gradient(135deg,#778A3B 0%,#5F702D 100%)",
    completed: { bg: "rgba(63,107,58,0.26)", text: "#86EFAC", dot: "#86EFAC" },
    pending: { bg: "rgba(201,138,40,0.22)", text: "#F0CB8C", dot: "#F0CB8C" },
    cancelled: { bg: "rgba(199,72,72,0.22)", text: "#FCA5A5", dot: "#FCA5A5" },
    confirmed: { bg: "rgba(119,138,59,0.22)", text: "#D4EDAA", dot: "#D4EDAA" },
    expired: { bg: "rgba(161,161,170,0.14)", text: "#A1A1AA", dot: "#A1A1AA" },
    admin: { bg: "rgba(119,138,59,0.20)", text: "#D4EDAA", dot: "#D4EDAA" },
    shadow: "0 12px 28px rgba(0,0,0,0.40)",
    shadowLg: "0 20px 48px rgba(0,0,0,0.50)",
  },
};

function Badge({s,t}){const m={"نشط":t.completed,"غير نشط":t.expired,"مدير":t.admin,"موظف إداري":t.confirmed,"محاسب":t.pending,"مدرب":{bg:"#FFF7ED",text:"#C2410C",dot:"#F97316"},"موقوف":t.cancelled,"فعّال":t.completed};const c=m[s]||t.expired;return <span style={{display:"inline-flex",alignItems:"center",gap:5,background:c.bg,color:c.text,padding:"2px 9px",borderRadius:20,fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}><span style={{width:6,height:6,borderRadius:"50%",background:c.dot,flexShrink:0}}/>{s}</span>;}
function Card({children,t,p=16,mb=12,style={}}){return <div style={{background:t.bgSurface,borderRadius:12,border:`1px solid ${t.borderCard}`,padding:p,marginBottom:mb,boxShadow:t.shadow,...style}}>{children}</div>;}
function Modal({title,onClose,children,t,width=500}){return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(2px)"}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:t.bgSurface,borderRadius:16,width,maxWidth:"calc(100vw - 40px)",maxHeight:"85vh",overflow:"hidden",boxShadow:t.shadowLg,display:"flex",flexDirection:"column"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:`1px solid ${t.border}`}}><div style={{fontSize:16,fontWeight:700,color:t.text}}>{title}</div><button onClick={onClose} style={{width:28,height:28,borderRadius:7,border:"none",background:t.bgElevated,cursor:"pointer",fontSize:16,color:t.textMuted}}>✕</button></div><div style={{padding:"18px 20px",overflowY:"auto"}}>{children}</div></div></div>;}
function Btn({label,onClick,v="primary",sz="md",t,style={}}){const base={padding:sz==="sm"?"4px 11px":"9px 18px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:sz==="sm"?12:14,fontWeight:600};const vs={primary:{background:t.grad,color:"#fff"},secondary:{background:t.accentLight,color:t.accentText,border:`1px solid ${t.accent}30`},danger:{background:"#FFF1F2",color:"#9F1239",border:"1px solid #FECDD3"},ghost:{background:"transparent",color:t.textSec,border:`1px solid ${t.border}`}};return <button onClick={onClick} style={{...base,...vs[v],...style}}>{label}</button>;}
function KPI({label,value,color,sub,icon,t}){return <div style={{background:t.bgSurface,borderRadius:12,border:`1px solid ${t.borderCard}`,padding:"16px 18px",boxShadow:t.shadow}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:24,fontWeight:700,color,lineHeight:1,marginBottom:4}}>{value}</div><div style={{fontSize:13,fontWeight:600,color:t.text}}>{label}</div>{sub&&<div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{sub}</div>}</div><div style={{fontSize:24,opacity:0.8}}>{icon}</div></div></div>;}

// ─── DASHBOARD ───
function PgDash({t}){
  const kpis1 = [
    {
      label: "حجوزات اليوم",
      value: "١٤",
      color: t.accent,
      sub: "↑٢ عن أمس",
      icon: <IoIosCalendar color={t.accent} />,
    },
    {
      label: "مكتملة اليوم",
      value: "٦",
      color: t.accent,
      sub: "٤٣٪",
      icon: "✔",
    },
    {
      label: "إيرادات اليوم",
      value: "٤,٥٠٠ ل.س",
      color: t.accent,
      sub: "تقديري",
      icon: <TbReportMoney color={t.accent} />,
    },
    { label: "No-Show اليوم", value: "١", color: t.accent , icon: "⚠"   },
  ];
  const kpis2 = [
    {
      label: "إيرادات الشهر",
      value: "١٢٠,٠٠٠ ل.س",
      color: t.accent,
      icon: <PiChartLineUp size={24} color={t.accent} />,
    },
    {
      label: "مصاريف الشهر",
      value: "٣٥,٠٠٠ ل.س",
      color: "#b91c1c",
      icon: <PiChartLineDown size={24} color={t.accent} />,
    },
    {
      label: "صافي الربح",
      value: "٨٥,٠٠٠ ل.س",
      color: t.accent,
      icon: <MdOutlineAttachMoney size={24} color={t.accent} />,
    },
    {
      label: "ضريبة مستحقة",
      value: "١٧,٠٠٠ ل.س",
      color: "#b91c1c",
      icon: <TbReceiptTax size={24} color={t.accent} />,
    },
    {
      label: "طلاب جدد الشهر",
      value: "١٢",
      color: t.accent,
      icon: <PiUsersThin size={24} color={t.accent} />,
    },
    {
      label: "دروس مكتملة",
      value: "٨٦",
      color: t.accent,
      icon: <PiMedalFill size={24} color={t.accent} />,
    },
    {
      label: "طلبات شهادة",
      value: "٨",
      color: t.accent,
      icon: <IoDocumentTextOutline size={24} color={t.accent} />,
    },
    {
      label: "رحلات نقل",
      value: "٢",
      color: t.accent,
      icon: <TbBus size={24} color={t.accent} />,
    },
  ];
  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: t.textMuted,
          marginBottom: 8,
        }}
      >
        {" "}
        اليوم — الخميس ٤ يونيو ٢٠٢٦
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10,
          marginBottom: 14,
        }}
      >
        {kpis1.map((k, i) => (
          <KPI key={i} {...k} t={t} />
        ))}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: t.textMuted,
          marginBottom: 8,
        }}
      >
        {" "}
        يونيو ٢٠٢٦
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {kpis2.map((k, i) => (
          <KPI key={i} {...k} t={t} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
        <Card t={t} p={16}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: t.text,
              marginBottom: 12,
            }}
          >
            مقارنة شهرية
          </div>
          {[
            ["شهر", "الإيرادات", "المصاريف", "الصافي"],
            ["يونيو ٢٠٢٦", "١٢٠,٠٠٠ ل.س", "٣٥,٠٠٠ ل.س", "٨٥,٠٠٠ ل.س"],
            ["مايو ٢٠٢٦", "١١٠,٠٠٠ ل.س", "٣٢,٠٠٠ ل.س", "٧٨,٠٠٠ ل.س"],
            ["أبريل ٢٠٢٦", "١٠٥,٠٠٠ ل.س", "٣٤,٠٠٠ ل.س", "٧١,٠٠٠ ل.س"],
          ].map((row, ri) => (
            <div
              key={ri}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                padding: "7px 0",
                borderBottom: `1px solid ${t.border}`,
                fontSize: ri === 0 ? 11 : 12,
                fontWeight: ri === 0 ? 600 : 400,
                color: ri === 0 ? t.textMuted : t.text,
              }}
            >
              {row.map((c, ci) => (
                <span
                  key={ci}
                  style={{
                    color:
                      ri > 0 && ci === 3
                        ? "#166534"
                        : ri === 0
                          ? t.textMuted
                          : t.text,
                    fontWeight: ri > 0 && ci === 3 ? 700 : 400,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          ))}
        </Card>
        <Card t={t} p={14}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: t.text,
              marginBottom: 10,
            }}
          >
            تنبيهات
          </div>
          {[
            {
              icon: <FaRegAddressCard />,
              text: "٣ إثباتات بانتظار التحقق",
              c: t.pending,
            },
            {
              icon: <GiAutoRepair />,
              text: "سيارة أ·ب·ج ١٠٢ في الصيانة",
              c: t.cancelled,
            },
            { icon: "🌴", text: "مدربة سمر في إجازة اليوم", c: t.pending },
            {
              icon: "🏛️",
              text: "ضريبة الشهر: ١٧,٠٠٠ ل.س مستحقة",
              c: t.cancelled,
            },
          ].map((a, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 8,
                background: a.c.bg,
                border: `1px solid ${a.c.dot}20`,
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 13 }}>{a.icon}</span>
              <span style={{ fontSize: 11, color: a.c.text, fontWeight: 600 }}>
                {a.text}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── EMPLOYEES ───
const ROLE_LABEL_MAP = { MANAGER: "مدير", RECEPTIONIST: "موظف إداري", ACCOUNTANT: "محاسب" };
const ROLE_COLORS = { "مدير": "#6B21A8", "موظف إداري": "#1D4ED8", "محاسب": "#92400E" };
const STATUS_LABEL = { ACTIVE: "نشط", BLOCKED: "موقوف", ARCHIVED: "مؤرشف" };

function AddEmployeeModal({ t, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", phone: "", password: "", role: "", monthlySalary: "", hireDate: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const set = (field, value) => { setForm(prev => ({ ...prev, [field]: value })); setErrors(prev => ({ ...prev, [field]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.phone.trim()) e.phone = "رقم الهاتف مطلوب";
    else if (!/^09\d{8}$/.test(form.phone.trim())) e.phone = "رقم هاتف غير صالح";
    if (!form.password) e.password = "كلمة المرور مطلوبة";
    else if (form.password.length < 4) e.password = "٤ أحرف على الأقل";
    if (!form.role) e.role = "يجب اختيار الدور";
    if (!form.monthlySalary && form.monthlySalary !== 0) e.monthlySalary = "الراتب الشهري مطلوب";
    else if (isNaN(Number(form.monthlySalary))) e.monthlySalary = "يجب أن يكون رقم";
    else if (Number(form.monthlySalary) <= 0) e.monthlySalary = "يجب أن يكون أكبر من صفر";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      password: form.password,
      role: form.role,
      monthlySalary: Number(form.monthlySalary),
      hireDate: form.hireDate || new Date().toISOString().split("T")[0],
    };

    setSubmitting(true);
    try {
      const response = await employeesService.create(payload);
      const body = response.data?.data || response.data;

      // Guard: verify the server actually persisted the record
      const hasError = body?.error || body?.statusCode >= 400;
      const errorMsg = body?.message;
      if (hasError) {
        setServerError(Array.isArray(errorMsg) ? errorMsg.join("، ") : errorMsg || "فشل حفظ الموظف في قاعدة البيانات");
        return;
      }

      onSuccess();
    } catch (err) {
      const data = err.response?.data?.data || err.response?.data;
      const msg = data?.message || err.response?.data?.message || err.message;
      setServerError(Array.isArray(msg) ? msg.join("، ") : msg || "حدث خطأ أثناء الإضافة");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldStyle = (field) => ({
    width: "100%", padding: "10px 12px", borderRadius: 9,
    border: `1.5px solid ${errors[field] ? "#c74848" : t.border}`,
    background: t.bgElevated, color: t.text, fontSize: 13,
    fontFamily: "inherit", boxSizing: "border-box", outline: "none",
  });

  const chipStyle = (value) => ({
    flex: 1, padding: "10px 8px", borderRadius: 10, border: "none",
    cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "center",
    background: form.role === value ? "#778a3b" : t.bgElevated,
    color: form.role === value ? "#fff" : t.textSec,
    outline: form.role === value ? "none" : `1.5px solid ${errors.role ? "#c74848" : t.border}`,
  });

  return (
    <Modal title="إضافة موظف جديد" onClose={onClose} t={t} width={480}>
      {serverError && (
        <div style={{ background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c74848" }}>{serverError}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 4 }}>الاسم الكامل</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="محمد أحمد..." style={fieldStyle("name")} />
            {errors.name && <div style={{ fontSize: 11, color: "#c74848", marginTop: 3 }}>{errors.name}</div>}
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 4 }}>رقم الهاتف</label>
            <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="0991234567" dir="ltr" style={{ ...fieldStyle("phone"), textAlign: "left" }} />
            {errors.phone && <div style={{ fontSize: 11, color: "#c74848", marginTop: 3 }}>{errors.phone}</div>}
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 4 }}>كلمة المرور</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} placeholder="كلمة مرور الحساب" style={{ ...fieldStyle("password"), paddingLeft: 36 }} />
              <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: t.textMuted, display: "flex", alignItems: "center", padding: 0, fontSize: 16 }}>
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
            {errors.password && <div style={{ fontSize: 11, color: "#c74848", marginTop: 3 }}>{errors.password}</div>}
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 4 }}>الراتب الشهري</label>
            <input type="number" value={form.monthlySalary} onChange={e => set("monthlySalary", e.target.value)} placeholder="100000" dir="ltr" style={{ ...fieldStyle("monthlySalary"), textAlign: "left" }} />
            {errors.monthlySalary && <div style={{ fontSize: 11, color: "#c74848", marginTop: 3 }}>{errors.monthlySalary}</div>}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 6 }}>تاريخ التعيين (اختياري)</label>
          <input type="date" value={form.hireDate} onChange={e => set("hireDate", e.target.value)} style={{ ...fieldStyle("hireDate"), width: "100%" }} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 6 }}>الدور الوظيفي</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={() => set("role", "RECEPTIONIST")} style={chipStyle("RECEPTIONIST")}>موظف إداري</button>
            <button type="button" onClick={() => set("role", "ACCOUNTANT")} style={chipStyle("ACCOUNTANT")}>محاسب</button>
          </div>
          {errors.role && <div style={{ fontSize: 11, color: "#c74848", marginTop: 4 }}>{errors.role}</div>}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={submitting} style={{
            flex: 1, padding: "11px", borderRadius: 10, border: "none", cursor: submitting ? "not-allowed" : "pointer",
            background: submitting ? t.textMuted : t.grad, color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "inherit",
          }}>{submitting ? "جارٍ الحفظ..." : "إنشاء الحساب"}</button>
          <Btn label="إلغاء" onClick={onClose} t={t} v="ghost" />
        </div>
      </form>
    </Modal>
  );
}

// ─── EMPLOYEE ACCOUNTING HELPERS ───
const EMP_EXP_TYPES=[
  {v:"SALARY",lbl:"راتب شهري"},
  {v:"BONUS", lbl:"مكافأة"},
  {v:"OTHER", lbl:"سلفة / مصروف آخر"},
];
const EMP_EXP_LABEL={SALARY:"راتب شهري",BONUS:"مكافأة",OTHER:"سلفة / مصروف آخر"};
const EMP_PAY_LABEL={CASH:"نقداً",SHAM_CASH:"شام كاش"};
const _eToday = todayStr;
const _eYM    = currentYearMonth;
const _eFom   = firstOfMonthStr;
const fmtM=n=>(n!=null&&n!=="")?(Number(n).toLocaleString("en")):"—";
const empFldSt=(t,err)=>({width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${err?"#c74848":t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",boxSizing:"border-box",outline:"none"});

function IssueExpenseModal({t,employee,onClose,onSuccess}){
  const empId=employee.employeeId;
  const empName=employee.user?.name||employee.name||"الموظف";
  const [form,setForm]=useState({type:"SALARY",month:_eYM(),amount:"",paymentMethod:"CASH",expenseDate:_eToday(),note:""});
  const [errors,setErrors]=useState({});
  const [submitting,setSubmitting]=useState(false);
  const [serverError,setServerError]=useState("");
  const set=(k,v)=>{setForm(p=>({...p,[k]:v}));setErrors(p=>({...p,[k]:undefined}));};

  const validate=()=>{
    const e={};
    if(!form.type)e.type="النوع مطلوب";
    if(form.type==="SALARY"&&!form.month)e.month="الشهر مطلوب";
    if((form.type==="BONUS"||form.type==="OTHER")&&(!form.amount||isNaN(Number(form.amount))||Number(form.amount)<=0))e.amount="المبلغ مطلوب وأكبر من صفر";
    return e;
  };

  const handleSubmit=async()=>{
    setServerError("");
    const v=validate();setErrors(v);
    if(Object.keys(v).length)return;
    const payload={type:form.type,paymentMethod:form.paymentMethod};
    if(form.type==="SALARY"){payload.month=form.month;}
    else{payload.amount=Number(form.amount);}
    if(form.expenseDate)payload.expenseDate=form.expenseDate;
    if(form.note.trim())payload.note=form.note.trim();
    setSubmitting(true);
    try{
      await employeeAccountingService.issueExpense(empId,payload);
      onSuccess();
    }catch(err){
      const msg=err.response?.data?.message||err.message||"حدث خطأ";
      setServerError(Array.isArray(msg)?msg.join("، "):msg);
    }finally{setSubmitting(false);}
  };

  return(
    <Modal title={`إصدار فاتورة — ${empName}`} onClose={()=>{if(!submitting)onClose();}} t={t} width={460}>
      {serverError&&<div style={{background:"rgba(199,72,72,0.1)",border:"1px solid rgba(199,72,72,0.3)",borderRadius:9,padding:"9px 14px",marginBottom:12,fontSize:13,color:"#c74848"}}>{serverError}</div>}
      {/* Type chips */}
      <div style={{marginBottom:14}}>
        <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:6}}>نوع الصرف <span style={{color:"#c74848"}}>*</span></label>
        <div style={{display:"flex",gap:6}}>
          {EMP_EXP_TYPES.map(x=>(
            <button key={x.v} type="button" onClick={()=>set("type",x.v)} style={{flex:1,padding:"8px 6px",borderRadius:9,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:form.type===x.v?t.grad:t.bgElevated,color:form.type===x.v?"#fff":t.textSec,outline:form.type===x.v?"none":`1.5px solid ${t.border}`,transition:"all 0.15s"}}>{x.lbl}</button>
          ))}
        </div>
        {errors.type&&<div style={{fontSize:11,color:"#c74848",marginTop:3}}>{errors.type}</div>}
      </div>
      {/* SALARY: month + salary info */}
      {form.type==="SALARY"&&(
        <>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>الشهر <span style={{color:"#c74848"}}>*</span></label>
            <input type="month" value={form.month} onChange={e=>set("month",e.target.value)} style={empFldSt(t,errors.month)}/>
            {errors.month&&<div style={{fontSize:11,color:"#c74848",marginTop:3}}>{errors.month}</div>}
          </div>
          {employee.monthlySalary&&(
            <div style={{padding:"9px 14px",borderRadius:9,background:t.accentLight,color:t.accentText,fontSize:13,fontWeight:600,marginBottom:12}}>
              سيُصرف الراتب المسجل: <strong>{fmtM(employee.monthlySalary)} ل.س</strong>
            </div>
          )}
        </>
      )}
      {/* BONUS/OTHER: amount */}
      {(form.type==="BONUS"||form.type==="OTHER")&&(
        <div style={{marginBottom:12}}>
          <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>المبلغ (ل.س) <span style={{color:"#c74848"}}>*</span></label>
          <input type="number" min="1" value={form.amount} onChange={e=>set("amount",e.target.value)} placeholder="50000" dir="ltr" style={{...empFldSt(t,errors.amount),textAlign:"left"}}/>
          {errors.amount&&<div style={{fontSize:11,color:"#c74848",marginTop:3}}>{errors.amount}</div>}
        </div>
      )}
      {/* Payment + date */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        <div>
          <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>طريقة الدفع</label>
          <select value={form.paymentMethod} onChange={e=>set("paymentMethod",e.target.value)} style={{...empFldSt(t,false),appearance:"auto"}}>
            <option value="CASH">نقداً</option>
            <option value="SHAM_CASH">شام كاش</option>
          </select>
        </div>
        <div>
          <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>تاريخ الصرف</label>
          <input type="date" value={form.expenseDate} onChange={e=>set("expenseDate",e.target.value)} style={empFldSt(t,false)}/>
        </div>
      </div>
      {/* Note */}
      <div style={{marginBottom:14}}>
        <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>ملاحظات (اختياري)</label>
        <input value={form.note} onChange={e=>set("note",e.target.value)} placeholder="عيدية / الراتب الشهري..." style={empFldSt(t,false)}/>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={handleSubmit} disabled={submitting} style={{flex:1,padding:"11px",borderRadius:10,border:"none",cursor:submitting?"not-allowed":"pointer",background:submitting?t.textMuted:t.grad,color:"#fff",fontSize:14,fontWeight:700,fontFamily:"inherit",transition:"background 0.15s"}}>
          {submitting?"جارٍ الإصدار...":"إصدار الفاتورة"}
        </button>
        <Btn label="إلغاء" onClick={()=>{if(!submitting)onClose();}} t={t} v="ghost"/>
      </div>
    </Modal>
  );
}

function EmployeeStatementModal({t,employee,onClose}){
  const empId=employee.employeeId;
  const empName=employee.user?.name||employee.name||"الموظف";
  const [rows,setRows]=useState([]);
  const [empInfo,setEmpInfo]=useState(null);
  const [totals,setTotals]=useState(null);
  const [meta,setMeta]=useState(null);
  const [loading,setLoading]=useState(true);
  const [page,setPage]=useState(1);
  const [fType,setFType]=useState("");
  const [fFrom,setFFrom]=useState("");
  const [fTo,setFTo]=useState("");
  const [delTarget,setDelTarget]=useState(null);
  const [deleting,setDeleting]=useState(false);
  const [notice,setNotice]=useState(null);
  const [refreshKey,setRefreshKey]=useState(0);

  const showNotice=(msg,err=false)=>{setNotice({msg,err});setTimeout(()=>setNotice(null),3000);};

  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      setLoading(true);
      try{
        const params={page,limit:10};
        if(fType)params.type=fType;
        if(fFrom)params.from=fFrom;
        if(fTo)params.to=fTo;
        const res=await employeeAccountingService.getExpenses(empId,params);
        const body=res.data?.data??res.data;
        if(!cancelled){
          setEmpInfo(body?.employee||null);
          setRows(Array.isArray(body?.data)?body.data:[]);
          setTotals(body?.totals||null);
          setMeta(body?.meta||null);
        }
      }catch(err){
        if(!cancelled)showNotice(err.response?.data?.message||"فشل تحميل الكشف",true);
      }finally{
        if(!cancelled)setLoading(false);
      }
    })();
    return()=>{cancelled=true;};
  },[empId,page,fType,fFrom,fTo,refreshKey]);

  const handleDelete=async()=>{
    if(!delTarget||deleting)return;
    setDeleting(true);
    try{
      await employeeAccountingService.deleteExpense(empId,delTarget.expenseId);
      setRows(prev=>prev.filter(r=>r.expenseId!==delTarget.expenseId));
      setDelTarget(null);
      showNotice("تم حذف السجل بنجاح");
      setRefreshKey(k=>k+1);
    }catch(err){
      showNotice(err.response?.data?.message||"فشل الحذف",true);
    }finally{setDeleting(false);}
  };

  const thS={padding:"9px 12px",fontSize:11,fontWeight:700,color:t.textSec,textAlign:"right",background:t.bgElevated,borderBottom:`1px solid ${t.border}`,whiteSpace:"nowrap"};
  const tdS={padding:"10px 12px",fontSize:12,color:t.text,borderBottom:`1px solid ${t.border}`,verticalAlign:"middle"};
  const selSt={padding:"7px 10px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:12,fontFamily:"inherit",outline:"none"};

  return(
    <Modal title={`كشف فواتير — ${empName}`} onClose={onClose} t={t} width={740}>
      {/* Inline notice */}
      {notice&&<div style={{padding:"8px 14px",borderRadius:8,background:notice.err?"rgba(199,72,72,0.1)":"rgba(63,107,58,0.1)",border:`1px solid ${notice.err?"rgba(199,72,72,0.3)":"rgba(63,107,58,0.3)"}`,fontSize:12,color:notice.err?"#c74848":"#3F6B3A",marginBottom:12}}>{notice.msg}</div>}
      {/* Employee header */}
      <div style={{display:"flex",gap:16,flexWrap:"wrap",padding:"10px 14px",borderRadius:9,background:t.bgElevated,marginBottom:14}}>
        <span style={{fontSize:13,color:t.text}}><span style={{color:t.textMuted,fontSize:11}}>الموظف: </span><strong>{empInfo?.name||empName}</strong></span>
        {empInfo?.monthlySalary&&(
          <span style={{fontSize:13,color:t.text}}><span style={{color:t.textMuted,fontSize:11}}>الراتب الشهري: </span><strong style={{color:t.accent}}>{fmtM(empInfo.monthlySalary)} ل.س</strong></span>
        )}
      </div>
      {/* Filters */}
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <input type="date" value={fFrom} onChange={e=>{setFFrom(e.target.value);setPage(1);}} style={selSt} title="من تاريخ"/>
        <input type="date" value={fTo} onChange={e=>{setFTo(e.target.value);setPage(1);}} style={selSt} title="إلى تاريخ"/>
        <select value={fType} onChange={e=>{setFType(e.target.value);setPage(1);}} style={selSt}>
          <option value="">كل الأنواع</option>
          {EMP_EXP_TYPES.map(x=><option key={x.v} value={x.v}>{x.lbl}</option>)}
        </select>
        {(fFrom||fTo||fType)&&<Btn label="مسح" onClick={()=>{setFFrom("");setFTo("");setFType("");setPage(1);}} t={t} v="ghost" sz="sm"/>}
      </div>
      {/* Table */}
      {loading?(
        <div style={{textAlign:"center",padding:"28px",color:t.textMuted,fontSize:13}}>جارٍ التحميل...</div>
      ):rows.length===0?(
        <div style={{textAlign:"center",padding:"28px",color:t.textMuted,fontSize:13}}>لا توجد سجلات بهذه المعايير</div>
      ):(
        <div style={{overflowX:"auto",borderRadius:9,border:`1px solid ${t.border}`,marginBottom:12}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr>
                {["#","النوع","المبلغ","طريقة الدفع","الشهر","التاريخ","ملاحظات","حذف"].map((h,i)=>(
                  <th key={i} style={{...thS,...(i===7&&{textAlign:"center"})}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row=>(
                <tr key={row.expenseId} onMouseEnter={e=>e.currentTarget.style.background=t.bgElevated} onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <td style={{...tdS,color:t.textMuted,fontSize:10}}>{row.expenseId}</td>
                  <td style={tdS}><span style={{padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:600,background:t.accentLight,color:t.accentText}}>{EMP_EXP_LABEL[row.type]||row.type}</span></td>
                  <td style={{...tdS,fontWeight:700,color:t.accent}}>{fmtM(row.amount)} ل.س</td>
                  <td style={tdS}>{EMP_PAY_LABEL[row.paymentMethod]||row.paymentMethod||"—"}</td>
                  <td style={{...tdS,color:t.textSec}}>{row.month||"—"}</td>
                  <td style={{...tdS,color:t.textSec}}>{row.expenseDate||row.paidAt?.split("T")[0]||"—"}</td>
                  <td style={{...tdS,color:t.textMuted,maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.note||"—"}</td>
                  <td style={{...tdS,textAlign:"center"}}>
                    <button onClick={()=>setDelTarget(row)} style={{background:"none",border:"none",cursor:"pointer",color:"#C74848",padding:"3px 5px",borderRadius:6,display:"inline-flex",alignItems:"center"}}><FiTrash2 size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Totals footer */}
      {totals&&(
        <div style={{display:"flex",gap:14,flexWrap:"wrap",padding:"9px 14px",borderRadius:9,background:t.bgElevated,marginBottom:12,fontSize:13}}>
          <span style={{fontWeight:700,color:t.text}}>الإجمالي: <span style={{color:t.accent}}>{fmtM(totals.totalAmount)} ل.س</span></span>
          <span style={{color:t.textSec}}>نقداً: <strong>{fmtM(totals.totalCash)}</strong></span>
          <span style={{color:t.textSec}}>شام كاش: <strong>{fmtM(totals.totalShamCash)}</strong></span>
        </div>
      )}
      {/* Pagination */}
      {meta&&meta.totalPages>1&&(
        <div style={{display:"flex",gap:6,alignItems:"center",justifyContent:"center",marginBottom:8}}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${t.border}`,background:"transparent",color:page===1?t.textMuted:t.text,cursor:page===1?"default":"pointer",fontSize:12,fontFamily:"inherit"}}>السابق</button>
          <span style={{fontSize:12,color:t.textSec}}>صفحة {page} من {meta.totalPages}</span>
          <button onClick={()=>setPage(p=>Math.min(meta.totalPages,p+1))} disabled={page===meta.totalPages} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${t.border}`,background:"transparent",color:page===meta.totalPages?t.textMuted:t.text,cursor:page===meta.totalPages?"default":"pointer",fontSize:12,fontFamily:"inherit"}}>التالي</button>
        </div>
      )}
      {/* Delete confirm overlay */}
      {delTarget&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1100}} onClick={()=>{if(!deleting)setDelTarget(null);}}>
          <div onClick={e=>e.stopPropagation()} style={{background:t.bgSurface,borderRadius:14,padding:"24px 20px",maxWidth:340,width:"90%",boxShadow:t.shadowLg}}>
            <div style={{textAlign:"center",marginBottom:4,color:"#C74848",display:"flex",justifyContent:"center"}}><FiTrash2 size={32}/></div>
            <div style={{fontSize:15,fontWeight:700,color:t.text,marginBottom:8,textAlign:"center"}}>تأكيد الحذف</div>
            <div style={{fontSize:13,color:t.textSec,marginBottom:14,textAlign:"center",lineHeight:1.6}}>
              <strong>{EMP_EXP_LABEL[delTarget.type]||delTarget.type}</strong><br/>
              {fmtM(delTarget.amount)} ل.س
              {delTarget.note&&<><br/><span style={{fontSize:12,color:t.textMuted}}>{delTarget.note}</span></>}
            </div>
            <div style={{padding:"8px 12px",borderRadius:8,background:"#FFF1F2",fontSize:11,color:"#9F1239",textAlign:"center",marginBottom:14}}>هذا الإجراء لا يمكن التراجع عنه</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={handleDelete} disabled={deleting} style={{flex:1,padding:"9px",borderRadius:9,border:"none",cursor:deleting?"not-allowed":"pointer",background:deleting?t.textMuted:"#9F1239",color:"#fff",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>{deleting?"جارٍ الحذف...":"تأكيد الحذف"}</button>
              <Btn label="إلغاء" onClick={()=>{if(!deleting)setDelTarget(null);}} t={t} v="ghost"/>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

function PgEmployees({ t }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [issueModal, setIssueModal] = useState(null);
  const [statementModal, setStatementModal] = useState(null);
  const [summary, setSummary] = useState(null);
  const [sumLoading, setSumLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [empRefresh, setEmpRefresh] = useState(0);

  const showToast = (msg, err=false) => { setToast({msg,err}); setTimeout(()=>setToast(null), 3500); };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const response = await employeesService.getAll();
        const body = response.data?.data || response.data;
        if (!cancelled) setEmployees(Array.isArray(body) ? body : []);
      } catch { if (!cancelled) setEmployees([]); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [empRefresh]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setSumLoading(true);
      try {
        const res = await employeeAccountingService.getSummary({ from: _eFom(), to: _eToday() });
        const body = res.data?.data ?? res.data;
        if (!cancelled) setSummary(body);
      } catch { /* silent — summary is optional */ }
      finally { if (!cancelled) setSumLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [empRefresh]);

  const mapRoles = (emp) => {
    const role = emp.role || "";
    if (!role) return [];
    const label = ROLE_LABEL_MAP[role.toUpperCase()] || role;
    return [label];
  };

  const mapStatus = (emp) => {
    const s = emp.user?.accountStatus || emp.accountStatus || "ACTIVE";
    return STATUS_LABEL[s.toUpperCase()] || s;
  };

  const sumTypes = summary?.byType || {};

  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1, position: "relative" }}>
      {/* Toast */}
      {toast && <div style={{position:"fixed",top:22,left:"50%",transform:"translateX(-50%)",zIndex:3000,background:toast.err?"#9F1239":"#3F6B3A",color:"#fff",padding:"11px 26px",borderRadius:12,fontSize:13,fontWeight:600,boxShadow:"0 8px 28px rgba(0,0,0,0.22)",whiteSpace:"nowrap",pointerEvents:"none"}}>{toast.msg}</div>}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>الموظفون والمستخدمون</div>
          <div style={{ fontSize: 13, color: t.textSec, marginTop: 2 }}>
            {loading ? "جارٍ التحميل..." : `${employees.length} موظف مسجل`}
          </div>
        </div>
        <Btn label="+ إضافة موظف" onClick={() => setAddModal(true)} t={t} />
      </div>

      {/* Financial summary cards */}
      {!sumLoading && summary && (
        <div style={{marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:t.textMuted,marginBottom:8,paddingRight:4,borderRight:`3px solid ${t.accent}`}}>إحصائيات مالية الموظفين — الشهر الحالي</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
            {[
              {lbl:"إجمالي المصروف",val:summary.totalAmount,clr:t.accent,sub:`${summary.totalCount||0} عملية`},
              {lbl:"نقداً",val:summary.cash,clr:"#374151",sub:""},
              {lbl:"شام كاش",val:summary.shamCash,clr:"#7C3AED",sub:""},
              {lbl:"رواتب",val:Number(sumTypes.salary?.total||0),clr:"#059669",sub:`${sumTypes.salary?.count||0} صرفة`},
              {lbl:"مكافآت وأخرى",val:Number(sumTypes.bonus?.total||0)+Number(sumTypes.other?.total||0),clr:"#D97706",sub:""},
            ].map(c=>(
              <div key={c.lbl} style={{background:t.bgSurface,borderRadius:10,border:`1px solid ${t.borderCard}`,padding:"11px 13px",boxShadow:t.shadow}}>
                <div style={{fontSize:15,fontWeight:700,color:c.clr,lineHeight:1,marginBottom:3}}>{fmtM(c.val)} <span style={{fontSize:10,fontWeight:500}}>ل.س</span></div>
                <div style={{fontSize:11,fontWeight:600,color:t.text}}>{c.lbl}</div>
                {c.sub&&<div style={{fontSize:10,color:t.textMuted,marginTop:2}}>{c.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Employees table */}
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>جارٍ تحميل بيانات الموظفين...</div>
      ) : employees.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>لا يوجد موظفون مسجلون بعد</div>
      ) : (
        <div style={{ borderRadius: 11, border: `1px solid ${t.border}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: t.bgElevated }}>
                {["الاسم","رقم الهاتف","الدور","الحالة","الراتب","تاريخ التعيين","الإجراءات"].map((h, i) => (
                  <th key={i} style={{ padding: "10px 14px", textAlign: "right", color: t.textMuted, fontWeight: 600, fontSize: 11, borderBottom: `1px solid ${t.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => {
                const roleLabels = mapRoles(emp);
                const status = mapStatus(emp);
                return (
                  <tr key={emp.id || i} style={{ background: i % 2 === 0 ? t.bgSurface : t.bgElevated, borderBottom: `1px solid ${t.border}` }}>
                    <td style={{ padding: "11px 14px", fontWeight: 600, color: t.text }}>{emp.user?.name || emp.name || "—"}</td>
                    <td style={{ padding: "11px 14px", color: t.textSec, fontSize: 12, direction: "ltr", textAlign: "right" }}>{emp.user?.phone || emp.phone || "—"}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {roleLabels.map(r => (
                          <span key={r} style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: `${ROLE_COLORS[r] || "#747A70"}18`, color: ROLE_COLORS[r] || "#747A70" }}>{r}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "11px 14px" }}><Badge s={status} t={t} /></td>
                    <td style={{ padding: "11px 14px", color: t.textSec, fontSize: 12 }}>{emp.monthlySalary ? `${Number(emp.monthlySalary).toLocaleString("en")} ل.س` : "—"}</td>
                    <td style={{ padding: "11px 14px", color: t.textMuted, fontSize: 12 }}>{emp.hireDate || "—"}</td>
                    <td style={{ padding: "8px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn label="صرف دفعة" onClick={() => setIssueModal(emp)} t={t} sz="sm" v="primary" />
                        <Btn label="كشف الحساب" onClick={() => setStatementModal(emp)} t={t} sz="sm" v="secondary" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add employee modal */}
      {addModal && (
        <AddEmployeeModal
          t={t}
          onClose={() => setAddModal(false)}
          onSuccess={() => { setAddModal(false); setEmpRefresh(k => k + 1); }}
        />
      )}

      {/* Issue expense modal */}
      {issueModal && (
        <IssueExpenseModal
          t={t}
          employee={issueModal}
          onClose={() => setIssueModal(null)}
          onSuccess={() => {
            setIssueModal(null);
            setEmpRefresh(k => k + 1);
            showToast("تم إصدار الفاتورة بنجاح");
          }}
        />
      )}

      {/* Employee statement modal */}
      {statementModal && (
        <EmployeeStatementModal
          t={t}
          employee={statementModal}
          onClose={() => setStatementModal(null)}
        />
      )}
    </div>
  );
}

// ─── PERMISSIONS ───
function PgPermissions({t}){
  const matrix=[
    ["الموديول","مدير","موظف إداري","محاسب","مدرب","طالب"],
    ["لوحة التحكم","✔ كاملة","✔ تشغيلية","✔ مالية","✖","✖"],
    ["إدارة الطلاب","✔ كامل","✔ كامل","👁 عرض محدود","✖","👤 نفسه فقط"],
    ["إدارة المدربين","✔ كامل","✔ كامل","👁 عرض","📅 جدوله فقط","✖"],
    ["إدارة المركبات","✔ كامل","✔ كامل","👁 عرض","✖","✖"],
    ["الحجز والجدولة","✔ كامل","✔ + حجز جديد","👁 + إكمال الدفع","📅 جدوله","✔ لنفسه"],
    ["زر لم يحضر (No-Show)","✔","✔ حصراً","✔","✖","✖"],
    ["زر إكمال الدفع","✔","✔","✔ حصراً","✖","✖"],
    ["تحقق الدفعات","✔ كامل","💵 نقدي فقط","✔ كامل","✖","📎 رفع إثبات"],
    ["الفواتير","✔","✔","✔ كامل","✖","✖"],
    ["مستحقات المدربين","✔","✖","✔ كامل","✖","✖"],
    ["الإيرادات والمصاريف","✔","✖","✔ كامل","✖","✖"],
    ["الشهادة الحكومية","✔ كامل","✔ لوجستي","👁 مالي فقط","✖","📋 طلب+وثائق"],
    ["خدمة النقل","✔ كامل","✔ لوجستي","👁 دفع فقط","✖","🚌 تسجيل"],
    ["الأسعار","✔ حصراً","✖","✔ عرض + تعديل","✖","✖"],
    ["الموظفون والصلاحيات","✔ حصراً","✖","✖","✖","✖"],
  ];
  return(
    <div style={{padding:"20px 24px",overflowY:"auto",flex:1}}>
      <div style={{fontSize:20,fontWeight:700,color:t.text,marginBottom:6}}>مصفوفة الصلاحيات</div>
      <div style={{fontSize:13,color:t.textSec,marginBottom:16}}>نظرة شاملة على صلاحيات كل دور في النظام</div>
      <div style={{borderRadius:11,border:`1px solid ${t.border}`,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:700}}>
          <tbody>
            {matrix.map((row,ri)=>(
              <tr key={ri} style={{background:ri===0?t.bgElevated:ri%2===0?t.bgSurface:t.bgElevated,borderBottom:`1px solid ${t.border}`}}>
                {row.map((cell,ci)=>(
                  <td key={ci} style={{padding:ri===0?"10px 12px":"9px 12px",fontWeight:ri===0||ci===0?700:400,fontSize:ri===0||ci===0?11:12,color:ri===0?t.textMuted:ci===0?t.text:cell.includes("✔")?t.accent:cell.includes("✖")?"#b91c1c":t.textSec,borderLeft:ci>0?`1px solid ${t.border}`:"none",textAlign:"right"}}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PRICING (admin copy) ───
const SYSTEM_META={
  deposit_percentage:                 {label:"نسبة العربون",              suffix:"%",       inputType:"number"},
  booking_hold_minutes:               {label:"مدة التعليق",               suffix:" دقيقة",  inputType:"number"},
  booking_completion_grace_minutes:   {label:"مهلة إكمال الحجز",          suffix:" دقيقة",  inputType:"number"},
  booking_window_days:                {label:"نافذة الحجز",               suffix:" يوم",    inputType:"number"},
  lesson_duration_minutes:            {label:"مدة الدرس",                 suffix:" دقيقة",  inputType:"number"},
  shamcash_receiver_name:             {label:"اسم مستقبل ShamCash",       suffix:"",        inputType:"text"},
  certificate_service_fee:            {label:"رسوم خدمة الشهادة",         suffix:" ل.س",    inputType:"number"},
  certificate_reexam_fee:             {label:"رسوم إعادة الامتحان",       suffix:" ل.س",    inputType:"number"},
  certificate_service_school_share:   {label:"حصة المدرسة (شهادة)",       suffix:" ل.س",    inputType:"number"},
  certificate_reexam_school_share:    {label:"حصة المدرسة (إعادة)",       suffix:" ل.س",    inputType:"number"},
  certificate_training_sessions_count:{label:"عدد جلسات التدريب",         suffix:" جلسة",   inputType:"number"},
  certificate_max_reexam_attempts:    {label:"الحد الأقصى لمحاولات الإعادة",suffix:" مرة",  inputType:"number"},
};

function SettingRow({item,metaSuffix,metaInputType,isLast,t,onEdit}){
  const displayLabel=item.description||item.key;
  const display=item.value!==undefined&&item.value!==null&&item.value!==""
    ?`${item.value}${metaSuffix||""}`:"—";
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",...(!isLast&&{borderBottom:`1px solid ${t.border}`})}}>
      <div style={{flex:1,minWidth:0,paddingLeft:12}}>
        <div style={{fontSize:13,color:t.text,fontWeight:500}}>{displayLabel}</div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
        <span style={{fontSize:14,fontWeight:700,color:t.accent,minWidth:60,textAlign:"left"}}>{display}</span>
        <Btn label="تعديل" onClick={()=>onEdit(item,displayLabel,metaSuffix||"",metaInputType||"text")} t={t} sz="sm" v="secondary"/>
      </div>
    </div>
  );
}

function SettingCard({title,keys,system,t,onEdit}){
  const ordered=keys.map(k=>system.find(s=>s.key===k)).filter(Boolean);
  if(!ordered.length)return null;
  return(
    <div style={{background:t.bgSurface,borderRadius:12,border:`1px solid ${t.borderCard}`,padding:"14px 16px",marginBottom:14}}>
      <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:10,paddingRight:10,borderRight:`3px solid ${t.accent}`}}>{title}</div>
      {ordered.map((item,i)=>{
        const meta=SYSTEM_META[item.key]||{suffix:"",inputType:"text"};
        return <SettingRow key={item.key} item={item} metaSuffix={meta.suffix} metaInputType={meta.inputType} isLast={i===ordered.length-1} t={t} onEdit={onEdit}/>;
      })}
    </div>
  );
}

function PgPricing({t}){
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [loadErr,setLoadErr]=useState(null);
  const [editModal,setEditModal]=useState(null);
  const [editValue,setEditValue]=useState("");
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState(null);

  const showToast=(msg,isErr=false)=>{setToast({msg,isErr});setTimeout(()=>setToast(null),3500);};

  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      setLoading(true);setLoadErr(null);
      try{
        const res=await settingsService.getAll();
        const body=res.data?.data??res.data;
        if(!cancelled)setData({system:body?.system||[],lessonPrices:body?.lessonPrices||[],instructorWages:body?.instructorWages||[]});
      }catch(err){
        if(!cancelled)setLoadErr(err.response?.data?.message||err.message||"فشل تحميل الإعدادات");
      }finally{
        if(!cancelled)setLoading(false);
      }
    })();
    return()=>{cancelled=true;};
  },[]);

  const openEdit=(item,displayLabel,suffix,inputType)=>{
    setEditModal({key:item.key,label:displayLabel,suffix,inputType:inputType||"text"});
    setEditValue(item.value??"");
  };

  const handleSave=async()=>{
    if(!editModal||saving)return;
    setSaving(true);
    try{
      await settingsService.update(editModal.key,String(editValue));
      setData(prev=>{
        const patch=(arr)=>arr.map(s=>s.key===editModal.key?{...s,value:String(editValue)}:s);
        return{system:patch(prev.system),lessonPrices:patch(prev.lessonPrices),instructorWages:patch(prev.instructorWages)};
      });
      setEditModal(null);
      showToast("تم حفظ الإعداد بنجاح");
    }catch(err){
      const msg=err.response?.data?.message||err.message||"حدث خطأ أثناء الحفظ";
      showToast(Array.isArray(msg)?msg.join("، "):msg,true);
    }finally{
      setSaving(false);
    }
  };

  if(loading)return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:320,gap:14}}>
      <style>{`@keyframes pgSpin{to{transform:rotate(360deg)}}`}</style>
      <div style={{width:38,height:38,borderRadius:"50%",border:`4px solid ${t.border}`,borderTopColor:t.accent,animation:"pgSpin 0.85s linear infinite"}}/>
      <div style={{fontSize:13,color:t.textMuted}}>جارٍ تحميل الإعدادات...</div>
    </div>
  );

  if(loadErr)return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:320,gap:12}}>
      <div style={{fontSize:32}}>⚠️</div>
      <div style={{fontSize:14,color:"#c74848",fontWeight:600}}>{loadErr}</div>
      <Btn label="إعادة المحاولة" onClick={()=>{setLoadErr(null);setLoading(true);}} t={t}/>
    </div>
  );

  const sys=data?.system||[];
  const lessonPrices=data?.lessonPrices||[];
  const instructorWages=data?.instructorWages||[];

  return(
    <div style={{padding:"20px 24px",overflowY:"auto",flex:1,position:"relative"}}>
      {toast&&(
        <div style={{position:"fixed",top:22,left:"50%",transform:"translateX(-50%)",zIndex:3000,background:toast.isErr?"#9F1239":"#3F6B3A",color:"#fff",padding:"11px 26px",borderRadius:12,fontSize:13,fontWeight:600,boxShadow:"0 8px 28px rgba(0,0,0,0.22)",whiteSpace:"nowrap",pointerEvents:"none"}}>
          {toast.msg}
        </div>
      )}

      <div style={{fontSize:20,fontWeight:700,color:t.text,marginBottom:4}}>الأسعار والإعدادات</div>
      <div style={{fontSize:13,color:t.textMuted,marginBottom:14}}>إعدادات النظام — تُطبَّق فورياً على جميع العمليات الجديدة</div>
      <div style={{padding:"10px 14px",borderRadius:9,background:"#FFF1F2",border:"1px solid #FECDD3",marginBottom:18,fontSize:12,color:"#9F1239",fontWeight:600}}>
        ⚠ التعديل من هنا يطبق على الحجوزات الجديدة فقط ويُسجَّل في سجل النشاط باسمك
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {/* Right column */}
        <div>
          <SettingCard title="العربون والحجز" keys={["deposit_percentage","booking_hold_minutes","booking_completion_grace_minutes","booking_window_days"]} system={sys} t={t} onEdit={openEdit}/>
          <SettingCard title="الجدولة والنظام" keys={["lesson_duration_minutes","shamcash_receiver_name"]} system={sys} t={t} onEdit={openEdit}/>
          {instructorWages.length>0&&(
            <div style={{background:t.bgSurface,borderRadius:12,border:`1px solid ${t.borderCard}`,padding:"14px 16px",marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:10,paddingRight:10,borderRight:`3px solid ${t.accent}`}}>أجور المدربين</div>
              {instructorWages.map((item,i)=>(
                <SettingRow key={item.key} item={item} metaSuffix=" ل.س" metaInputType="number" isLast={i===instructorWages.length-1} t={t} onEdit={openEdit}/>
              ))}
            </div>
          )}
        </div>

        {/* Left column */}
        <div>
          <SettingCard title="رسوم الشهادة الحكومية" keys={["certificate_service_fee","certificate_reexam_fee","certificate_service_school_share","certificate_reexam_school_share","certificate_training_sessions_count","certificate_max_reexam_attempts"]} system={sys} t={t} onEdit={openEdit}/>
          {lessonPrices.length>0&&(
            <div style={{background:t.bgSurface,borderRadius:12,border:`1px solid ${t.borderCard}`,padding:"14px 16px",marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:10,paddingRight:10,borderRight:`3px solid ${t.accent}`}}>أسعار الدروس</div>
              {lessonPrices.map((item,i)=>(
                <SettingRow key={item.key} item={item} metaSuffix=" ل.س" metaInputType="number" isLast={i===lessonPrices.length-1} t={t} onEdit={openEdit}/>
              ))}
            </div>
          )}
        </div>
      </div>

      {editModal&&(
        <Modal title="تعديل الإعداد" onClose={()=>{if(!saving)setEditModal(null);}} t={t} width={400}>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>الإعداد</label>
            <div style={{padding:"9px 12px",borderRadius:9,background:t.accentLight,color:t.accentText,fontSize:13,fontWeight:600}}>{editModal.label}</div>
          </div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>
              القيمة الجديدة{editModal.suffix?` (${editModal.suffix.trim()})` : ""}
            </label>
            <input
              type={editModal.inputType||"text"}
              value={editValue}
              onChange={e=>setEditValue(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!saving)handleSave();}}
              dir={editModal.inputType==="number"?"ltr":"rtl"}
              autoFocus
              style={{width:"100%",padding:"10px 12px",borderRadius:9,border:`1.5px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}
            />
          </div>
          <div style={{padding:"9px 12px",borderRadius:9,background:"#FFFBEB",fontSize:11,color:"#92400E",marginBottom:14}}>
            ⚠ سيُسجَّل التعديل في سجل النشاط
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={handleSave} disabled={saving} style={{flex:1,padding:"11px",borderRadius:10,border:"none",cursor:saving?"not-allowed":"pointer",background:saving?t.textMuted:t.grad,color:"#fff",fontSize:14,fontWeight:700,fontFamily:"inherit",transition:"background 0.15s"}}>
              {saving?"جارٍ الحفظ...":"حفظ التعديل"}
            </button>
            <Btn label="إلغاء" onClick={()=>{if(!saving)setEditModal(null);}} t={t} v="ghost"/>
          </div>
        </Modal>
      )}
    </div>
  );
}

const NAV = [
  { id: "dash", label: "لوحة التحكم", icon: "⊞" },
  { id: "employees", label: "الموظفون", icon: <FaUserTie /> },
  { id: "permissions", label: "الصلاحيات", icon: <IoIosUnlock /> },
  { id: "pricing", label: "الأسعار وإعدادات النظام", icon: <TbReportMoney /> },
];

export default function AdminPro({embedded=false,page:forcedPage,darkMode}){
  const [localDark,setLocalDark]=useState(false);
  const dark = (embedded && typeof darkMode !== 'undefined') ? darkMode : localDark;
  const [page,setPage]=useState(forcedPage||"dash");
  const [collapsed,setCollapsed]=useState(false);
  const t=T[dark?"dark":"light"];
  const sidebarWidth = collapsed ? 84 : 320;
  // sync when parent forces a page (embedded mode)
  if(forcedPage && forcedPage!==page){ setPage(forcedPage); }
  const pages={dash:<PgDash t={t}/>,employees:<PgEmployees t={t}/>,permissions:<PgPermissions t={t}/>,pricing:<PgPricing t={t}/>};
  return(
    <div dir="rtl" style={{display:"flex",height: embedded?"100%":"100vh",overflow:"hidden",background:t.bgApp,fontFamily:"var(--font-body)"}}>
      {!embedded && <div style={{width:sidebarWidth,flexShrink:0}} />}
      {!embedded && <div style={{width:sidebarWidth,height:"100svh",minHeight:"100svh",position:"fixed",top:0,right:0,zIndex:40,background:t.bgSidebar,display:"flex",flexDirection:"column",transition:"width 0.2s",overflow:"hidden",boxShadow:"2px 0 18px rgba(0,0,0,0.18)"}}>
        <div style={{padding:"20px 16px 16px",borderBottom:`1px solid ${t.borderCard}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:42,height:42,borderRadius:12,background:"linear-gradient(135deg,#DB3069 0%,#F5D547 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,color:"#17325C"}}>🛡️</div>
          {!collapsed&&<div><div style={{fontSize:15,fontWeight:800,color:"#fff",lineHeight:1.2}}>المدير</div><div style={{fontSize:12,color:t.textSidebar,marginTop:2}}>صلاحيات كاملة</div></div>}
        </div>
        {!collapsed&&<div style={{margin:"10px 12px",padding:"10px 12px",borderRadius:12,background:"rgba(255,255,255,0.10)",textAlign:"center"}}><div style={{fontSize:12,color:t.textSidebar,fontWeight:700}}>محمد هاشم سرحان</div></div>}
        <div style={{flex:1,minHeight:0,padding:"10px",overflowY:"auto"}}>
          {NAV.map(item=>{const active=page===item.id;return <button key={item.id} onClick={()=>setPage(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:collapsed?"14px 10px":"14px 16px",borderRadius:14,border:"none",cursor:"pointer",background:active?t.bgSidebarActive:"transparent",color:active?t.textSidebarActive:t.textSidebar,fontSize:16,fontWeight:active?700:500,marginBottom:6,justifyContent:collapsed?"center":"flex-start",fontFamily:"inherit",transition:"all 0.15s",boxShadow:active?"0 10px 24px rgba(0,0,0,0.18)":"none"}}><span style={{fontSize:19,flexShrink:0}}>{item.icon}</span>{!collapsed&&<span>{item.label}</span>}</button>;})}
        </div>
        <div style={{padding:"12px 10px",borderTop:`1px solid ${t.borderCard}`}}>
          <button onClick={()=>setCollapsed(!collapsed)} style={{width:"100%",padding:"11px",borderRadius:12,background:t.accentLight,border:"none",color:t.accentText,cursor:"pointer",fontSize:18,fontWeight:700}}>{collapsed?"»":"«"}</button>
        </div>
      </div>}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {!embedded && <div style={{height:50,background:t.bgSurface,borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",padding:"0 18px",gap:10,flexShrink:0,boxShadow:t.shadow}}>
          <div style={{fontSize:13,fontWeight:700,color:t.text}}>{NAV.find(n=>n.id===page)?.label}</div>
          <div style={{flex:1}}/>
          <div style={{padding:"4px 12px",borderRadius:20,background:t.bgElevated,border:`1px solid ${t.borderCard}`,fontSize:11,fontWeight:700,color:t.text}}>مدير النظام 🛡️</div>
          <button onClick={()=>{ if(!embedded) setLocalDark(!localDark); }} style={{padding:"5px 13px",borderRadius:7,background:t.accentLight,color:t.accentText,border:"none",fontSize:11,cursor:"pointer",fontWeight:600}}>{dark?"☀️ نهاري":"🌙 ليلي"}</button>
          <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#7e22ce 0%,#a855f7 100%)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>م</div>
        </div>}
        <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>{pages[page]}</div>
      </div>
    </div>
  );
}
