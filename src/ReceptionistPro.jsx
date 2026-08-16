import { useState, useEffect, useRef } from "react";
import { todayStr } from "./utils/dateUtils";
import { IoIosCalendar } from "react-icons/io";

import { IoDocumentTextOutline } from "react-icons/io5";
import {  PiUsersThin } from "react-icons/pi";
import { FaUserTie } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { bookingsService, studentsService, instructorsService, certificatesService } from "./api";
import { useAuth } from "./contexts/useAuth";
import { P } from "./constants/roles";
import RequirePermission from "./components/RequirePermission";


const T = {
  light: {
    bgApp: "#f4f5f0",
    bgSurface: "#ffffff",
    bgElevated: "#e8e9e4",
    bgList: "#fcfcf9",

    // ألوان السايدبار المعتمدة
    bgSidebar: "#f4f5f0",
    bgSidebarActive: "#778a3b",

    text: "#2c3024",
    textSec: "#5a6150",
    textMuted: "#796c2c",
    textSidebar: "#715317",
    textSidebarActive: "#FFFFFF",

    border: "#d9ddd0",
    borderCard: "rgba(86,107,45,0.2)",

    accent: "#566b2d",
    accentLight: "#eaf0d8",
    accentText: "#3d4e1f",
    grad: "linear-gradient(135deg, #6a8238 0%, #566b2d 100%)",

    // الحالات التشغيلية المحدثة
    confirmed: { bg: "rgba(86,107,45,0.1)", text: "#3d4e1f", dot: "#566b2d" },
    pending: { bg: "rgba(201,124,40,0.14)", text: "#c98a28", dot: "#c98a28" },
    cancelled: { bg: "rgba(199,72,72,0.12)", text: "#c74848", dot: "#c74848" },
    completed: { bg: "rgba(80,90,50,0.14)", text: "#505a32", dot: "#505a32" },
    noshow: { bg: "rgba(199,72,72,0.12)", text: "#c74848", dot: "#c74848" },
    inprogress: { bg: "rgba(86,107,45,0.12)", text: "#3d4e1f", dot: "#566b2d" },
    expired: { bg: "rgba(160,165,155,0.16)", text: "#747a70", dot: "#747a70" },

    // حالات الاستقبال الخاصة
    accepted: { bg: "rgba(80,90,50,0.14)", text: "#505a32", dot: "#505a32" },
    qualified: { bg: "rgba(113,83,23,0.1)", text: "#715317", dot: "#715317" },
    passed: { bg: "rgba(80,90,50,0.14)", text: "#505a32", dot: "#505a32" },
    failed: { bg: "rgba(199,72,72,0.12)", text: "#c74848", dot: "#c74848" },
    applied: { bg: "rgba(201,124,40,0.14)", text: "#c98a28", dot: "#c98a28" },

    // الظلال (Shadows) متناسقة مع اللون الأساسي
    shadow: "0 12px 28px rgba(113,83,23,0.08)",
    shadowMd: "0 14px 32px rgba(113,83,23,0.10)",
    shadowLg: "0 20px 48px rgba(113,83,23,0.14)",
  },

  dark: {
    bgApp: "#18181b",
    bgSurface: "#27272a",
    bgElevated: "#2d2d32",
    bgList: "#27272a",
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
    confirmed: { bg: "rgba(119,138,59,0.22)", text: "#D4EDAA", dot: "#D4EDAA" },
    pending: { bg: "rgba(201,138,40,0.22)", text: "#F0CB8C", dot: "#F0CB8C" },
    cancelled: { bg: "rgba(199,72,72,0.22)", text: "#FCA5A5", dot: "#FCA5A5" },
    completed: { bg: "rgba(63,107,58,0.26)", text: "#86EFAC", dot: "#86EFAC" },
    noshow: { bg: "rgba(199,72,72,0.20)", text: "#FCA5A5", dot: "#FCA5A5" },
    inprogress: { bg: "rgba(119,138,59,0.20)", text: "#D4EDAA", dot: "#D4EDAA" },
    expired: { bg: "rgba(161,161,170,0.14)", text: "#A1A1AA", dot: "#A1A1AA" },
    accepted: { bg: "rgba(63,107,58,0.26)", text: "#86EFAC", dot: "#86EFAC" },
    qualified: { bg: "rgba(119,138,59,0.22)", text: "#D4EDAA", dot: "#D4EDAA" },
    passed: { bg: "rgba(63,107,58,0.26)", text: "#86EFAC", dot: "#86EFAC" },
    failed: { bg: "rgba(199,72,72,0.22)", text: "#FCA5A5", dot: "#FCA5A5" },
    applied: { bg: "rgba(201,138,40,0.22)", text: "#F0CB8C", dot: "#F0CB8C" },
    shadow: "0 12px 28px rgba(0,0,0,0.40)",
    shadowMd: "0 14px 32px rgba(0,0,0,0.44)",
    shadowLg: "0 20px 48px rgba(0,0,0,0.50)",
  },
};

const SL=["مؤكد","بانتظار العربون","ملغي","مكتمل","لم يحضر","جاري","منتهي","نشط","غير نشط","في إجازة","متاحة","في الصيانة","مقبول","مؤهل للامتحان","ناجح","راسب","تم التقديم","داخلي","خارجي","عادي","أوتوماتيك","مسجل","غير مسجل","حضر","مدفوع","معلق","تم الإثبات","جديد","قيد التدريب","أنهى التدريب","طلب شهادة","ذكر","أنثى"];

function Badge({s,t}){
  const m={
    "مؤكد":t.confirmed,"بانتظار العربون":t.pending,"ملغي":t.cancelled,"مكتمل":t.completed,
    "لم يحضر":t.noshow,"جاري":t.inprogress,"منتهي":t.expired,"نشط":t.completed,"غير نشط":t.expired,
    "في إجازة":t.pending,"متاحة":t.completed,"في الصيانة":t.pending,"مقبول":t.accepted,
    "مؤهل للامتحان":t.qualified,"ناجح":t.passed,"راسب":t.failed,"تم التقديم":t.applied,
    "داخلي":t.confirmed,"خارجي":t.pending,"عادي":t.confirmed,"أوتوماتيك":t.qualified,
    "مسجل":t.completed,"غير مسجل":t.expired,"حضر":t.completed,"مدفوع":t.completed,"معلق":t.pending,
    "تم الإثبات":t.qualified,"جديد":t.pending,"قيد التدريب":t.inprogress,"أنهى التدريب":t.accepted,
    "طلب شهادة":t.qualified,"ذكر":t.confirmed,"أنثى":t.noshow,
    "العربون مدفوع":t.pending,"مدفوع بالكامل":t.completed,"عربون محروق":t.cancelled,
    "رصيد محفوظ":t.inprogress,"رصيد مستهلك":t.expired,
  };
  const c=m[s]||t.expired;
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,background:c.bg,color:c.text,padding:"2px 9px",borderRadius:20,fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}><span style={{width:6,height:6,borderRadius:"50%",background:c.dot,flexShrink:0}}/>{s}</span>;
}
function Card({children,t,p=16,mb=10,style={}}){return <div style={{background:t.bgSurface,borderRadius:12,border:`1px solid ${t.borderCard}`,padding:p,marginBottom:mb,boxShadow:t.shadow,...style}}>{children}</div>;}
function Modal({title,onClose,children,t,width=500,bodyStyle={}}){return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(2px)"}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:t.bgSurface,borderRadius:16,width,maxWidth:"calc(100vw-40px)",maxHeight:"85vh",overflow:"hidden",boxShadow:t.shadowLg,display:"flex",flexDirection:"column"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:`1px solid ${t.border}`}}><div style={{fontSize:16,fontWeight:700,color:t.text}}>{title}</div><button onClick={onClose} style={{width:28,height:28,borderRadius:7,border:"none",background:t.bgElevated,cursor:"pointer",fontSize:16,color:t.textMuted}}>✕</button></div><div style={{padding:"18px 20px",overflowY:"auto",...bodyStyle}}>{children}</div></div></div>;}
function Btn({label,onClick,v="primary",sz="md",t,style={},disabled=false}){
  const base={padding:sz==="sm"?"4px 12px":"9px 18px",borderRadius:8,border:"none",cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",fontSize:sz==="sm"?12:14,fontWeight:600,transition:"all 0.15s",opacity:disabled?0.5:1};

  const primaryBg = "#778a3b";
  const vs={
    primary:{background:primaryBg,color:"#fff"},
    secondary:{background:t.accentLight,color:t.accentText,border:`1px solid ${t.accent}30`},
    danger:{background:"#FFF1F2",color:"#9F1239",border:"1px solid #FECDD3"},
    ghost:{background:"transparent",color:t.textSec,border:`1px solid ${t.border}`}
  };

  return <button disabled={disabled} onClick={onClick} style={{...base,...vs[v],...style}}>{label}</button>;
}

function InfoRow({k,v,t}){return <div style={{display:"flex",alignItems:"center",gap:6,padding:"7px 0",borderBottom:`1px solid ${t.border}`,fontSize:13}}><span style={{color:t.textMuted,whiteSpace:"nowrap"}}>{k}</span><span style={{color:t.textMuted}}>:</span><span style={{fontWeight:600,color:t.text}}>{SL.includes(v)?<Badge s={v} t={t}/>:v}</span></div>;}
function SearchBar({placeholder,t,value,onChange,onKeyDown}){return <div style={{position:"relative",flex:1}}><span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:14,color:t.textMuted}}>🔍</span><input value={value} onChange={e=>onChange(e.target.value)} onKeyDown={onKeyDown} placeholder={placeholder} style={{width:"100%",padding:"8px 32px 8px 10px",borderRadius:9,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/></div>;}
// `Sel` component removed — it was defined but never used.

function InvoiceModal({booking,t,onClose}){
  const [disc,setDisc]=useState("");
  const rem=1500;
  const dv=parseFloat(disc)||0;
  const total=Math.max(0,rem-dv);
  return <Modal title="تأكيد الدفع — فاتورة الجلسة" onClose={onClose} t={t} width={460}>
    <div style={{background:t.bgElevated,borderRadius:12,border:`1px solid ${t.border}`,overflow:"hidden",marginBottom:14}}>
      <div style={{background:t.grad,padding:"14px 18px",textAlign:"center"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#fff"}}> مدرسة القيادة — فاتورة رقم F-2024-0245</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:2}}>الطالب: {booking.student} • حجز {booking.id} • {booking.date}</div>
      </div>
      <div style={{padding:"12px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${t.border}`,fontSize:12}}><span style={{color:t.textMuted}}>سعر الجلسة الكامل</span><span style={{fontWeight:600,color:t.text}}>٣,٠٠٠ ل.س</span></div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${t.border}`,fontSize:12}}><span style={{color:t.textMuted}}>العربون المدفوع (شام كاش)</span><span style={{fontWeight:600,color:t.completed.text}}>- ١,٥٠٠ ل.س</span></div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${t.border}`,fontSize:12}}><span style={{color:t.textMuted}}>المبلغ المتبقي</span><span style={{fontWeight:600,color:t.pending.text}}>١,٥٠٠ ل.س</span></div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${t.border}`,fontSize:12}}>
          <span style={{color:t.textMuted}}>حسم (اختياري)</span>
          <div style={{display:"flex",gap:5,alignItems:"center"}}><input value={disc} onChange={e=>setDisc(e.target.value)} placeholder="0" type="number" style={{width:70,padding:"4px 7px",borderRadius:6,border:`1px solid ${t.border}`,background:t.bgSurface,color:t.text,fontSize:12,fontFamily:"inherit",textAlign:"center",outline:"none"}}/><span style={{fontSize:11,color:t.textMuted}}>ل.س</span></div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"9px 0",fontSize:15,fontWeight:700}}><span style={{color:t.text}}>الإجمالي المستحق</span><span style={{color:t.accent}}>{total.toLocaleString("en")} ل.س</span></div>
      </div>
    </div>
    <div style={{padding:"9px 12px",borderRadius:9,background:t.pending.bg,fontSize:12,color:t.pending.text,marginBottom:14}}>⚠ بعد التأكيد تُحفظ الفاتورة وتصبح الجلسة "مكتملة"</div>
    <div style={{display:"flex",gap:8}}><Btn label="✓ تأكيد وإصدار الفاتورة" onClick={onClose} t={t} style={{flex:1}}/><Btn label="إلغاء" onClick={onClose} t={t} v="ghost"/></div>
  </Modal>;
}


const STUDENT_STATUS_MAP = {
  IN_TRAINING: "قيد التدريب",
  PASSED: "ناجح",
  FAILED: "راسب",
  CERTIFICATE_SEEKER: "طلب شهادة",
};
const STUDENT_STATUS_FILTER = [
  { value: "", label: "الكل" },
  { value: "IN_TRAINING", label: "قيد التدريب" },
  { value: "PASSED", label: "ناجح" },
  { value: "FAILED", label: "راسب" },
  { value: "CERTIFICATE_SEEKER", label: "طلب شهادة" },
];

function SectionStudents({t}){
  const { hasPermission } = useAuth();
  const canCreateStudent = hasPermission(P.STUDENTS_CREATE);
  const canCreateBooking = hasPermission(P.BOOKINGS_CREATE);
  const canCompleteBooking = hasPermission(P.BOOKINGS_COMPLETE);
  const canCancelBooking = hasPermission(P.BOOKINGS_CANCEL);
  const sId   = (s) => s?.studentId ?? s?.id;
  const sName = (s) => s?.user?.name  || s?.name  || "—";
  const sPhone= (s) => s?.user?.phone || s?.phone || "—";
  const sStatus=(s) => STUDENT_STATUS_MAP[s?.studentStatus] || s?.studentStatus || "—";
  const gLabel= (g) => g==="MALE"?"ذكر":g==="FEMALE"?"أنثى":"—";
  const ttLabel=(tt)=> tt==="MANUAL"?"عادي":tt==="AUTOMATIC"?"أوتوماتيك":"—";

  // ── List state ──
  const [students,      setStudents]      = useState([]);
  const [loadingList,   setLoadingList]   = useState(true);
  const [search,        setSearch]        = useState("");
  const [fSt,           setFSt]           = useState("");
  const [sel,           setSel]           = useState(null);

  // ── Detail state (GET /students/:id) ──
  const [detail,        setDetail]        = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ── Tabs + bookings ──
  const [dTab,          setDTab]          = useState("bookings");
  const [bookings,      setBookings]      = useState([]);
  const [loadingBk,     setLoadingBk]     = useState(false);
  const [bFilt,         setBFilt]         = useState("");
  const [statusBusyId,  setStatusBusyId]  = useState(null);
  const [actionToast,   setActionToast]   = useState(null);
  const [cancelBkModal, setCancelBkModal] = useState(null);
  const [cancelBkToast, setCancelBkToast] = useState(null);
  const [payRemModal,   setPayRemModal]   = useState(null);

  // ── Create booking modal ──
  const [bookingModal,  setBookingModal]  = useState(false);

  // ── Create student modal ──
  const [newStudentModal, setNewStudentModal] = useState(false);
  const [newName,        setNewName]       = useState("");
  const [newPhone,       setNewPhone]      = useState("");
  const [newPassword,    setNewPassword]   = useState("");
  const [creating,       setCreating]      = useState(false);

  // ── Fetch list ──
  const fetchList = async (keepSel = true) => {
    setLoadingList(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (fSt) params.status = fSt;
      const res = await studentsService.getAll(params);
      const body = res.data?.data ?? res.data;
      const arr  = Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : []);
      setStudents(arr);
      if (keepSel) setSel(prev => (prev && arr.some(s => String(sId(s)) === String(sId(prev)))) ? prev : (arr[0] || null));
      else setSel(arr[0] || null);
    } catch { setStudents([]); setSel(null); }
    finally  { setLoadingList(false); }
  };

  useEffect(() => { let c=false; (async()=>{ setLoadingList(true); try { const params={}; if(search.trim())params.search=search.trim(); if(fSt)params.status=fSt; const res=await studentsService.getAll(params); const body=res.data?.data??res.data; const arr=Array.isArray(body?.data)?body.data:(Array.isArray(body)?body:[]); if(!c){setStudents(arr);setSel(prev=>(prev&&arr.some(s=>String(sId(s))===String(sId(prev))))?prev:(arr[0]||null));} } catch{if(!c){setStudents([]);setSel(null);}} finally{if(!c)setLoadingList(false);} })(); return()=>{c=true;}; }, [search, fSt]);

  // ── Fetch full student detail ──
  useEffect(() => {
    if (!sel) return;
    let c = false;
    (async () => {
      if (!c) setLoadingDetail(true);
      try {
        const res  = await studentsService.getById(sId(sel));
        const body = res.data?.data ?? res.data;
        if (!c) setDetail(body);
      } catch { if (!c) setDetail(null); }
      finally  { if (!c) setLoadingDetail(false); }
    })();
    return () => { c = true; };
  }, [sel]);

  // ── Fetch student bookings via GET /students/:studentId/bookings ──
  const fetchStudentBookings = async (cancelled = { v: false }) => {
    if (!sel) { setBookings([]); return; }
    setLoadingBk(true);
    try {
      const studentId = sel.studentId ?? sel.id;
      const params = {};
      if (bFilt) params.bookingStatus = bFilt;
      const res = await studentsService.getBookings(studentId, params);
      const body = res.data?.data ?? res.data;
      const list = Array.isArray(body?.data) ? body.data : [];
      if (!cancelled.v) setBookings(list);
    } catch {
      if (!cancelled.v) setBookings([]);
    } finally {
      if (!cancelled.v) setLoadingBk(false);
    }
  };

  const fetchBookings = () => fetchStudentBookings();

  useEffect(() => {
    const guard = { v: false };
    (async () => { await fetchStudentBookings(guard); })();
    return () => { guard.v = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, bFilt]);

  const showActionToast = (msg, isErr = false) => {
    setActionToast({ msg, isErr });
    setTimeout(() => setActionToast(null), isErr ? 4500 : 3000);
  };

  // ── Update booking status ──
  const handleUpdateStatus = async (bookingId, status) => {
    setStatusBusyId(bookingId);
    try {
      await bookingsService.updateStatus(bookingId, status);
      await fetchBookings();
    } catch (err) {
      const raw = err?.response?.data?.message;
      showActionToast(Array.isArray(raw) ? raw.join("، ") : (raw || "حدث خطأ أثناء تحديث الحجز"), true);
    } finally {
      setStatusBusyId(null);
    }
  };

  // ── Collect remainder payment — open modal (same as SectionBookings) ──
  const handlePayRemainder = (b) => setPayRemModal({ ...b, student: sName(sel) });

  // ── Create student ──
  const handleCreateStudent = async () => {
    if (!newName.trim() || !newPhone.trim() || !newPassword.trim()) return;
    setCreating(true);
    try {
      await studentsService.create({ name: newName.trim(), phone: newPhone.trim(), password: newPassword.trim() });
      setNewStudentModal(false); setNewName(""); setNewPhone(""); setNewPassword("");
      await fetchList(false);
    } catch (e) { alert(e?.response?.data?.message || "حدث خطأ في تسجيل الطالب"); }
    finally { setCreating(false); }
  };

  const mappedBookings = (Array.isArray(bookings) ? bookings : []).map(b => {
    const dateStr = b.date ? b.date.split("T")[0] : null;
    const et = b.endTime ? b.endTime.substring(0, 5) : null;
    return {
      id: b.id,
      dateTime: formatBookingDate(b),
      inst:           b.instructorName || b.instructor?.name || "—",
      type:           TRAINING_MAP[b.trainingType] || b.trainingType || "—",
      status:         BOOKING_STATUS_MAP[b.bookingStatus] || b.bookingStatus || "—",
      pay:            PAYMENT_STATUS_MAP[b.paymentStatus] || b.paymentStatus || "—",
      rawStatus:       b.bookingStatus,
      rawPayment:      b.paymentStatus,
      canPayRemainder: b.canPayRemainder ?? false,
      vehicleSource:   b.vehicleSource,
      vehiclePlate:    b.vehiclePlate,
      remainingAmount: b.remainingAmount,
      sessionEnded:    dateStr && et ? Date.now() > new Date(`${dateStr}T${et}:00`).getTime() : false, // eslint-disable-line react-hooks/purity -- session-end gate only, staleness across a render is harmless
    };
  });
  const shownBookings = mappedBookings;

  const dotColor = (raw) => {
    if (raw === "COMPLETED")       return t.completed.dot;
    if (raw === "BOOKED")          return t.confirmed.dot;
    if (raw === "PENDING_PAYMENT") return t.pending.dot;
    if (raw === "CANCELLED")       return t.cancelled.dot;
    if (raw === "NO_SHOW")         return t.noshow.dot;
    return t.expired.dot;
  };

  const d = sel ? detail : null;

  return (
    <div style={{ display: "flex", height: "100%" }}>

      {/* ── Left list panel ── */}
      <div className="hide-scrollbar" style={{ width: 290, height: "100%", flexShrink: 0, display: "flex", flexDirection: "column", overflow: "hidden", borderLeft: `1px solid ${t.border}` }}>
        <div style={{ padding: "12px 12px 8px", borderBottom: `1px solid ${t.border}` }}>
          <SearchBar placeholder="بحث بالاسم أو الهاتف..." t={t} value={search} onChange={setSearch} />
          <div style={{ display: "flex", gap: 3, marginTop: 8, flexWrap: "wrap" }}>
            {STUDENT_STATUS_FILTER.map(f => (
              <button key={f.value} onClick={() => setFSt(f.value)} style={{ padding: "3px 9px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 10, fontWeight: fSt === f.value ? 700 : 400, background: fSt === f.value ? t.accent : "transparent", color: fSt === f.value ? "#fff" : t.textMuted }}>{f.label}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loadingList ? (
            <div style={{ padding: 24, textAlign: "center", color: t.textMuted, fontSize: 12 }}>جارٍ التحميل...</div>
          ) : students.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: t.textMuted, fontSize: 12 }}>لا يوجد طلاب</div>
          ) : students.map(s => {
            const isSel = sel && String(sId(sel)) === String(sId(s));
            return (
              <div key={sId(s)} onClick={() => { setSel(s); setDTab("bookings"); setBFilt(""); }} style={{ padding: "11px 13px", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, borderBottom: `1px solid ${t.border}`, background: isSel ? t.accentLight : t.bgSurface, borderRight: isSel ? `3px solid ${t.accent}` : "3px solid transparent" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#778a3b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{sName(s).charAt(0)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sName(s)}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <span dir="ltr">{sPhone(s)}</span>
                    {s.completedBookingsCount != null && <span style={{ color: t.accent, fontWeight: 600 }}>{s.completedBookingsCount} درس</span>}
                    {s.certificateStatus && <span style={{ color: t.textMuted }}>·</span>}
                    {s.certificateStatus && <span style={{ color: t.accentText, fontWeight: 600 }}>{CERT_STATUS_MAP[s.certificateStatus]?.label || s.certificateStatus}</span>}
                  </div>
                </div>
                <Badge s={sStatus(s)} t={t} />
              </div>
            );
          })}
        </div>
        {canCreateStudent && (
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${t.border}`, background: t.bgElevated }}>
            <Btn label="+ تسجيل طالب جديد" onClick={() => setNewStudentModal(true)} t={t} sz="sm" style={{ width: "100%" }} />
          </div>
        )}
      </div>

      {/* ── Right detail panel ── */}
      {sel && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 14, background: t.bgSurface, flexShrink: 0 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#778a3b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff", fontWeight: 700 }}>{sName(sel).charAt(0)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: t.text }}>{sName(sel)}</div>
              <div style={{ fontSize: 12, color: t.textSec, marginTop: 2, direction: "ltr", textAlign: "right" }}>{sPhone(sel)}</div>
              <div style={{ marginTop: 5, display: "flex", gap: 5, flexWrap: "wrap" }}>
                <Badge s={sStatus(sel)} t={t} />
                {d?.gender     && <Badge s={gLabel(d.gender)}      t={t} />}
                {d?.trainingType && <Badge s={ttLabel(d.trainingType)} t={t} />}
              </div>
            </div>
            {canCreateBooking && <Btn label="+ حجز جديد" onClick={() => setBookingModal(true)} t={t} sz="sm" />}
          </div>

          <div style={{ display: "flex", borderBottom: `1px solid ${t.border}`, background: t.bgSurface, padding: "0 22px", flexShrink: 0 }}>
            {[["bookings","الحجوزات"],["info","البيانات"]].map(([id,label]) => (
              <button key={id} onClick={() => setDTab(id)} style={{ padding: "11px 15px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: dTab===id?700:400, background: "transparent", color: dTab===id?t.accent:t.textSec, borderBottom: `2px solid ${dTab===id?t.accent:"transparent"}`, marginBottom: -1 }}>{label}</button>
            ))}
          </div>

          <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "18px 22px" }}>

            {dTab === "bookings" && (
              <div>
                <div style={{ display: "flex", gap: 3, marginBottom: 12, background: t.bgElevated, borderRadius: 8, padding: 3, overflowX: "auto" }}>
                  {BOOKING_STATUS_FILTER.map(f => (
                    <button key={f.value} onClick={() => setBFilt(f.value)} style={{ flex: 1, padding: "6px 8px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: bFilt===f.value?700:400, whiteSpace: "nowrap", background: bFilt===f.value?t.bgSurface:"transparent", color: bFilt===f.value?t.text:t.textMuted, boxShadow: bFilt===f.value?t.shadow:"none" }}>{f.label}</button>
                  ))}
                </div>
                {loadingBk ? (
                  <div style={{ padding: 30, textAlign: "center", color: t.textMuted, fontSize: 13 }}>جارٍ تحميل الحجوزات...</div>
                ) : shownBookings.length === 0 ? (
                  <div style={{ padding: 30, textAlign: "center", color: t.textMuted, fontSize: 13 }}>لا توجد حجوزات لهذا الطالب</div>
                ) : shownBookings.map(b => (
                  <div key={b.id} style={{ background: t.bgSurface, borderRadius: 10, border: `1px solid ${t.borderCard}`, padding: "12px 14px", marginBottom: 7, borderRight: `3px solid ${dotColor(b.rawStatus)}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: t.textMuted }}>#{b.id}</span>
                        <div style={{ fontSize: 12, color: t.textSec, marginTop: 2, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><IoIosCalendar style={{ fontSize: 13 }} /> {b.dateTime}</span>
                          <span style={{ color: t.border }}>|</span>
                          <span style={{ fontWeight: 600 }}>{b.inst}</span>
                          <span style={{ color: t.border }}>|</span>
                          <span style={{ fontWeight: 600, color: t.accent }}>{b.type}</span>
                          {b.vehicleSource === "SCHOOL_CAR" && b.vehiclePlate && (
                            <><span style={{ color: t.border }}>|</span><span style={{ fontSize: 11, color: t.textMuted }} dir="ltr">{b.vehiclePlate}</span></>
                          )}
                          {b.vehicleSource === "STUDENT_CAR" && (
                            <><span style={{ color: t.border }}>|</span><span style={{ fontSize: 11, color: t.textMuted }}>سيارة الطالب</span></>
                          )}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
                        <Badge s={b.pay} t={t} />
                        <Badge s={b.status} t={t} />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 7, marginTop: 9, flexWrap: "wrap" }}>
                      {canCompleteBooking && (b.rawStatus === "BOOKED" || b.rawStatus === "NO_SHOW") && (
                        <Btn
                          label={statusBusyId === b.id ? "جارٍ..." : "✓ إكمال الجلسة"}
                          onClick={() => handleUpdateStatus(b.id, "COMPLETED")}
                          t={t} sz="sm"
                          disabled={statusBusyId === b.id || !b.sessionEnded || b.rawPayment !== "FULLY_PAID"}
                          title={!b.sessionEnded ? "بعد انتهاء الجلسة" : (b.rawPayment !== "FULLY_PAID" ? "حصّل المبلغ المتبقي أولاً" : undefined)}
                        />
                      )}
                      {canCompleteBooking && b.rawStatus === "BOOKED" && (
                        <Btn
                          label="لم يحضر"
                          onClick={() => handleUpdateStatus(b.id, "NO_SHOW")}
                          t={t} sz="sm" v="danger"
                          disabled={statusBusyId === b.id || !b.sessionEnded}
                          title={!b.sessionEnded ? "بعد انتهاء الجلسة" : undefined}
                        />
                      )}
                      {(b.canPayRemainder || b.remainingAmount != null || b.rawPayment === "DEPOSIT_NON_REFUNDABLE") && (
                        <Btn label={`تحصيل الباقي${b.remainingAmount != null ? ` — ${Number(b.remainingAmount).toLocaleString("en")} ل.س` : ""}`} onClick={() => handlePayRemainder(b)} t={t} sz="sm" v="secondary" disabled={statusBusyId === b.id} />
                      )}
                      {canCancelBooking && (b.rawStatus === "BOOKED" || b.rawStatus === "PENDING_PAYMENT") && (
                        <Btn label="إلغاء الحجز" onClick={() => setCancelBkModal({ ...b, student: sName(sel) })} t={t} sz="sm" v="danger" disabled={statusBusyId === b.id} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {dTab === "info" && (
              <Card t={t} p={16}>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 12 }}>بيانات الطالب</div>
                {loadingDetail ? (
                  <div style={{ padding: 16, textAlign: "center", color: t.textMuted, fontSize: 12 }}>جارٍ التحميل...</div>
                ) : (
                  <>
                    <InfoRow k="الاسم"           v={sName(d || sel)}         t={t} />
                    <InfoRow k="الهاتف"          v={sPhone(d || sel)}        t={t} />
                    <InfoRow k="الحالة"          v={sStatus(d || sel)}       t={t} />
                    <InfoRow k="الجنس"           v={gLabel(d?.gender)}       t={t} />
                    <InfoRow k="نوع التدريب"     v={ttLabel(d?.trainingType)} t={t} />
                    {d?.nationalId  && <InfoRow k="رقم الهوية"       v={String(d.nationalId)}                                          t={t} />}
                    {d?.createdAt   && <InfoRow k="تاريخ التسجيل"   v={new Date(d.createdAt).toLocaleDateString("ar-SY")}            t={t} />}
                    {d?.balance != null && <InfoRow k="الرصيد"        v={`${Number(d.balance).toLocaleString("en")} ل.س`}          t={t} />}
                    {sel.completedBookingsCount != null && <InfoRow k="الدروس المكتملة" v={`${sel.completedBookingsCount} درس`} t={t} />}
                    {sel.lastCompletedBookingDate && <InfoRow k="آخر درس مكتمل" v={sel.lastCompletedBookingDate} t={t} />}
                    {sel.certificateStatus && <InfoRow k="حالة الشهادة" v={CERT_STATUS_MAP[sel.certificateStatus]?.label || sel.certificateStatus} t={t} />}
                    {sel.accountStatus === "BLOCKED" && <InfoRow k="الحساب" v="محظور" t={t} />}
                  </>
                )}
              </Card>
            )}


          </div>
        </div>
      )}

      {/* ── Create booking modal ── */}
      {bookingModal && sel && (
        <CreateBookingModal
          t={t}
          initialStudentId={sId(sel)}
          initialStudentName={sName(sel)}
          onClose={() => setBookingModal(false)}
          onSuccess={() => { setBookingModal(false); fetchBookings(); }}
        />
      )}

      {/* ── Action toast (complete / no-show / pay-remainder feedback) ── */}
      {actionToast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: actionToast.isErr ? t.cancelled.bg : t.completed.bg,
          color: actionToast.isErr ? t.cancelled.text : t.completed.text,
          border: `1px solid ${actionToast.isErr ? t.cancelled.dot : t.completed.dot}40`,
          padding: "11px 24px", borderRadius: 10, fontSize: 13, fontWeight: 600,
          zIndex: 2000, whiteSpace: "nowrap", boxShadow: t.shadowMd,
        }}>{actionToast.msg}</div>
      )}

      {/* ── Pay remainder modal ── */}
      {payRemModal && (
        <PayRemainingModal
          booking={payRemModal}
          t={t}
          onClose={() => setPayRemModal(null)}
          onSuccess={() => { setPayRemModal(null); fetchBookings(); }}
        />
      )}

      {/* ── Cancel booking modal ── */}
      {cancelBkModal && (
        <CancelBookingModal
          booking={cancelBkModal}
          t={t}
          onClose={() => setCancelBkModal(null)}
          onSuccess={(msg) => {
            setCancelBkModal(null);
            setCancelBkToast(msg);
            setTimeout(() => setCancelBkToast(null), 4000);
            fetchBookings();
          }}
        />
      )}
      {cancelBkToast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: t.cancelled.bg, color: t.cancelled.text,
          border: `1px solid ${t.cancelled.dot}40`,
          padding: "11px 24px", borderRadius: 10, fontSize: 13, fontWeight: 600,
          zIndex: 2000, whiteSpace: "nowrap", boxShadow: t.shadowMd,
        }}>{cancelBkToast}</div>
      )}

      {/* ── Create student modal ── */}
      {newStudentModal && (
        <Modal title="تسجيل طالب جديد" onClose={() => setNewStudentModal(false)} t={t} width={420}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 5 }}>الاسم الكامل</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="أدخل الاسم الكامل" style={{ width: "100%", padding: "9px 10px", borderRadius: 9, border: `1px solid ${t.border}`, background: t.bgElevated, color: t.text, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 5 }}>رقم الهاتف</label>
              <input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="09XXXXXXXX" type="tel" dir="ltr" style={{ width: "100%", padding: "9px 10px", borderRadius: 9, border: `1px solid ${t.border}`, background: t.bgElevated, color: t.text, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 5 }}>كلمة المرور المؤقتة</label>
              <input value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="كلمة المرور" type="password" style={{ width: "100%", padding: "9px 10px", borderRadius: 9, border: `1px solid ${t.border}`, background: t.bgElevated, color: t.text, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Btn label={creating ? "جاري الحفظ..." : "✓ تسجيل الطالب"} onClick={handleCreateStudent} t={t} disabled={creating || !newName.trim() || !newPhone.trim() || !newPassword.trim()} style={{ flex: 1 }} />
            <Btn label="إلغاء" onClick={() => setNewStudentModal(false)} t={t} v="ghost" />
          </div>
        </Modal>
      )}

    </div>
  );
}

const GENDER_MAP = { MALE: "ذكر", FEMALE: "أنثى" };
const INSTRUCTOR_TYPE_MAP = { MANUAL: "عادي", AUTOMATIC: "أوتوماتيك", BOTH: "عادي + أوتوماتيك" };
const INSTRUCTOR_TYPE_FILTER = [
  { value: "", label: "الكل" },
  { value: "MANUAL", label: "عادي" },
  { value: "AUTOMATIC", label: "أوتوماتيك" },
  { value: "BOTH", label: "كلاهما" },
];
const GENDER_FILTER = [
  { value: "", label: "الكل" },
  { value: "MALE", label: "ذكر" },
  { value: "FEMALE", label: "أنثى" },
];
const DAY_OF_WEEK_ORDER = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAY_OF_WEEK_LABELS = { SUN: "الأحد", MON: "الاثنين", TUE: "الثلاثاء", WED: "الأربعاء", THU: "الخميس", FRI: "الجمعة", SAT: "السبت" };


// dayOfWeek/periods come back from GET /instructors/{id}/schedule as e.g. { dayOfWeek: "SAT", periods: [{ startTime: "08:00:00", endTime: "14:00:00" }] }
// the update endpoint expects "HH:MM" (no seconds), so times are normalized on read.
function hhmm(v) { return typeof v === "string" ? v.slice(0, 5) : v; }

// Instructor's own account status; leaveStatus (from GET .../profile) is non-null only while currently on leave.
function instructorStatusLabel(entity) {
  if (entity?.leaveStatus) return "في إجازة";
  const acct = entity?.accountStatus;
  if (acct === "BLOCKED" || acct === "ARCHIVED") return "غير نشط";
  return "نشط";
}

// GET /instructors -> { data: [...] }; GET .../bookings -> { data: { data: [...], meta } }; GET .../leaves -> { data: { leaves: [...] } }
function extractList(body, keys) {
  if (!body) return [];
  const b = body?.data ?? body;
  if (Array.isArray(b)) return b;
  if (b && typeof b === "object") {
    if (Array.isArray(b.data)) return b.data;
    for (const k of keys) if (Array.isArray(b[k])) return b[k];
  }
  return [];
}

function formatMoney(v) {
  if (v == null || v === "") return "—";
  const n = Number(v);
  return isNaN(n) ? String(v) : `${n.toLocaleString("en")} ل.س`;
}

function formatLeaveRange(l) {
  try {
    if (l.date) {
      const d = new Date(l.date + "T00:00:00");
      return d.toLocaleDateString("ar-SY", { weekday: "long", day: "numeric", month: "long" }) + " — يوم كامل";
    }
    if (l.startAt && l.endAt) {
      const s = new Date(l.startAt), e = new Date(l.endAt);
      const day = s.toLocaleDateString("ar-SY", { weekday: "long", day: "numeric", month: "long" });
      const st = s.toLocaleTimeString("ar-SY", { hour: "2-digit", minute: "2-digit", hour12: false });
      const et = e.toLocaleTimeString("ar-SY", { hour: "2-digit", minute: "2-digit", hour12: false });
      return `${day} — من ${st} إلى ${et}`;
    }
  } catch { /* empty */ }
  return "—";
}

function SectionInstructors({ t }) {
  const { hasPermission } = useAuth();
  const canCreateInstructor = hasPermission(P.INSTRUCTORS_CREATE);
  const canManageLeave = hasPermission(P.INSTRUCTOR_LEAVE_CREATE);
  const canUpdateSchedule = hasPermission(P.INSTRUCTOR_SCHEDULE_UPDATE);
  // The list/profile "id" field is the instructor's *user* id — routes are keyed by "instructorId".
  const iId = (i) => i?.instructorId;
  const iName = (i) => i?.name || "—";
  const iPhone = (i) => i?.phone || "—";
  const iGender = (i) => i?.gender;

  const [instructors, setInstructors] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sel, setSel] = useState(null);
  const [dTab, setDTab] = useState("info");

  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const [schedule, setSchedule] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(null);

  const [bookingDate, setBookingDate] = useState(todayStr());
  const [bookingStatusFilter, setBookingStatusFilter] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const [leaves, setLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [leaveModal, setLeaveModal] = useState(null);
  const [leaveBusyId, setLeaveBusyId] = useState(null);
  const [deleteLeaveTarget, setDeleteLeaveTarget] = useState(null);

  const [addModal, setAddModal] = useState(false);

  // ── Fetch instructors list (search + filters) ──
  const fetchInstructors = async () => {
    setLoadingList(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (genderFilter) params.gender = genderFilter;
      if (typeFilter) params.instructorType = typeFilter;
      const res = await instructorsService.getAll(params);
      const arr = extractList(res.data, ["items", "instructors", "results", "rows"]);
      setInstructors(arr);
      setSel(prev => (prev && arr.some(i => String(iId(i)) === String(iId(prev)))) ? prev : (arr[0] || null));
    } catch {
      setInstructors([]);
      setSel(null);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingList(true);
      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (genderFilter) params.gender = genderFilter;
        if (typeFilter) params.instructorType = typeFilter;
        const res = await instructorsService.getAll(params);
        const arr = extractList(res.data, ["items", "instructors", "results", "rows"]);
        if (!cancelled) {
          setInstructors(arr);
          setSel(prev => (prev && arr.some(i => String(iId(i)) === String(iId(prev)))) ? prev : (arr[0] || null));
        }
      } catch {
        if (!cancelled) { setInstructors([]); setSel(null); }
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    })();
    return () => { cancelled = true; };
  }, [search, genderFilter, typeFilter]);

  // ── Fetch selected instructor's profile + stats ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!sel) { setDetail(null); setStats(null); return; }
      setLoadingDetail(true);
      try {
        const [baseRes, profileRes] = await Promise.allSettled([
          instructorsService.getById(iId(sel)),
          instructorsService.getProfile(iId(sel)),
        ]);
        const base = baseRes.status === "fulfilled" ? (baseRes.value.data?.data ?? baseRes.value.data) : null;
        const profile = profileRes.status === "fulfilled" ? (profileRes.value.data?.data ?? profileRes.value.data) : null;
        if (!cancelled) {
          // profile (GET .../profile, confirmed shape) always wins over the plain get-one response.
          setDetail({
            ...(base && typeof base === "object" ? base : {}),
            ...(profile && typeof profile === "object" ? profile : {}),
          });
        }
      } catch {
        if (!cancelled) setDetail(null);
      } finally {
        if (!cancelled) setLoadingDetail(false);
      }

      setLoadingStats(true);
      try {
        const res = await instructorsService.getStats(iId(sel));
        const body = res.data?.data ?? res.data;
        if (!cancelled) setStats(body && typeof body === "object" ? body : {});
      } catch {
        if (!cancelled) setStats(null);
      } finally {
        if (!cancelled) setLoadingStats(false);
      }
    })();
    return () => { cancelled = true; };
  }, [sel]);

  // ── Fetch selected instructor's weekly schedule ──
  const fetchSchedule = async () => {
    if (!sel) { setSchedule([]); return; }
    setLoadingSchedule(true);
    try {
      const res = await instructorsService.getSchedule(iId(sel));
      const body = res.data?.data ?? res.data;
      const arr = Array.isArray(body?.schedule) ? body.schedule : (Array.isArray(body) ? body : []);
      setSchedule(arr);
    } catch {
      setSchedule([]);
    } finally {
      setLoadingSchedule(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!sel) { setSchedule([]); return; }
      setLoadingSchedule(true);
      try {
        const res = await instructorsService.getSchedule(iId(sel));
        const body = res.data?.data ?? res.data;
        const arr = Array.isArray(body?.schedule) ? body.schedule : (Array.isArray(body) ? body : []);
        if (!cancelled) setSchedule(arr);
      } catch {
        if (!cancelled) setSchedule([]);
      } finally {
        if (!cancelled) setLoadingSchedule(false);
      }
    })();
    return () => { cancelled = true; };
  }, [sel]);

  // ── Fetch selected instructor's leaves ──
  const fetchLeaves = async () => {
    if (!sel) { setLeaves([]); return; }
    setLoadingLeaves(true);
    try {
      const res = await instructorsService.getLeaves(iId(sel));
      const arr = extractList(res.data, ["leaves", "items", "results"]);
      setLeaves(arr);
    } catch {
      setLeaves([]);
    } finally {
      setLoadingLeaves(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!sel) { setLeaves([]); return; }
      setLoadingLeaves(true);
      try {
        const res = await instructorsService.getLeaves(iId(sel));
        const arr = extractList(res.data, ["leaves", "items", "results"]);
        if (!cancelled) setLeaves(arr);
      } catch {
        if (!cancelled) setLeaves([]);
      } finally {
        if (!cancelled) setLoadingLeaves(false);
      }
    })();
    return () => { cancelled = true; };
  }, [sel]);

  // ── Fetch selected instructor's daily bookings ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!sel) { setBookings([]); return; }
      setLoadingBookings(true);
      try {
        const params = { viewMode: "day", date: bookingDate, page: 1, limit: 20 };
        if (bookingStatusFilter) params.bookingStatus = bookingStatusFilter;
        const res = await instructorsService.getBookings(iId(sel), params);
        const arr = extractList(res.data, ["items", "bookings", "results", "rows"]);
        if (!cancelled) setBookings(arr);
      } catch {
        if (!cancelled) setBookings([]);
      } finally {
        if (!cancelled) setLoadingBookings(false);
      }
    })();
    return () => { cancelled = true; };
  }, [sel, bookingDate, bookingStatusFilter]);

  const handleDeleteLeave = async () => {
    if (!deleteLeaveTarget || !sel) return;
    setLeaveBusyId(deleteLeaveTarget.id);
    try {
      await instructorsService.deleteLeave(iId(sel), deleteLeaveTarget.id);
      setDeleteLeaveTarget(null);
      await fetchLeaves();
    } catch { /* silent */ }
    finally { setLeaveBusyId(null); }
  };

  const display = { ...(sel || {}), ...(detail || {}) };
  const instructorType = INSTRUCTOR_TYPE_MAP[display.instructorType] || display.instructorType || "—";
  const statusLabel = instructorStatusLabel(display);
  const sessionWage = display.sessionWage ?? stats?.sessionWage;
  const todayLessonsCount = display.todayLessonsCount ?? stats?.todayLessonsCount;

  const st = stats || {};
  const sessionsThisMonth = st.sessionsThisMonth;
  const noShowsThisMonth = st.noShowsThisMonth;
  const completionRate = st.completionRate;
  const dueToday = st.dueToday;
  const totalOutstanding = st.totalOutstanding;

  const scheduleByDay = {};
  DAY_OF_WEEK_ORDER.forEach(d => { scheduleByDay[d] = []; });
  (Array.isArray(schedule) ? schedule : []).forEach(row => {
    const day = row.dayOfWeek;
    if (day && scheduleByDay[day] !== undefined) {
      scheduleByDay[day] = (Array.isArray(row.periods) ? row.periods : []).map(p => ({ startTime: hhmm(p.startTime), endTime: hhmm(p.endTime) }));
    }
  });

  const shiftBookingDate = (delta) => {
    const d = new Date(bookingDate + "T00:00:00");
    d.setDate(d.getDate() + delta);
    // toISOString() reads UTC — in UTC+ timezones local midnight is still the previous UTC day,
    // silently shifting the result by a day. Read back local Y/M/D instead of round-tripping through UTC.
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    setBookingDate(`${y}-${m}-${day}`);
  };

  const formatDayHeader = (dateStr) => {
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("ar-SY", { weekday: "long", day: "numeric", month: "long" });
    } catch { return dateStr; }
  };

  const mapLessonBooking = (b) => ({
    id: b.id,
    student: b.student?.name || "—",
    timeLabel: b.startTime && b.endTime ? `${b.startTime}–${b.endTime}` : "—",
    vehicle: b.vehicleSource === "STUDENT_CAR" ? "سيارة الطالب" : "سيارة المدرسة",
    type: TRAINING_MAP[b.trainingType] || b.trainingType || "—",
    status: BOOKING_STATUS_MAP[b.bookingStatus] || b.bookingStatus || "—",
    pay: PAYMENT_STATUS_MAP[b.paymentStatus] || b.paymentStatus || "—",
    rawStatus: b.bookingStatus,
  });
  const mappedBookings = (Array.isArray(bookings) ? bookings : []).map(mapLessonBooking);

  const dotColor = (raw) => {
    if (raw === "COMPLETED") return t.completed.dot;
    if (raw === "BOOKED") return t.confirmed.dot;
    if (raw === "PENDING_PAYMENT") return t.pending.dot;
    if (raw === "CANCELLED") return t.cancelled.dot;
    if (raw === "NO_SHOW") return t.noshow.dot;
    return t.expired.dot;
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* ── Left list panel ── */}
      <div className="hide-scrollbar" style={{ width: 290, height: "100%", flexShrink: 0, display: "flex", flexDirection: "column", overflow: "hidden", borderLeft: `1px solid ${t.border}` }}>
        <div style={{ padding: "12px 12px 8px", borderBottom: `1px solid ${t.border}` }}>
          <SearchBar placeholder="بحث عن مدرب..." t={t} value={search} onChange={setSearch} />
          <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
            {GENDER_FILTER.map(g => (
              <button key={g.value} onClick={() => setGenderFilter(g.value)} style={{ flex: 1, padding: "5px", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: genderFilter === g.value ? 700 : 400, background: genderFilter === g.value ? t.accent : "transparent", color: genderFilter === g.value ? "#fff" : t.textMuted }}>{g.label}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 3, marginTop: 5, flexWrap: "wrap" }}>
            {INSTRUCTOR_TYPE_FILTER.map(f => (
              <button key={f.value} onClick={() => setTypeFilter(f.value)} style={{ padding: "3px 9px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 10, fontWeight: typeFilter === f.value ? 700 : 400, background: typeFilter === f.value ? t.accent : "transparent", color: typeFilter === f.value ? "#fff" : t.textMuted }}>{f.label}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loadingList ? (
            <div style={{ padding: 24, textAlign: "center", color: t.textMuted, fontSize: 12 }}>جارٍ التحميل...</div>
          ) : instructors.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: t.textMuted, fontSize: 12 }}>لا يوجد مدربون</div>
          ) : instructors.map(inst => {
            const isSel = sel && String(iId(sel)) === String(iId(inst));
            const male = iGender(inst) === "MALE";
            return (
              <div key={iId(inst)} onClick={() => { setSel(inst); setDTab("info"); setBookingDate(todayStr()); setBookingStatusFilter(""); }} style={{ padding: "11px 13px", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, borderBottom: `1px solid ${t.border}`, background: isSel ? t.accentLight : t.bgSurface, borderRight: isSel ? `3px solid ${t.accent}` : "3px solid transparent" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: male ? t.confirmed.bg : t.noshow.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: male ? t.confirmed.text : t.noshow.text, fontWeight: 700, flexShrink: 0 }}>{iName(inst).charAt(0)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{iName(inst)}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1, direction: "ltr", textAlign: "right" }}>{iPhone(inst)}</div>
                </div>
                <Badge s={instructorStatusLabel(inst)} t={t} />
              </div>
            );
          })}
        </div>
        {canCreateInstructor && (
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${t.border}`, background: t.bgElevated }}>
            <Btn label="+ إضافة مدرب" onClick={() => setAddModal(true)} t={t} sz="sm" style={{ width: "100%" }} />
          </div>
        )}
      </div>

      {/* ── Right detail panel ── */}
      {sel && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 14, background: t.bgSurface, flexShrink: 0 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: iGender(display) === "MALE" ? t.confirmed.bg : t.noshow.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: iGender(display) === "MALE" ? t.confirmed.text : t.noshow.text, fontWeight: 700 }}>{iName(display).charAt(0)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: t.text }}>{iName(display)}</div>
              <div style={{ fontSize: 12, color: t.textSec, marginTop: 2, direction: "ltr", textAlign: "right" }}>{iPhone(display)}</div>
              <div style={{ marginTop: 5, display: "flex", gap: 5 }}>
                <Badge s={statusLabel} t={t} />
                {iGender(display) && <Badge s={GENDER_MAP[iGender(display)] || iGender(display)} t={t} />}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", borderBottom: `1px solid ${t.border}`, background: t.bgSurface, padding: "0 22px", flexShrink: 0 }}>
            {[["info", "البيانات"], ["schedule", "جدول اليوم"], ["availability", "أوقات التوفر"], ["leaves", "الإجازات"]].map(([id, label]) => (
              <button key={id} onClick={() => setDTab(id)} style={{ padding: "11px 14px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: dTab === id ? 700 : 400, background: "transparent", color: dTab === id ? t.accent : t.textSec, borderBottom: `2px solid ${dTab === id ? t.accent : "transparent"}`, marginBottom: -1 }}>{label}</button>
            ))}
          </div>

          <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "18px 22px" }}>
            {dTab === "info" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Card t={t} p={16}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 10 }}>بيانات المدرب</div>
                  {loadingDetail && <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 6 }}>جارٍ تحميل البيانات...</div>}
                  <InfoRow k="الهاتف" v={iPhone(display)} t={t} />
                  <InfoRow k="الجنس" v={GENDER_MAP[iGender(display)] || iGender(display) || "—"} t={t} />
                  <InfoRow k="نوع التدريب" v={instructorType} t={t} />
                  <InfoRow k="الحالة" v={statusLabel} t={t} />
                  <InfoRow k="أجر الجلسة" v={formatMoney(sessionWage)} t={t} />
                  <InfoRow k="دروس اليوم" v={todayLessonsCount != null ? String(todayLessonsCount) : "—"} t={t} />
                </Card>
                <Card t={t} p={16}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 10 }}>الإحصاءات</div>
                  {loadingStats && <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 6 }}>جارٍ تحميل الإحصاءات...</div>}
                  <InfoRow k="جلسات الشهر" v={sessionsThisMonth != null ? String(sessionsThisMonth) : "—"} t={t} />
                  <InfoRow k="معدل الإتمام" v={completionRate != null ? `${completionRate}٪` : "—"} t={t} />
                  <InfoRow k="حالات عدم الحضور (الشهر)" v={noShowsThisMonth != null ? String(noShowsThisMonth) : "—"} t={t} />
                  <InfoRow k="المستحق اليوم" v={formatMoney(dueToday)} t={t} />
                  <InfoRow k="إجمالي المستحقات" v={formatMoney(totalOutstanding)} t={t} />
                </Card>
              </div>
            )}

            {dTab === "schedule" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 8, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => shiftBookingDate(-1)} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${t.border}`, background: t.bgElevated, cursor: "pointer", color: t.text }}>‹</button>
                    <div style={{ fontSize: 13, fontWeight: 700, color: t.text, minWidth: 150, textAlign: "center" }}>{formatDayHeader(bookingDate)}</div>
                    <button onClick={() => shiftBookingDate(1)} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${t.border}`, background: t.bgElevated, cursor: "pointer", color: t.text }}>›</button>
                    <Btn label="اليوم" onClick={() => setBookingDate(todayStr())} t={t} sz="sm" v="ghost" />
                  </div>
                  <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} style={{ padding: "6px 9px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgElevated, color: t.text, fontSize: 12, fontFamily: "inherit" }} />
                </div>
                <div style={{ display: "flex", gap: 3, marginBottom: 12, background: t.bgElevated, borderRadius: 8, padding: 3, overflowX: "auto" }}>
                  {BOOKING_STATUS_FILTER.map(f => (
                    <button key={f.value} onClick={() => setBookingStatusFilter(f.value)} style={{ flex: 1, padding: "6px 8px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: bookingStatusFilter === f.value ? 700 : 400, whiteSpace: "nowrap", background: bookingStatusFilter === f.value ? t.bgSurface : "transparent", color: bookingStatusFilter === f.value ? t.text : t.textMuted, boxShadow: bookingStatusFilter === f.value ? t.shadow : "none" }}>{f.label}</button>
                  ))}
                </div>
                {loadingBookings ? (
                  <div style={{ padding: 30, textAlign: "center", color: t.textMuted, fontSize: 13 }}>جارٍ تحميل الجلسات...</div>
                ) : mappedBookings.length === 0 ? (
                  <div style={{ padding: 30, textAlign: "center", color: t.textMuted, fontSize: 13 }}>لا توجد جلسات في هذا اليوم</div>
                ) : mappedBookings.map(b => (
                  <div key={b.id} style={{ background: t.bgSurface, borderRadius: 9, border: `1px solid ${t.borderCard}`, padding: "12px 14px", marginBottom: 7, display: "flex", alignItems: "center", gap: 12, borderRight: `3px solid ${dotColor(b.rawStatus)}` }}>
                    <div style={{ textAlign: "center", minWidth: 90 }}><div style={{ fontSize: 12, fontWeight: 700, color: t.accent }}>{b.timeLabel}</div></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{b.student}</div>
                      <div style={{ fontSize: 11, color: t.textSec, marginTop: 2 }}>{b.type} • {b.vehicle}</div>
                    </div>
                    <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
                      <Badge s={b.pay} t={t} />
                      <Badge s={b.status} t={t} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {dTab === "availability" && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 12 }}>الجدول الأسبوعي</div>
                {loadingSchedule ? (
                  <div style={{ padding: 30, textAlign: "center", color: t.textMuted, fontSize: 13 }}>جارٍ تحميل الجدول...</div>
                ) : DAY_OF_WEEK_ORDER.map(day => {
                  const periods = scheduleByDay[day] || [];
                  return (
                    <div key={day} style={{ background: t.bgSurface, borderRadius: 9, border: `1px solid ${t.borderCard}`, padding: "11px 14px", marginBottom: 7, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ minWidth: 70, fontSize: 13, fontWeight: 700, color: t.text }}>{DAY_OF_WEEK_LABELS[day]}</div>
                      <div style={{ flex: 1, display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {periods.length ? periods.map((p, i) => (
                          <span key={i} style={{ padding: "3px 9px", borderRadius: 20, background: t.accentLight, color: t.accentText, fontSize: 11, fontWeight: 600 }}>{p.startTime}–{p.endTime}</span>
                        )) : <span style={{ fontSize: 12, color: t.textMuted }}>غير متاح</span>}
                      </div>
                      {canUpdateSchedule && (
                        <Btn label="تعديل" onClick={() => setScheduleModal({ dayOfWeek: day, periods: periods.length ? periods : [{ startTime: "09:00", endTime: "12:00" }] })} t={t} sz="sm" v="ghost" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {dTab === "leaves" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>الإجازات المسجلة</div>
                  {canManageLeave && <Btn label="+ تسجيل إجازة" onClick={() => setLeaveModal({})} t={t} sz="sm" />}
                </div>
                {loadingLeaves ? (
                  <div style={{ padding: 30, textAlign: "center", color: t.textMuted, fontSize: 13 }}>جارٍ تحميل الإجازات...</div>
                ) : leaves.length === 0 ? (
                  <div style={{ padding: 30, textAlign: "center", color: t.textMuted, fontSize: 13 }}>لا توجد إجازات مسجلة</div>
                ) : leaves.map(l => (
                  <div key={l.id} style={{ background: t.bgSurface, borderRadius: 9, border: `1px solid ${t.borderCard}`, padding: "12px 14px", marginBottom: 7 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{formatLeaveRange(l)}</div>
                        {l.reason && <div style={{ fontSize: 12, color: t.textSec, marginTop: 3 }}>{l.reason}</div>}
                      </div>
                      {canManageLeave && (
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <Btn label="تعديل" onClick={() => setLeaveModal(l)} t={t} sz="sm" v="ghost" disabled={leaveBusyId === l.id} />
                          <Btn label="حذف" onClick={() => setDeleteLeaveTarget(l)} t={t} sz="sm" v="danger" disabled={leaveBusyId === l.id} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {scheduleModal && sel && (
        <ScheduleModal
          t={t}
          instructorId={iId(sel)}
          initialDay={scheduleModal.dayOfWeek}
          initialPeriods={scheduleModal.periods}
          scheduleByDay={scheduleByDay}
          onClose={() => setScheduleModal(null)}
          onSaved={fetchSchedule}
        />
      )}

      {leaveModal && sel && (
        <LeaveModal
          t={t}
          instructorId={iId(sel)}
          existing={leaveModal.id ? leaveModal : null}
          onClose={() => setLeaveModal(null)}
          onSuccess={() => { setLeaveModal(null); fetchLeaves(); }}
        />
      )}

      {deleteLeaveTarget && (
        <Modal title="حذف الإجازة" onClose={() => setDeleteLeaveTarget(null)} t={t} width={380}>
          <div style={{ padding: "10px 12px", borderRadius: 9, background: t.cancelled.bg, marginBottom: 12, fontSize: 12, color: t.cancelled.text }}>هل أنت متأكد من حذف هذه الإجازة؟</div>
          <InfoRow k="الإجازة" v={formatLeaveRange(deleteLeaveTarget)} t={t} />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Btn label={leaveBusyId === deleteLeaveTarget.id ? "جارٍ الحذف..." : "تأكيد الحذف"} onClick={handleDeleteLeave} t={t} v="danger" style={{ flex: 1 }} disabled={leaveBusyId === deleteLeaveTarget.id} />
            <Btn label="إلغاء" onClick={() => setDeleteLeaveTarget(null)} t={t} v="ghost" />
          </div>
        </Modal>
      )}

      {addModal && (
        <AddInstructorModal t={t} onClose={() => setAddModal(false)} onSuccess={() => { setAddModal(false); fetchInstructors(); }} />
      )}
    </div>
  );
}

function AddInstructorModal({ t, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", phone: "", password: "", gender: "", instructorType: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.phone.trim()) e.phone = "رقم الهاتف مطلوب";
    else if (!/^09\d{8}$/.test(form.phone.trim())) e.phone = "رقم الهاتف غير صالح (مثال: 0991234567)";
    if (!form.password) e.password = "كلمة المرور مطلوبة";
    else if (form.password.length < 4) e.password = "كلمة المرور قصيرة جداً";
    if (!form.gender) e.gender = "الجنس مطلوب";
    if (!form.instructorType) e.instructorType = "نوع التدريب مطلوب";
    return e;
  };

  const handleSubmit = async () => {
    setServerError("");
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    try {
      await instructorsService.create({
        name: form.name.trim(), phone: form.phone.trim(), password: form.password,
        gender: form.gender, instructorType: form.instructorType,
      });
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join("، ") : msg || "حدث خطأ أثناء إضافة المدرب");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldStyle = (field) => ({
    width: "100%", padding: "9px 12px", borderRadius: 9,
    border: `1.5px solid ${errors[field] ? "#c74848" : t.border}`,
    background: t.bgElevated, color: t.text, fontSize: 13,
    fontFamily: "inherit", boxSizing: "border-box", outline: "none",
  });
  const chip = (active, hasErr) => ({
    flex: 1, padding: "9px 6px", borderRadius: 9, border: "none",
    cursor: "pointer", fontSize: 12, fontWeight: 600, textAlign: "center", fontFamily: "inherit",
    background: active ? "#778a3b" : t.bgElevated,
    color: active ? "#fff" : t.textSec,
    outline: active ? "none" : `1.5px solid ${hasErr ? "#c74848" : t.border}`,
  });
  const labelStyle = { fontSize: 11, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 4 };
  const errMsg = (field) => errors[field] ? <div style={{ fontSize: 11, color: "#c74848", marginTop: 4 }}>{errors[field]}</div> : null;

  return (
    <Modal title="إضافة مدرب جديد" onClose={onClose} t={t} width={420}>
      {serverError && <div style={{ background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c74848" }}>{serverError}</div>}
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>الاسم الكامل</label>
        <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="مثال: خالد عمر الزيد" style={fieldStyle("name")} />
        {errMsg("name")}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>رقم الهاتف</label>
        <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="0991234567" dir="ltr" style={{ ...fieldStyle("phone"), textAlign: "left" }} />
        {errMsg("phone")}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>كلمة المرور</label>
        <input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="كلمة مرور الحساب" style={fieldStyle("password")} />
        {errMsg("password")}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>الجنس</label>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => set("gender", "MALE")} style={chip(form.gender === "MALE", errors.gender)}>ذكر</button>
          <button type="button" onClick={() => set("gender", "FEMALE")} style={chip(form.gender === "FEMALE", errors.gender)}>أنثى</button>
        </div>
        {errMsg("gender")}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>نوع التدريب</label>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => set("instructorType", "MANUAL")} style={chip(form.instructorType === "MANUAL", errors.instructorType)}>عادي</button>
          <button type="button" onClick={() => set("instructorType", "AUTOMATIC")} style={chip(form.instructorType === "AUTOMATIC", errors.instructorType)}>أوتوماتيك</button>
          <button type="button" onClick={() => set("instructorType", "BOTH")} style={chip(form.instructorType === "BOTH", errors.instructorType)}>كلاهما</button>
        </div>
        {errMsg("instructorType")}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn label={submitting ? "جارٍ الحفظ..." : "حفظ المدرب"} onClick={handleSubmit} t={t} style={{ flex: 1 }} disabled={submitting} />
        <Btn label="إلغاء" onClick={onClose} t={t} v="ghost" />
      </div>
    </Modal>
  );
}

function ScheduleModal({ t, instructorId, initialDay, initialPeriods, scheduleByDay, onClose, onSaved }) {
  const [day, setDay] = useState(initialDay);
  const [periods, setPeriods] = useState(initialPeriods && initialPeriods.length ? initialPeriods : [{ startTime: "09:00", endTime: "12:00" }]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const changeDay = (d) => {
    setDay(d);
    setServerError(""); setSuccessMsg("");
    const existing = scheduleByDay?.[d] || [];
    setPeriods(existing.length ? existing.map(p => ({ startTime: p.startTime, endTime: p.endTime })) : [{ startTime: "09:00", endTime: "12:00" }]);
  };

  const updateRow = (idx, key, val) => setPeriods(p => p.map((row, i) => i === idx ? { ...row, [key]: val } : row));
  const addRow = () => setPeriods(p => [...p, { startTime: "09:00", endTime: "12:00" }]);
  const removeRow = (idx) => setPeriods(p => p.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setServerError(""); setSuccessMsg("");
    setSubmitting(true);
    try {
      await instructorsService.updateSchedule(instructorId, { dayOfWeek: day, periods });
      setSuccessMsg("تم حفظ جدول اليوم بنجاح");
      onSaved();
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join("، ") : msg || "فشل حفظ الجدول");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="تعديل أوقات التوفر" onClose={onClose} t={t} width={420}>
      {successMsg && <div style={{ background: "rgba(80,90,50,0.12)", border: "1px solid rgba(80,90,50,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#505a32", fontWeight: 600 }}>{successMsg}</div>}
      {serverError && <div style={{ background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c74848" }}>{serverError}</div>}

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 4 }}>اليوم</label>
        <select value={day} onChange={e => changeDay(e.target.value)} style={{ width: "100%", padding: "8px 9px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgElevated, color: t.text, fontSize: 13, fontFamily: "inherit" }}>
          {DAY_OF_WEEK_ORDER.map(d => <option key={d} value={d}>{DAY_OF_WEEK_LABELS[d]}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: t.textSec }}>الفترات (يمكن إضافة أكثر من فترة لليوم الواحد)</label>
        <Btn label="+ فترة" onClick={addRow} t={t} sz="sm" v="ghost" />
      </div>
      {periods.length === 0 && (
        <div style={{ padding: "9px 12px", borderRadius: 9, background: t.bgElevated, fontSize: 12, color: t.textMuted, marginBottom: 10 }}>لا توجد أوقات توفر لهذا اليوم — سيُعتبر يوم إجازة أسبوعية</div>
      )}
      {periods.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <input type="time" value={p.startTime} onChange={e => updateRow(i, "startTime", e.target.value)} style={{ flex: 1, padding: "8px 9px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgElevated, color: t.text, fontSize: 12, fontFamily: "inherit", boxSizing: "border-box" }} />
          <span style={{ color: t.textMuted, fontSize: 12 }}>إلى</span>
          <input type="time" value={p.endTime} onChange={e => updateRow(i, "endTime", e.target.value)} style={{ flex: 1, padding: "8px 9px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgElevated, color: t.text, fontSize: 12, fontFamily: "inherit", boxSizing: "border-box" }} />
          <button type="button" onClick={() => removeRow(i)} style={{ width: 28, height: 28, borderRadius: 7, border: "none", background: t.cancelled.bg, color: t.cancelled.text, cursor: "pointer", fontSize: 13, flexShrink: 0 }}>✕</button>
        </div>
      ))}

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <Btn label={submitting ? "جارٍ الحفظ..." : "حفظ"} onClick={handleSave} t={t} style={{ flex: 1 }} disabled={submitting} />
        <Btn label="إغلاق" onClick={onClose} t={t} v="ghost" />
      </div>
    </Modal>
  );
}

function LeaveModal({ t, instructorId, existing, onClose, onSuccess }) {
  const isEdit = Boolean(existing?.id);
  const [mode, setMode] = useState(existing?.startAt ? "range" : "full");
  const [date, setDate] = useState(existing?.date || todayStr());
  const [startAt, setStartAt] = useState(existing?.startAt ? existing.startAt.slice(0, 16) : "");
  const [endAt, setEndAt] = useState(existing?.endAt ? existing.endAt.slice(0, 16) : "");
  const [reason, setReason] = useState(existing?.reason || "");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async () => {
    setServerError("");
    if (mode === "full" && !date) { setServerError("يجب تحديد التاريخ"); return; }
    if (mode === "range" && (!startAt || !endAt)) { setServerError("يجب تحديد وقتي البداية والنهاية"); return; }

    const payload = { reason: reason.trim() || null };
    if (mode === "full") payload.date = date;
    else { payload.startAt = startAt; payload.endAt = endAt; }

    setSubmitting(true);
    try {
      if (isEdit) await instructorsService.updateLeave(instructorId, existing.id, payload);
      else await instructorsService.requestLeave(instructorId, payload);
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join("، ") : msg || "فشل تسجيل الإجازة");
    } finally {
      setSubmitting(false);
    }
  };

  const labelStyle = { fontSize: 11, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 4 };
  const fieldStyle = { width: "100%", padding: "9px 12px", borderRadius: 9, border: `1px solid ${t.border}`, background: t.bgElevated, color: t.text, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" };
  const chip = (active) => ({ flex: 1, padding: "9px 6px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, textAlign: "center", fontFamily: "inherit", background: active ? "#778a3b" : t.bgElevated, color: active ? "#fff" : t.textSec, outline: active ? "none" : `1.5px solid ${t.border}` });

  return (
    <Modal title={isEdit ? "تعديل الإجازة" : "تسجيل إجازة جديدة"} onClose={onClose} t={t} width={420}>
      {serverError && <div style={{ background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c74848" }}>{serverError}</div>}

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>نوع الإجازة</label>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => setMode("full")} style={chip(mode === "full")}>يوم كامل</button>
          <button type="button" onClick={() => setMode("range")} style={chip(mode === "range")}>فترة زمنية محددة</button>
        </div>
      </div>

      {mode === "full" ? (
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>التاريخ</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={fieldStyle} />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>من</label>
            <input type="datetime-local" value={startAt} onChange={e => setStartAt(e.target.value)} style={fieldStyle} />
          </div>
          <div>
            <label style={labelStyle}>إلى</label>
            <input type="datetime-local" value={endAt} onChange={e => setEndAt(e.target.value)} style={fieldStyle} />
          </div>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>السبب (اختياري)</label>
        <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="سبب الإجازة" style={fieldStyle} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <Btn label={submitting ? "جارٍ الحفظ..." : "✓ تسجيل الإجازة"} onClick={handleSubmit} t={t} style={{ flex: 1 }} disabled={submitting} />
        <Btn label="إلغاء" onClick={onClose} t={t} v="ghost" />
      </div>
    </Modal>
  );
}

const BOOKING_STATUS_MAP = {
  BOOKED: "مؤكد", PENDING_PAYMENT: "بانتظار العربون", COMPLETED: "مكتمل",
  CANCELLED: "ملغي", NO_SHOW: "لم يحضر", EXPIRED: "منتهي",
};
const PAYMENT_STATUS_MAP = {
  DEPOSIT_PAID: "العربون مدفوع",
  FULLY_PAID: "مدفوع بالكامل",
  PENDING_DEPOSIT: "معلق",
  DEPOSIT_NON_REFUNDABLE: "عربون محروق",
  DEPOSIT_AVAILABLE_FOR_REBOOKING: "رصيد محفوظ",
  DEPOSIT_USED_IN_REBOOKING: "رصيد مستهلك",
};
const TRAINING_MAP = { MANUAL: "عادي", AUTOMATIC: "أوتوماتيك" };
const BOOKING_STATUS_FILTER = [
  { value: "", label: "الكل" }, { value: "BOOKED", label: "مؤكد" },
  { value: "PENDING_PAYMENT", label: "بانتظار العربون" }, { value: "COMPLETED", label: "مكتمل" },
  { value: "CANCELLED", label: "ملغي" }, { value: "NO_SHOW", label: "لم يحضر" },
  { value: "EXPIRED", label: "منتهي" },
];


function formatBookingDate(b) {
  if (b.dayName && b.date && b.startTime) {
    const [year, month, day] = b.date.split("T")[0].split("-");
    const localDate = new Date(Number(year), Number(month) - 1, Number(day));
    const dayPadded = String(Number(day)).padStart(2, "0");
    const monthName = localDate.toLocaleDateString("ar-SY", { month: "long" });
    return `${b.dayName} ${dayPadded} ${monthName} ${b.startTime}`;
  }
  if (b.startAt) {
    const d = new Date(b.startAt);
    return d.toLocaleDateString("ar-SY", { weekday: "long", day: "2-digit", month: "long" })
      + " " + d.toLocaleTimeString("ar-SY", { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  return "—";
}

const WIZARD_STEPS = [
  { num: 1, label: "التفاصيل" },
  { num: 2, label: "الموعد" },
  { num: 3, label: "الدفع" },
];

function StepIndicator({ step, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 22, padding: "0 10px" }}>
      {WIZARD_STEPS.map((s, i) => {
        const done = step > s.num;
        const active = step === s.num;
        const circleColor = done ? "#778a3b" : active ? "#778a3b" : t.border;
        const textColor = done || active ? "#778a3b" : t.textMuted;
        return (
          <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i < WIZARD_STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 56 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: done || active ? "#778a3b" : t.bgElevated,
                color: done || active ? "#fff" : t.textMuted,
                fontSize: 13, fontWeight: 700, border: `2px solid ${circleColor}`,
              }}>{done ? "✓" : s.num}</div>
              <span style={{ fontSize: 10, fontWeight: 600, color: textColor, whiteSpace: "nowrap" }}>{s.label}</span>
            </div>
            {i < WIZARD_STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? "#778a3b" : t.border, margin: "0 6px", marginBottom: 18 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CreateBookingModal({ t, onClose, onSuccess, initialStudentId, initialStudentName }) {
  const lockedStudent = Boolean(initialStudentId);
  const [step, setStep] = useState(1);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(!lockedStudent);

  // Step 1 state — pre-filled & locked when opened from a student profile
  const [studentId, setStudentId] = useState(initialStudentId ? String(initialStudentId) : "");
  const [studentLabel, setStudentLabel] = useState(initialStudentName || "");
  const [studentQuery, setStudentQuery] = useState(initialStudentName || "");
  const [studentOpen, setStudentOpen] = useState(false);
  const [trainingType, setTrainingType] = useState("");
  const [vehicleSource, setVehicleSource] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  // Step 2 state
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const [selectedInstructorName, setSelectedInstructorName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Step 2 pricing (from available-slots response)
  const [pricing, setPricing] = useState(null);

  // Step 3 state
  const [credit, setCredit] = useState(null);
  const [checkingCredit, setCheckingCredit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (lockedStudent) return;
    let cancelled = false;
    const delay = studentQuery.trim() ? 300 : 0; // immediate on open, debounced on type
    const timer = setTimeout(async () => {
      setLoadingStudents(true);
      try {
        const params = { limit: 20 };
        if (studentQuery.trim()) params.search = studentQuery.trim();
        const sRes = await studentsService.getAll(params);
        const body = sRes.data?.data ?? sRes.data;
        const list = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
        if (!cancelled) setStudents(list);
      } catch { /* empty */ }
      finally { if (!cancelled) setLoadingStudents(false); }
    }, delay);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [studentQuery, lockedStudent]);

  const getSid = (s) => s.studentId ?? s.id;
  const sName = (s) => s.user?.name || s.name || "";
  const sPhone = (s) => s.user?.phone || s.phone || "";

  const filteredStudents = students; // server already filters by search param

  const selectStudent = (s) => {
    const rid = getSid(s);
    setStudentId(String(rid));
    setStudentLabel(sName(s));
    setStudentQuery(sName(s));
    setStudentOpen(false);
    setErrors(prev => ({ ...prev, studentId: undefined }));
  };

  const clearStudent = () => {
    setStudentId("");
    setStudentLabel("");
    setStudentQuery("");
  };

  const fieldStyle = (field) => ({
    width: "100%", padding: "10px 12px", borderRadius: 9,
    border: `1.5px solid ${errors[field] ? "#c74848" : t.border}`,
    background: t.bgElevated, color: t.text, fontSize: 13,
    fontFamily: "inherit", boxSizing: "border-box", outline: "none",
  });

  const chip = (active, hasErr) => ({
    flex: 1, padding: "10px 6px", borderRadius: 9, border: "none",
    cursor: "pointer", fontSize: 12, fontWeight: 600, textAlign: "center", fontFamily: "inherit",
    background: active ? "#778a3b" : t.bgElevated,
    color: active ? "#fff" : t.textSec,
    outline: active ? "none" : `1.5px solid ${hasErr ? "#c74848" : t.border}`,
    transition: "all 0.15s",
  });

  const errMsg = (field) => errors[field] ? <div style={{ fontSize: 11, color: "#c74848", marginTop: 4 }}>{errors[field]}</div> : null;

  // جلب المواعيد المتاحة فقط (بلا تغيير خطوة/أخطاء) — يُستخدم من handleShowSlots (الانتقال 1→2)
  // ومن handleSubmit لإعادة تحميل المواعيد بعد رفض حجز مدرب مؤرشف (409)
  const fetchAvailableSlots = async () => {
    const params = { trainingType, vehicleSource };
    if (genderFilter) params.instructorGender = genderFilter;
    const res = await bookingsService.getAvailableSlots(params);
    const body = res.data?.data ?? res.data;
    setPricing(body?.pricing || null);
    setSlots(Array.isArray(body?.instructors) ? body.instructors : Array.isArray(body) ? body : []);
  };

  // ── Step 1 → 2 ──
  const handleShowSlots = async () => {
    setServerError("");
    const e = {};
    if (!studentId) e.studentId = "يجب اختيار الطالب";
    if (!trainingType) e.trainingType = "يجب اختيار نوع التدريب";
    if (!vehicleSource) e.vehicleSource = "يجب اختيار مصدر المركبة";
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoadingSlots(true);
    try {
      await fetchAvailableSlots();
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.data?.message || err.message;
      setServerError(Array.isArray(msg) ? msg.join("، ") : msg || "فشل تحميل الأوقات المتاحة");
    } finally {
      setLoadingSlots(false);
    }
  };

  // ── Step 2 → 3 ──
  const handleCheckCredit = async () => {
    setServerError("");
    if (!selectedInstructorId || !selectedDate || !selectedTime) {
      setServerError("يجب اختيار وقت من الأوقات المتاحة");
      return;
    }
    setCheckingCredit(true);
    try {
      const res = await bookingsService.creditCheck(studentId);
      const body = res.data?.data || res.data;
      setCredit(body);
    } catch {
      setCredit(null);
    } finally {
      setCheckingCredit(false);
      setStep(3);
    }
  };

  const hasCredit = credit && (credit.hasCredit === true || credit.credit > 0 || credit.amount > 0);

  // ── Step 3 submit ──
  const handleSubmit = async () => {
    setServerError(""); setSuccessMsg("");
    if (!hasCredit && !pricing?.depositAmount) {
      setServerError("لم يتم تحميل بيانات التسعير — ارجع وأعد المحاولة");
      return;
    }
    setErrors({});
    const payload = {
      studentId: Number(studentId),
      instructorId: Number(selectedInstructorId),
      date: selectedDate,
      time: selectedTime,
      trainingType,
      vehicleSource,
    };
    if (!hasCredit) payload.collectedAmount = Number(pricing.depositAmount);

    setSubmitting(true);
    try {
      const res = await bookingsService.create(payload);
      const body = res.data?.data || res.data;
      if (body?.error || body?.statusCode >= 400) {
        setServerError(Array.isArray(body?.message) ? body.message.join("، ") : body?.message || "فشل إنشاء الحجز");
        return;
      }
      setSuccessMsg("تم إنشاء الحجز بنجاح");
      setTimeout(() => onSuccess(), 800);
    } catch (err) {
      const status = err.response?.status;
      const data   = err.response?.data?.data || err.response?.data;
      const raw    = data?.message || err.response?.data?.message || err.message;
      const msg    = Array.isArray(raw) ? raw.join("، ") : (raw || "");
      if (status === 409 && /لم يعد يستقبل|no longer accept/i.test(msg)) {
        // المدرب صار مؤرشفاً بين لحظة عرض المواعيد ولحظة التأكيد — نعرض رسالة الخادم كما هي
        // ونرجع لخطوة اختيار الموعد بعد تحديث القائمة، بدل ترك المستخدم عالقاً على مدرب لم يعد متاحاً
        setSelectedInstructorId(""); setSelectedInstructorName(""); setSelectedDate(""); setSelectedTime("");
        setServerError(msg || "هذا المدرب لم يعد يستقبل حجوزات جديدة — اختر مدرباً آخر");
        setStep(2);
        setLoadingSlots(true);
        try { await fetchAvailableSlots(); } catch { /* تبقى القائمة كما كانت إن فشل التحديث */ }
        finally { setLoadingSlots(false); }
      } else if (status === 409) {
        // Backend returns English; detect student-time-conflict vs. instructor-time-conflict
        const isStudentConflict = /student.*time|same\s+time|exact\s+time/i.test(msg);
        setServerError(
          isStudentConflict
            ? "الطالب لديه حجز آخر في هذا الوقت بالضبط — يرجى اختيار موعد مختلف"
            : "هذا الموعد محجوز مسبقاً — المدرب أو الطالب غير متاح في هذه الساعة، يرجى اختيار وقت آخر"
        );
      } else if (status === 404) {
        setServerError(msg || "الطالب أو المدرب غير موجود");
      } else if (status === 400) {
        setServerError(msg || "بيانات الحجز غير صالحة");
      } else {
        setServerError(msg || "حدث خطأ أثناء إنشاء الحجز");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const buildDayGroups = (instructorSlots) => {
    const groups = {};
    (Array.isArray(instructorSlots) ? instructorSlots : []).forEach(slot => {
      if (typeof slot === "string") {
        const d = slot.includes("T") ? slot.split("T")[0] : "";
        const tm = slot.includes("T") ? slot.split("T")[1].substring(0, 5) : slot.substring(0, 5);
        if (d && tm) { if (!groups[d]) groups[d] = []; if (!groups[d].includes(tm)) groups[d].push(tm); }
        return;
      }
      const d = slot.date || (slot.startAt ? slot.startAt.split("T")[0] : "");
      if (!d) return;
      if (!groups[d]) groups[d] = [];
      let timeStr = "";
      if (slot.time) timeStr = slot.time;
      else if (slot.startTime) timeStr = slot.startTime;
      else if (slot.startAt && slot.startAt.includes("T")) timeStr = slot.startAt.split("T")[1].substring(0, 5);
      else if (slot.startAt) timeStr = slot.startAt.substring(0, 5);
      if (timeStr && !groups[d].includes(timeStr)) groups[d].push(timeStr);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  };

  const formatDayHeader = (dateStr) => {
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("ar-SY", { weekday: "long", day: "numeric", month: "long" });
    } catch { return dateStr; }
  };

  const labelStyle = { fontSize: 11, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 6 };

  return (
    <Modal title="حجز جلسة جديدة" onClose={onClose} t={t} width={560} bodyStyle={{ padding: 0, overflowY: "hidden", display: "flex", flexDirection: "column", flex: 1 }}>

      {/* ── FIXED TOP: Stepper + alerts ── */}
      <div style={{ flexShrink: 0, padding: "14px 20px 10px", borderBottom: `1px solid ${t.border}` }}>
        <StepIndicator step={step} t={t} />
        {successMsg && (
          <div style={{ background: "rgba(80,90,50,0.12)", border: "1px solid rgba(80,90,50,0.3)", borderRadius: 10, padding: "10px 14px", marginTop: 10, fontSize: 13, color: "#505a32", fontWeight: 600 }}>{successMsg}</div>
        )}
        {serverError && (
          <div style={{ background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)", borderRadius: 10, padding: "10px 14px", marginTop: 10, fontSize: 13, color: "#c74848" }}>{serverError}</div>
        )}
      </div>

      {/* ── SCROLLABLE MIDDLE ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>

      {/* ════════ STEP 1: التفاصيل ════════ */}
      {step === 1 && (
        <div>
          {/* Student — locked read-only badge (from profile) OR searchable select */}
          <div style={{ marginBottom: 14, position: "relative" }}>
            <label style={labelStyle}>الطالب</label>
            {lockedStudent ? (
              <div style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 9, background: t.accentLight, border: `1.5px solid ${t.accent}`,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", background: "#778a3b", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0,
                }}>{(studentLabel || "؟").charAt(0)}</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: t.accentText }}>{studentLabel}</span>
              </div>
            ) : (
              <>
                <div style={{ position: "relative" }}>
                  <input value={studentQuery}
                    onChange={e => { setStudentQuery(e.target.value); setStudentOpen(true); if (studentId) clearStudent(); }}
                    onFocus={() => setStudentOpen(true)}
                    placeholder={loadingStudents ? "جارٍ التحميل..." : "ابحث باسم أو رقم الطالب..."}
                    disabled={loadingStudents} autoComplete="off" style={fieldStyle("studentId")} />
                  {studentId && (
                    <button type="button" onClick={clearStudent} style={{
                      position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 16, padding: 2,
                    }}>✕</button>
                  )}
                </div>
                {studentOpen && !studentId && (
                  <div style={{
                    position: "absolute", top: "100%", right: 0, left: 0, zIndex: 20, marginTop: 2,
                    background: t.bgSurface, border: `1px solid ${t.border}`, borderRadius: 9,
                    boxShadow: t.shadowLg || t.shadow, maxHeight: 180, overflowY: "auto",
                  }}>
                    {filteredStudents.length === 0
                      ? <div style={{ padding: "10px 12px", fontSize: 12, color: t.textMuted, textAlign: "center" }}>لا توجد نتائج</div>
                      : filteredStudents.slice(0, 30).map(s => (
                        <div key={getSid(s)} onClick={() => selectStudent(s)} style={{
                          padding: "8px 12px", cursor: "pointer", fontSize: 12, borderBottom: `1px solid ${t.border}`,
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = t.bgElevated}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <span style={{ fontWeight: 600, color: t.text }}>{sName(s)}</span>
                          <span style={{ fontSize: 11, color: t.textMuted, direction: "ltr" }}>{sPhone(s)}</span>
                        </div>
                      ))}
                  </div>
                )}
                {errMsg("studentId")}
              </>
            )}
          </div>

          {/* Training type */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>نوع التدريب</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => { setTrainingType("MANUAL"); setErrors(p => ({ ...p, trainingType: undefined })); }} style={chip(trainingType === "MANUAL", errors.trainingType)}>عادي</button>
              <button type="button" onClick={() => { setTrainingType("AUTOMATIC"); setErrors(p => ({ ...p, trainingType: undefined })); }} style={chip(trainingType === "AUTOMATIC", errors.trainingType)}>أوتوماتيك</button>
            </div>
            {errMsg("trainingType")}
          </div>

          {/* Vehicle source */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>مصدر المركبة</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => { setVehicleSource("SCHOOL_CAR"); setErrors(p => ({ ...p, vehicleSource: undefined })); }} style={chip(vehicleSource === "SCHOOL_CAR", errors.vehicleSource)}>سيارة المدرسة</button>
              <button type="button" onClick={() => { setVehicleSource("STUDENT_CAR"); setErrors(p => ({ ...p, vehicleSource: undefined })); }} style={chip(vehicleSource === "STUDENT_CAR", errors.vehicleSource)}>سيارة الطالب</button>
            </div>
            {errMsg("vehicleSource")}
          </div>

          {/* Instructor gender */}
          <div style={{ marginBottom: 4 }}>
            <label style={labelStyle}>جنس المدرب (اختياري)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => setGenderFilter("MALE")} style={chip(genderFilter === "MALE", false)}>ذكر</button>
              <button type="button" onClick={() => setGenderFilter("FEMALE")} style={chip(genderFilter === "FEMALE", false)}>أنثى</button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ STEP 2: الموعد ════════ */}
      {step === 2 && (
        <div>
          {/* Pricing banner — always shown so receptionist sees rates before picking a slot */}
          {pricing && (
            <div style={{ background: t.accentLight, border: `1px solid ${t.accent}30`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 18, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: t.accentText }}>
                💰 سعر الدرس: <strong>{Number(pricing.lessonPrice).toLocaleString("en")} ل.س</strong>
              </span>
              <span style={{ fontSize: 12, color: t.accentText }}>
                العربون: <strong>{Number(pricing.depositAmount).toLocaleString("en")} ل.س ({pricing.depositPercentage}%)</strong>
              </span>
              {pricing.lessonDurationMinutes && (
                <span style={{ fontSize: 12, color: t.accentText }}>
                  المدة: <strong>{pricing.lessonDurationMinutes} دقيقة</strong>
                </span>
              )}
            </div>
          )}
          {slots.length === 0 ? (
            <div style={{ padding: 30, textAlign: "center", color: t.textMuted, fontSize: 14 }}>لا توجد أوقات متاحة بهذه المعايير</div>
          ) : (
            <div style={{ paddingLeft: 4 }}>
              {slots.map((item, idx) => {
                const instId = item.instructor?.id;
                const instName = item.instructor?.name || "مدرب";
                const instGender = item.instructor?.gender;
                const dayGroups = buildDayGroups(item.slots || []);
                if (dayGroups.length === 0) return null;
                return (
                  <div key={instId || idx} style={{ marginBottom: 16 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 700, color: t.accent, marginBottom: 8,
                      paddingBottom: 6, borderBottom: `2px solid ${t.accentLight}`,
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <span style={{
                        width: 26, height: 26, borderRadius: "50%", display: "inline-flex",
                        alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700,
                        background: t.accentLight, color: t.accent, flexShrink: 0,
                      }}>{instName.charAt(0)}</span>
                      {instName}
                      {instGender && (
                        <span style={{ fontSize: 10, color: t.textMuted, fontWeight: 400 }}>
                          ({instGender === "MALE" ? "ذكر" : "أنثى"})
                        </span>
                      )}
                    </div>
                    {dayGroups.map(([dateStr, times]) => (
                      <div key={dateStr} style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, marginBottom: 6 }}>{formatDayHeader(dateStr)}</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {times.map(time => {
                            const isSelected = selectedInstructorId === String(instId) && selectedDate === dateStr && selectedTime === time;
                            return (
                              <button key={time} type="button" onClick={() => {
                                setSelectedInstructorId(String(instId));
                                setSelectedInstructorName(instName);
                                setSelectedDate(dateStr);
                                setSelectedTime(time);
                                setServerError("");
                              }} style={{
                                padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                                fontFamily: "inherit", cursor: "pointer", border: "none", transition: "all 0.15s",
                                background: isSelected ? "#778a3b" : t.bgElevated,
                                color: isSelected ? "#fff" : t.text,
                                outline: isSelected ? "none" : `1px solid ${t.border}`,
                              }}>{time}</button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ════════ STEP 3: الدفع ════════ */}
      {step === 3 && (
        <div>
          {/* Summary */}
          <div style={{ background: t.bgElevated, borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 10 }}>ملخص الحجز</div>
            <InfoRow k="الطالب" v={studentLabel} t={t} />
            <InfoRow k="المدرب" v={selectedInstructorName} t={t} />
            <InfoRow k="التاريخ" v={formatDayHeader(selectedDate)} t={t} />
            <InfoRow k="الوقت" v={selectedTime} t={t} />
            <InfoRow k="نوع التدريب" v={TRAINING_MAP[trainingType] || trainingType} t={t} />
            <InfoRow k="المركبة" v={vehicleSource === "STUDENT_CAR" ? "سيارة الطالب" : "سيارة المدرسة"} t={t} />
            {pricing && <InfoRow k="سعر الدرس" v={`${Number(pricing.lessonPrice).toLocaleString("en")} ل.س`} t={t} />}
            {pricing && <InfoRow k="العربون المطلوب" v={`${Number(pricing.depositAmount).toLocaleString("en")} ل.س (${pricing.depositPercentage}%)`} t={t} />}
          </div>

          {/* Credit / Amount */}
          {hasCredit ? (
            <div style={{ background: "rgba(80,90,50,0.1)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#505a32", fontWeight: 600 }}>
              الطالب لديه رصيد سابق — سيتم خصم العربون تلقائياً
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>مبلغ العربون المحصَّل</label>
              <input
                type="text"
                value={pricing ? `${Number(pricing.depositAmount).toLocaleString("en")} ل.س` : "—"}
                readOnly
                dir="ltr"
                style={{ ...fieldStyle("collectedAmount"), textAlign: "left", cursor: "not-allowed", color: t.textSec, background: t.bgPage }}
              />
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>المبلغ محدد تلقائياً بقيمة العربون ولا يمكن تغييره</div>
            </div>
          )}

        </div>
      )}

      </div>

      {/* ── FIXED BOTTOM FOOTER ── */}
      <div style={{ flexShrink: 0, padding: "12px 20px", borderTop: `1px solid ${t.border}`, display: "flex", gap: 8, background: t.bgSurface }}>
        {step === 1 && (
          <button type="button" disabled={loadingSlots} onClick={handleShowSlots} style={{
            flex: 1, padding: "12px", borderRadius: 10, border: "none", fontFamily: "inherit",
            cursor: loadingSlots ? "not-allowed" : "pointer",
            background: loadingSlots ? t.textMuted : "#778a3b", color: "#fff", fontSize: 14, fontWeight: 700,
          }}>{loadingSlots ? "جارٍ تحميل الأوقات..." : "عرض الأوقات المتاحة"}</button>
        )}
        {step === 2 && (
          <>
            <button type="button" disabled={checkingCredit} onClick={handleCheckCredit} style={{
              flex: 1, padding: "12px", borderRadius: 10, border: "none", fontFamily: "inherit",
              cursor: (!selectedTime || checkingCredit) ? "not-allowed" : "pointer",
              background: (!selectedTime || checkingCredit) ? t.textMuted : "#778a3b", color: "#fff", fontSize: 14, fontWeight: 700,
              opacity: !selectedTime ? 0.6 : 1,
            }}>{checkingCredit ? "جارٍ التحقق..." : "التحقق من العربون"}</button>
            <Btn label="رجوع" onClick={() => { setStep(1); setServerError(""); }} t={t} v="ghost" />
          </>
        )}
        {step === 3 && (
          <>
            <button type="button" disabled={submitting} onClick={handleSubmit} style={{
              flex: 1, padding: "12px", borderRadius: 10, border: "none", fontFamily: "inherit",
              cursor: submitting ? "not-allowed" : "pointer",
              background: submitting ? t.textMuted : "#778a3b", color: "#fff", fontSize: 14, fontWeight: 700,
            }}>{submitting ? "جارٍ الإنشاء..." : "إنشاء الحجز"}</button>
            <Btn label="رجوع" onClick={() => { setStep(2); setServerError(""); setSuccessMsg(""); }} t={t} v="ghost" />
          </>
        )}
      </div>
    </Modal>
  );
}

function PayRemainingModal({ booking, t, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await bookingsService.getById(booking.id);
        if (!cancelled) setDetail(res.data?.data ?? res.data);
      } catch { /* ignore */ }
      finally { if (!cancelled) setDetailLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [booking.id]);

  // Priority 1: value already shown on the button (list API) — always correct
  const listRemaining = booking.remainingAmount != null ? Number(booking.remainingAmount) : null;

  // Priority 2: explicit field from the detail endpoint
  const detailRemaining = detail?.booking?.remainingAmount != null
    ? Number(detail.booking.remainingAmount)
    : null;

  // Priority 3: derive from charges only as a last resort
  const chargesArr = Array.isArray(detail?.charges) ? detail.charges : [];
  const chargesRemaining = chargesArr.length > 0
    ? chargesArr.reduce((sum, c) => {
        const due  = parseFloat(c.amountDue  ?? c.remainingAmount ?? 0);
        const paid = (c.payments || []).reduce((s, p) => s + parseFloat(p.amount || 0), 0);
        return sum + Math.max(0, due - paid);
      }, 0)
    : null;

  const remaining =
    listRemaining ??
    detailRemaining ??
    (chargesRemaining != null && chargesRemaining > 0 ? chargesRemaining : null) ??
    null;

  const totalAmt =
    detail?.booking?.totalAmount ??
    detail?.booking?.price ??
    booking.raw?.totalAmount ??
    booking.raw?.price ??
    null;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      await bookingsService.payRemainder(booking.id);
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || "حدث خطأ أثناء تنفيذ الدفع");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="تحصيل باقي المبلغ" onClose={onClose} t={t} width={440}>
      <div style={{ background: t.bgElevated, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
        <InfoRow k="الطالب"     v={booking.student}  t={t} />
        <InfoRow k="الجلسة"     v={booking.dateTime} t={t} />
        <InfoRow k="حالة الدفع" v={booking.pay}      t={t} />
        {totalAmt != null && (
          <InfoRow k="المبلغ الكلي" v={`${Number(totalAmt).toLocaleString("en")} ل.س`} t={t} />
        )}
      </div>

      {/* Remaining amount — always shown, prominent */}
      <div style={{
        borderRadius: 10, padding: "14px 16px", marginBottom: 14,
        background: t.confirmed?.bg || "#f0fdf4",
        border: `1.5px solid ${t.confirmed?.dot || "#16a34a"}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: t.confirmed?.text || "#15803d" }}>
          المبلغ المتبقي للتحصيل
        </span>
        <span style={{ fontSize: 17, fontWeight: 800, color: t.confirmed?.text || "#15803d" }}>
          {detailLoading
            ? "جارٍ التحميل..."
            : remaining != null
              ? `${Number(remaining).toLocaleString("en")} ل.س`
              : "—"}
        </span>
      </div>

      <div style={{ padding: "10px 12px", borderRadius: 8, background: t.pending.bg, color: t.pending.text, fontSize: 12, marginBottom: 14 }}>
        ℹ يتم تسجيل الدفع نقداً تلقائياً — بعد التأكيد تصبح حالة الدفع "مدفوع بالكامل"
      </div>

      {error && (
        <div style={{ padding: "8px 12px", borderRadius: 8, background: t.cancelled.bg, color: t.cancelled.text, fontSize: 12, marginBottom: 12 }}>{error}</div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <Btn label={submitting ? "جارٍ التنفيذ..." : "✓ تأكيد الدفع"} onClick={handleSubmit} t={t} style={{ flex: 1 }} disabled={submitting || detailLoading} />
        <Btn label="إلغاء" onClick={onClose} t={t} v="ghost" />
      </div>
    </Modal>
  );
}

const CANCEL_PARTIES = [
  { value: "STUDENT",    label: "الطالب"  },
  { value: "INSTRUCTOR", label: "المدرب"  },
  { value: "VEHICLE",    label: "السيارة" },
  { value: "SCHOOL",     label: "المدرسة" },
];

function CancelBookingModal({ booking, t, onClose, onSuccess }) {
  const [party,      setParty]      = useState("");
  const [reason,     setReason]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");

  const isStudentParty = party === "STUDENT";
  const canSubmit = party && reason.trim().length >= 1 && reason.trim().length <= 255;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await bookingsService.cancel(booking.id, {
        cancellationParty:  party,
        cancellationReason: reason.trim(),
      });
      const msg = (res.data?.data ?? res.data)?.message || "تم إلغاء الحجز بنجاح";
      onSuccess(msg);
    } catch (err) {
      setError(err?.response?.data?.message || "حدث خطأ أثناء إلغاء الحجز");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="إلغاء الحجز" onClose={onClose} t={t} width={460}>
      <div style={{ background: t.bgElevated, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
        <InfoRow k="الطالب"     v={booking.student}  t={t} />
        <InfoRow k="الجلسة"     v={booking.dateTime} t={t} />
        <InfoRow k="حالة الحجز" v={booking.status}   t={t} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: t.textSec, marginBottom: 8 }}>الجهة المُلغِية</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CANCEL_PARTIES.map(({ value, label }) => (
            <button key={value} type="button" onClick={() => setParty(value)} style={{
              padding: "9px 18px", borderRadius: 9, border: "none",
              cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
              background: party === value ? (value === "STUDENT" ? "#b91c1c" : "#778a3b") : t.bgElevated,
              color:      party === value ? "#fff" : t.textSec,
              outline:    party === value ? "none" : `1.5px solid ${t.border}`,
            }}>{label}</button>
          ))}
        </div>
      </div>

      {party && (
        <div style={{
          padding: "10px 12px", borderRadius: 8, marginBottom: 14, fontSize: 12,
          background: isStudentParty ? "#fef2f2" : t.pending.bg,
          color:      isStudentParty ? "#b91c1c"  : t.pending.text,
          border: `1px solid ${isStudentParty ? "#fca5a5" : t.pending.dot + "50"}`,
        }}>
          {isStudentParty
            ? "⚠ تنبيه: العربون غير مسترد ويُصبح محروقاً نهائياً (DEPOSIT_NON_REFUNDABLE)"
            : "ℹ يُحفَظ العربون كرصيد للطالب لاستخدامه في حجز آخر (DEPOSIT_AVAILABLE_FOR_REBOOKING)"}
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 6 }}>
          سبب الإلغاء <span style={{ color: "#b91c1c" }}>*</span>
        </label>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value.slice(0, 255))}
          placeholder="أدخل سبب الإلغاء..."
          rows={3}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "10px 12px", borderRadius: 9, resize: "vertical",
            border: `1.5px solid ${t.border}`, background: t.bgElevated, color: t.text,
            fontFamily: "inherit", fontSize: 13, outline: "none",
          }}
        />
        <div style={{ fontSize: 11, color: t.textMuted, textAlign: "left", marginTop: 3 }}>
          {reason.trim().length}/255
        </div>
      </div>

      {error && (
        <div style={{ padding: "8px 12px", borderRadius: 8, background: t.cancelled.bg, color: t.cancelled.text, fontSize: 12, marginBottom: 12 }}>{error}</div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <Btn
          label={submitting ? "جارٍ التنفيذ..." : "✓ تأكيد الإلغاء"}
          onClick={handleSubmit}
          t={t}
          style={{ flex: 1, ...(canSubmit && !submitting ? { background: "#b91c1c", color: "#fff" } : {}) }}
          disabled={!canSubmit || submitting}
        />
        <Btn label="تراجع" onClick={onClose} t={t} v="ghost" />
      </div>
    </Modal>
  );
}

function SectionBookings({ t }) {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission(P.BOOKINGS_CREATE);
  const canCancel = hasPermission(P.BOOKINGS_CANCEL);
  const canComplete = hasPermission(P.BOOKINGS_COMPLETE);
  const canPay = hasPermission(P.PAYMENTS_CREATE);
  const [bookings, setBookings] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [invModal, setInvModal] = useState(null);
  const [nsModal, setNsModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [payModal, setPayModal] = useState(null);
  const [payToast, setPayToast] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelToast, setCancelToast] = useState(null);
  const [nsBusy, setNsBusy] = useState(false);
  const [nsError, setNsError] = useState("");
  const [completeBusyId, setCompleteBusyId] = useState(null);
  const [completeToast, setCompleteToast] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 350);
    return () => clearTimeout(timer);
  }, [search]);  

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (tab) params.bookingStatus = tab;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      const res = await bookingsService.getAll(params);
      const body = res.data?.data ?? res.data;
      setBookings(Array.isArray(body?.data) ? body.data : []);
      setMeta(body?.meta || null);
    } catch {
      setBookings([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = { page, limit: 20 };
        if (tab) params.bookingStatus = tab;
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        const res = await bookingsService.getAll(params);
        const body = res.data?.data ?? res.data;
        if (!cancelled) {
          setBookings(Array.isArray(body?.data) ? body.data : []);
          setMeta(body?.meta || null);
        }
      } catch {
        if (!cancelled) { setBookings([]); setMeta(null); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [tab, debouncedSearch, page]);  

  const handlePayRemainder = (b) => setPayModal(b);

  const handleNoShow = async () => {
    if (!nsModal) return;
    setNsError("");
    setNsBusy(true);
    try {
      await bookingsService.updateStatus(nsModal.id, "NO_SHOW");
      setNsModal(null);
      setNsError("");
      await fetchBookings();
    } catch (err) {
      const raw = err?.response?.data?.message;
      setNsError(Array.isArray(raw) ? raw.join("، ") : (raw || "حدث خطأ أثناء تسجيل الغياب"));
    } finally {
      setNsBusy(false);
    }
  };

  const handleComplete = async (bookingId) => {
    setCompleteBusyId(bookingId);
    try {
      await bookingsService.updateStatus(bookingId, "COMPLETED");
      setCompleteToast("✓ تم إكمال الجلسة بنجاح");
      setTimeout(() => setCompleteToast(null), 3500);
      await fetchBookings();
    } catch (err) {
      const raw = err?.response?.data?.message;
      const msg = Array.isArray(raw) ? raw.join("، ") : (raw || "حدث خطأ أثناء إكمال الجلسة");
      setCompleteToast(`✗ ${msg}`);
      setTimeout(() => setCompleteToast(null), 5000);
    } finally {
      setCompleteBusyId(null);
    }
  };

  const openDetail = async (b) => {
    setDetailModal({ ...b, apiDetail: null });
    setDetailLoading(true);
    try {
      const res = await bookingsService.getById(b.id);
      const body = res.data?.data ?? res.data;
      if (body) setDetailModal({ ...b, apiDetail: body });
    } catch { /* keep list data */ }
    finally { setDetailLoading(false); }
  };

  const mapBooking = (b) => {
    const student = b.studentName || b.student?.user?.name || "—";
    const inst = b.instructorName || b.instructor?.user?.name || "—";
    const vehicle = b.vehicleSource === "STUDENT_CAR"
      ? "سيارة الطالب"
      : (b.vehiclePlate || b.vehicle?.plateNumber || "—");
    const dateTime = formatBookingDate(b);
    const type = TRAINING_MAP[b.trainingType] || b.trainingType || "—";
    const status = BOOKING_STATUS_MAP[b.bookingStatus] || b.bookingStatus || "—";
    const pay = PAYMENT_STATUS_MAP[b.paymentStatus] || b.paymentStatus || "—";
    const dateStr = b.date ? b.date.split("T")[0] : null;
    const et = b.endTime ? b.endTime.substring(0, 5) : null;
    return {
      id: b.id,
      student,
      inst,
      vehicle,
      dateTime,
      type,
      status,
      pay,
      rawStatus:       b.bookingStatus,
      rawPayment:      b.paymentStatus,
      canPayRemainder: b.canPayRemainder ?? false,
      remainingAmount: b.remainingAmount ?? null,
      sessionEnded:    dateStr && et ? Date.now() > new Date(`${dateStr}T${et}:00`).getTime() : false, // eslint-disable-line react-hooks/purity -- session-end gate only, staleness across a render is harmless
      raw: b,
    };
  };

  const mapped = (Array.isArray(bookings) ? bookings : []).map(mapBooking);

  const dotColor = (s) => {
    if (s === "مكتمل") return t.completed.dot;
    if (s === "مؤكد") return t.confirmed.dot;
    if (s === "بانتظار العربون") return t.pending.dot;
    if (s === "ملغي") return t.cancelled.dot;
    if (s === "لم يحضر") return t.noshow.dot;
    return t.expired.dot;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Sticky control bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: t.bgPage, borderBottom: `1px solid ${t.border}`,
        padding: "12px 22px 10px",
      }}>
        <div style={{ display: "flex", gap: 3, marginBottom: 10, background: t.bgElevated, borderRadius: 9, padding: 3, overflowX: "auto" }}>
          {BOOKING_STATUS_FILTER.map((f) => (
            <button key={f.value} onClick={() => { setTab(f.value); setPage(1); }} style={{
              padding: "7px 12px", borderRadius: 7, border: "none", cursor: "pointer",
              fontFamily: "inherit", fontSize: 11, fontWeight: tab === f.value ? 700 : 400,
              whiteSpace: "nowrap", background: tab === f.value ? t.bgSurface : "transparent",
              color: tab === f.value ? t.text : t.textMuted, boxShadow: tab === f.value ? t.shadow : "none",
            }}>{f.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <SearchBar placeholder="بحث باسم الطالب..." t={t} value={search} onChange={setSearch} />
          {canCreate && <Btn label="+ حجز جديد" onClick={() => setCreateModal(true)} t={t} />}
        </div>
      </div>

      {/* Scrollable bookings list */}
      <div style={{ overflowY: "auto", flex: 1, padding: "14px 22px" }}>
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>جارٍ تحميل الحجوزات...</div>
      ) : mapped.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>لا توجد حجوزات</div>
      ) : (
        mapped.map((b) => (
          <div key={b.id} style={{
            background: t.bgSurface, borderRadius: 11, border: `1px solid ${t.borderCard}`,
            padding: "13px 16px", marginBottom: 7, boxShadow: t.shadow,
            borderRight: `4px solid ${dotColor(b.status)}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "baseline", marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{b.student}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: t.textMuted }}>#{b.id}</span>
                </div>
                <div style={{ fontSize: 12, color: t.textSec, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600 }}>{b.inst}</span>
                  <span style={{ color: t.border }}>|</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                    <IoIosCalendar style={{ fontSize: 13, flexShrink: 0 }} />
                    {b.dateTime}
                  </span>
                  <span style={{ color: t.border }}>|</span>
                  <span>{b.vehicle}</span>
                  <span style={{ color: t.border }}>|</span>
                  <span style={{ fontWeight: 600, color: t.accent }}>{b.type}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
                <Badge s={b.pay} t={t} />
                <Badge s={b.status} t={t} />
              </div>
              <div style={{ display: "flex", gap: 5, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {canPay && (b.canPayRemainder || b.remainingAmount !== null || b.rawPayment === "DEPOSIT_NON_REFUNDABLE") && (
                  <Btn label={`دفع المتبقي${b.remainingAmount !== null ? ` — ${b.remainingAmount} ل.س` : ""}`} onClick={() => handlePayRemainder(b)} t={t} sz="sm" style={{ background: "#6b723a", color: "#fff" }} />
                )}
                {canComplete && (b.rawStatus === "BOOKED" || b.rawStatus === "NO_SHOW") && (
                  <Btn
                    label={completeBusyId === b.id ? "جارٍ..." : "✓ إكمال الجلسة"}
                    onClick={() => handleComplete(b.id)}
                    t={t} sz="sm"
                    disabled={completeBusyId === b.id || !b.sessionEnded || b.rawPayment !== "FULLY_PAID"}
                    title={!b.sessionEnded ? "بعد انتهاء الجلسة" : (b.rawPayment !== "FULLY_PAID" ? "حصّل المبلغ المتبقي أولاً" : undefined)}
                  />
                )}
                {canComplete && b.rawStatus === "BOOKED" && (
                  <Btn
                    label="لم يحضر"
                    onClick={() => setNsModal(b)}
                    t={t} sz="sm" v="danger"
                    disabled={completeBusyId === b.id || !b.sessionEnded}
                    title={!b.sessionEnded ? "بعد انتهاء الجلسة" : undefined}
                  />
                )}
                {canCancel && (b.rawStatus === "BOOKED" || b.rawStatus === "PENDING_PAYMENT") && (
                  <Btn label="إلغاء الحجز" onClick={(e) => { e.stopPropagation(); setCancelModal(b); }} t={t} sz="sm" v="danger" disabled={completeBusyId === b.id} />
                )}
                <Btn label="تفاصيل" onClick={(e) => { e.stopPropagation(); openDetail(b); }} t={t} sz="sm" v="ghost" />
              </div>
            </div>
          </div>
        ))
      )}
      </div>{/* /scrollable list */}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "10px 22px", borderTop: `1px solid ${t.border}`, background: t.bgPage, flexShrink: 0,
        }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            style={{
              padding: "5px 14px", borderRadius: 7, border: `1px solid ${t.border}`,
              background: t.bgSurface, color: page <= 1 ? t.textMuted : t.text,
              cursor: page <= 1 ? "default" : "pointer", fontFamily: "inherit", fontSize: 12,
            }}
          >السابق</button>
          <span style={{ fontSize: 12, color: t.textSec, minWidth: 80, textAlign: "center" }}>
            {page} / {meta.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
            disabled={page >= meta.totalPages}
            style={{
              padding: "5px 14px", borderRadius: 7, border: `1px solid ${t.border}`,
              background: t.bgSurface, color: page >= meta.totalPages ? t.textMuted : t.text,
              cursor: page >= meta.totalPages ? "default" : "pointer", fontFamily: "inherit", fontSize: 12,
            }}
          >التالي</button>
          {meta.total != null && (
            <span style={{ fontSize: 11, color: t.textMuted, marginRight: 4 }}>
              ({meta.total} حجز)
            </span>
          )}
        </div>
      )}

      {createModal && (
        <CreateBookingModal t={t} onClose={() => setCreateModal(false)} onSuccess={() => { setCreateModal(false); fetchBookings(); }} />
      )}
      {invModal && <InvoiceModal booking={invModal} t={t} onClose={() => setInvModal(null)} />}
      {payModal && (
        <PayRemainingModal
          booking={payModal}
          t={t}
          onClose={() => setPayModal(null)}
          onSuccess={() => {
            setPayModal(null);
            setPayToast("✓ تم تسجيل الدفع بنجاح — حالة الدفع أصبحت مدفوع بالكامل");
            setTimeout(() => setPayToast(null), 3500);
            fetchBookings();
          }}
        />
      )}
      {payToast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: t.completed.bg, color: t.completed.text,
          border: `1px solid ${t.completed.dot}40`,
          padding: "11px 24px", borderRadius: 10, fontSize: 13, fontWeight: 600,
          zIndex: 2000, whiteSpace: "nowrap", boxShadow: t.shadowMd,
        }}>{payToast}</div>
      )}
      {completeToast && (
        <div style={{
          position: "fixed", bottom: 68, left: "50%", transform: "translateX(-50%)",
          background: completeToast.startsWith("✗") ? t.cancelled.bg : t.completed.bg,
          color: completeToast.startsWith("✗") ? t.cancelled.text : t.completed.text,
          border: `1px solid ${completeToast.startsWith("✗") ? t.cancelled.dot : t.completed.dot}40`,
          padding: "11px 24px", borderRadius: 10, fontSize: 13, fontWeight: 600,
          zIndex: 2001, whiteSpace: "nowrap", boxShadow: t.shadowMd,
        }}>{completeToast}</div>
      )}
      {cancelModal && (
        <CancelBookingModal
          booking={cancelModal}
          t={t}
          onClose={() => setCancelModal(null)}
          onSuccess={(msg) => {
            setCancelModal(null);
            setCancelToast(msg);
            setTimeout(() => setCancelToast(null), 4000);
            fetchBookings();
          }}
        />
      )}
      {cancelToast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: t.cancelled.bg, color: t.cancelled.text,
          border: `1px solid ${t.cancelled.dot}40`,
          padding: "11px 24px", borderRadius: 10, fontSize: 13, fontWeight: 600,
          zIndex: 2000, whiteSpace: "nowrap", boxShadow: t.shadowMd,
        }}>{cancelToast}</div>
      )}
      {nsModal && (
        <Modal title="تأكيد: لم يحضر" onClose={() => { setNsModal(null); setNsError(""); }} t={t} width={400}>
          <div style={{ padding: "10px 12px", borderRadius: 9, background: t.noshow.bg, marginBottom: 12, fontSize: 12, color: t.noshow.text }}>
            العربون غير مسترد — تُسجَّل الجلسة كـ No-Show
          </div>
          <InfoRow k="الطالب" v={nsModal.student} t={t} />
          <InfoRow k="الجلسة" v={nsModal.dateTime} t={t} />
          {nsError && (
            <div style={{ background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)", borderRadius: 9, padding: "10px 12px", marginTop: 10, fontSize: 13, color: "#c74848" }}>{nsError}</div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Btn label={nsBusy ? "جارٍ..." : "تأكيد No-Show"} onClick={handleNoShow} t={t} v="danger" style={{ flex: 1 }} disabled={nsBusy} />
            <Btn label="إلغاء" onClick={() => { setNsModal(null); setNsError(""); }} t={t} v="ghost" />
          </div>
        </Modal>
      )}
      {detailModal && (() => {
        // api = nested response { booking, student, instructor, vehicle, ... } from GET /reception/bookings/:id
        // raw = flat booking object from the list API (always preserved)
        const api = detailModal.apiDetail;
        const r = detailModal.raw || {};

        const bk = api?.booking || r;
        const studentName = api?.student?.name || r.studentName || detailModal.student || "—";
        const instructorName = api?.instructor?.name || r.instructorName || detailModal.inst || "—";

        const vehicleStr = (() => {
          if (api?.vehicle) {
            const v = api.vehicle;
            const src = api.booking?.vehicleSource || v.vehicleSource;
            return src === "STUDENT_CAR" ? "سيارة الطالب" : (`${v.model || ""} ${v.plateNumber || ""}`.trim() || "—");
          }
          return r.vehicleSource === "STUDENT_CAR" ? "سيارة الطالب" : (r.vehiclePlate || detailModal.vehicle || "—");
        })();

        const type = TRAINING_MAP[bk.trainingType] || bk.trainingType || detailModal.type || "—";
        const payLabel = PAYMENT_STATUS_MAP[bk.paymentStatus] || bk.paymentStatus || detailModal.pay || "—";
        const statusLabel = BOOKING_STATUS_MAP[bk.bookingStatus] || bk.bookingStatus || detailModal.status || "—";
        const detailCharges = Array.isArray(api?.charges) ? api.charges : [];

        // Deposit amount shown next to "العربون مدفوع"
        const depositAmt = (() => {
          // 1. Direct field on the booking object
          const direct = bk.collectedAmount ?? bk.depositAmount ?? bk.depositPaid ?? null;
          if (direct != null && parseFloat(direct) > 0) return parseFloat(direct);
          // 2. Payments on a DEPOSIT-type charge
          const depositCharge = detailCharges.find(c =>
            /deposit/i.test(c.chargeReason || "") ||
            c.chargeReason === "BOOKING_DEPOSIT"
          );
          if (depositCharge) {
            const paid = (depositCharge.payments || []).reduce((s, p) => s + parseFloat(p.amount || 0), 0);
            if (paid > 0) return paid;
          }
          // 3. Total of all payments across all charges (what was actually collected so far)
          const totalPaid = detailCharges.reduce(
            (sum, c) => sum + (c.payments || []).reduce((s, p) => s + parseFloat(p.amount || 0), 0), 0
          );
          return totalPaid > 0 ? totalPaid : null;
        })();
        const payLabelFull = (bk.paymentStatus === "DEPOSIT_PAID" && depositAmt != null)
          ? `${payLabel} (${Number(depositAmt).toLocaleString("en")} ل.س)`
          : payLabel;
        const dateStr = bk.dayName && bk.date ? `${bk.dayName} ${bk.date}` : (bk.date || "—");
        const timeStr = bk.startTime && bk.endTime ? `من ${bk.startTime} إلى ${bk.endTime}` : (bk.startTime || "—");
        const chargesRem = detailCharges.length > 0
          ? detailCharges.reduce((sum, c) => {
              const due  = parseFloat(c.amountDue ?? c.remainingAmount ?? 0);
              const paid = (c.payments || []).reduce((s, p) => s + parseFloat(p.amount || 0), 0);
              return sum + Math.max(0, due - paid);
            }, 0)
          : null;
        const remainingAmt = (chargesRem != null && chargesRem > 0 ? chargesRem : null) ?? bk.remainingAmount ?? null;
        const remainingStr = remainingAmt != null ? `${Number(remainingAmt).toLocaleString("en")} ل.س` : "—";
        const bookingId = bk.id || detailModal.id;

        const sectionTitle = (text) => (
          <div style={{
            fontSize: 13, fontWeight: 700, color: t.accent,
            paddingBottom: 6, marginBottom: 10, marginTop: 16,
            borderBottom: `2px solid ${t.accentLight}`,
          }}>{text}</div>
        );

        return (
          <Modal title={`تفاصيل الحجز كاملة #${bookingId}`} onClose={() => setDetailModal(null)} t={t} width={480}>
            {detailLoading && <div style={{textAlign:"center",padding:"6px 0 10px",fontSize:12,color:t.textMuted}}>جارٍ تحميل التفاصيل...</div>}
            {sectionTitle("معلومات الطالب والمدرب")}
            <InfoRow k="اسم الطالب" v={studentName} t={t} />
            <InfoRow k="اسم المدرب" v={instructorName} t={t} />

            {sectionTitle("تفاصيل التدريب والجدولة")}
            <InfoRow k="نوع التدريب" v={type} t={t} />
            <InfoRow k="تاريخ الجلسة" v={dateStr} t={t} />
            <InfoRow k="وقت الجلسة" v={timeStr} t={t} />
            <InfoRow k="المركبة" v={vehicleStr} t={t} />

            {sectionTitle("التفاصيل المالية")}
            <InfoRow k="حالة الدفع" v={payLabelFull} t={t} />
            <InfoRow k="حالة الحجز" v={statusLabel} t={t} />
            <InfoRow k="المبلغ المتبقي" v={remainingStr} t={t} />

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
              <Btn label="إغلاق" onClick={() => setDetailModal(null)} t={t} v="ghost" style={{ minWidth: 100 }} />
            </div>
          </Modal>
        );
      })()}
    </div>
  );
}

const VEHICLES=[
  {id:1,plate:"أ·ب·ج ١٠١",model:"تويوتا كورولا",year:2020,type:"عادي",color:"أبيض",status:"متاحة",lm:42,fm:6000,maint:3000},
  {id:2,plate:"أ·ب·ج ١٠٢",model:"تويوتا كورولا",year:2019,type:"عادي",color:"رمادي",status:"في الصيانة",lm:31,fm:4800,maint:4500},
  {id:3,plate:"أ·ب·ج ٢٠١",model:"هيونداي إلنترا",year:2021,type:"أوتوماتيك",color:"أسود",status:"متاحة",lm:38,fm:5400,maint:1200},
  {id:4,plate:"أ·ب·ج ٢٠٢",model:"هيونداي إلنترا",year:2022,type:"أوتوماتيك",color:"أبيض",status:"متاحة",lm:41,fm:5800,maint:900},
];
const FUEL_LOG=[
  {date:"٤ يونيو",liters:30,ppl:200,total:6000,note:"تعبئة كاملة"},
  {date:"٢٨ مايو",liters:25,ppl:200,total:5000,note:""},
  {date:"٢٠ مايو",liters:28,ppl:195,total:5460,note:""},
];

function SectionVehicles({t}){
  const [tf,setTf]=useState("الكل");
  const [sel,setSel]=useState(VEHICLES[0]);
  const [vTab,setVTab]=useState("info");
  const [fModal,setFModal]=useState(false);
  const [liters,setLiters]=useState("");
  const [ppl,setPpl]=useState("");
  const filtered=VEHICLES.filter(v=>tf==="الكل"||v.type===tf);
  return(
    <div style={{display:"flex",height:"100%"}}>
      <div className="hide-scrollbar" style={{width:270,flexShrink:0,display:"flex",flexDirection:"column",borderLeft:`1px solid ${t.border}`}}>
        <div style={{padding:"12px 12px 8px",borderBottom:`1px solid ${t.border}`}}>
          <div style={{display:"flex",gap:3}}>
            {["الكل","عادي","أوتوماتيك"].map(ty=><button key={ty} onClick={()=>setTf(ty)} style={{flex:1,padding:"6px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:tf===ty?700:400,background:tf===ty?t.accent:"transparent",color:tf===ty?"#fff":t.textMuted}}>{ty}</button>)}
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {filtered.map(v=>(
            <div key={v.id} onClick={()=>setSel(v)} style={{padding:"13px 13px",cursor:"pointer",borderBottom:`1px solid ${t.border}`,background:sel?.id===v.id?t.accentLight:t.bgSurface,borderRight:sel?.id===v.id?`3px solid ${t.accent}`:"3px solid transparent"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}><span style={{fontSize:14,fontWeight:700,color:t.text}}>{v.plate}</span><Badge s={v.status} t={t}/></div>
              <div style={{fontSize:12,color:t.textSec}}>{v.model} {v.year}</div>
              <div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{v.type} • {v.lm} جلسة/شهر</div>
            </div>
          ))}
        </div>
        <div style={{padding:"10px 12px",borderTop:`1px solid ${t.border}`,background:t.bgElevated}}>
          <Btn label="+ إضافة مركبة" t={t} sz="sm" style={{width:"100%"}}/>
        </div>
      </div>
      {sel&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"16px 22px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:12,background:t.bgSurface,flexShrink:0}}>
            <div style={{fontSize:32}}></div>
            <div style={{flex:1}}>
              <div style={{fontSize:17,fontWeight:700,color:t.text}}>{sel.plate}</div>
              <div style={{fontSize:12,color:t.textSec,marginTop:2}}>{sel.model} {sel.year} • {sel.color}</div>
              <div style={{marginTop:5,display:"flex",gap:5}}><Badge s={sel.status} t={t}/><Badge s={sel.type} t={t}/></div>
            </div>
            <div style={{display:"flex",gap:7}}>
              <Btn label=" تعبئة بنزين" onClick={()=>setFModal(true)} t={t} sz="sm" v="secondary"/>
              {sel.status==="متاحة"?<Btn label="صيانة" t={t} sz="sm" v="danger"/>:<Btn label="إعادة للخدمة" t={t} sz="sm" v="secondary"/>}
            </div>
          </div>
          <div style={{display:"flex",borderBottom:`1px solid ${t.border}`,background:t.bgSurface,padding:"0 22px",flexShrink:0}}>
            {[["info","البيانات"],["sessions","الجلسات"],["fuel","الوقود"],["stats","الإحصاءات"]].map(([id,label])=>(
              <button key={id} onClick={()=>setVTab(id)} style={{padding:"11px 13px",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:vTab===id?700:400,background:"transparent",color:vTab===id?t.accent:t.textSec,borderBottom:`2px solid ${vTab===id?t.accent:"transparent"}`,marginBottom:-1}}>{label}</button>
            ))}
          </div>
          <div style={{flex:1,overflowY:"hidden",padding:"18px 22px"}}>
            {vTab==="info"&&<Card t={t} p={16} style={{maxWidth:420}}>
              <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:10}}>بيانات المركبة</div>
              <InfoRow k="رقم اللوحة" v={sel.plate} t={t}/><InfoRow k="الموديل" v={`${sel.model} ${sel.year}`} t={t}/>
              <InfoRow k="اللون" v={sel.color} t={t}/><InfoRow k="نوع التدريب" v={sel.type} t={t}/><InfoRow k="الحالة" v={sel.status} t={t}/>
            </Card>}
            {vTab==="sessions"&&(
              <div>
                {[{date:"٤ يونيو",time:"٠٩:٠٠",inst:"خالد عمر",student:"أحمد محمد",status:"مكتمل"},{date:"٤ يونيو",time:"١٤:٠٠",inst:"أحمد الزيد",student:"محمود سالم",status:"مؤكد"},{date:"٣ يونيو",time:"١١:٠٠",inst:"خالد عمر",student:"كريم عبدو",status:"ملغي"}].map((s,i)=>(
                  <div key={i} style={{background:t.bgSurface,borderRadius:9,border:`1px solid ${t.borderCard}`,padding:"11px 14px",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><div style={{fontSize:13,fontWeight:600,color:t.text}}>{s.student}</div><div style={{fontSize:11,color:t.textSec,marginTop:2}}>{s.inst} • {s.date} {s.time}</div></div>
                    <Badge s={s.status} t={t}/>
                  </div>
                ))}
              </div>
            )}
            {vTab==="fuel"&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                  <div style={{fontSize:13,fontWeight:700,color:t.text}}>سجل الوقود</div>
                  <Btn label=" تعبئة جديدة" onClick={()=>setFModal(true)} t={t} sz="sm"/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:12}}>
                  {[["83 لتر","هذا الشهر",t.accent],[`${sel.fm.toLocaleString("en")} ل.س`,"تكلفة الشهر",t.pending.text],["3","عمليات تعبئة",t.text]].map(([v,l,c],i)=>(
                    <div key={i} style={{background:t.bgSurface,borderRadius:9,border:`1px solid ${t.borderCard}`,padding:12,textAlign:"center"}}>
                      <div style={{fontSize:18,fontWeight:700,color:c}}>{v}</div>
                      <div style={{fontSize:10,color:t.textMuted,marginTop:3}}>{l}</div>
                    </div>
                  ))}
                </div>
                {FUEL_LOG.map((f,i)=>(
                  <div key={i} style={{background:t.bgSurface,borderRadius:9,border:`1px solid ${t.borderCard}`,padding:"11px 14px",marginBottom:7}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:13,fontWeight:700,color:t.text}}>{f.date}</span><span style={{fontSize:13,fontWeight:700,color:t.accent}}>{f.total.toLocaleString("en")} ل.س</span></div>
                    <div style={{fontSize:12,color:t.textSec}}>{f.liters} لتر × {f.ppl} ل.س/لتر{f.note&&` • ${f.note}`}</div>
                  </div>
                ))}
              </div>
            )}
            {vTab==="stats"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[{l:"جلسات الشهر",v:sel.lm,max:60,c:t.accent},{l:"تكلفة الوقود/شهر",v:sel.fm,suf:" ل.س",c:t.pending.text},{l:"تكلفة الصيانة/شهر",v:sel.maint,suf:" ل.س",c:t.cancelled.text},{l:"معدل التوفر",v:93,suf:"٪",c:t.completed.text}].map((s,i)=>(
                  <Card key={i} t={t} p={16} mb={0}>
                    <div style={{fontSize:20,fontWeight:700,color:s.c}}>{typeof s.v==="number"?s.v.toLocaleString("en"):s.v}{s.suf||""}</div>
                    <div style={{fontSize:11,color:t.textMuted,marginTop:3}}>{s.l}</div>
                    {s.max&&<div style={{marginTop:8,height:5,background:t.border,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${(s.v/s.max)*100}%`,background:s.c,borderRadius:3}}/></div>}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {fModal&&<Modal title=" تعبئة وقود" onClose={()=>setFModal(false)} t={t} width={380}>
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>المركبة</label><div style={{padding:"9px 12px",borderRadius:9,background:t.accentLight,color:t.accentText,fontSize:13,fontWeight:600}}>{sel?.plate}</div></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          {[{l:"عدد الليترات",v:liters,set:setLiters},{l:"سعر اللتر (ل.س)",v:ppl,set:setPpl}].map((f,i)=>(
            <div key={i}><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>{f.l}</label><input value={f.v} onChange={e=>f.set(e.target.value)} type="number" placeholder="0" style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}}/></div>
          ))}
        </div>
        {liters&&ppl&&<div style={{padding:"10px 12px",borderRadius:9,background:t.accentLight,marginBottom:10,display:"flex",justifyContent:"space-between",fontSize:13}}><span style={{color:t.accentText}}>الإجمالي</span><span style={{fontWeight:700,color:t.accent}}>{(parseFloat(liters)*parseFloat(ppl)).toLocaleString("en")} ل.س</span></div>}
        <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>ملاحظة</label><input type="text" placeholder="اختيارية" style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}}/></div>
        <div style={{display:"flex",gap:8}}><Btn label="✓ حفظ وإصدار فاتورة" onClick={()=>setFModal(false)} t={t} style={{flex:1}}/><Btn label="إلغاء" onClick={()=>setFModal(false)} t={t} v="ghost"/></div>
      </Modal>}
    </div>
  );
}

const CERT_STATUS_MAP = {
  WAITING_FOR_TRAINING_SCHEDULE: { label: "بانتظار جدولة التدريب",     tk: "pending" },
  IN_GOVERNMENT_TRAINING:        { label: "في التدريب الحكومي",         tk: "inprogress" },
  WAITING_FOR_PRACTICAL_EXAM:    { label: "بانتظار الامتحان العملي",   tk: "qualified" },
  WAITING_FOR_THEORETICAL_EXAM:  { label: "بانتظار الامتحان النظري",   tk: "confirmed" },
  SUBMITTED_TO_GOV:              { label: "أُرسلت للحكومة",             tk: "inprogress" },
  EXAM_SCHEDULED:                { label: "مجدول الامتحان",             tk: "qualified" },
  COMPLETED:                     { label: "حصل على الرخصة",            tk: "completed" },
  FAILED:                        { label: "راسب نهائياً",              tk: "failed" },
  CANCELLED:                     { label: "ملغى",                       tk: "cancelled" },
};

const EXAM_TYPE_LABEL  = { PRACTICAL: "عملي", THEORY: "نظري" };
const EXAM_RESULT_LABEL = { PASS: "ناجح", FAIL: "راسب", ABSENT: "غائب" };

function CertBadge({s,t}){
  const m=CERT_STATUS_MAP[s]||{label:s||"—",tk:"expired"};
  const c=t[m.tk]||t.expired;
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,background:c.bg,color:c.text,padding:"2px 9px",borderRadius:20,fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}><span style={{width:6,height:6,borderRadius:"50%",background:c.dot,flexShrink:0}}/>{m.label}</span>;
}

// ── Certificate helpers ───────────────────────────────────────────────
const CERT_TRANS={MANUAL:"يدوي",AUTOMATIC:"أوتوماتيك"};
const blobDownload=(blob,name)=>{const url=URL.createObjectURL(blob);Object.assign(document.createElement("a"),{href:url,download:name}).click();URL.revokeObjectURL(url);};
const COURSE_STATUS={
  SUBMITTED_TO_GOV:{label:"أُرسلت للحكومة", tk:"inprogress"},
  EXAM_SCHEDULED:  {label:"مجدول الامتحان",  tk:"qualified" },
  CLOSED:          {label:"مُغلقة",           tk:"completed" },
};
function CourseBadge({s,t}){
  const m=COURSE_STATUS[s]||CERT_STATUS_MAP[s]||{label:s||"—",tk:"expired"};
  const c=t[m.tk]||t.expired;
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,background:c.bg,color:c.text,padding:"2px 9px",borderRadius:20,fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}><span style={{width:6,height:6,borderRadius:"50%",background:c.dot,flexShrink:0}}/>{m.label}</span>;
}
function useCertToast(){
  const [toast,setToast]=useState(null);
  const show=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};
  const el=toast?<div style={{marginBottom:12,padding:"8px 14px",borderRadius:9,background:toast.type==="err"?"#FEE2E2":toast.type==="warn"?"#FEF3C7":"#DCFCE7",color:toast.type==="err"?"#991B1B":toast.type==="warn"?"#92400E":"#166534",fontSize:12,fontWeight:600}}>{toast.msg}</div>:null;
  return {show,el};
}

/* ── Tab 1: Pool ─────────────────────────────────────────────────────── */
function CertPoolTab({t,onOpenCourse,onOpenCert}){
  const {hasPermission}=useAuth();
  const canManageCert=hasPermission(P.CERTIFICATES_UPDATE);
  const canExportCert=hasPermission(P.CERTIFICATES_EXPORT);
  const [items,setItems]                  =useState([]);
  const [loading,setLoading]              =useState(true);
  const [error,setError]                  =useState(null);
  const [sel,setSel]                      =useState([]);   // string IDs (from GET response)
  const [allowSmallCourse,setAllowSmall]  =useState(false);
  const [createBusy,setCreateBusy]        =useState(false);
  const [exportBusy,setExportBusy]        =useState(false);
  const {show:toast,el:toastEl}           =useCertToast();

  /* ── fetch ── */
  const load=async()=>{
    setLoading(true);setError(null);
    try{
      const r=await certificatesService.getAll({unassigned:true,limit:50});
      // server wraps: r.data = { data: { data:[...], meta } } or { data:[...], meta }
      const payload=r.data?.data;
      const arr=Array.isArray(payload?.data)?payload.data:Array.isArray(payload)?payload:[];
      setItems(arr);
    }catch(e){
      setError(e.response?.data?.message||"تعذّر تحميل الطلبات");
      setItems([]);
    }finally{setLoading(false);}
  };
  useEffect(()=>{load();},[]);  // eslint-disable-line

  /* ── selection ── */
  const allChk =items.length>0&&items.every(c=>sel.includes(c.id));
  const toggle =id=>setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleAll=()=>setSel(allChk?[]:items.map(c=>c.id));
  const noneSelected=sel.length===0;

  /* ── export (no DB write — safe to repeat) ── */
  const doExport=async(fmt)=>{
    if(exportBusy||noneSelected)return;
    setExportBusy(true);
    try{
      const r=await certificatesService.exportPreview({certificateIds:sel.map(Number),format:fmt});
      blobDownload(r.data,`export.${fmt}`);
      toast("تم تحميل الملف");
    }catch(e){toast(e.response?.data?.message||"حدث خطأ","err");}
    finally{setExportBusy(false);}
  };

  /* ── create course — certificateIds MUST be Numbers per spec ── */
  const doCreate=async()=>{
    if(createBusy||noneSelected)return;
    setCreateBusy(true);
    try{
      const r=await certificatesService.createCourse({
        certificateIds:sel.map(Number),   // string → number
        allowSmallCourse,
      });
      // Response: { courseId:12, courseNumber:183, count:3, message:"..." }
      // courseId is always a Number (course IDs exception to string-ID rule)
      const body=r.data?.data??r.data;
      const newCourseId=body?.courseId;   // Number
      setSel([]);
      toast(`تم إنشاء الدورة ${body?.courseNumber??""} بنجاح`);
      if(newCourseId!=null&&onOpenCourse)onOpenCourse(newCourseId);
      else load();
    }catch(e){toast(e.response?.data?.message||"حدث خطأ","err");}
    finally{setCreateBusy(false);}
  };

  const cols ="40px 1fr 70px 160px 90px 100px";
  const btnBase={padding:"6px 14px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontFamily:"inherit",fontSize:12,cursor:"pointer"};
  const disabledStyle=(dis)=>dis?{opacity:0.45,cursor:"not-allowed"}:{};

  return(
    <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:12}}>
      {toastEl}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:14,fontWeight:700,color:t.text}}>الطلبات غير المسندة</div>
        <button onClick={load} style={{...btnBase}}>↻ تحديث</button>
      </div>

      {/* ── Table ── */}
      <div style={{border:`1px solid ${t.border}`,borderRadius:10,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:cols,background:t.bgElevated,borderBottom:`1px solid ${t.border}`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"9px 0"}}>
            <input type="checkbox" checked={allChk} onChange={toggleAll} disabled={!items.length} style={{cursor:"pointer"}}/>
          </div>
          {["اسم الطالب","الفئة","ناقل الحركة","نقل المدرسة","الإجراءات"].map(h=>(
            <div key={h} style={{fontSize:11,fontWeight:700,color:t.textMuted,padding:"9px 10px"}}>{h}</div>
          ))}
        </div>

        {loading?(
          <div style={{textAlign:"center",padding:36,color:t.textMuted,fontSize:13}}>جاري التحميل...</div>
        ):error?(
          <div style={{textAlign:"center",padding:36,color:"#e53e3e",fontSize:13}}>{error}</div>
        ):!items.length?(
          <div style={{textAlign:"center",padding:36,color:t.textMuted,fontSize:13}}>لا توجد طلبات غير مسندة</div>
        ):items.map((c,i)=>{
          const checked=sel.includes(c.id);
          return(
            <div key={c.id} onClick={()=>toggle(c.id)}
              style={{display:"grid",gridTemplateColumns:cols,alignItems:"center",borderBottom:i<items.length-1?`1px solid ${t.border}`:"none",background:checked?t.accentLight:t.bgSurface,cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"10px 0"}}>
                <input type="checkbox" checked={checked} onChange={()=>toggle(c.id)} onClick={e=>e.stopPropagation()} style={{cursor:"pointer"}}/>
              </div>
              <div style={{padding:"10px"}}>
                <div style={{fontSize:13,fontWeight:600,color:t.text}}>{c.studentName||"—"}</div>
              </div>
              <div style={{padding:"10px",fontSize:13,fontWeight:600,color:t.text}}>{c.category||"—"}</div>
              <div style={{padding:"10px",fontSize:12,color:t.textSec}}>
                {CERT_TRANS[c.transmissionType]||c.transmissionType||"—"}
              </div>
              <div style={{padding:"10px"}}>
                {c.transportRequested
                  ?<span style={{display:"inline-flex",gap:3,background:"#DCFCE7",color:"#166534",padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600}}>● نعم</span>
                  :<span style={{display:"inline-flex",gap:3,background:t.bgElevated,color:t.textMuted,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600}}>○ لا</span>
                }
              </div>
              <div style={{padding:"6px 10px"}} onClick={e=>e.stopPropagation()}>
                {/* Open cert file — allowed before course creation, locks after */}
                <button onClick={()=>onOpenCert&&onOpenCert(c.id)}
                  style={{padding:"4px 10px",borderRadius:7,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,cursor:"pointer",fontSize:11,fontFamily:"inherit",whiteSpace:"nowrap"}}>
                  فتح الملف
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer: actions ── */}
      <div style={{display:"flex",flexDirection:"column",gap:10,padding:"12px 14px",borderRadius:10,border:`1px solid ${t.border}`,background:t.bgSurface}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div style={{fontSize:13,fontWeight:600,color:t.text}}>
            {noneSelected?`${items.length} طلب — لم تختر أحداً`:`تم تحديد ${sel.length} طلبات`}
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            {/* Export buttons — same API route as course export, no DB write */}
            {canExportCert&&(
              <>
                <button onClick={()=>doExport("pdf")} disabled={noneSelected||exportBusy}
                  style={{...btnBase,...disabledStyle(noneSelected||exportBusy)}}>
                  {exportBusy?"...":"كشف الحكومة PDF"}
                </button>
                <button onClick={()=>doExport("xlsx")} disabled={noneSelected||exportBusy}
                  style={{...btnBase,...disabledStyle(noneSelected||exportBusy)}}>
                  XLSX
                </button>
              </>
            )}
            {/* Create course — disabled until at least one selected */}
            {canManageCert&&(
              <button onClick={doCreate} disabled={noneSelected||createBusy}
                style={{padding:"6px 16px",borderRadius:8,border:"none",background:noneSelected||createBusy?t.border:t.accent,color:"#fff",fontFamily:"inherit",fontSize:12,fontWeight:700,...disabledStyle(noneSelected||createBusy)}}>
                {createBusy?"جاري الإنشاء...":"إنشاء دورة جديدة"}
              </button>
            )}
          </div>
        </div>
        {/* allowSmallCourse — permanent inline checkbox, no confirm dialog */}
        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none",fontSize:12,color:t.textSec}}>
          <input type="checkbox" checked={allowSmallCourse} onChange={e=>setAllowSmall(e.target.checked)} style={{cursor:"pointer"}}/>
          تجاوز تحذير «أقل من 20 طالباً»
        </label>
      </div>

      {/* ── Warning — data locks after creation ── */}
      <div style={{padding:"10px 14px",borderRadius:9,background:"#FFFBEB",border:"1px solid #FDE68A",color:"#92400E",fontSize:12,lineHeight:1.6}}>
        ⚠ تنبيه. بعد إنشاء الدورة لن يمكن تعديل بيانات الطلاب المدرجين فيها. تأكد من اختيار الطلبات الصحيحة قبل المتابعة.
      </div>
    </div>
  );
}

/* ── Exam Results View ───────────────────────────────────────────────── */
function ExamResultsView({t, courseId, courseNumber, onBack, onToast, onRefresh, onPracticalPhase}){
  const [registered, setRegistered] = useState([]);
  const [invitedNot, setInvitedNot] = useState([]);
  const [summary,    setSummary]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  // local: { [certId]: { theory?: val, practical?: val } }
  const [local,      setLocal]      = useState({});
  const [saving,     setSaving]     = useState(false);

  /* ─ helpers ─ */
  const certIdStr    = s  => String(s.certificateId);
  const theorySection= s  => s.sections?.find(x => x.examType === "THEORY");
  const practSection = s  => s.sections?.find(x => x.examType === "PRACTICAL");
  // effective result = local override first, then saved from server
  const effTheory    = s  => local[certIdStr(s)]?.theory    ?? theorySection(s)?.examResult  ?? null;
  const effPract     = s  => local[certIdStr(s)]?.practical ?? practSection(s)?.examResult   ?? null;

  /* ─ load ─ */
  const loadRoster = async () => {
    setLoading(true); setError(null);
    try {
      const r    = await certificatesService.getCourseRoster(courseId);
      const body = r.data?.data ?? r.data;
      const reg  = Array.isArray(body?.registered) ? body.registered : [];
      setRegistered(reg);
      setInvitedNot(Array.isArray(body?.invitedNotRegistered)  ? body.invitedNotRegistered  : []);
      setSummary(body?.summary ?? null);
      const hasPract = reg.some(s => {
        const th = s.sections?.find(x=>x.examType==="THEORY");
        const pr = s.sections?.find(x=>x.examType==="PRACTICAL");
        return th?.examResult==="PASS" && (!pr || pr.examResult==null);
      });
      onPracticalPhase?.(hasPract);
    } catch(e){ setError(e.response?.data?.message || "تعذّر تحميل القائمة"); }
    finally   { setLoading(false); }
  };

  useEffect(()=>{ loadRoster(); },[courseId]); // eslint-disable-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect

  /* ─ derived stats ─ */
  const readySaveCount = Object.values(local).filter(v => v.theory != null || v.practical != null).length;

  /* ─ actions ─ */
  const setResult = (certId, field, value) =>
    setLocal(prev => ({
      ...prev,
      [String(certId)]: {
        ...(prev[String(certId)] || {}),
        [field]: prev[String(certId)]?.[field] === value ? null : value,
      }
    }));

  const setBatch = (field, value) => {
    const next = { ...local };
    registered.forEach(s => {
      const cid  = certIdStr(s);
      const sect = field === "theory" ? theorySection(s) : practSection(s);
      if (sect?.examResult != null) return; // already saved
      if (field === "theory"    && !theorySection(s)) return;
      if (field === "practical" && !sect)             return;
      if (field === "practical" && effTheory(s) !== "PASS") return;
      next[cid] = { ...(next[cid] || {}), [field]: value };
    });
    setLocal(next);
  };

  const handleSave = async () => {
    const items = [];
    Object.entries(local).forEach(([certId, vals]) => {
      const item = { certificateId: Number(certId) };
      if (vals.theory    != null) item.theory    = vals.theory;
      if (vals.practical != null) item.practical = vals.practical;
      if (item.theory !== undefined || item.practical !== undefined) items.push(item);
    });
    if (!items.length) return;
    setSaving(true);
    try {
      const r    = await certificatesService.submitResults(courseId, { items });
      const body = r.data?.data ?? r.data;
      if (body?.courseClosed) {
        onToast?.("تم إغلاق الدورة تلقائياً — جميع النتائج سُجِّلت");
        onRefresh?.();
        onBack();
        return;
      }
      onToast?.("تم حفظ النتائج بنجاح");
      setLocal({});
      await loadRoster();
      onRefresh?.();
    } catch(e){ onToast?.(e.response?.data?.message || "فشل الحفظ", "err"); }
    finally   { setSaving(false); }
  };

  /* ─ style helpers ─ */
  const rBtn = (active, clr) => ({
    padding:"3px 9px", borderRadius:20, border:`1.5px solid ${active?clr:t.border}`,
    background: active?`${clr}18`:"transparent", color: active?clr:t.textMuted,
    cursor:"pointer", fontSize:11, fontWeight: active?700:500, fontFamily:"inherit",
    transition:"all 0.12s", whiteSpace:"nowrap",
  });

  const savedBadge = (result, attempt) => {
    const map = { PASS:{ bg:"#DCFCE7", txt:"#166534", lbl:"ناجح" }, FAIL:{ bg:"#FEE2E2", txt:"#991B1B", lbl:"راسب" }, ABSENT:{ bg:"#FEF9C3", txt:"#92400E", lbl:"لم يحضر" } };
    const m = map[result] || { bg: t.bgElevated, txt: t.textMuted, lbl: "—" };
    return (
      <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:m.bg, color:m.txt }}>
        {m.lbl}{attempt != null ? ` · م${attempt}` : " · مُسجّلة"}
      </span>
    );
  };

  const OPTS = [
    { v:"PASS",   lbl:"ناجح",    clr:"#166534" },
    { v:"FAIL",   lbl:"راسب",    clr:"#DC2626" },
    { v:"ABSENT", lbl:"لم يحضر", clr:"#D97706" },
  ];

  // Render a single theory or practical cell
  const renderCell = (s, field) => {
    const sect      = field === "theory" ? theorySection(s) : practSection(s);
    const effective = field === "theory" ? effTheory(s)     : effPract(s);
    const cid       = certIdStr(s);

    // Practical: locked when no section exists yet
    if (field === "practical" && !sect) {
      const th = effTheory(s);
      return (
        <span style={{fontSize:11, color:t.textMuted, fontStyle:"italic"}}>
          {th==="PASS" ? "سيُفتح بعد الحفظ"
           : th==="FAIL"   ? "راسب في النظري"
           : th==="ABSENT" ? "لم يحضر النظري"
           : "يُفتح بعد النجاح في النظري"}
        </span>
      );
    }
    // Theory: no section (e.g. reexam-practical-only student)
    if (field === "theory" && !sect) {
      return <span style={{fontSize:11, color:t.textMuted}}>—</span>;
    }
    // Already saved
    if (sect?.examResult != null) return savedBadge(sect.examResult, sect.attemptNumber);
    // Editable
    return (
      <div style={{display:"flex", gap:4, flexWrap:"wrap"}}>
        {OPTS.map(opt=>(
          <button key={opt.v} onClick={()=>setResult(cid, field, opt.v)} style={rBtn(effective===opt.v, opt.clr)}>{opt.lbl}</button>
        ))}
      </div>
    );
  };

  return (
    <div style={{padding:"16px 20px", display:"flex", flexDirection:"column", gap:14, overflowY:"auto", flex:1}}>

      {/* ── Breadcrumb ── */}
      <div style={{display:"flex", alignItems:"center", gap:10, flexWrap:"wrap"}}>
        <button onClick={onBack} style={{padding:"6px 14px", borderRadius:8, border:`1px solid ${t.border}`, background:t.bgElevated, color:t.text, cursor:"pointer", fontSize:13, fontFamily:"inherit"}}>
          ← الدورة {courseNumber}
        </button>
        <span style={{fontSize:16, fontWeight:800, color:t.text}}>إدخال نتائج الامتحان</span>
        {summary && (
          <span style={{fontSize:11, padding:"2px 10px", borderRadius:20, background:summary.pendingResults>0?"#FEF9C3":t.accentLight, color:summary.pendingResults>0?"#92400E":t.accentText, fontWeight:700}}>
            {summary.pendingResults} بانتظار النتيجة
          </span>
        )}
      </div>

      {loading ? (
        <div style={{textAlign:"center", padding:48, color:t.textMuted, fontSize:13}}>جارٍ تحميل قائمة الطلاب...</div>
      ) : error ? (
        <div style={{textAlign:"center", padding:48, color:"#c74848", fontSize:13}}>{error}<br/>
          <button onClick={loadRoster} style={{marginTop:12, padding:"6px 14px", borderRadius:8, border:`1px solid ${t.border}`, background:t.bgElevated, color:t.text, cursor:"pointer", fontSize:12, fontFamily:"inherit"}}>إعادة المحاولة</button>
        </div>
      ) : (<>

        {/* ── Stats cards ── */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10}}>
          {[
            { lbl:"المسجلون في الجلسة", val:summary?.total??registered.length, sub:`${summary?.regular??0} نظامي · ${summary?.reexam??0} معيد`, clr:t.accent },
            { lbl:"بانتظار النتيجة",    val:summary?.pendingResults??0,         sub:"لم تُسجَّل بعد",                                              clr:"#D97706" },
            { lbl:"مدعوون لم يسجّلوا", val:invitedNot.length,                  sub:"يمكن تسجيل إعادتهم يدوياً",                                   clr:"#DC2626" },
          ].map(c=>(
            <div key={c.lbl} style={{background:t.bgSurface, borderRadius:12, border:`1px solid ${t.borderCard}`, padding:"14px 16px"}}>
              <div style={{fontSize:22, fontWeight:800, color:c.clr, lineHeight:1, marginBottom:4}}>{c.val}</div>
              <div style={{fontSize:12, fontWeight:700, color:t.text, lineHeight:1.4}}>{c.lbl}</div>
              <div style={{fontSize:11, color:t.textMuted, marginTop:3}}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Batch actions ── */}
        <div style={{display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", padding:"9px 14px", background:t.bgElevated, borderRadius:10, border:`1px solid ${t.border}`}}>
          <span style={{fontSize:12, fontWeight:700, color:t.textSec}}>نظري:</span>
          {OPTS.map(a=>(
            <button key={`th-${a.v}`} onClick={()=>setBatch("theory", a.v)}
              style={{padding:"4px 12px", borderRadius:7, border:`1px solid ${t.border}`, background:t.bgSurface, color:a.clr, cursor:"pointer", fontSize:11, fontWeight:700, fontFamily:"inherit"}}>
              {a.v==="PASS"?"الكل ناجح":a.v==="FAIL"?"الكل راسب":"الكل لم يحضر"}
            </button>
          ))}
          <span style={{fontSize:12, fontWeight:700, color:t.textSec, marginRight:6}}>عملي:</span>
          {OPTS.map(a=>(
            <button key={`pr-${a.v}`} onClick={()=>setBatch("practical", a.v)}
              style={{padding:"4px 12px", borderRadius:7, border:`1px solid ${t.border}`, background:t.bgSurface, color:a.clr, cursor:"pointer", fontSize:11, fontWeight:700, fontFamily:"inherit"}}>
              {a.v==="PASS"?"الكل ناجح":a.v==="FAIL"?"الكل راسب":"الكل لم يحضر"}
            </button>
          ))}
          <button onClick={()=>setLocal({})}
            style={{padding:"4px 12px", borderRadius:7, border:`1px solid ${t.border}`, background:"transparent", color:t.textMuted, cursor:"pointer", fontSize:11, fontFamily:"inherit", marginRight:"auto"}}>
            مسح
          </button>
        </div>

        {/* ── Main table ── */}
        <div style={{border:`1px solid ${t.border}`, borderRadius:10, overflow:"hidden"}}>
          <div style={{display:"grid", gridTemplateColumns:"2fr 80px 1fr 1fr", background:t.bgElevated, borderBottom:`1px solid ${t.border}`}}>
            {["الطالب","الصفة","الامتحان النظري","الامتحان العملي"].map(h=>(
              <div key={h} style={{fontSize:11, fontWeight:700, color:t.textMuted, padding:"10px 14px"}}>{h}</div>
            ))}
          </div>
          {!registered.length ? (
            <div style={{textAlign:"center", padding:32, color:t.textMuted, fontSize:13}}>لا يوجد طلاب مسجلون</div>
          ) : registered.map((s, i) => (
            <div key={certIdStr(s)} style={{display:"grid", gridTemplateColumns:"2fr 80px 1fr 1fr", alignItems:"center", borderBottom:i<registered.length-1?`1px solid ${t.border}`:"none", background:t.bgSurface}}>
              <div style={{padding:"11px 14px"}}>
                <div style={{fontSize:13, fontWeight:600, color:t.text}}>{s.studentName||"—"}</div>
                <div style={{fontSize:11, color:t.textMuted, marginTop:2, direction:"ltr", textAlign:"right"}}>{s.studentPhone||"—"}</div>
                {s.isReexam&&<span style={{fontSize:10,color:"#C2410C"}}>دورة {s.ownCourseNumber}</span>}
              </div>
              <div style={{padding:"11px 14px"}}>
                <span style={{padding:"2px 9px", borderRadius:20, fontSize:11, fontWeight:600, background:s.isReexam?"#FFF7ED":t.accentLight, color:s.isReexam?"#C2410C":t.accentText}}>
                  {s.isReexam?"معيد":"نظامي"}
                </span>
              </div>
              <div style={{padding:"9px 14px"}}>{renderCell(s,"theory")}</div>
              <div style={{padding:"9px 14px"}}>{renderCell(s,"practical")}</div>
            </div>
          ))}
        </div>

        {/* ── Invited not registered ── */}
        {invitedNot.length > 0 && (
          <div style={{border:`1px solid #FDE68A`, borderRadius:10, overflow:"hidden"}}>
            <div style={{padding:"10px 14px", background:"#FFFBEB", borderBottom:`1px solid #FDE68A`}}>
              <span style={{fontSize:12, fontWeight:700, color:"#92400E"}}>مدعوون للإعادة لم يُسجّلوا ({invitedNot.length})</span>
              <span style={{fontSize:11, color:"#B45309", marginRight:8}}>— يمكن تسجيل إعادتهم يدوياً من ملف كل طالب</span>
            </div>
            {invitedNot.map((s,i)=>(
              <div key={`inv-${i}`} style={{display:"flex", alignItems:"center", padding:"9px 14px", borderBottom:i<invitedNot.length-1?`1px solid ${t.border}`:"none", background:t.bgSurface, gap:12}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:13, fontWeight:600, color:t.text}}>{s.studentName||"—"}</div>
                  <div style={{fontSize:11, color:t.textMuted}}>دورته الأصلية: {s.ownCourseNumber} · {s.examType==="THEORY"?"نظري":"عملي"}</div>
                </div>
                <span style={{fontSize:11, padding:"2px 10px", borderRadius:20, background:"#FFF7ED", color:"#C2410C", fontWeight:600}}>{s.studentPhone||"—"}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:t.bgSurface, borderRadius:10, border:`1px solid ${t.borderCard}`, flexWrap:"wrap", gap:10}}>
          <div style={{fontSize:13, fontWeight:readySaveCount>0?700:400, color:readySaveCount>0?t.accent:t.textMuted}}>
            {readySaveCount>0 ? `${readySaveCount} نتيجة جاهزة للحفظ` : "لم تُدخل أي نتيجة"}
          </div>
          <div style={{display:"flex", gap:8}}>
            <button onClick={onBack} style={{padding:"8px 18px", borderRadius:9, border:`1px solid ${t.border}`, background:"transparent", color:t.textSec, cursor:"pointer", fontSize:13, fontFamily:"inherit"}}>إلغاء</button>
            <button onClick={handleSave} disabled={readySaveCount===0||saving}
              style={{padding:"8px 20px", borderRadius:9, border:"none", background:readySaveCount===0||saving?t.border:t.accent, color:"#fff", cursor:readySaveCount===0||saving?"not-allowed":"pointer", fontSize:13, fontFamily:"inherit", fontWeight:700, opacity:readySaveCount===0||saving?0.5:1}}>
              {saving?"جارٍ الحفظ...":"حفظ النتائج"}
            </button>
          </div>
        </div>

      </>)}
    </div>
  );
}

/* ── Tab 2: Courses ──────────────────────────────────────────────────── */
function CourseDetailView({t,course:payload,onBack,onToast,toastEl,onRefresh,onOpenCert}){
  const {hasPermission}=useAuth();
  const canManageCert=hasPermission(P.CERTIFICATES_UPDATE);
  const canExportCert=hasPermission(P.CERTIFICATES_EXPORT);
  const c        = payload?.course   ?? payload   ?? {};
  const initSess = Array.isArray(payload?.sessions) ? payload.sessions : [];
  const students = Array.isArray(payload?.students) ? payload.students : [];

  const [_simOff,_setSimOff]=useState(()=>Number(localStorage.getItem("sim.clock.offsetMs")||"0"));
  useEffect(()=>{const id=setInterval(()=>_setSimOff(Number(localStorage.getItem("sim.clock.offsetMs")||"0")),1000);return()=>clearInterval(id);},[]);
  // eslint-disable-next-line react-hooks/purity
  const simNow=()=>new Date(Date.now()+_simOff);

  const fmtScheduledAt=(scheduledAt)=>{
    if(!scheduledAt)return"—";
    const d=new Date(scheduledAt);
    return d.toLocaleString("ar-SY",{weekday:"long",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false});
  };

  const mkSlot=(n)=>{
    const f=initSess.find(s=>s.sessionNumber===n);
    if(!f?.scheduledAt)return{sessionNumber:n,date:"",time:""};
    const d=new Date(f.scheduledAt);
    const date=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    const time=`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
    return{sessionNumber:n,date,time};
  };
  const [sessions,setSessions]=useState([mkSlot(1),mkSlot(2),mkSlot(3)]);
  const [savedSessions,setSavedSessions]=useState(initSess);
  const [notify,setNotify]=useState(false);
  const [sessionsBusy,setSessionsBusy]=useState(false);

  const [examDate,setExamDate]=useState(c.examScheduledAt?c.examScheduledAt.slice(0,10):"");
  const [examTime,setExamTime]=useState(c.examScheduledAt?c.examScheduledAt.slice(11,16):"");
  const [examNotify,setExamNotify]=useState(false);
  const [examBusy,setExamBusy]=useState(false);

  const [exportBusy,setExportBusy]=useState(false);
  const [showExamResults,setShowExamResults]=useState(false);
  const [practicalPhase,setPracticalPhase]=useState(false);

  const canEdit         = c.status==="SUBMITTED_TO_GOV" && canManageCert;
  const allSaved        = savedSessions.length>=3;
  const sess3Form       = sessions.find(s=>s.sessionNumber===3);
  const sess3DateTime   = allSaved&&sess3Form?.date&&sess3Form?.time?new Date(`${sess3Form.date}T${sess3Form.time}:00`):null;
  const sess3Passed     = sess3DateTime?simNow()>sess3DateTime:false;
  const anyResultRecorded = c.status==="CLOSED";
  const examAlreadySet  = c.status==="EXAM_SCHEDULED";
  const canSetExam      = (examAlreadySet ? !anyResultRecorded : (allSaved&&sess3Passed&&!anyResultRecorded)) && canManageCert;
  const showResults     = examAlreadySet && canManageCert;
  const resultsTimeLocked=!!c.examScheduledAt&&simNow()<new Date(c.examScheduledAt);
  const inp        = {width:"100%",padding:"8px 10px",borderRadius:9,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  const btnPrimary = (dis)=>({width:"100%",padding:"9px",borderRadius:9,border:"none",background:dis?t.border:t.accent,color:"#fff",cursor:dis?"not-allowed":"pointer",fontSize:13,fontFamily:"inherit",fontWeight:600,opacity:dis?0.5:1});
  const btnSec     = (dis)=>({padding:"6px 14px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,cursor:dis?"not-allowed":"pointer",fontSize:12,fontFamily:"inherit",opacity:dis?0.45:1});

  const saveSessions=async()=>{
    const filled=sessions.filter(s=>s.date&&s.time);
    if(filled.length<3){onToast("أدخل تاريخ ووقت الجلسات الثلاث","warn");return;}
    setSessionsBusy(true);
    try{
      const payload={
        sessions:filled.map(s=>({
          sessionNumber:s.sessionNumber,
          date:s.date,
          time:s.time.slice(0,5),
        })),
        notify,
      };
      const r=await certificatesService.updateSessions(c.id,payload);
      const d=r.data?.data;
      const count=d?.count??filled.length;
      const notified=d?.notified??0;
      setSavedSessions(filled.map(s=>({...s,scheduledAt:`${s.date}T${s.time.slice(0,5)}:00`})));
      onToast(`حُفظت ${count} جلسات · أُشعر ${notified} طالباً`);
      await onRefresh();
    }catch(e){onToast(e.response?.data?.message||"حدث خطأ","err");}
    finally{setSessionsBusy(false);}
  };

  const saveExam=async()=>{
    setExamBusy(true);
    try{
      await certificatesService.updateExamSchedule(c.id,{date:examDate,time:examTime,notify:examNotify});
      onToast("تم ضبط موعد الامتحان");
      await onRefresh();
    }catch(e){onToast(e.response?.data?.message||"حدث خطأ","err");}
    finally{setExamBusy(false);}
  };

  const doExport=async(fmt)=>{
    setExportBusy(true);
    try{
      const r=await certificatesService.exportCourse(c.id,{format:fmt});
      blobDownload(r.data,`course-${c.courseNumber??c.id}.${fmt}`);
      onToast("تم تحميل الملف");
    }catch(e){onToast(e.response?.data?.message||"حدث خطأ","err");}
    finally{setExportBusy(false);}
  };

  const statusPipeline=[
    {label:"أُرسلت للحكومة", sub:"مُنجزة",                                                                done:true},
    {label:"الجلسات الثلاث", sub:allSaved?"تمت الجدولة":"لم تُدخل",                                      done:allSaved},
    {label:"موعد الامتحان",  sub:c.examScheduledAt?fmtScheduledAt(c.examScheduledAt):"لم يُحدّد",         done:!!c.examScheduledAt},
    {label:"إدخال النتائج",  sub:c.status==="CLOSED"?"منتهية":showResults&&!resultsTimeLocked?"جاهز":showResults?"لم يحن موعده":"بانتظار الجدولة",
     done:c.status==="CLOSED",
     action:showResults&&!resultsTimeLocked?()=>setShowExamResults(true):undefined},
    {label:"إغلاق الدورة",   sub:c.status==="CLOSED"?"مُغلقة":"مفتوحة",                                  done:c.status==="CLOSED"},
  ];

  const StudentsColsTemplate="1fr 120px 60px 1fr 130px 80px";

  if(showExamResults){
    return(
      <ExamResultsView
        t={t}
        courseId={c.id}
        courseNumber={c.courseNumber??c.id}
        onBack={()=>setShowExamResults(false)}
        onToast={onToast}
        onRefresh={onRefresh}
        onPracticalPhase={v=>setPracticalPhase(v)}
      />
    );
  }

  return(
    <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:16}}>
      {toastEl}

      {/* ── Top bar ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={onBack} style={btnSec(false)}>← كل الدورات</button>
          <span style={{fontSize:16,fontWeight:800,color:t.text}}>الدورة {c.courseNumber??c.id}</span>
          <CourseBadge s={c.status} t={t}/>
        </div>
        {canExportCert&&(
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>doExport("pdf")} disabled={exportBusy} style={btnSec(exportBusy)}>كشف الحكومة PDF</button>
            <button onClick={()=>doExport("xlsx")} disabled={exportBusy} style={btnSec(exportBusy)}>XLSX</button>
          </div>
        )}
      </div>

      {/* ── Status pipeline ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
        {statusPipeline.map((s,i)=>(
          <div key={i} onClick={s.action||undefined}
            style={{padding:"10px 12px",borderRadius:10,border:`1px solid ${s.action?t.accent:s.done?t.accent:t.border}`,background:s.action?t.accentLight:s.done?t.accentLight:t.bgSurface,cursor:s.action?"pointer":"default",transition:"box-shadow 0.15s"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
              <span style={{width:18,height:18,borderRadius:"50%",background:s.done?t.accent:s.action?t.accent:t.border,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700,flexShrink:0}}>{s.done?"✓":i+1}</span>
              <span style={{fontSize:11,fontWeight:700,color:s.done?t.accentText:s.action?t.accentText:t.textSec,lineHeight:1.3}}>{s.label}</span>
            </div>
            <div style={{fontSize:10,color:s.done?t.accentText:s.action?t.accentText:t.textMuted,paddingRight:24}}>
              {s.sub}{s.action&&<span style={{marginRight:4}}>← انقر</span>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Results card (EXAM_SCHEDULED only) ── */}
      {showResults&&(
        <Card t={t}>
          <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:16,fontWeight:800,color:t.text,marginBottom:2}}>
                {students.length} طالب{students.length===1?"":"اً"} بانتظار إدخال النتيجة
              </div>
              <div style={{fontSize:11,color:t.textMuted}}>
                المسجلون {students.length} · موعد الامتحان {fmtScheduledAt(c.examScheduledAt)}
              </div>
            </div>
            <button
              onClick={()=>!resultsTimeLocked&&setShowExamResults(true)}
              disabled={resultsTimeLocked}
              style={{padding:"10px 22px",borderRadius:10,border:"none",background:resultsTimeLocked?t.border:t.accent,color:"#fff",cursor:resultsTimeLocked?"not-allowed":"pointer",fontSize:13,fontFamily:"inherit",fontWeight:700,opacity:resultsTimeLocked?0.6:1,flexShrink:0}}>
              {resultsTimeLocked?"النتائج تُفتح في موعد الامتحان":practicalPhase?"إدخال نتائج امتحان العملي":"إدخال نتائج الامتحان"}
            </button>
          </div>
        </Card>
      )}

      {/* ── Two-column cards ── */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,alignItems:"start"}}>

        {/* Card ① Sessions */}
        <Card t={t}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <span style={{width:26,height:26,borderRadius:"50%",background:t.accent,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",fontWeight:700,flexShrink:0}}>1</span>
            <span style={{fontSize:13,fontWeight:700,color:t.text}}>الجلسات الحكومية الثلاث</span>
            {savedSessions.length>=3
              ?<span style={{display:"inline-flex",background:"#DCFCE7",color:"#166534",borderRadius:20,padding:"1px 10px",fontSize:10,fontWeight:700,marginRight:"auto"}}>✓ محدّدة</span>
              :<span style={{display:"inline-flex",background:"#FFFBEB",color:"#92400E",border:"1px solid #FDE68A",borderRadius:20,padding:"1px 10px",fontSize:10,fontWeight:700,marginRight:"auto"}}>مطلوبة</span>
            }
          </div>
          <div style={{fontSize:11,color:t.textMuted,marginBottom:12,lineHeight:1.5}}>موعد واحد يشترك فيه كل طلاب الدورة، وكل جلسة في يوم مختلف.</div>

          {/* Read-only summary */}
          {savedSessions.length>0&&(
            <div style={{marginBottom:14,padding:"10px 12px",borderRadius:9,background:t.bgElevated,border:`1px solid ${t.border}`}}>
              {savedSessions.map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",borderBottom:i<savedSessions.length-1?`1px solid ${t.border}`:"none"}}>
                  <span style={{fontSize:10,fontWeight:700,color:t.textMuted,minWidth:48}}>الجلسة {s.sessionNumber??i+1}</span>
                  <span style={{fontSize:12,color:t.text}}>{s.label||fmtScheduledAt(s.scheduledAt)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Form */}
          {!canEdit&&(
            <div style={{padding:"7px 10px",borderRadius:8,background:t.accentLight,color:t.accentText,fontSize:11,marginBottom:10}}>القراءة فقط — الدورة في مرحلة متقدمة</div>
          )}
          {savedSessions.length>0&&canEdit&&(
            <div style={{fontSize:11,fontWeight:700,color:t.textSec,marginBottom:8}}>تعديل المواعيد</div>
          )}

          {sessions.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{fontSize:11,fontWeight:700,color:t.textSec,minWidth:52,textAlign:"right",flexShrink:0}}>الجلسة {i+1}</span>
              <input type="date" value={s.date} disabled={!canEdit}
                onChange={e=>{const n=[...sessions];n[i]={...n[i],date:e.target.value};setSessions(n);}}
                style={{...inp,flex:1,padding:"6px 8px",fontSize:12,opacity:canEdit?1:0.5}}/>
              <input type="time" value={s.time} disabled={!canEdit}
                onChange={e=>{const n=[...sessions];n[i]={...n[i],time:e.target.value};setSessions(n);}}
                style={{...inp,flex:"0 0 110px",padding:"6px 8px",fontSize:12,opacity:canEdit?1:0.5}}/>
            </div>
          ))}

          {/* Bottom row */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:10,gap:8}}>
            <button onClick={saveSessions} disabled={!canEdit||sessionsBusy}
              style={{padding:"8px 20px",borderRadius:9,border:"none",background:!canEdit||sessionsBusy?t.border:t.accent,color:"#fff",cursor:!canEdit||sessionsBusy?"not-allowed":"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600,opacity:!canEdit||sessionsBusy?0.5:1}}>
              {sessionsBusy?"جاري الحفظ...":"حفظ الجلسات"}
            </button>
            {canEdit&&(
              <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",userSelect:"none",fontSize:12,color:t.textSec}}>
                <input type="checkbox" checked={notify} onChange={e=>setNotify(e.target.checked)} style={{cursor:"pointer"}}/>
                إشعار الطلاب
              </label>
            )}
          </div>
        </Card>

        {/* Card ② Exam schedule */}
        <Card t={t}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <span style={{width:26,height:26,borderRadius:"50%",background:t.accent,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",fontWeight:700,flexShrink:0}}>2</span>
            <span style={{fontSize:13,fontWeight:700,color:t.text}}>موعد الامتحان</span>
            {c.examScheduledAt
              ?<span style={{display:"inline-flex",background:"#DCFCE7",color:"#166534",borderRadius:20,padding:"1px 8px",fontSize:10,fontWeight:700,marginRight:"auto"}}>✓ محدّد</span>
              :<span style={{display:"inline-flex",background:"#FFFBEB",color:"#92400E",border:"1px solid #FDE68A",borderRadius:20,padding:"1px 8px",fontSize:10,fontWeight:600,marginRight:"auto"}}>بعد الجلسات</span>
            }
          </div>

          {/* Current exam date when already set */}
          {c.examScheduledAt&&(
            <div style={{fontSize:12,color:t.textSec,padding:"8px 12px",borderRadius:8,background:t.bgElevated,border:`1px solid ${t.border}`,marginBottom:10,marginTop:8}}>
              <span style={{fontWeight:700,color:t.text}}>الموعد الحالي: </span>{fmtScheduledAt(c.examScheduledAt)}
            </div>
          )}

          {/* Blocking messages — only before exam is scheduled */}
          {!examAlreadySet&&!allSaved&&(
            <div style={{fontSize:11,color:"#92400E",padding:"7px 10px",borderRadius:8,background:"#FFFBEB",border:"1px solid #FDE68A",marginBottom:10,marginTop:8}}>
              أدخل الجلسات الثلاث واحفظها أولاً
            </div>
          )}
          {!examAlreadySet&&allSaved&&!sess3Passed&&(
            <div style={{fontSize:11,color:"#92400E",padding:"7px 10px",borderRadius:8,background:"#FFFBEB",border:"1px solid #FDE68A",marginBottom:10,marginTop:8}}>
              تُفتح بعد انتهاء الجلسة الثالثة — {sess3DateTime?sess3DateTime.toLocaleString("ar-SY",{weekday:"long",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}):"—"}
            </div>
          )}
          {anyResultRecorded&&(
            <div style={{fontSize:11,color:"#991B1B",padding:"7px 10px",borderRadius:8,background:"#FEE2E2",border:"1px solid #FECACA",marginBottom:10,marginTop:8}}>
              مقفلة — نتائج سُجِّلت بالفعل
            </div>
          )}

          <div style={{marginBottom:12,marginTop:8}}>
            <div style={{fontSize:11,fontWeight:600,color:t.textSec,marginBottom:4}}>تاريخ الامتحان</div>
            <input type="date" value={examDate} disabled={!canSetExam} onChange={e=>setExamDate(e.target.value)} style={{...inp,opacity:canSetExam?1:0.5}}/>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:600,color:t.textSec,marginBottom:4}}>وقت الامتحان</div>
            <input type="time" value={examTime} disabled={!canSetExam} onChange={e=>setExamTime(e.target.value)} style={{...inp,opacity:canSetExam?1:0.5}}/>
          </div>

          {canSetExam&&(
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none",fontSize:12,color:t.textSec,marginBottom:14}}>
              <input type="checkbox" checked={examNotify} onChange={e=>setExamNotify(e.target.checked)} style={{cursor:"pointer"}}/>
              إرسال الإشعارات
            </label>
          )}

          <button onClick={saveExam} disabled={!canSetExam||examBusy||!examDate||!examTime} style={btnPrimary(!canSetExam||examBusy||!examDate||!examTime)}>
            {examBusy?"جاري الحفظ...":examAlreadySet?"تعديل الموعد":"ضبط الموعد"}
          </button>
        </Card>
      </div>

      {/* ── Students table ── */}
      <Card t={t}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <span style={{fontSize:13,fontWeight:700,color:t.text}}>طلاب الدورة</span>
          <span style={{display:"inline-flex",background:t.accentLight,color:t.accentText,borderRadius:20,padding:"1px 9px",fontSize:11,fontWeight:700}}>{students.length}</span>
        </div>
        <div style={{border:`1px solid ${t.border}`,borderRadius:9,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:StudentsColsTemplate,background:t.bgElevated,borderBottom:`1px solid ${t.border}`}}>
            {["الطلب","الهاتف","الفئة","حالة الطلب","الرقم الحكومي","الإجراءات"].map(h=>(
              <div key={h} style={{fontSize:11,fontWeight:700,color:t.textMuted,padding:"8px 10px"}}>{h}</div>
            ))}
          </div>
          {!students.length?(
            <div style={{textAlign:"center",padding:28,color:t.textMuted,fontSize:13}}>لا يوجد طلاب</div>
          ):students.map((s,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:StudentsColsTemplate,alignItems:"center",borderBottom:i<students.length-1?`1px solid ${t.border}`:"none",background:t.bgSurface}}>
              <div style={{padding:"10px"}}>
                <div style={{fontSize:13,fontWeight:600,color:t.text}}>{s.studentName||"—"}</div>
              </div>
              <div style={{padding:"10px",fontSize:12,color:t.textSec}}>{s.studentPhone||"—"}</div>
              <div style={{padding:"10px",fontSize:13,fontWeight:600,color:t.text}}>{s.category||"—"}</div>
              <div style={{padding:"10px"}}><CertBadge s={s.requestStatus} t={t}/></div>
              <div style={{padding:"10px",fontSize:12,color:t.textSec,fontFamily:"monospace"}}>{s.governmentStudentNumber||"—"}</div>
              <div style={{padding:"6px 10px"}}>
                <button onClick={()=>onOpenCert&&onOpenCert(s.certificateId??s.id)} style={{padding:"4px 10px",borderRadius:7,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>ملفه</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CertCoursesTab({t,pendingCourseId,onPendingConsumed,onOpenCert}){
  const [courses,setCourses]=useState([]);
  const [meta,setMeta]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [selCourse,setSelCourse]=useState(null);
  const {show:toast,el:toastEl}=useCertToast();

  const loadCourses=async()=>{
    setLoading(true);setError(null);
    try{
      const r=await certificatesService.getCourses({limit:50});
      const payload=r.data?.data;
      const arr=Array.isArray(payload?.data)?payload.data:Array.isArray(payload)?payload:[];
      setCourses(arr);
      setMeta(payload?.meta??null);
    }catch(e){
      setError(e.response?.data?.message||"تعذّر تحميل الدورات");
      setCourses([]);
    }finally{setLoading(false);}
  };
  useEffect(()=>{(async()=>{await loadCourses();})();},[]);

  const openCourse=async(id)=>{
    try{
      const r=await certificatesService.getCourseById(id);
      setSelCourse(r.data?.data??r.data);
    }catch(e){toast(e.response?.data?.message||"حدث خطأ","err");}
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(()=>{if(pendingCourseId){openCourse(pendingCourseId);onPendingConsumed&&onPendingConsumed();}},[]);

  const refreshCourse=async()=>{
    if(!selCourse)return;
    const id=(selCourse.course??selCourse).id;
    if(!id)return;
    const r=await certificatesService.getCourseById(id);
    setSelCourse(r.data?.data??r.data);
  };

  if(selCourse){
    return(
      <CourseDetailView
        t={t}
        course={selCourse}
        onBack={()=>{setSelCourse(null);loadCourses();}}
        onToast={toast}
        toastEl={toastEl}
        onRefresh={refreshCourse}
        onOpenCert={onOpenCert}
      />
    );
  }

  const total=meta?.total??courses.length;
  const cols="100px 160px 80px 160px 110px 120px";

  return(
    <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:12}}>
      {toastEl}

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:14,fontWeight:700,color:t.text}}>الدورات</span>
            <span style={{display:"inline-flex",alignItems:"center",background:t.accentLight,color:t.accentText,borderRadius:20,padding:"1px 10px",fontSize:12,fontWeight:700}}>
              {loading?"...":total}
            </span>
          </div>
          <div style={{fontSize:11,color:t.textMuted,marginTop:3}}>كل دورة دفعة طلاب أُرسلت للحكومة معاً وتمتحن معاً.</div>
        </div>
        <button onClick={loadCourses} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.textSec,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>↻ تحديث</button>
      </div>

      {/* Table */}
      <div style={{border:`1px solid ${t.border}`,borderRadius:10,overflow:"hidden"}}>
        {/* Header row */}
        <div style={{display:"grid",gridTemplateColumns:cols,background:t.bgElevated,borderBottom:`1px solid ${t.border}`}}>
          {["الدورة","المرحلة","الطلاب","موعد الامتحان","تسجيل الإعادة",""].map((h,i)=>(
            <div key={i} style={{fontSize:11,fontWeight:700,color:t.textMuted,padding:"9px 12px"}}>{h}</div>
          ))}
        </div>
        {/* Body */}
        {loading?(
          <div style={{textAlign:"center",padding:36,color:t.textMuted,fontSize:13}}>جاري التحميل...</div>
        ):error?(
          <div style={{textAlign:"center",padding:36,color:"#e53e3e",fontSize:13}}>{error}</div>
        ):!courses.length?(
          <div style={{textAlign:"center",padding:36,color:t.textMuted,fontSize:13}}>لا توجد دورات</div>
        ):courses.map((c,i)=>(
          /* Entire row is clickable per spec: "الضغط على صفّ → شاشة تفاصيل الدورة" */
          <div key={c.id} onClick={()=>openCourse(c.id)}
            style={{display:"grid",gridTemplateColumns:cols,alignItems:"center",borderBottom:i<courses.length-1?`1px solid ${t.border}`:"none",background:t.bgSurface,cursor:"pointer",transition:"background 0.12s"}}
            onMouseEnter={e=>e.currentTarget.style.background=t.bgElevated}
            onMouseLeave={e=>e.currentTarget.style.background=t.bgSurface}>
            <div style={{padding:"11px 12px",fontSize:14,fontWeight:700,color:t.text,fontFamily:"monospace"}}>
              {c.courseNumber??`#${c.id}`}
            </div>
            <div style={{padding:"11px 12px"}}>
              <CourseBadge s={c.status} t={t}/>
            </div>
            <div style={{padding:"11px 12px",fontSize:13,color:t.text}}>
              {c.studentsCount??0}
            </div>
            <div style={{padding:"11px 12px",fontSize:12,color:t.textSec}}>
              {c.examScheduledLabel||"—"}
            </div>
            <div style={{padding:"11px 12px"}}>
              {c.reexamRegistrationOpen
                ?<span style={{display:"inline-flex",alignItems:"center",gap:3,background:"#DCFCE7",color:"#166534",padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:600}}>● مفتوح</span>
                :<span style={{display:"inline-flex",alignItems:"center",gap:3,background:t.bgElevated,color:t.textMuted,padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:600}}>○ مغلق</span>
              }
            </div>
            <div style={{padding:"6px 12px"}} onClick={e=>e.stopPropagation()}>
              <button onClick={()=>openCourse(c.id)} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,cursor:"pointer",fontSize:11,fontFamily:"inherit",whiteSpace:"nowrap"}}>إدارة الدورة</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Doc image preview box (module-level to avoid "component during render") */
function CertDocBox({url,label,t}){
  return(
    <div style={{flex:"1 1 120px",minWidth:80}}>
      <div style={{fontSize:11,fontWeight:600,color:t.textSec,marginBottom:4,textAlign:"center"}}>{label}</div>
      {url?(
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img src={url} alt={label} style={{width:"100%",height:90,objectFit:"cover",borderRadius:8,border:`1px solid ${t.border}`,display:"block"}}/>
        </a>
      ):(
        <div style={{width:"100%",height:90,borderRadius:8,border:`1px dashed ${t.border}`,background:t.bgSurface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:t.textMuted}}>لا توجد</div>
      )}
    </div>
  );
}

const CHARGE_LABEL={CERTIFICATE_FEE:"رسم الشهادة",REEXAM_FEE:"رسم إعادة الامتحان",TRANSPORT_FEE:"رسم النقل"};
const CHARGE_STATUS_MAP={PAID:{bg:"#dcfce7",color:"#166534",label:"مدفوع"},UNPAID:{bg:"#fef2f2",color:"#b91c1c",label:"غير مدفوع"},WAIVED:{bg:"#f3f4f6",color:"#6b7280",label:"مُعفى"}};
const _API_ORIGIN=(import.meta.env.VITE_API_URL||"http://20.250.144.221:3000/api/v1").replace(/\/api\/v1\/?$/,"");
const resolveDocUrl=(p)=>p?(p.startsWith("http")?p:`${_API_ORIGIN}${p}`):null;
function CertSection({title,t,children}){
  return(
    <div>
      <div style={{fontSize:11,fontWeight:700,color:t.textMuted,marginBottom:8,letterSpacing:"0.4px"}}>{title}</div>
      {children}
    </div>
  );
}

/* ── Tab 3: Search ───────────────────────────────────────────────────── */
function CertSearchTab({t,pendingCertId,onPendingConsumed}){
  const {hasPermission}=useAuth();
  const canManageCert=hasPermission(P.CERTIFICATES_UPDATE);
  const [q,setQ]=useState("");
  const [statusFilter,setStatusFilter]=useState("");
  const [results,setResults]=useState([]);
  const [searched,setSearched]=useState(false);
  const [searchLoading,setSearchLoading]=useState(false);
  const [profile,setProfile]=useState(null);
  const [profileLoading,setProfileLoading]=useState(false);
  const [editForm,setEditForm]=useState({category:"B",transmissionType:"MANUAL",transportRequested:false});
  const [resultForm,setResultForm]=useState({examType:"",attemptNumber:null,result:"PASS"});
  const [editBusy,setEditBusy]=useState(false);
  const [docsBusy,setDocsBusy]=useState(false);
  const [resultBusy,setResultBusy]=useState(false);
  const [reexamBusy,setReexamBusy]=useState(false);
  const docPersonalRef=useRef(null);
  const docIdFrontRef=useRef(null);
  const docIdBackRef=useRef(null);
  const detailRef=useRef(null);
  const {show:toast,el:toastEl}=useCertToast();

  const cert=profile?.certificate||profile||{};
  const docs=profile?.documents||{};
  const charges=Array.isArray(profile?.charges)?profile.charges:[];
  const exams=Array.isArray(profile?.exams)?profile.exams:[];
  const certStatus=cert.requestStatus||cert.status||"";
  const isLocked=!!cert.submittedToGovAt;
  const reexamEligible=profile?.actions?.reexam?.eligible;
  const reexamMsg=profile?.actions?.reexam?.message||profile?.actions?.reexam?.reason||"";
  const pendingExams=exams.filter(e=>e.examResult===null);
  const EXAM_TYPE_ORDER={THEORY:0,PRACTICAL:1};
  const sortedExams=[...exams].sort((a,b)=>{
    const to=(EXAM_TYPE_ORDER[a.examType||a.type]??2)-(EXAM_TYPE_ORDER[b.examType||b.type]??2);
    return to!==0?to:(a.attemptNumber||0)-(b.attemptNumber||0);
  });
  const activeId=cert?.id;

  const inp={width:"100%",padding:"8px 10px",borderRadius:9,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};

  const doSearch=async()=>{
    setSearchLoading(true);setSearched(true);setProfile(null);
    try{
      const params={limit:50};
      if(q.trim())params.search=q.trim();
      if(statusFilter)params.status=statusFilter;
      const r=await certificatesService.getAll(params);
      const arr=r.data?.data?.data;
      setResults(Array.isArray(arr)?arr:[]);
    }catch{setResults([]);}
    finally{setSearchLoading(false);}
  };

  const openProfile=async(id)=>{
    setProfileLoading(true);
    try{
      const r=await certificatesService.getById(id);
      const p=r.data?.data??r.data;
      const c=p?.certificate||p||{};
      const pending=(Array.isArray(p?.exams)?p.exams:[]).filter(e=>e.examResult===null);
      const first=pending[0];
      setProfile(p);
      setEditForm({category:c.category||"B",transmissionType:c.transmissionType||"MANUAL",transportRequested:c.transportRequested||false});
      setResultForm(first?{examType:first.examType,attemptNumber:first.attemptNumber,result:"PASS"}:{examType:"",attemptNumber:null,result:"PASS"});
      setTimeout(()=>detailRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),120);
    }catch(e){toast(e.response?.data?.message||"حدث خطأ","err");}
    finally{setProfileLoading(false);}
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(()=>{if(pendingCertId){openProfile(pendingCertId);onPendingConsumed&&onPendingConsumed();}},[]);

  const refreshProfile=async()=>{const id=cert?.id;if(id)await openProfile(id);};

  const saveEdit=async()=>{
    setEditBusy(true);
    try{
      await certificatesService.update(cert.id,{category:editForm.category,transmissionType:editForm.transmissionType,transportRequested:editForm.transportRequested});
      toast("تم تحديث البيانات");
      await refreshProfile();
    }catch(e){
      const st=e.response?.status;
      const msg=e.response?.data?.message||"حدث خطأ";
      toast(st===409?"هذا الطالب يمتلك هذه الفئة بالفعل — "+msg:msg,"err");
    }
    finally{setEditBusy(false);}
  };

  const uploadDocs=async()=>{
    const personal=docPersonalRef.current?.files?.[0];
    const idFront=docIdFrontRef.current?.files?.[0];
    const idBack=docIdBackRef.current?.files?.[0];
    if(!personal&&!idFront&&!idBack){toast("اختر ملفاً على الأقل","warn");return;}
    const fd=new FormData();
    if(personal)fd.append("personalPhoto",personal);
    if(idFront)fd.append("idFront",idFront);
    if(idBack)fd.append("idBack",idBack);
    setDocsBusy(true);
    try{
      await certificatesService.uploadDocuments(cert.id,fd);
      toast("تم استبدال الوثائق");
      await refreshProfile();
    }catch(e){toast(e.response?.data?.message||"حدث خطأ","err");}
    finally{setDocsBusy(false);}
  };

  const requestReexam=async()=>{
    setReexamBusy(true);
    try{
      const r=await certificatesService.requestReexam(cert.id);
      const collected=r.data?.data?.collectedAmount;
      toast(collected!=null
        ?`تم التسجيل · المبلغ المحصّل: ${Number(collected).toLocaleString("en")} ل.س`
        :"تم تسجيل طلب الإعادة النقدية"
      );
      await refreshProfile();
    }catch(e){toast(e.response?.data?.message||"حدث خطأ","err");}
    finally{setReexamBusy(false);}
  };

  const saveResult=async()=>{
    if(!resultForm.examType||resultForm.attemptNumber==null){toast("اختر الامتحان أولاً","warn");return;}
    setResultBusy(true);
    try{
      await certificatesService.recordExamResult(cert.id,{
        examType:resultForm.examType,
        attemptNumber:resultForm.attemptNumber,
        result:resultForm.result,
      });
      toast("تم حفظ النتيجة");
      await refreshProfile();
    }catch(e){
      const st=e.response?.status;
      const msg=e.response?.data?.message||"حدث خطأ";
      toast(st===400?"لا يمكن التسجيل الآن — "+msg:msg,"err");
    }
    finally{setResultBusy(false);}
  };

  const chargeBadge=(status)=>{
    const s=CHARGE_STATUS_MAP[status]||{bg:t.bgSurface,color:t.textMuted,label:status||"—"};
    return <span style={{fontSize:11,fontWeight:700,padding:"2px 9px",borderRadius:20,background:s.bg,color:s.color,whiteSpace:"nowrap"}}>{s.label}</span>;
  };

  return(
    <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:12}}>
      {toastEl}

      {/* Filter bar */}
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <div style={{flex:1}}>
          <SearchBar
            placeholder="اسم الطالب أو رقم هاتفه"
            t={t} value={q} onChange={setQ}
            onKeyDown={e=>e.key==="Enter"&&doSearch()}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e=>setStatusFilter(e.target.value)}
          style={{padding:"8px 10px",borderRadius:9,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",outline:"none",cursor:"pointer",minWidth:170}}
        >
          <option value="">كل الحالات</option>
          <option value="WAITING_FOR_TRAINING_SCHEDULE">بانتظار جدولة التدريب</option>
          <option value="IN_GOVERNMENT_TRAINING">في التدريب الحكومي</option>
          <option value="WAITING_FOR_PRACTICAL_EXAM">بانتظار الامتحان العملي</option>
          <option value="WAITING_FOR_THEORETICAL_EXAM">بانتظار الامتحان النظري</option>
          <option value="SUBMITTED_TO_GOV">أُرسلت للحكومة</option>
          <option value="EXAM_SCHEDULED">مجدول الامتحان</option>
          <option value="COMPLETED">حصل على الرخصة</option>
          <option value="FAILED">راسب نهائياً</option>
          <option value="CANCELLED">ملغى</option>
        </select>
        <Btn label="بحث" onClick={doSearch} t={t}/>
      </div>

      {/* Results table */}
      {searchLoading?(
        <div style={{textAlign:"center",padding:32,color:t.textMuted,fontSize:13}}>جاري البحث...</div>
      ):searched&&!results.length?(
        <div style={{textAlign:"center",padding:32,color:t.textMuted,fontSize:13}}>لا توجد نتائج</div>
      ):results.length>0&&(
        <div style={{border:`1px solid ${t.border}`,borderRadius:10,overflow:"hidden"}}>
          {/* Table header — RTL: الطالب | الفئة | الحالة | الدورة | رقم الطلب | الإجراءات */}
          <div style={{display:"grid",gridTemplateColumns:"2fr 0.8fr 2fr 1fr 1fr 1.3fr",background:t.bgSurface,padding:"8px 14px",gap:8,fontSize:11,fontWeight:700,color:t.textMuted,borderBottom:`1px solid ${t.border}`}}>
            <span>الطالب</span>
            <span style={{textAlign:"center"}}>الفئة</span>
            <span>الحالة</span>
            <span style={{textAlign:"center"}}>الدورة</span>
            <span style={{textAlign:"center"}}>رقم الطلب</span>
            <span/>
          </div>
          {results.map((c,i)=>(
            <div key={c.id} style={{display:"grid",gridTemplateColumns:"2fr 0.8fr 2fr 1fr 1fr 1.3fr",alignItems:"center",gap:8,padding:"10px 14px",borderBottom:i<results.length-1?`1px solid ${t.border}`:"none",background:activeId===c.id?t.bgElevated:t.bg}}>
              <div style={{minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.studentName||"—"}</div>
              </div>
              <span style={{fontSize:12,color:t.textSec,fontWeight:600,textAlign:"center"}}>{c.category||"—"}</span>
              <div><CertBadge s={c.requestStatus||c.status} t={t}/></div>
              <span style={{fontSize:12,color:t.textSec,textAlign:"center"}}>{c.courseNumber??"—"}</span>
              <span style={{fontSize:12,color:t.textMuted,fontFamily:"monospace",textAlign:"center"}}>{c.id}</span>
              <div style={{display:"flex",justifyContent:"flex-end"}}><Btn label="فتح الملف" onClick={()=>openProfile(c.id)} t={t} v="secondary" sz="sm"/></div>
            </div>
          ))}
        </div>
      )}

      {profileLoading&&(
        <div style={{textAlign:"center",padding:32,color:t.textMuted,fontSize:13}}>جاري تحميل الملف...</div>
      )}

      {/* ── Student detail card ─────────────────────────────────────────── */}
      {!profileLoading&&profile&&(
        <div ref={detailRef} style={{border:`2px solid ${t.borderCard||t.border}`,borderRadius:14,overflow:"hidden",background:t.bg}}>

          {/* Header — student info right (RTL start), إغلاق left (RTL end) */}
          <div style={{background:t.bgSurface,borderBottom:`1px solid ${t.border}`,padding:"14px 18px",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start",gap:12,direction:"rtl"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:5}}>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <div style={{fontSize:16,fontWeight:800,color:t.text}}>{cert.studentName||profile?.student?.name||"—"}</div>
                <CertBadge s={certStatus} t={t}/>
                <span style={{fontSize:11,background:t.bgElevated,border:`1px solid ${t.border}`,color:t.textSec,padding:"2px 10px",borderRadius:20,fontWeight:600}}>طلب رقم {cert.id||"—"}</span>
                {cert.transportRequested&&(
                  <span style={{fontSize:11,background:"#e0f2fe",color:"#0369a1",padding:"2px 9px",borderRadius:20,fontWeight:600}}>نقل مدرسي: يريد النقل</span>
                )}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",fontSize:12,color:t.textMuted}}>
                <span>فئة {cert.category||"—"} — {CERT_TRANS[cert.transmissionType]||"—"}</span>
                {cert.courseId&&<span style={{color:t.textSec}}>• دورة #{cert.courseId}</span>}
              </div>
            </div>
            <button onClick={()=>setProfile(null)} style={{background:"none",border:`1px solid ${t.border}`,borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600,color:t.textSec,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,marginTop:2}}>إغلاق ✕</button>
          </div>

          {/* 2-column body (RTL: col-1 → right, col-2 → left) */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",alignItems:"start"}}>

            {/* ── Right column ─────────────────────────────────────────── */}
            <div style={{padding:16,borderLeft:`1px solid ${t.border}`,display:"flex",flexDirection:"column",gap:18}}>

              {/* 1 — Documents preview */}
              <CertSection title="وثائق الطالب المرفوعة" t={t}>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <CertDocBox url={resolveDocUrl(docs.personalPhotoUrl)} label="الصورة الشخصية" t={t}/>
                  <CertDocBox url={resolveDocUrl(docs.idFrontUrl)} label="وجه الهوية الأمامي" t={t}/>
                  <CertDocBox url={resolveDocUrl(docs.idBackUrl)} label="وجه الهوية الخلفي" t={t}/>
                </div>
              </CertSection>

              {/* 2 — Request data correction (locked once submittedToGovAt is set) */}
              <CertSection title="تصحيح بيانات الطلب" t={t}>
                {isLocked?(
                  <div style={{display:"flex",alignItems:"center",gap:8,background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:9,padding:"10px 12px",fontSize:12,color:"#92400e",fontWeight:600}}>
                    <span>🔒</span><span>مقفل — أُرسل الطلب للحكومة.</span>
                  </div>
                ):(
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      <div>
                        <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>الفئة</label>
                        <select value={editForm.category} onChange={e=>setEditForm({...editForm,category:e.target.value})} style={inp}>
                          {["A","A1","B","B1","C","D"].map(v=><option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>ناقل الحركة</label>
                        <select value={editForm.transmissionType} onChange={e=>setEditForm({...editForm,transmissionType:e.target.value})} style={inp}>
                          <option value="MANUAL">يدوي</option>
                          <option value="AUTOMATIC">أوتوماتيك</option>
                        </select>
                      </div>
                    </div>
                    <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer",color:t.text}}>
                      <input type="checkbox" checked={!!editForm.transportRequested} onChange={e=>setEditForm({...editForm,transportRequested:e.target.checked})} style={{accentColor:"#778a3b",width:15,height:15}}/>
                      النقل المدرسي مطلوب
                    </label>
                    {canManageCert&&<Btn label={editBusy?"جاري الحفظ...":"حفظ التعديل"} onClick={saveEdit} t={t} disabled={editBusy}/>}
                  </div>
                )}
              </CertSection>

              {/* 3 — Replace documents (same lock rule) */}
              <CertSection title="استبدال وثائق الطالب" t={t}>
                {isLocked?(
                  <div style={{display:"flex",alignItems:"center",gap:8,background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:9,padding:"10px 12px",fontSize:12,color:"#92400e",fontWeight:600}}>
                    <span>🔒</span><span>مقفل — أُرسل الطلب للحكومة.</span>
                  </div>
                ):(
                  <div style={{display:"flex",flexDirection:"column",gap:9}}>
                    <div>
                      <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:3}}>الصورة الشخصية</label>
                      <input ref={docPersonalRef} type="file" accept="image/*" style={{...inp,padding:"5px 8px",cursor:"pointer"}}/>
                    </div>
                    <div>
                      <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:3}}>وجه الهوية الأمامي</label>
                      <input ref={docIdFrontRef} type="file" accept="image/*" style={{...inp,padding:"5px 8px",cursor:"pointer"}}/>
                    </div>
                    <div>
                      <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:3}}>وجه الهوية الخلفي</label>
                      <input ref={docIdBackRef} type="file" accept="image/*" style={{...inp,padding:"5px 8px",cursor:"pointer"}}/>
                    </div>
                    {canManageCert&&<Btn label={docsBusy?"جاري الرفع...":"استبدال الصور المختارة"} onClick={uploadDocs} t={t} disabled={docsBusy}/>}
                  </div>
                )}
              </CertSection>

              {/* 4 — Cash re-exam — strictly gated on actions.reexam.eligible */}
              <CertSection title="تسجيل إعادة نقدية عند الشباك" t={t}>
                <div style={{fontSize:12,color:t.textMuted,marginBottom:10,lineHeight:1.65}}>
                  إذا دفع الطالب رسوم إعادة الامتحان نقداً عند الشباك، استخدم هذا الزر لتسجيل الطلب وتحديث السجلات.
                </div>
                {!reexamEligible&&reexamMsg&&(
                  <div style={{fontSize:12,color:"#b91c1c",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"8px 10px",marginBottom:8}}>
                    {reexamMsg}
                  </div>
                )}
                {canManageCert&&(
                  <Btn
                    label={reexamBusy?"جاري التسجيل...":"تسجيل إعادة نقدية"}
                    onClick={requestReexam}
                    t={t}
                    disabled={reexamBusy||reexamEligible===false}
                    v="secondary"
                  />
                )}
              </CertSection>

            </div>

            {/* ── Left column ──────────────────────────────────────────── */}
            <div style={{padding:16,display:"flex",flexDirection:"column",gap:18}}>

              {/* 5 — Individual result registration — only shown when pending exams exist */}
              {pendingExams.length>0&&(
                <CertSection title="تسجيل نتيجة فردية" t={t}>
                  <div style={{display:"flex",flexDirection:"column",gap:9}}>
                    <div>
                      <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>الامتحان</label>
                      <select
                        value={`${resultForm.examType}::${resultForm.attemptNumber}`}
                        onChange={e=>{
                          const [et,an]=e.target.value.split("::");
                          setResultForm(f=>({...f,examType:et,attemptNumber:Number(an)}));
                        }}
                        style={inp}
                      >
                        {pendingExams.map((ex,i)=>(
                          <option key={i} value={`${ex.examType}::${ex.attemptNumber}`}>
                            {EXAM_TYPE_LABEL[ex.examType]||ex.examType} — محاولة {ex.attemptNumber}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>النتيجة</label>
                      <select value={resultForm.result} onChange={e=>setResultForm(f=>({...f,result:e.target.value}))} style={inp}>
                        <option value="PASS">ناجح ✓</option>
                        <option value="FAIL">راسب ✗</option>
                      </select>
                    </div>
                    {canManageCert&&<Btn label={resultBusy?"جاري الحفظ...":"حفظ النتيجة"} onClick={saveResult} t={t} disabled={resultBusy}/>}
                  </div>
                </CertSection>
              )}

              {/* 6 — Attempts history — sorted THEORY→PRACTICAL then by attemptNumber */}
              <CertSection title="سجّل المحاولات" t={t}>
                {sortedExams.length===0?(
                  <div style={{border:`1px dashed ${t.border}`,borderRadius:9,padding:"18px 12px",textAlign:"center",fontSize:12,color:t.textMuted}}>لا محاولات مسجّلة</div>
                ):(
                  <div style={{border:`1px solid ${t.border}`,borderRadius:9,overflow:"hidden"}}>
                    {sortedExams.map((ex,i)=>{
                      const pending=ex.examResult===null;
                      return(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",borderBottom:i<sortedExams.length-1?`1px solid ${t.border}`:"none",fontSize:12}}>
                          <span style={{color:t.textSec}}>{EXAM_TYPE_LABEL[ex.examType||ex.type]||"—"} — محاولة {ex.attemptNumber}</span>
                          <span style={{fontWeight:700,color:pending?t.textMuted:ex.examResult==="PASS"||ex.result==="PASS"?t.completed?.text||"#166534":t.failed?.text||"#b91c1c"}}>
                            {pending?"بانتظار النتيجة":EXAM_RESULT_LABEL[ex.examResult||ex.result]||"—"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CertSection>

              {/* 7 — Dues & charges — shows amountDue + nested payments[] */}
              <CertSection title="المستحقات المالية" t={t}>
                {charges.length===0?(
                  <div style={{fontSize:12,color:t.textMuted,padding:"8px 0"}}>لا مستحقات مسجّلة</div>
                ):(
                  <div style={{border:`1px solid ${t.border}`,borderRadius:9,overflow:"hidden"}}>
                    {charges.map((ch,ci)=>{
                      const pmts=Array.isArray(ch.payments)?ch.payments:[];
                      return(
                        <div key={ci} style={{borderBottom:ci<charges.length-1?`1px solid ${t.border}`:"none"}}>
                          <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",alignItems:"center",gap:10,padding:"9px 12px",background:t.bgSurface}}>
                            <span style={{fontSize:13,fontWeight:600,color:t.text}}>{CHARGE_LABEL[ch.chargeType]||ch.chargeType||"رسم الشهادة"}</span>
                            <span style={{fontSize:12,color:t.textSec,fontWeight:600,whiteSpace:"nowrap"}}>{ch.amountDue!=null?Number(ch.amountDue).toLocaleString("en")+" ل.س":"—"}</span>
                            {chargeBadge(ch.chargeStatus)}
                          </div>
                          {pmts.map((pm,pi)=>(
                            <div key={pi} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 12px 6px 20px",fontSize:11,color:t.textMuted,borderTop:`1px dashed ${t.border}`}}>
                              <span>دفعة {pi+1}</span>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <span style={{fontWeight:600,color:t.textSec}}>{pm.amountPaid!=null?Number(pm.amountPaid).toLocaleString("en")+" ل.س":"—"}</span>
                                {chargeBadge(pm.status||pm.paymentStatus)}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CertSection>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Tab 4: Revenue ──────────────────────────────────────────────────── */
// ─── REVENUE SUB-TAB 1: Period Summary ───────────────────────────────────────
function RevSummaryTab({t}){
  const todayISO=()=>new Date().toISOString().slice(0,10);
  const defaultFrom=()=>{const d=new Date();d.setDate(d.getDate()-30);return d.toISOString().slice(0,10);};
  const fmt=v=>v!=null?Number(v).toLocaleString("en"):"—";
  const fmtSy=v=>v!=null?`${Number(v).toLocaleString("en")} ل.س`:"—";
  const fmtDay=s=>{if(!s)return"—";return new Date(s+"T00:00:00").toLocaleDateString("ar-SY",{weekday:"short",month:"2-digit",day:"2-digit"});};

  const [fromD,setFromD]=useState(defaultFrom);
  const [toD,setToD]=useState(todayISO);
  const [applied,setApplied]=useState({from:defaultFrom(),to:todayISO()});
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [busy,setBusy]=useState(false);

  const load=async(from,to)=>{
    setLoading(true);setError(null);
    try{const r=await certificatesService.getRevenueSummary(from,to);setData(r.data?.data??r.data);}
    catch(e){setError(e.response?.data?.message||"تعذّر تحميل البيانات");}
    finally{setLoading(false);}
  };
  useEffect(()=>{load(applied.from,applied.to);},[applied.from,applied.to]); // eslint-disable-line

  const apply=()=>{if(busy)return;setBusy(true);setApplied({from:fromD,to:toD});setTimeout(()=>setBusy(false),600);};

  const col=data?.collected??{};
  const service=data?.service??{};
  const reexam=data?.reexam??{};
  const byDay=Array.isArray(data?.byDay)?data.byDay:[];
  const totalC=Number(col.total||0),schShare=Number(col.schoolShare||0),govShare=Number(col.governmentShare||0);
  const mathOk=Math.abs((schShare+govShare)-totalC)<1;

  const inp={padding:"7px 10px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:12,fontFamily:"inherit",outline:"none"};
  const thSt={fontSize:11,fontWeight:700,color:t.textMuted,padding:"9px 12px",textAlign:"right",borderBottom:`1px solid ${t.border}`,background:t.bgElevated};
  const tdSt=(bold,clr)=>({fontSize:13,fontWeight:bold?700:400,color:clr||t.text,padding:"9px 12px",textAlign:"right",whiteSpace:"nowrap"});

  return(
    <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:16}}>
      {/* Filter */}
      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <span style={{fontSize:13,fontWeight:700,color:t.text,flexShrink:0}}>ملخص الفترة</span>
        <div style={{display:"flex",alignItems:"center",gap:7,marginRight:"auto",flexWrap:"wrap"}}>
          <span style={{fontSize:12,color:t.textMuted}}>من</span>
          <input type="date" value={fromD} onChange={e=>setFromD(e.target.value)} style={inp}/>
          <span style={{fontSize:12,color:t.textMuted}}>إلى</span>
          <input type="date" value={toD} onChange={e=>setToD(e.target.value)} style={inp}/>
          <button onClick={apply} disabled={busy} style={{padding:"7px 18px",borderRadius:8,border:"none",background:busy?t.border:t.accent,color:"#fff",fontSize:12,fontFamily:"inherit",fontWeight:700,cursor:busy?"not-allowed":"pointer"}}>
            {busy?"...":"عرض"}
          </button>
        </div>
      </div>

      {loading?(
        <div style={{textAlign:"center",padding:48,color:t.textMuted,fontSize:13}}>جارٍ التحميل...</div>
      ):error?(
        <div style={{textAlign:"center",padding:40,color:"#c74848",fontSize:13}}>
          {error}<br/>
          <button onClick={()=>load(applied.from,applied.to)} style={{marginTop:10,padding:"5px 14px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>إعادة المحاولة</button>
        </div>
      ):(<>

        {/* 4 KPI cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          <div style={{background:t.bgSurface,borderRadius:14,border:`1px solid ${t.borderCard}`,padding:"16px 18px"}}>
            <div style={{fontSize:10,fontWeight:700,color:t.textMuted,marginBottom:6}}>إجمالي المحصَّل</div>
            <div style={{fontSize:24,fontWeight:800,color:t.text,lineHeight:1,marginBottom:4,fontVariantNumeric:"tabular-nums"}}>{fmt(col.total)}</div>
            <div style={{fontSize:11,color:t.textMuted}}>{fmt(col.count)} دفعة</div>
          </div>
          <div style={{background:"#f0fdf4",borderRadius:14,border:"1px solid #bbf7d0",padding:"16px 18px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#15803d",marginBottom:6}}>حصة المدرسة — الدخل الحقيقي</div>
            <div style={{fontSize:24,fontWeight:800,color:"#15803d",lineHeight:1,marginBottom:4,fontVariantNumeric:"tabular-nums"}}>{fmt(col.schoolShare)}</div>
            <div style={{fontSize:11,color:"#16a34a"}}>دخل المدرسة الفعلي</div>
          </div>
          <div style={{background:"#fffbeb",borderRadius:14,border:"1px solid #fde68a",padding:"16px 18px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#92400e",marginBottom:6}}>حصة الحكومة — أمانة</div>
            <div style={{fontSize:24,fontWeight:800,color:"#b45309",lineHeight:1,marginBottom:4,fontVariantNumeric:"tabular-nums"}}>{fmt(col.governmentShare)}</div>
            <div style={{fontSize:11,color:"#d97706"}}>تُسلَّم للحكومة لاحقاً</div>
          </div>
          <div style={{background:t.bgSurface,borderRadius:14,border:`1px solid ${t.borderCard}`,padding:"16px 18px"}}>
            <div style={{fontSize:10,fontWeight:700,color:t.textMuted,marginBottom:6}}>تفصيل طريقة الدفع</div>
            <div style={{fontSize:12,color:t.textMuted,marginBottom:4}}>نقداً: <strong style={{color:t.text,fontSize:14}}>{fmt(col.cash)}</strong></div>
            <div style={{fontSize:12,color:t.textMuted}}>شام كاش: <strong style={{color:t.text,fontSize:14}}>{fmt(col.shamCash)}</strong></div>
          </div>
        </div>

        {/* Math validation banner */}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,background:mathOk?"#f0fdf4":"#fef2f2",border:`1px solid ${mathOk?"#86efac":"#fca5a5"}`}}>
          <span style={{fontSize:16}}>{mathOk?"✓":"⚠"}</span>
          <span style={{fontSize:12,color:mathOk?"#15803d":"#b91c1c",fontWeight:600}}>
            تحقق: حصة المدرسة ({fmt(schShare)}) + حصة الحكومة ({fmt(govShare)}) {mathOk?"= ✓":"≠"} الإجمالي ({fmt(totalC)})
          </span>
        </div>

        {/* Breakdown by Fee Type */}
        <div>
          <div style={{fontSize:12,fontWeight:700,color:t.text,marginBottom:8}}>حسب نوع الرسم</div>
          <div style={{border:`1px solid ${t.border}`,borderRadius:10,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 70px 1fr 1fr 1fr"}}>
              {["البند","العدد","الإجمالي","حصة المدرسة","حصة الحكومة"].map(h=><div key={h} style={thSt}>{h}</div>)}
            </div>
            {[
              {label:"رسم الشهادة",count:service.count,total:service.total,school:service.schoolShare,gov:service.governmentShare},
              {label:"إعادة الامتحان",count:reexam.count,total:reexam.total,school:reexam.schoolShare,gov:reexam.governmentShare},
            ].map((row,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 70px 1fr 1fr 1fr",borderTop:`1px solid ${t.border}`,background:t.bgSurface}}>
                <div style={{...tdSt(true),paddingRight:14}}>{row.label}</div>
                <div style={tdSt(false,t.textSec)}>{fmt(row.count)}</div>
                <div style={tdSt(true)}>{fmtSy(row.total)}</div>
                <div style={tdSt(true,"#15803d")}>{fmtSy(row.school)}</div>
                <div style={tdSt(false,"#b45309")}>{fmtSy(row.gov)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown by Day */}
        {byDay.length>0&&(
          <div>
            <div style={{fontSize:12,fontWeight:700,color:t.text,marginBottom:8}}>حسب اليوم</div>
            <div style={{border:`1px solid ${t.border}`,borderRadius:10,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"1.2fr 60px 1fr 1fr 1fr 1fr 1fr"}}>
                {["اليوم","دفعات","الإجمالي","نقداً","شام كاش","حصة المدرسة","حصة الحكومة"].map(h=><div key={h} style={thSt}>{h}</div>)}
              </div>
              {byDay.map((row,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"1.2fr 60px 1fr 1fr 1fr 1fr 1fr",borderTop:`1px solid ${t.border}`,background:t.bgSurface}}>
                  <div style={tdSt(false,t.textSec)}>{fmtDay(row.date)}</div>
                  <div style={tdSt(false,t.textMuted)}>{fmt(row.count)}</div>
                  <div style={tdSt(true)}>{fmtSy(row.total)}</div>
                  <div style={tdSt(false)}>{fmtSy(row.cash)}</div>
                  <div style={tdSt(false)}>{fmtSy(row.shamCash)}</div>
                  <div style={tdSt(true,"#15803d")}>{fmtSy(row.schoolShare)}</div>
                  <div style={tdSt(false,"#b45309")}>{fmtSy(row.governmentShare)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!data&&<div style={{textAlign:"center",padding:32,color:t.textMuted,fontSize:13}}>لا توجد بيانات في هذه الفترة</div>}
      </>)}
    </div>
  );
}

// ─── Shared payment badges (used by RevDailyTab) ─────────────────────────────
function MethodBadge({m}){
  const cfg={
    CASH:     {bg:"#dcfce7",clr:"#15803d",dot:"#16a34a",label:"نقدي"},
    SHAM_CASH:{bg:"#dbeafe",clr:"#1d4ed8",dot:"#2563eb",label:"شام كاش"},
  };
  const c=cfg[m]||{bg:"#f3f4f6",clr:"#6b7280",dot:"#9ca3af",label:m||"—"};
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 9px",borderRadius:20,background:c.bg,color:c.clr,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:c.dot,flexShrink:0}}/>
      {c.label}
    </span>
  );
}

function KindBadge({k}){
  const cfg={
    SERVICE:{bg:"#eff6ff",clr:"#1d4ed8",label:"رسم شهادة"},
    REEXAM: {bg:"#fff7ed",clr:"#c2410c",label:"إعادة امتحان"},
  };
  const c=cfg[k]||{bg:"#f3f4f6",clr:"#6b7280",label:k||"—"};
  return(
    <span style={{display:"inline-block",padding:"3px 9px",borderRadius:20,background:c.bg,color:c.clr,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>
      {c.label}
    </span>
  );
}

// ─── REVENUE SUB-TAB 2: Daily Details ────────────────────────────────────────
function RevDailyTab({t,onViewCertificate}){
  const todayISO=()=>new Date().toISOString().slice(0,10);
  const fmt=v=>v!=null?Number(v).toLocaleString("en"):"—";
  const fmtSy=v=>v!=null?`${Number(v).toLocaleString("en")} ل.س`:"—";

  const [date,setDate]=useState(todayISO);
  const [applied,setApplied]=useState(todayISO());
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [data,setData]=useState(null);
  const [payments,setPayments]=useState([]);
  const [busy,setBusy]=useState(false);

  const load=async(d)=>{
    setLoading(true);setError(null);
    try{
      const r=await certificatesService.getRevenueDaily(d);
      const body=r.data?.data??r.data;
      setData(body);
      setPayments(Array.isArray(body?.payments)?body.payments:[]);
    }catch(e){setError(e.response?.data?.message||"تعذّر تحميل بيانات اليوم");setPayments([]);}
    finally{setLoading(false);}
  };
  useEffect(()=>{load(applied);},[applied]); // eslint-disable-line

  const apply=()=>{if(busy)return;setBusy(true);setApplied(date);setTimeout(()=>setBusy(false),600);};

  /* daily response returns totals at root level (not inside "collected") */
  const totAmt=payments.reduce((s,p)=>s+Number(p.amount||0),0);
  const totSch=payments.reduce((s,p)=>s+Number(p.schoolShare||0),0);
  const totGov=payments.reduce((s,p)=>s+Number(p.governmentShare||0),0);

  const inp={padding:"7px 10px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:12,fontFamily:"inherit",outline:"none"};
  const thSt={fontSize:11,fontWeight:700,color:t.textMuted,padding:"9px 12px",textAlign:"right",background:t.bgElevated,borderBottom:`1px solid ${t.border}`};
  const COLS="42px 1.8fr 130px 130px 100px 1fr 1fr 1fr 110px";

  return(
    <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:16}}>
      {/* Filter bar */}
      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <span style={{fontSize:13,fontWeight:700,color:t.text,flexShrink:0}}>تفصيل يوم</span>
        <div style={{display:"flex",alignItems:"center",gap:7,marginRight:"auto"}}>
          <span style={{fontSize:12,color:t.textMuted}}>اليوم</span>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inp}/>
          <button onClick={apply} disabled={busy}
            style={{padding:"7px 18px",borderRadius:8,border:"none",background:busy?t.border:t.accent,color:"#fff",fontSize:12,fontFamily:"inherit",fontWeight:700,cursor:busy?"not-allowed":"pointer"}}>
            {busy?"...":"عرض"}
          </button>
        </div>
      </div>

      {loading?(
        <div style={{textAlign:"center",padding:48,color:t.textMuted,fontSize:13}}>جارٍ التحميل...</div>
      ):error?(
        <div style={{textAlign:"center",padding:40,color:"#c74848",fontSize:13}}>
          {error}<br/>
          <button onClick={()=>load(applied)}
            style={{marginTop:8,padding:"5px 14px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>
            إعادة المحاولة
          </button>
        </div>
      ):(<>

        {/* 4 KPI cards — fields are at response root, not inside "collected" */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          <div style={{background:t.bgSurface,borderRadius:12,border:`1px solid ${t.borderCard}`,padding:"14px 16px"}}>
            <div style={{fontSize:10,fontWeight:700,color:t.textMuted,marginBottom:5}}>إجمالي اليوم</div>
            <div style={{fontSize:22,fontWeight:800,color:t.text,fontVariantNumeric:"tabular-nums"}}>{fmt(data?.total)}</div>
            <div style={{fontSize:11,color:t.textMuted,marginTop:3}}>{fmt(data?.count)} دفعة</div>
          </div>
          <div style={{background:"#f0fdf4",borderRadius:12,border:"1px solid #bbf7d0",padding:"14px 16px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#15803d",marginBottom:5}}>حصة المدرسة — الدخل الحقيقي</div>
            <div style={{fontSize:22,fontWeight:800,color:"#15803d",fontVariantNumeric:"tabular-nums"}}>{fmt(data?.schoolShare)}</div>
            <div style={{fontSize:11,color:"#16a34a",marginTop:3}}>فعلاً في جيب المدرسة</div>
          </div>
          <div style={{background:"#fffbeb",borderRadius:12,border:"1px solid #fde68a",padding:"14px 16px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#92400e",marginBottom:5}}>حصة الحكومة — أمانة</div>
            <div style={{fontSize:22,fontWeight:800,color:"#b45309",fontVariantNumeric:"tabular-nums"}}>{fmt(data?.governmentShare)}</div>
            <div style={{fontSize:11,color:"#d97706",marginTop:3}}>ستُسلَّم لاحقاً</div>
          </div>
          <div style={{background:t.bgSurface,borderRadius:12,border:`1px solid ${t.borderCard}`,padding:"14px 16px"}}>
            <div style={{fontSize:10,fontWeight:700,color:t.textMuted,marginBottom:6}}>طريقة الدفع</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
              <MethodBadge m="CASH"/>
              <span style={{fontSize:12,fontWeight:700,color:t.text,fontVariantNumeric:"tabular-nums"}}>{fmt(data?.cash)}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <MethodBadge m="SHAM_CASH"/>
              <span style={{fontSize:12,fontWeight:700,color:t.text,fontVariantNumeric:"tabular-nums"}}>{fmt(data?.shamCash)}</span>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {!payments.length?(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,padding:"52px 24px",background:t.bgSurface,borderRadius:14,border:`1px dashed ${t.border}`}}>
            <span style={{fontSize:40,lineHeight:1}}>📭</span>
            <div style={{fontSize:14,fontWeight:700,color:t.text}}>لا توجد دفعات في هذا اليوم</div>
            <div style={{fontSize:12,color:t.textMuted}}>لم يُسجَّل أي مقبوض بتاريخ {applied}</div>
          </div>
        ):(
          <div style={{border:`1px solid ${t.border}`,borderRadius:10,overflowX:"auto"}}>
            {/* Header */}
            <div style={{display:"grid",gridTemplateColumns:COLS,minWidth:920}}>
              {["#","الطالب","النوع","طريقة الدفع","وقت القبض","المبلغ","حصة المدرسة","حصة الحكومة","الشهادة"].map(h=>(
                <div key={h} style={thSt}>{h}</div>
              ))}
            </div>
            {/* Rows */}
            {payments.map((p,i)=>(
              <div key={p.paymentId??i}
                style={{display:"grid",gridTemplateColumns:COLS,minWidth:920,borderTop:`1px solid ${t.border}`,background:i%2===0?t.bgSurface:t.bgElevated,alignItems:"center"}}>
                {/* # */}
                <div style={{padding:"10px 8px",textAlign:"center",fontSize:11,color:t.textMuted,fontWeight:600}}>
                  {p.paymentId??i+1}
                </div>
                {/* Student */}
                <div style={{padding:"10px 12px",fontSize:13,fontWeight:600,color:t.text}}>
                  {p.studentName||"—"}
                </div>
                {/* Kind badge */}
                <div style={{padding:"10px 12px"}}>
                  <KindBadge k={p.kind}/>
                </div>
                {/* Method badge */}
                <div style={{padding:"10px 12px"}}>
                  <MethodBadge m={p.paymentMethod}/>
                </div>
                {/* Received at */}
                <div style={{padding:"10px 12px",fontSize:11,color:t.textMuted,fontVariantNumeric:"tabular-nums",direction:"ltr",textAlign:"left"}}>
                  {p.receivedAt?new Date(p.receivedAt).toLocaleTimeString("ar-SY",{hour:"2-digit",minute:"2-digit",hour12:false}):"—"}
                </div>
                {/* Amount */}
                <div style={{padding:"10px 12px",fontSize:13,fontWeight:700,color:t.text,textAlign:"right",fontVariantNumeric:"tabular-nums"}}>
                  {fmtSy(p.amount)}
                </div>
                {/* School share */}
                <div style={{padding:"10px 12px",fontSize:13,fontWeight:700,color:"#15803d",textAlign:"right",fontVariantNumeric:"tabular-nums"}}>
                  {fmtSy(p.schoolShare)}
                </div>
                {/* Gov share */}
                <div style={{padding:"10px 12px",fontSize:13,color:"#b45309",textAlign:"right",fontVariantNumeric:"tabular-nums"}}>
                  {fmtSy(p.governmentShare)}
                </div>
                {/* Certificate */}
                <div style={{padding:"10px 8px",textAlign:"center"}}>
                  {p.certificateId!=null?(
                    onViewCertificate?(
                      <button
                        onClick={()=>onViewCertificate(p.certificateId)}
                        title="فتح بيانات الشهادة"
                        style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:8,border:`1px solid ${t.accent}`,background:"transparent",color:t.accent,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}
                        onMouseEnter={e=>e.currentTarget.style.background=t.accentLight}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        🔗 #{p.certificateId}
                      </button>
                    ):(
                      <span style={{padding:"3px 8px",borderRadius:7,background:t.accentLight,color:t.accentText,fontSize:11,fontWeight:700}}>
                        #{p.certificateId}
                      </span>
                    )
                  ):(
                    <span style={{fontSize:11,color:t.textMuted}}>—</span>
                  )}
                </div>
              </div>
            ))}
            {/* Footer totals row */}
            <div style={{display:"grid",gridTemplateColumns:COLS,minWidth:920,borderTop:`2px solid ${t.border}`,background:t.bgElevated}}>
              <div style={{gridColumn:"1/6",padding:"10px 12px",fontSize:12,fontWeight:700,color:t.textSec,textAlign:"right"}}>
                الإجمالي — {payments.length} دفعة
              </div>
              <div style={{padding:"10px 12px",fontSize:13,fontWeight:800,color:t.text,textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{fmtSy(totAmt)}</div>
              <div style={{padding:"10px 12px",fontSize:13,fontWeight:800,color:"#15803d",textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{fmtSy(totSch)}</div>
              <div style={{padding:"10px 12px",fontSize:13,fontWeight:800,color:"#b45309",textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{fmtSy(totGov)}</div>
              <div/>
            </div>
          </div>
        )}
      </>)}
    </div>
  );
}

// ─── REVENUE SUB-TAB 3: Outstanding Government Remittance ────────────────────
function RevOutstandingTab({t, onRemitSuccess}){
  const fmtSy=v=>v!=null?`${Number(v).toLocaleString("en")} ل.س`:"—";
  const {hasPermission}=useAuth();
  const canRemit=hasPermission("certificates.remit-government");
  const {show:toast,el:toastEl}=useCertToast();

  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [data,setData]=useState(null);
  const [sessions,setSessions]=useState([]);
  const [selected,setSelected]=useState(new Set());
  const [submitting,setSubmitting]=useState(false);

  const load=async()=>{
    setLoading(true);setError(null);setSelected(new Set());
    try{
      const r=await certificatesService.getGovernmentOutstanding();
      const body=r.data?.data??r.data;
      setData(body);
      setSessions(Array.isArray(body?.courses)?body.courses:[]);
    }catch(e){setError(e.response?.data?.message||"تعذّر تحميل البيانات");}
    finally{setLoading(false);}
  };
  useEffect(()=>{load();},[]);// eslint-disable-line react-hooks/set-state-in-effect

  const toggleAll=()=>setSelected(s=>s.size===sessions.length?new Set():new Set(sessions.map(x=>x.courseId??x.id)));
  const toggle=id=>setSelected(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});

  const handleSubmit=async()=>{
    if(!selected.size||submitting||!canRemit)return;
    setSubmitting(true);
    try{
      await certificatesService.recordGovernmentRemittance({courseIds:[...selected]});
      toast(`تم تسجيل تسليم ${selected.size} دورة بنجاح`,"ok");
      await load();
      onRemitSuccess?.();
    }catch(e){
      const status=e.response?.status;
      const msg=status===403?"ليس لديك صلاحية تسجيل التسليم الحكومي":e.response?.data?.message||"حدث خطأ أثناء التسجيل";
      toast(msg,"err");
    }
    finally{setSubmitting(false);}
  };

  const selTotal=sessions.filter(s=>selected.has(s.courseId??s.id)).reduce((sum,s)=>sum+Number(s.governmentShare||0),0);
  const thSt={fontSize:11,fontWeight:700,color:t.textMuted,padding:"9px 12px",textAlign:"right",borderBottom:`1px solid ${t.border}`,background:t.bgElevated};

  return(
    <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:14}}>
      {loading?(
        <div style={{textAlign:"center",padding:48,color:t.textMuted,fontSize:13}}>جارٍ التحميل...</div>
      ):error?(
        <div style={{textAlign:"center",padding:40,color:"#c74848",fontSize:13}}>
          {error}<br/>
          <button onClick={load} style={{marginTop:8,padding:"5px 14px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>إعادة المحاولة</button>
        </div>
      ):(<>
        {toastEl}
        {/* Summary cards */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{background:"#fffbeb",borderRadius:14,border:"1px solid #fde68a",padding:"18px 20px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#92400e",marginBottom:6}}>إجمالي المتبقي للحكومة</div>
            <div style={{fontSize:28,fontWeight:800,color:"#b45309",fontVariantNumeric:"tabular-nums"}}>{fmtSy(data?.outstanding)}</div>
          </div>
          <div style={{background:t.bgSurface,borderRadius:14,border:`1px solid ${t.borderCard}`,padding:"18px 20px"}}>
            <div style={{fontSize:10,fontWeight:700,color:t.textMuted,marginBottom:6}}>الدورات المعلقة</div>
            <div style={{fontSize:28,fontWeight:800,color:t.text,fontVariantNumeric:"tabular-nums"}}>{sessions.length} <span style={{fontSize:14,fontWeight:500}}>دورة</span></div>
          </div>
        </div>

        {!sessions.length?(
          <div style={{textAlign:"center",padding:32,color:t.textMuted,fontSize:13}}>لا توجد دورات معلقة — كل المستحقات مسلَّمة ✓</div>
        ):(
          <>
            <div style={{border:`1px solid ${t.border}`,borderRadius:10,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"40px 1fr 1.2fr"}}>
                <div style={{...thSt,textAlign:"center"}}>
                  <input type="checkbox" checked={selected.size===sessions.length&&sessions.length>0} onChange={toggleAll} style={{cursor:"pointer"}}/>
                </div>
                {["رقم الدورة","حصة الحكومة"].map(h=><div key={h} style={thSt}>{h}</div>)}
              </div>
              {sessions.map((s,i)=>{
                const id=s.courseId??s.id;
                const checked=selected.has(id);
                return(
                  <div key={id??i} onClick={()=>toggle(id)} style={{display:"grid",gridTemplateColumns:"40px 1fr 1.2fr",borderTop:`1px solid ${t.border}`,background:checked?t.accentLight:"transparent",cursor:"pointer",transition:"background 0.1s"}}>
                    <div style={{padding:"11px 12px",textAlign:"center"}}><input type="checkbox" checked={checked} onChange={()=>toggle(id)} onClick={e=>e.stopPropagation()} style={{cursor:"pointer"}}/></div>
                    <div style={{padding:"11px 12px",fontSize:13,color:t.text,fontWeight:600}}>دورة #{id}</div>
                    <div style={{padding:"11px 12px",fontSize:13,fontWeight:700,color:"#b45309"}}>{fmtSy(s.governmentShare)}</div>
                  </div>
                );
              })}
            </div>
            {/* Action footer */}
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:10,background:t.bgSurface,border:`1px solid ${t.borderCard}`}}>
              <span style={{fontSize:13,color:t.textSec}}>المحدَّد: <strong style={{color:t.text}}>{selected.size} دورة</strong></span>
              {selected.size>0&&<span style={{fontSize:12,color:"#b45309"}}>({fmtSy(selTotal)})</span>}
              {canRemit?(
                <button onClick={handleSubmit} disabled={!selected.size||submitting}
                  style={{marginRight:"auto",padding:"10px 20px",borderRadius:10,border:"none",background:(!selected.size||submitting)?"#e5e7eb":"#b45309",color:"#fff",fontSize:13,fontWeight:700,cursor:(!selected.size||submitting)?"not-allowed":"pointer",fontFamily:"inherit",opacity:(!selected.size||submitting)?0.6:1,transition:"all 0.15s"}}>
                  {submitting?"جارٍ التسجيل...":"تسجيل تسليم المحدَّد"}
                </button>
              ):(
                <span style={{marginRight:"auto",fontSize:11,color:t.textMuted,padding:"10px 16px",borderRadius:10,background:t.bgElevated,border:`1px solid ${t.border}`}}>لا تملك صلاحية التسليم</span>
              )}
            </div>
          </>
        )}
      </>)}
    </div>
  );
}

// ─── REVENUE SUB-TAB 4: Remittance History ───────────────────────────────────
function RevHistoryTab({t, historyRev}){
  const fmtSy=v=>v!=null?`${Number(v).toLocaleString("en")} ل.س`:"—";
  const {hasPermission}=useAuth();
  const canRemit=hasPermission("certificates.remit-government");
  const {show:toast,el:toastEl}=useCertToast();

  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [history,setHistory]=useState([]);
  const [expanded,setExpanded]=useState(new Set());
  const [selected,setSelected]=useState({});
  const [submitting,setSubmitting]=useState(null);
  const [confirmPending,setConfirmPending]=useState(null); // {remId, ids, selTotal}

  const load=async()=>{
    setLoading(true);setError(null);
    try{
      const r=await certificatesService.getGovernmentHistory();
      const body=r.data?.data??r.data;
      setHistory(Array.isArray(body)?body:Array.isArray(body?.history)?body.history:[]);
    }catch(e){setError(e.response?.data?.message||"تعذّر تحميل السجل");}
    finally{setLoading(false);}
  };
  useEffect(()=>{load();},[historyRev]);// eslint-disable-line react-hooks/set-state-in-effect

  const toggleExpand=id=>setExpanded(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});
  const toggleCourse=(remId,cid)=>setSelected(p=>{const s=new Set(p[remId]||[]);s.has(cid)?s.delete(cid):s.add(cid);return{...p,[remId]:s};});

  const openConfirm=(remId,courses)=>{
    const ids=[...(selected[remId]||[])];
    if(!ids.length||submitting||!canRemit)return;
    const selTotal=courses.filter(c=>ids.includes(c.courseId??c.id)).reduce((s,c)=>s+Number(c.governmentShare||0),0);
    setConfirmPending({remId,ids,selTotal});
  };

  const handleRollback=async()=>{
    if(!confirmPending)return;
    const {remId,ids}=confirmPending;
    setConfirmPending(null);
    setSubmitting(remId);
    try{
      await certificatesService.rollbackGovernmentRemittance({courseIds:ids});
      toast(`تم التراجع عن تسليم ${ids.length} دورة`,"ok");
      await load();
    }catch(e){
      const status=e.response?.status;
      const msg=status===403?"ليس لديك صلاحية التراجع عن التسليم":e.response?.data?.message||"حدث خطأ أثناء التراجع";
      toast(msg,"err");
    }
    finally{setSubmitting(null);}
  };

  const thSt={fontSize:11,fontWeight:700,color:t.textMuted,padding:"8px 12px",textAlign:"right",borderBottom:`1px solid ${t.border}`,background:t.bgElevated};

  return(
    <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:12}}>
      {/* Confirmation modal */}
      {confirmPending&&(
        <div onClick={()=>setConfirmPending(null)} style={{position:"fixed",inset:0,zIndex:9000,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(2px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:t.bgSurface,borderRadius:16,padding:"26px 28px 20px",width:320,boxShadow:"0 20px 48px rgba(0,0,0,0.22)",border:`1px solid ${t.borderCard}`,textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:10}}>⚠️</div>
            <div style={{fontSize:15,fontWeight:700,color:t.text,marginBottom:6}}>تأكيد التراجع</div>
            <div style={{fontSize:13,color:t.textMuted,marginBottom:6}}>سيتم التراجع عن تسليم <strong style={{color:t.text}}>{confirmPending.ids.length} دورة</strong></div>
            <div style={{fontSize:12,color:"#b45309",marginBottom:20}}>({fmtSy(confirmPending.selTotal)})</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={handleRollback} style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:"#c74848",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>تأكيد التراجع</button>
              <button onClick={()=>setConfirmPending(null)} style={{flex:1,padding:"10px",borderRadius:10,cursor:"pointer",background:t.bgElevated,color:t.textSec,fontSize:14,fontWeight:600,border:`1px solid ${t.border}`,fontFamily:"inherit"}}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
      {loading?(
        <div style={{textAlign:"center",padding:48,color:t.textMuted,fontSize:13}}>جارٍ التحميل...</div>
      ):error?(
        <div style={{textAlign:"center",padding:40,color:"#c74848",fontSize:13}}>
          {error}<br/>
          <button onClick={load} style={{marginTop:8,padding:"5px 14px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>إعادة المحاولة</button>
        </div>
      ):!history.length?(
        <div style={{textAlign:"center",padding:48,color:t.textMuted,fontSize:13}}>لا يوجد سجل تسليم حتى الآن</div>
      ):(<>
        {toastEl}
        {history.map((item,idx)=>{
          const remId=item.remittanceId??item.id??idx;
          const courses=Array.isArray(item.sessions)?item.sessions:Array.isArray(item.courses)?item.courses:[];
          const isExpanded=expanded.has(remId);
          const selSet=selected[remId]||new Set();
          const selCount=selSet.size;
          const selTotal=courses.filter(c=>selSet.has(c.courseId??c.id)).reduce((s,c)=>s+Number(c.governmentShare||0),0);
          const paidAt=item.paidAt||item.remittedAt;
          return(
            <div key={remId} style={{border:`1px solid ${t.border}`,borderRadius:12,overflow:"hidden",background:t.bgSurface}}>
              <div onClick={()=>toggleExpand(remId)} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.background=t.bgElevated}
                onMouseLeave={e=>e.currentTarget.style.background=t.bgSurface}>
                <span style={{fontSize:12,color:t.textMuted}}>{isExpanded?"▼":"▶"}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:t.text}}>تسليم #{remId} — {courses.length} دورة</div>
                  {paidAt&&<div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{new Date(paidAt).toLocaleString("ar-SY",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}</div>}
                </div>
                <div style={{fontSize:15,fontWeight:800,color:"#b45309",fontVariantNumeric:"tabular-nums"}}>{fmtSy(item.totalAmount??item.amount)}</div>
              </div>
              {isExpanded&&(
                <>
                  <div style={{borderTop:`1px solid ${t.border}`}}>
                    <div style={{display:"grid",gridTemplateColumns:"40px 1fr 1.2fr"}}>
                      <div style={{...thSt,textAlign:"center"}}>
                        <input type="checkbox" checked={selCount===courses.length&&courses.length>0}
                          onChange={()=>setSelected(p=>({...p,[remId]:selCount===courses.length?new Set():new Set(courses.map(c=>c.courseId??c.id))}))}
                          style={{cursor:"pointer"}}/>
                      </div>
                      {["رقم الدورة","حصة الحكومة"].map(h=><div key={h} style={thSt}>{h}</div>)}
                    </div>
                    {courses.map((c,ci)=>{
                      const cid=c.courseId??c.id;
                      const checked=selSet.has(cid);
                      return(
                        <div key={cid??ci} onClick={()=>toggleCourse(remId,cid)} style={{display:"grid",gridTemplateColumns:"40px 1fr 1.2fr",borderTop:`1px solid ${t.border}`,background:checked?t.accentLight:"transparent",cursor:"pointer"}}>
                          <div style={{padding:"9px 12px",textAlign:"center"}}><input type="checkbox" checked={checked} onChange={()=>toggleCourse(remId,cid)} onClick={e=>e.stopPropagation()} style={{cursor:"pointer"}}/></div>
                          <div style={{padding:"9px 12px",fontSize:13,color:t.text,fontWeight:600}}>دورة #{cid}</div>
                          <div style={{padding:"9px 12px",fontSize:13,fontWeight:700,color:"#b45309"}}>{fmtSy(c.governmentShare)}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:t.bgElevated}}>
                    <span style={{fontSize:12,color:t.textSec}}>المحدَّد: <strong style={{color:t.text}}>{selCount} دورة</strong></span>
                    {selCount>0&&<span style={{fontSize:11,color:"#b45309"}}>({fmtSy(selTotal)})</span>}
                    {canRemit?(
                      <button onClick={()=>openConfirm(remId,courses)} disabled={!selCount||submitting===remId}
                        style={{marginRight:"auto",padding:"8px 18px",borderRadius:9,border:"none",background:(!selCount||submitting===remId)?"#e5e7eb":"#c74848",color:"#fff",fontSize:12,fontWeight:700,cursor:(!selCount||submitting===remId)?"not-allowed":"pointer",fontFamily:"inherit",opacity:(!selCount||submitting===remId)?0.6:1}}>
                        {submitting===remId?"جارٍ التراجع...":"تراجع عن تسليم المحدَّد"}
                      </button>
                    ):(
                      <span style={{marginRight:"auto",fontSize:11,color:t.textMuted,padding:"8px 14px",borderRadius:9,background:t.bgSurface,border:`1px solid ${t.border}`}}>لا تملك صلاحية التراجع</span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </>)}
    </div>
  );
}

// ─── REVENUE PARENT: 4-sub-tab navigator ─────────────────────────────────────
function CertRevenueTab({t,onViewCertificate}){
  const [revTab,setRevTab]=useState("summary");
  const [historyRev,setHistoryRev]=useState(0);
  const REV_TABS=[
    {id:"summary",     label:"ملخص الفترة"},
    {id:"daily",       label:"تفصيل يوم"},
    {id:"outstanding", label:"المتبقي للحكومة"},
    {id:"history",     label:"سجل التسليم"},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{display:"flex",gap:0,padding:"10px 16px 0",borderBottom:`1px solid ${t.border}`,background:t.bgSurface,flexShrink:0,overflowX:"auto"}}>
        {REV_TABS.map(tb=>(
          <button key={tb.id} onClick={()=>setRevTab(tb.id)} style={{padding:"8px 16px",border:"none",borderBottom:revTab===tb.id?`2px solid ${t.accent}`:"2px solid transparent",marginBottom:-1,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:revTab===tb.id?700:500,color:revTab===tb.id?t.accentText:t.textMuted,background:"transparent",whiteSpace:"nowrap",transition:"color 0.15s"}}>
            {tb.label}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {revTab==="summary"     &&<RevSummaryTab     t={t}/>}
        {revTab==="daily"       &&<RevDailyTab       t={t} onViewCertificate={onViewCertificate}/>}
        {revTab==="outstanding" &&<RevOutstandingTab t={t} onRemitSuccess={()=>setHistoryRev(r=>r+1)}/>}
        {revTab==="history"     &&<RevHistoryTab     t={t} historyRev={historyRev}/>}
      </div>
    </div>
  );
}

/* ── SimClockBar ──────────────────────────────────────────────────────── */
function SimClockBar({t}){
  const KEY='sim.clock.offsetMs';
  const getOffset=()=>Number(localStorage.getItem(KEY)||'0');
  const [offsetMs,setOffsetMs]=useState(getOffset);
  useEffect(()=>{const id=setInterval(()=>setOffsetMs(getOffset()),1000);return()=>clearInterval(id);},[]);
  const shift=(h)=>{const next=offsetMs+h*3600000;localStorage.setItem(KEY,String(next));setOffsetMs(next);};
  const reset=()=>{localStorage.setItem(KEY,'0');setOffsetMs(0);};
  // eslint-disable-next-line react-hooks/purity
  const simTime=new Date(Date.now()+offsetMs);
  const fmt=d=>d.toLocaleString('en-GB',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false});
  const offsetH=Math.round((offsetMs/3600000)*100)/100;
  const absH=Math.abs(offsetH);
  const days=Math.floor(absH/24);
  const hrs=Math.round((absH%24)*10)/10;
  const parts=[];
  if(days)parts.push(`${days} يوم`);
  if(hrs)parts.push(`${hrs} ساعة`);
  const label=offsetH===0?'الآن':`${offsetH>0?'بعد':'قبل'} ${parts.join(' و')}`;
  const btn={padding:'3px 9px',border:`1px solid ${t.border}`,borderRadius:5,cursor:'pointer',fontSize:11,fontWeight:600,background:t.bgSurface,color:t.textMuted,fontFamily:'inherit'};
  return(
    <div style={{display:'inline-flex',alignItems:'center',gap:5,padding:'0 10px',marginRight:'auto',flexShrink:0}}>
      <span style={{fontSize:11,color:t.textMuted,direction:'ltr',fontVariantNumeric:'tabular-nums'}}>{fmt(simTime)}</span>
      <span style={{padding:'2px 8px',borderRadius:10,fontSize:11,fontWeight:700,background:offsetH!==0?t.accentLight:'transparent',color:offsetH!==0?t.accentText:t.textMuted}}>{label}</span>
      <button style={btn} onClick={()=>shift(1)}>ساعة+</button>
      <button style={btn} onClick={()=>shift(24)}>يوم+</button>
      <button style={btn} onClick={()=>shift(168)}>أسبوع+</button>
      <button style={btn} onClick={()=>shift(-24)}>يوم−</button>
      <button style={{...btn,color:t.accent,borderColor:t.accent}} onClick={reset}>الآن</button>
    </div>
  );
}

/* ── SectionCertificate (parent) ─────────────────────────────────────── */
function SectionCertificate({t}){
  const [tab,setTab]=useState("pool");
  const [pendingCourseId,setPendingCourseId]=useState(null);
  const [pendingCertId,setPendingCertId]=useState(null);
  const TABS=[
    {id:"pool",    label:"طلبات المجموعات"},
    {id:"courses", label:"إدارة الدورات"  },
    {id:"search",  label:"بحث عن طالب"   },
    {id:"revenue", label:"لوحة الإيرادات" },
  ];
  const goToCourse=id=>{setPendingCourseId(id);setTab("courses");};
  const goToCert=id=>{setPendingCertId(id);setTab("search");};
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{display:"flex",borderBottom:`2px solid ${t.border}`,background:t.bgSurface,flexShrink:0,overflowX:"auto",alignItems:"center"}}>
        {TABS.map(tb=>(
          <button key={tb.id} onClick={()=>setTab(tb.id)} style={{padding:"11px 18px",border:"none",borderBottom:tab===tb.id?`2px solid ${t.accent}`:"2px solid transparent",marginBottom:-2,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:tab===tb.id?700:400,color:tab===tb.id?t.accentText:t.textMuted,background:"transparent",whiteSpace:"nowrap"}}>{tb.label}</button>
        ))}
        <SimClockBar t={t}/>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {tab==="pool"    &&<CertPoolTab    t={t} onOpenCourse={goToCourse} onOpenCert={goToCert}/>}
        {tab==="courses" &&<CertCoursesTab t={t} pendingCourseId={pendingCourseId} onPendingConsumed={()=>setPendingCourseId(null)} onOpenCert={goToCert}/>}
        {tab==="search"  &&<CertSearchTab  t={t} pendingCertId={pendingCertId}  onPendingConsumed={()=>setPendingCertId(null)}/>}
        {tab==="revenue" &&<CertRevenueTab t={t} onViewCertificate={goToCert}/>}
      </div>
    </div>
  );
}

const NAV = [
  { id: "students", label: "إدارة الطلاب", icon: <PiUsersThin /> },
  { id: "instructors", label: "إدارة المدربين", icon: <FaUserTie /> },
  { id: "bookings", label: "الحجوزات", icon: <IoIosCalendar /> },
  { id: "vehicles", label: "المركبات", icon: <FaCar /> },
  {
    id: "certificate",
    label: "الشهادة الحكومية",
    icon: <IoDocumentTextOutline />,
  },
];

export default function ReceptionistPro({embedded=false,page:forcedPage,darkMode}){
  const [localDark,setLocalDark]=useState(false);
  const dark = (embedded && typeof darkMode !== 'undefined') ? darkMode : localDark;
  const [page,setPage]=useState(forcedPage||"students");
  const [collapsed,setCollapsed]=useState(false);
  const t=T[dark?"dark":"light"];
  const sidebarWidth = collapsed ? 84 : 308;
  const pages={
    students:<RequirePermission permission={P.STUDENTS_READ} t={t}><SectionStudents t={t}/></RequirePermission>,
    instructors:<RequirePermission permission={P.INSTRUCTORS_READ} t={t}><SectionInstructors t={t}/></RequirePermission>,
    bookings:<RequirePermission permission={P.BOOKINGS_READ} t={t}><SectionBookings t={t}/></RequirePermission>,
    vehicles:<SectionVehicles t={t}/>,
    certificate:<RequirePermission permission={P.CERTIFICATES_READ} t={t}><SectionCertificate t={t}/></RequirePermission>,
  };
  // sync when parent forces a page (embedded mode)
  if(forcedPage && forcedPage!==page){ setPage(forcedPage); }
  return(
    <div dir="rtl" style={{display:"flex",height: embedded?"calc(100vh - 112px)":"100vh",overflow:"hidden",background:t.bgApp,fontFamily:"var(--font-body)"}}>
      {!embedded && (
        <div style={{width:sidebarWidth,flexShrink:0}} />
      )}
      {!embedded && (
        <div style={{width:sidebarWidth,height:"100svh",minHeight:"100svh",position:"fixed",top:0,right:0,zIndex:40,background:t.bgSidebar,display:"flex",flexDirection:"column",transition:"width 0.2s",overflow:"hidden",boxShadow:"2px 0 18px rgba(0,0,0,0.18)"}}>
          <div style={{padding:"18px 14px 16px",borderBottom:`1px solid ${t.borderCard}`,display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:40,height:40,borderRadius:11,background:"linear-gradient(135deg,#0F766E 0%,#F5D547 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,boxShadow:"0 2px 8px rgba(15,118,110,0.30)",color:"#17325C"}}>🗂️</div>
            {!collapsed&&<div><div style={{fontSize:15,fontWeight:800,color:"#fff",lineHeight:1.2}}>الموظف الإداري</div><div style={{fontSize:12,color:t.textSidebar,marginTop:2}}>مدرسة القيادة</div></div>}
          </div>
          <div style={{flex:1,minHeight:0,padding:"10px",overflowY:"auto"}}>
            {NAV.map(item=>{const active=page===item.id;return(
              <button key={item.id} onClick={()=>setPage(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:11,padding:collapsed?"14px 10px":"13px 15px",borderRadius:14,border:"none",cursor:"pointer",background:active?t.bgSidebarActive:"transparent",color:active?t.textSidebarActive:t.textSidebar,fontSize:15,fontWeight:active?700:500,marginBottom:6,justifyContent:collapsed?"center":"flex-start",fontFamily:"inherit",transition:"all 0.15s",boxShadow:active?"0 10px 24px rgba(0,0,0,0.16)":"none"}}>
                <span style={{fontSize:18,flexShrink:0}}>{item.icon}</span>
                {!collapsed&&<span>{item.label}</span>}
              </button>
            );})}
          </div>
          <div style={{padding:"12px 10px",borderTop:`1px solid ${t.borderCard}`}}>
            <button onClick={()=>setCollapsed(!collapsed)} style={{width:"100%",padding:"11px",borderRadius:12,background:t.accentLight,border:"none",color:t.accentText,cursor:"pointer",fontSize:18,fontWeight:700}}>{collapsed?"»":"«"}</button>
          </div>
        </div>
      )}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {!embedded && (
          <div style={{height:50,background:t.bgSurface,borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",padding:"0 18px",gap:10,flexShrink:0,boxShadow:t.shadow}}>
            <div style={{fontSize:13,fontWeight:700,color:t.text}}>{NAV.find(n=>n.id===page)?.label}</div>
            <div style={{flex:1}}/>
            <button onClick={()=>{ if(!embedded) setLocalDark(!localDark); }} style={{padding:"5px 13px",borderRadius:7,background:t.accentLight,color:t.accentText,border:"none",fontSize:11,cursor:"pointer",fontWeight:600}}>{dark?"☀️ نهاري":"🌙 ليلي"}</button>
            <div style={{width:32,height:32,borderRadius:"50%",background:t.accentLight,color:t.accentText,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>أ</div>
          </div>
        )}
        <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>{pages[page]}</div>
      </div>
    </div>
  );
}