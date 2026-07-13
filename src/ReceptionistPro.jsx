import { useState, useEffect } from "react";
import { TbBus } from "react-icons/tb";
import { IoIosCalendar } from "react-icons/io";

import { IoDocumentTextOutline } from "react-icons/io5";
import {  PiUsersThin } from "react-icons/pi";
import { FaUserTie } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { bookingsService, studentsService, instructorsService, certificatesService } from "./api";


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
    borderCard: "rgba(113,83,23,0.2)",

    accent: "#715317",
    accentLight: "#e9e3d6",
    accentText: "#715317",
    grad: "linear-gradient(135deg, #796c2c 0%, #715317 100%)",

    // الحالات التشغيلية المحدثة
    confirmed: { bg: "rgba(113,83,23,0.1)", text: "#715317", dot: "#715317" },
    pending: { bg: "rgba(201,124,40,0.14)", text: "#c98a28", dot: "#c98a28" },
    cancelled: { bg: "rgba(199,72,72,0.12)", text: "#c74848", dot: "#c74848" },
    completed: { bg: "rgba(80,90,50,0.14)", text: "#505a32", dot: "#505a32" },
    noshow: { bg: "rgba(199,72,72,0.12)", text: "#c74848", dot: "#c74848" },
    inprogress: { bg: "rgba(113,83,23,0.12)", text: "#715317", dot: "#715317" },
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
  };
  const c=m[s]||t.expired;
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,background:c.bg,color:c.text,padding:"2px 9px",borderRadius:20,fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}><span style={{width:6,height:6,borderRadius:"50%",background:c.dot,flexShrink:0}}/>{s}</span>;
}
function Card({children,t,p=16,mb=10,style={}}){return <div style={{background:t.bgSurface,borderRadius:12,border:`1px solid ${t.borderCard}`,padding:p,marginBottom:mb,boxShadow:t.shadow,...style}}>{children}</div>;}
function Modal({title,onClose,children,t,width=500}){return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(2px)"}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:t.bgSurface,borderRadius:16,width,maxWidth:"calc(100vw-40px)",maxHeight:"85vh",overflow:"hidden",boxShadow:t.shadowLg,display:"flex",flexDirection:"column"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:`1px solid ${t.border}`}}><div style={{fontSize:16,fontWeight:700,color:t.text}}>{title}</div><button onClick={onClose} style={{width:28,height:28,borderRadius:7,border:"none",background:t.bgElevated,cursor:"pointer",fontSize:16,color:t.textMuted}}>✕</button></div><div style={{padding:"18px 20px",overflowY:"auto"}}>{children}</div></div></div>;}
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
function SearchBar({placeholder,t,value,onChange}){return <div style={{position:"relative",flex:1}}><span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:14,color:t.textMuted}}>🔍</span><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"8px 32px 8px 10px",borderRadius:9,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/></div>;}
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
        <div style={{display:"flex",justifyContent:"space-between",padding:"9px 0",fontSize:15,fontWeight:700}}><span style={{color:t.text}}>الإجمالي المستحق</span><span style={{color:t.accent}}>{total.toLocaleString()} ل.س</span></div>
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
      const arr  = Array.isArray(body) ? body : (body?.items || body?.students || body?.data || []);
      setStudents(arr);
      if (keepSel) setSel(prev => (prev && arr.some(s => String(sId(s)) === String(sId(prev)))) ? prev : (arr[0] || null));
      else setSel(arr[0] || null);
    } catch { setStudents([]); setSel(null); }
    finally  { setLoadingList(false); }
  };

  useEffect(() => { let c=false; (async()=>{ setLoadingList(true); try { const params={}; if(search.trim())params.search=search.trim(); if(fSt)params.status=fSt; const res=await studentsService.getAll(params); const body=res.data?.data??res.data; const arr=Array.isArray(body)?body:(body?.items||body?.students||body?.data||[]); if(!c){setStudents(arr);setSel(prev=>(prev&&arr.some(s=>String(sId(s))===String(sId(prev))))?prev:(arr[0]||null));} } catch{if(!c){setStudents([]);setSel(null);}} finally{if(!c)setLoadingList(false);} })(); return()=>{c=true;}; }, [search, fSt]);

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

  // ── Fetch student bookings via dedicated endpoint ──
  const fetchBookings = async () => {
    if (!sel) { setBookings([]); return; }
    setLoadingBk(true);
    try {
      const res  = await studentsService.getBookings(sId(sel), { limit: 100 });
      const body = res.data?.data ?? res.data;
      const arr  = Array.isArray(body) ? body : (body?.data || body?.bookings || body?.items || []);
      setBookings(arr);
    } catch { setBookings([]); }
    finally  { setLoadingBk(false); }
  };

  useEffect(() => {
    let c = false;
    (async () => {
      if (!sel) { setBookings([]); return; }
      setLoadingBk(true);
      try {
        const res  = await studentsService.getBookings(sId(sel), { limit: 100 });
        const body = res.data?.data ?? res.data;
        const arr  = Array.isArray(body) ? body : (body?.data || body?.bookings || body?.items || []);
        if (!c) setBookings(arr);
      } catch { if (!c) setBookings([]); }
      finally  { if (!c) setLoadingBk(false); }
    })();
    return () => { c = true; };
  }, [sel]);

  // ── Update booking status ──
  const handleUpdateStatus = async (bookingId, status) => {
    setStatusBusyId(bookingId);
    try { await bookingsService.updateStatus(bookingId, status); await fetchBookings(); }
    catch { /* silent */ }
    finally { setStatusBusyId(null); }
  };

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

  const mappedBookings = (Array.isArray(bookings) ? bookings : []).map(b => ({
    id: b.id,
    dateTime: formatBookingDate(b),
    inst:      b.instructorName || b.instructor?.name || "—",
    type:      TRAINING_MAP[b.trainingType]   || b.trainingType   || "—",
    status:    BOOKING_STATUS_MAP[b.bookingStatus] || b.bookingStatus || "—",
    pay:       PAYMENT_STATUS_MAP[b.paymentStatus] || b.paymentStatus || "—",
    rawStatus: b.bookingStatus,
  }));
  const shownBookings = mappedBookings.filter(b => !bFilt || b.rawStatus === bFilt);

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
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1, direction: "ltr", textAlign: "right" }}>{sPhone(s)}</div>
                </div>
                <Badge s={sStatus(s)} t={t} />
              </div>
            );
          })}
        </div>
        <div style={{ padding: "10px 12px", borderTop: `1px solid ${t.border}`, background: t.bgElevated }}>
          <Btn label="+ تسجيل طالب جديد" onClick={() => setNewStudentModal(true)} t={t} sz="sm" style={{ width: "100%" }} />
        </div>
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
            <Btn label="+ حجز جديد" onClick={() => setBookingModal(true)} t={t} sz="sm" />
          </div>

          <div style={{ display: "flex", borderBottom: `1px solid ${t.border}`, background: t.bgSurface, padding: "0 22px", flexShrink: 0 }}>
            {[["bookings","الحجوزات"],["info","البيانات"],["docs","الوثائق"]].map(([id,label]) => (
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
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
                        <Badge s={b.pay} t={t} />
                        <Badge s={b.status} t={t} />
                      </div>
                    </div>
                    {b.rawStatus === "BOOKED" && (
                      <div style={{ display: "flex", gap: 7, marginTop: 9 }}>
                        <Btn label="✓ إكمال الجلسة" onClick={() => handleUpdateStatus(b.id, "COMPLETED")} t={t} sz="sm" disabled={statusBusyId === b.id} />
                        <Btn label="لم يحضر"         onClick={() => handleUpdateStatus(b.id, "NO_SHOW")}   t={t} sz="sm" v="danger" disabled={statusBusyId === b.id} />
                      </div>
                    )}
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
                    {d?.balance != null && <InfoRow k="الرصيد"        v={`${Number(d.balance).toLocaleString("ar-SY")} ل.س`}          t={t} />}
                  </>
                )}
              </Card>
            )}

            {dTab === "docs" && (
              <Card t={t} p={16}>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 12 }}>وثائق الشهادة الحكومية</div>
                {["صورة شخصية حديثة","صورة الهوية (أمامي)","صورة الهوية (خلفي)"].map((doc, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${t.border}` }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{doc}</span>
                    <span style={{ fontSize: 11, color: t.textMuted }}>تُسلَّم للمركز — لا تُخزَّن</span>
                  </div>
                ))}
                <div style={{ marginTop: 10, padding: "9px 12px", borderRadius: 8, background: t.accentLight, fontSize: 11, color: t.accentText }}>الوثائق تُسلَّم للمركز الحكومي مباشرةً — يكفي تأكيدها هنا</div>
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

function todayStr() { return new Date().toISOString().slice(0, 10); }

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
  return isNaN(n) ? String(v) : `${n.toLocaleString("ar-SY")} ل.س`;
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
    setBookingDate(d.toISOString().slice(0, 10));
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
        <div style={{ padding: "10px 12px", borderTop: `1px solid ${t.border}`, background: t.bgElevated }}>
          <Btn label="+ إضافة مدرب" onClick={() => setAddModal(true)} t={t} sz="sm" style={{ width: "100%" }} />
        </div>
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
            <div style={{ display: "flex", gap: 7 }}>
              <Btn label="+ تسجيل إجازة" onClick={() => setLeaveModal({})} t={t} sz="sm" v="secondary" />
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
                      <Btn label="تعديل" onClick={() => setScheduleModal({ dayOfWeek: day, periods: periods.length ? periods : [{ startTime: "09:00", endTime: "12:00" }] })} t={t} sz="sm" v="ghost" />
                    </div>
                  );
                })}
              </div>
            )}

            {dTab === "leaves" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>الإجازات المسجلة</div>
                  <Btn label="+ تسجيل إجازة" onClick={() => setLeaveModal({})} t={t} sz="sm" />
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
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <Btn label="تعديل" onClick={() => setLeaveModal(l)} t={t} sz="sm" v="ghost" disabled={leaveBusyId === l.id} />
                        <Btn label="حذف" onClick={() => setDeleteLeaveTarget(l)} t={t} sz="sm" v="danger" disabled={leaveBusyId === l.id} />
                      </div>
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
  DEPOSIT_PAID: "مدفوع", FULLY_PAID: "مدفوع", PENDING_DEPOSIT: "معلق",
  DEPOSIT_NON_REFUNDABLE: "غير مسترد", DEPOSIT_AVAILABLE_FOR_REBOOKING: "قابل لإعادة الحجز",
  DEPOSIT_USED_IN_REBOOKING: "مُستخدم",
};
const TRAINING_MAP = { MANUAL: "عادي", AUTOMATIC: "أوتوماتيك" };
const BOOKING_STATUS_FILTER = [
  { value: "", label: "الكل" }, { value: "BOOKED", label: "مؤكد" },
  { value: "PENDING_PAYMENT", label: "بانتظار العربون" }, { value: "COMPLETED", label: "مكتمل" },
  { value: "CANCELLED", label: "ملغي" }, { value: "NO_SHOW", label: "لم يحضر" },
];

function formatBookingDate(b) {
  if (b.dayName && b.date && b.startTime) {
    const d = new Date(b.date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleDateString("ar-SY", { month: "long" });
    return `${b.dayName} ${day} ${month} ${b.startTime}`;
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

  // Step 3 state
  const [credit, setCredit] = useState(null);
  const [checkingCredit, setCheckingCredit] = useState(false);
  const [collectedAmount, setCollectedAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (lockedStudent) return;
    let cancelled = false;
    (async () => {
      try {
        const sRes = await studentsService.getAll();
        const sRaw = sRes.data?.data || sRes.data;
        if (!cancelled) setStudents(Array.isArray(sRaw) ? sRaw : []);
      } catch { /* empty */ }
      finally { if (!cancelled) setLoadingStudents(false); }
    })();
    return () => { cancelled = true; };
  }, [lockedStudent]);

  const getSid = (s) => s.studentId ?? s.id;
  const sName = (s) => s.user?.name || s.name || "";
  const sPhone = (s) => s.user?.phone || s.phone || "";

  const filteredStudents = students.filter(s => {
    if (!studentQuery.trim()) return true;
    const q = studentQuery.trim().toLowerCase();
    return sName(s).toLowerCase().includes(q) || sPhone(s).includes(q);
  });

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
      const params = { trainingType, vehicleSource };
      if (genderFilter) params.instructorGender = genderFilter;
      const res = await bookingsService.getAvailableSlots(params);
      const body = res.data?.data || res.data;
      setSlots(Array.isArray(body) ? body : body?.slots || body?.instructors || []);
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
    if (!hasCredit) {
      if (!collectedAmount || isNaN(Number(collectedAmount)) || Number(collectedAmount) <= 0) {
        setErrors({ collectedAmount: "مبلغ العربون مطلوب" });
        return;
      }
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
    if (!hasCredit) payload.collectedAmount = Number(collectedAmount);

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
      const data = err.response?.data?.data || err.response?.data;
      const raw = data?.message || err.response?.data?.message || err.message;
      const msg = Array.isArray(raw) ? raw.join("، ") : raw;
      if (status === 409) setServerError(msg || "هذا الوقت محجوز مسبقاً للمدرب أو الطالب");
      else if (status === 404) setServerError(msg || "الطالب أو المدرب غير موجود");
      else if (status === 400) setServerError(msg || "بيانات الحجز غير صالحة");
      else setServerError(msg || "حدث خطأ أثناء إنشاء الحجز");
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
    <Modal title="حجز جلسة جديدة" onClose={onClose} t={t} width={560}>
      <StepIndicator step={step} t={t} />

      {successMsg && (
        <div style={{ background: "rgba(80,90,50,0.12)", border: "1px solid rgba(80,90,50,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#505a32", fontWeight: 600 }}>{successMsg}</div>
      )}
      {serverError && (
        <div style={{ background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c74848" }}>{serverError}</div>
      )}

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
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>جنس المدرب (اختياري)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => setGenderFilter("MALE")} style={chip(genderFilter === "MALE", false)}>ذكر</button>
              <button type="button" onClick={() => setGenderFilter("FEMALE")} style={chip(genderFilter === "FEMALE", false)}>أنثى</button>
            </div>
          </div>

          <button type="button" disabled={loadingSlots} onClick={handleShowSlots} style={{
            width: "100%", padding: "12px", borderRadius: 10, border: "none", fontFamily: "inherit",
            cursor: loadingSlots ? "not-allowed" : "pointer",
            background: loadingSlots ? t.textMuted : "#778a3b", color: "#fff", fontSize: 14, fontWeight: 700,
          }}>{loadingSlots ? "جارٍ تحميل الأوقات..." : "عرض الأوقات المتاحة"}</button>
        </div>
      )}

      {/* ════════ STEP 2: الموعد ════════ */}
      {step === 2 && (
        <div>
          {slots.length === 0 ? (
            <div style={{ padding: 30, textAlign: "center", color: t.textMuted, fontSize: 14 }}>لا توجد أوقات متاحة بهذه المعايير</div>
          ) : (
            <div style={{ maxHeight: 380, overflowY: "auto", paddingLeft: 4 }}>
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

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button type="button" disabled={checkingCredit} onClick={handleCheckCredit} style={{
              flex: 1, padding: "12px", borderRadius: 10, border: "none", fontFamily: "inherit",
              cursor: (!selectedTime || checkingCredit) ? "not-allowed" : "pointer",
              background: (!selectedTime || checkingCredit) ? t.textMuted : "#778a3b", color: "#fff", fontSize: 14, fontWeight: 700,
              opacity: !selectedTime ? 0.6 : 1,
            }}>{checkingCredit ? "جارٍ التحقق..." : "التحقق من العربون"}</button>
            <Btn label="رجوع" onClick={() => { setStep(1); setServerError(""); }} t={t} v="ghost" />
          </div>
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
          </div>

          {/* Credit / Amount */}
          {hasCredit ? (
            <div style={{ background: "rgba(80,90,50,0.1)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#505a32", fontWeight: 600 }}>
              الطالب لديه رصيد سابق — سيتم خصم العربون تلقائياً
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>مبلغ العربون المحصل</label>
              <input type="number" value={collectedAmount} onChange={e => { setCollectedAmount(e.target.value); setErrors(p => ({ ...p, collectedAmount: undefined })); }}
                placeholder="2000" dir="ltr" style={{ ...fieldStyle("collectedAmount"), textAlign: "left" }} />
              {errMsg("collectedAmount")}
            </div>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" disabled={submitting} onClick={handleSubmit} style={{
              flex: 1, padding: "12px", borderRadius: 10, border: "none", fontFamily: "inherit",
              cursor: submitting ? "not-allowed" : "pointer",
              background: submitting ? t.textMuted : "#778a3b", color: "#fff", fontSize: 14, fontWeight: 700,
            }}>{submitting ? "جارٍ الإنشاء..." : "إنشاء الحجز"}</button>
            <Btn label="رجوع" onClick={() => { setStep(2); setServerError(""); setSuccessMsg(""); }} t={t} v="ghost" />
          </div>
        </div>
      )}
    </Modal>
  );
}

function SectionBookings({ t }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("");
  const [search, setSearch] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [invModal, setInvModal] = useState(null);
  const [nsModal, setNsModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null);

  const extractBookings = (responseData) => {
    console.log("[Bookings] Raw response.data:", responseData);
    if (!responseData) return [];
    const body = responseData?.data ?? responseData;
    if (Array.isArray(body)) return body;
    if (body && typeof body === "object") {
      for (const key of ["items", "bookings", "results", "rows", "data"]) {
        if (Array.isArray(body[key])) return body[key];
      }
      const nested = body.data;
      if (nested && typeof nested === "object" && !Array.isArray(nested)) {
        for (const key of ["items", "bookings", "results", "rows"]) {
          if (Array.isArray(nested[key])) return nested[key];
        }
      }
    }
    return [];
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { page: 1, limit: 50 };
      if (tab) params.bookingStatus = tab;
      if (search.trim()) params.search = search.trim();
      const res = await bookingsService.getAll(params);
      setBookings(extractBookings(res.data));
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = { page: 1, limit: 50 };
        if (tab) params.bookingStatus = tab;
        if (search.trim()) params.search = search.trim();
        const res = await bookingsService.getAll(params);
        if (!cancelled) setBookings(extractBookings(res.data));
      } catch {
        if (!cancelled) setBookings([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [tab, search]);

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
    return {
      id: b.id,
      student,
      inst,
      vehicle,
      dateTime,
      type,
      status,
      pay,
      rawStatus: b.bookingStatus,
      rawPayment: b.paymentStatus,
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
    <div style={{ padding: "18px 22px", overflowY: "auto", flex: 1 }}>
      <div style={{ display: "flex", gap: 3, marginBottom: 14, background: t.bgElevated, borderRadius: 9, padding: 3, overflowX: "auto" }}>
        {BOOKING_STATUS_FILTER.map((f) => (
          <button key={f.value} onClick={() => setTab(f.value)} style={{
            padding: "7px 12px", borderRadius: 7, border: "none", cursor: "pointer",
            fontFamily: "inherit", fontSize: 11, fontWeight: tab === f.value ? 700 : 400,
            whiteSpace: "nowrap", background: tab === f.value ? t.bgSurface : "transparent",
            color: tab === f.value ? t.text : t.textMuted, boxShadow: tab === f.value ? t.shadow : "none",
          }}>{f.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <SearchBar placeholder="بحث باسم الطالب..." t={t} value={search} onChange={setSearch} />
        <Btn label="+ حجز جديد" onClick={() => setCreateModal(true)} t={t} />
      </div>

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
              <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                {b.rawStatus === "BOOKED" && b.rawPayment === "DEPOSIT_PAID" && (
                  <Btn label="دفع المتبقي" onClick={() => setInvModal(b)} t={t} sz="sm" />
                )}
                {b.rawStatus === "BOOKED" && (
                  <Btn label="لم يحضر" onClick={() => setNsModal(b)} t={t} sz="sm" v="danger" />
                )}
                <Btn label="تفاصيل" onClick={() => setDetailModal(b)} t={t} sz="sm" v="ghost" />
              </div>
            </div>
          </div>
        ))
      )}

      {createModal && (
        <CreateBookingModal t={t} onClose={() => setCreateModal(false)} onSuccess={() => { setCreateModal(false); fetchBookings(); }} />
      )}
      {invModal && <InvoiceModal booking={invModal} t={t} onClose={() => setInvModal(null)} />}
      {nsModal && (
        <Modal title="تأكيد: لم يحضر" onClose={() => setNsModal(null)} t={t} width={370}>
          <div style={{ padding: "10px 12px", borderRadius: 9, background: t.noshow.bg, marginBottom: 12, fontSize: 12, color: t.noshow.text }}>
            العربون غير مسترد — تُسجَّل الجلسة كـ No-Show
          </div>
          <InfoRow k="الطالب" v={nsModal.student} t={t} />
          <InfoRow k="الجلسة" v={nsModal.dateTime} t={t} />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Btn label="تأكيد No-Show" onClick={() => setNsModal(null)} t={t} v="danger" style={{ flex: 1 }} />
            <Btn label="إلغاء" onClick={() => setNsModal(null)} t={t} v="ghost" />
          </div>
        </Modal>
      )}
      {detailModal && (() => {
        const r = detailModal.raw;
        const vehicle = r.vehicleSource === "STUDENT_CAR"
          ? "سيارة الطالب"
          : (r.vehiclePlate || "—");
        const type = TRAINING_MAP[r.trainingType] || r.trainingType || "—";
        const payLabel = PAYMENT_STATUS_MAP[r.paymentStatus] || r.paymentStatus || "—";
        const statusLabel = BOOKING_STATUS_MAP[r.bookingStatus] || r.bookingStatus || "—";
        const dateStr = r.dayName && r.date
          ? `${r.dayName} ${r.date}`
          : r.date || "—";
        const timeStr = r.startTime && r.endTime
          ? `من ${r.startTime} إلى ${r.endTime}`
          : r.startTime || "—";
        const remaining = r.remainingAmount != null
          ? `${Number(r.remainingAmount).toLocaleString("ar-SY")} ل.س`
          : "—";

        const sectionTitle = (text) => (
          <div style={{
            fontSize: 13, fontWeight: 700, color: t.accent,
            paddingBottom: 6, marginBottom: 10, marginTop: 16,
            borderBottom: `2px solid ${t.accentLight}`,
          }}>{text}</div>
        );

        return (
          <Modal title={`تفاصيل الحجز كاملة #${r.id}`} onClose={() => setDetailModal(null)} t={t} width={480}>
            {sectionTitle("معلومات الطالب والمدرب")}
            <InfoRow k="اسم الطالب" v={r.studentName || detailModal.student} t={t} />
            <InfoRow k="اسم المدرب" v={r.instructorName || detailModal.inst} t={t} />

            {sectionTitle("تفاصيل التدريب والجدولة")}
            <InfoRow k="نوع التدريب" v={type} t={t} />
            <InfoRow k="تاريخ الجلسة" v={dateStr} t={t} />
            <InfoRow k="وقت الجلسة" v={timeStr} t={t} />
            <InfoRow k="المركبة" v={vehicle} t={t} />

            {sectionTitle("التفاصيل المالية")}
            <InfoRow k="حالة الدفع" v={payLabel} t={t} />
            <InfoRow k="حالة الحجز" v={statusLabel} t={t} />
            <InfoRow k="المبلغ المتبقي" v={remaining} t={t} />

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
                  {[["٨٣ لتر","هذا الشهر",t.accent],[`${sel.fm.toLocaleString()} ل.س`,"تكلفة الشهر",t.pending.text],["٣","عمليات تعبئة",t.text]].map(([v,l,c],i)=>(
                    <div key={i} style={{background:t.bgSurface,borderRadius:9,border:`1px solid ${t.borderCard}`,padding:12,textAlign:"center"}}>
                      <div style={{fontSize:18,fontWeight:700,color:c}}>{v}</div>
                      <div style={{fontSize:10,color:t.textMuted,marginTop:3}}>{l}</div>
                    </div>
                  ))}
                </div>
                {FUEL_LOG.map((f,i)=>(
                  <div key={i} style={{background:t.bgSurface,borderRadius:9,border:`1px solid ${t.borderCard}`,padding:"11px 14px",marginBottom:7}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:13,fontWeight:700,color:t.text}}>{f.date}</span><span style={{fontSize:13,fontWeight:700,color:t.accent}}>{f.total.toLocaleString()} ل.س</span></div>
                    <div style={{fontSize:12,color:t.textSec}}>{f.liters} لتر × {f.ppl} ل.س/لتر{f.note&&` • ${f.note}`}</div>
                  </div>
                ))}
              </div>
            )}
            {vTab==="stats"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[{l:"جلسات الشهر",v:sel.lm,max:60,c:t.accent},{l:"تكلفة الوقود/شهر",v:sel.fm,suf:" ل.س",c:t.pending.text},{l:"تكلفة الصيانة/شهر",v:sel.maint,suf:" ل.س",c:t.cancelled.text},{l:"معدل التوفر",v:93,suf:"٪",c:t.completed.text}].map((s,i)=>(
                  <Card key={i} t={t} p={16} mb={0}>
                    <div style={{fontSize:20,fontWeight:700,color:s.c}}>{typeof s.v==="number"?s.v.toLocaleString():s.v}{s.suf||""}</div>
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
        {liters&&ppl&&<div style={{padding:"10px 12px",borderRadius:9,background:t.accentLight,marginBottom:10,display:"flex",justifyContent:"space-between",fontSize:13}}><span style={{color:t.accentText}}>الإجمالي</span><span style={{fontWeight:700,color:t.accent}}>{(parseFloat(liters)*parseFloat(ppl)).toLocaleString()} ل.س</span></div>}
        <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>ملاحظة</label><input type="text" placeholder="اختيارية" style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}}/></div>
        <div style={{display:"flex",gap:8}}><Btn label="✓ حفظ وإصدار فاتورة" onClick={()=>setFModal(false)} t={t} style={{flex:1}}/><Btn label="إلغاء" onClick={()=>setFModal(false)} t={t} v="ghost"/></div>
      </Modal>}
    </div>
  );
}

const TRANSPORT_SERVICES=[
  {id:1,type:"محاضرات نظرية",label:"المحاضرات الإجبارية الثلاث",date:"١٥–١٧ يونيو",assembly:"٧:٣٠ ص",dest:"مركز المحاضرات الوطني",price:2000,days:3},
  {id:2,type:"يوم الامتحان",label:"نقل يوم الامتحان الحكومي",date:"٢٥ يونيو",assembly:"٨:٠٠ ص",dest:"مركز الاختبارات",price:800,days:1},
];
const TRANSPORT_STUDENTS=[
  {id:1,name:"نورا الأحمد",d1:"حضر",d2:"حضر",d3:"—",paid:true,sid:1},
  {id:2,name:"كريم عبدو",d1:"حضر",d2:"لم يحضر",d3:"—",paid:true,sid:1},
  {id:3,name:"سعيد المحمد",d1:"حضر",d2:"—",d3:"—",paid:true,sid:1},
  {id:4,name:"لمى الزعبي",d1:"لم يحضر",d2:"—",d3:"—",paid:true,sid:1},
  {id:5,name:"باسل الخطيب",d1:"حضر",d2:"—",d3:"—",paid:true,sid:2},
  {id:6,name:"رنا سليمان",d1:"—",d2:"—",d3:"—",paid:false,sid:2},
];

function SectionTransport({t}){
  const [sel,setSel]=useState(TRANSPORT_SERVICES[0]);
  const [addModal,setAddModal]=useState(false);
  const students=TRANSPORT_STUDENTS.filter(s=>s.sid===sel?.id);
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div
        style={{
          width: 280,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          borderLeft: `1px solid ${t.border}`,
        }}
      >
        <div
          style={{
            padding: "12px 12px 8px",
            borderBottom: `1px solid ${t.border}`,
            fontSize: 12,
            fontWeight: 700,
            color: t.text,
          }}
        >
          خدمات النقل النشطة
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {TRANSPORT_SERVICES.map((s) => (
            <div
              key={s.id}
              onClick={() => setSel(s)}
              style={{
                padding: "13px 12px",
                borderRadius: 10,
                marginBottom: 7,
                cursor: "pointer",
                background: sel?.id === s.id ? t.accentLight : t.bgSurface,
                border: `1px solid ${sel?.id === s.id ? t.accent : t.borderCard}`,
              }}
            >
              <div style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                <span style={{ fontSize: 18 }}>
                  {s.type === "محاضرات نظرية" ? "" : ""}
                </span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: t.text }}>
                    {s.label}
                  </div>
                  <div
                    style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}
                  >
                    {s.date}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                }}
              >
                <span style={{ color: t.textSec }}>
                  {TRANSPORT_STUDENTS.filter((st) => st.sid === s.id).length}{" "}
                  مسجل
                </span>
                <span style={{ fontWeight: 700, color: t.accent }}>
                  {s.price.toLocaleString()} ل.س
                </span>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{ padding: "10px 10px", borderTop: `1px solid ${t.border}` }}
        >
          <Btn
            label="+ إضافة خدمة نقل"
            onClick={() => setAddModal(true)}
            t={t}
            sz="sm"
            style={{ width: "100%" }}
          />
        </div>
      </div>
      {sel && (
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: t.text }}>
                {sel.label}
              </div>
              <div style={{ fontSize: 12, color: t.textSec, marginTop: 4 }}>
                <IoIosCalendar /> {sel.date} • ⏰ {sel.assembly} • 📍 {sel.dest}
              </div>
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 19, fontWeight: 800, color: t.accent }}>
                {sel.price.toLocaleString()} ل.س
              </div>
              <div style={{ fontSize: 10, color: t.textMuted }}>
                رسوم التسجيل
              </div>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 9,
              marginBottom: 14,
            }}
          >
            {[
              { l: "مسجلون", v: students.length, c: t.accent },
              {
                l: "دفعوا",
                v: students.filter((s) => s.paid).length,
                c: t.completed.text,
              },
              {
                l: "لم يدفعوا",
                v: students.filter((s) => !s.paid).length,
                c: t.pending.text,
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: t.bgSurface,
                  borderRadius: 9,
                  border: `1px solid ${t.borderCard}`,
                  padding: 12,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 700, color: s.c }}>
                  {s.v}
                </div>
                <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3 }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
          <Card t={t} p={0} style={{ overflow: "hidden" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ background: t.bgElevated }}>
                  {[
                    "الطالب",
                    ...(sel.type === "محاضرات نظرية"
                      ? ["اليوم ١", "اليوم ٢", "اليوم ٣"]
                      : ["يوم الامتحان"]),
                    "الدفع",
                    "إجراء",
                  ].map((h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: "9px 13px",
                        textAlign: "right",
                        color: t.textMuted,
                        fontWeight: 600,
                        fontSize: 11,
                        borderBottom: `1px solid ${t.border}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr
                    key={i}
                    style={{
                      background: i % 2 === 0 ? t.bgSurface : t.bgList,
                      borderBottom: `1px solid ${t.border}`,
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 13px",
                        fontWeight: 600,
                        color: t.text,
                      }}
                    >
                      {s.name}
                    </td>
                    {sel.type === "محاضرات نظرية" ? (
                      <>
                        <td style={{ padding: "10px 13px" }}>
                          {s.d1 !== "—" ? (
                            <Badge
                              s={s.d1 === "حضر" ? "حضر" : "لم يحضر"}
                              t={t}
                            />
                          ) : (
                            <span style={{ color: t.textMuted }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: "10px 13px" }}>
                          {s.d2 !== "—" ? (
                            <Badge
                              s={s.d2 === "حضر" ? "حضر" : "لم يحضر"}
                              t={t}
                            />
                          ) : (
                            <span style={{ color: t.textMuted }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: "10px 13px" }}>
                          <span style={{ color: t.textMuted }}>—</span>
                        </td>
                      </>
                    ) : (
                      <td style={{ padding: "10px 13px" }}>
                        {s.d1 !== "—" ? (
                          <Badge s={s.d1 === "حضر" ? "حضر" : "لم يحضر"} t={t} />
                        ) : (
                          <span style={{ color: t.textMuted }}>—</span>
                        )}
                      </td>
                    )}
                    <td style={{ padding: "10px 13px" }}>
                      <Badge s={s.paid ? "مدفوع" : "معلق"} t={t} />
                    </td>
                    <td style={{ padding: "10px 13px" }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        {!s.paid && <Btn label="تم الدفع" t={t} sz="sm" />}
                        <Btn label="لم يأتِ" t={t} sz="sm" v="danger" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
      {addModal && (
        <Modal
          title="إضافة خدمة نقل جديدة"
          onClose={() => setAddModal(false)}
          t={t}
          width={460}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {[
              {
                l: "نوع الخدمة",
                type: "select",
                opts: ["محاضرات نظرية إجبارية", "يوم الامتحان الحكومي"],
              },
              { l: "تاريخ الرحلة", type: "date" },
              { l: "وقت التجمع", type: "time" },
              { l: "رسوم التسجيل (ل.س)", type: "number", ph: "0" },
            ].map((f, i) => (
              <div key={i}>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: t.textSec,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {f.l}
                </label>
                {f.type === "select" ? (
                  <select
                    style={{
                      width: "100%",
                      padding: "8px 9px",
                      borderRadius: 8,
                      border: `1px solid ${t.border}`,
                      background: t.bgElevated,
                      color: t.text,
                      fontSize: 12,
                      fontFamily: "inherit",
                    }}
                  >
                    {f.opts.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    placeholder={f.ph}
                    style={{
                      width: "100%",
                      padding: "8px 9px",
                      borderRadius: 8,
                      border: `1px solid ${t.border}`,
                      background: t.bgElevated,
                      color: t.text,
                      fontSize: 12,
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: t.textSec,
                display: "block",
                marginBottom: 4,
              }}
            >
              الوجهة / المركز
            </label>
            <input
              type="text"
              style={{
                width: "100%",
                padding: "8px 9px",
                borderRadius: 8,
                border: `1px solid ${t.border}`,
                background: t.bgElevated,
                color: t.text,
                fontSize: 13,
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Btn
              label="✓ إنشاء خدمة النقل"
              onClick={() => setAddModal(false)}
              t={t}
              style={{ flex: 1 }}
            />
            <Btn
              label="إلغاء"
              onClick={() => setAddModal(false)}
              t={t}
              v="ghost"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

const CERT_STATUS_MAP = {
  WAITING_FOR_TRAINING_SCHEDULE: { label: "بانتظار التدريب", tk: "pending" },
  IN_GOVERNMENT_TRAINING:        { label: "في التدريب", tk: "inprogress" },
  WAITING_FOR_PRACTICAL_EXAM:    { label: "بانتظار العملي", tk: "qualified" },
  WAITING_FOR_THEORETICAL_EXAM:  { label: "بانتظار النظري", tk: "confirmed" },
  COMPLETED:                     { label: "مكتمل", tk: "completed" },
  FAILED:                        { label: "راسب", tk: "failed" },
  CANCELLED:                     { label: "ملغي", tk: "cancelled" },
};
const CERT_STEP_LABELS = ["بانتظار التدريب", "في التدريب", "بانتظار الامتحان", "مكتمل"];
const CERT_STATUS_OPTS = [
  { value: "", label: "الكل" },
  { value: "WAITING_FOR_TRAINING_SCHEDULE", label: "بانتظار التدريب" },
  { value: "IN_GOVERNMENT_TRAINING", label: "في التدريب" },
  { value: "WAITING_FOR_PRACTICAL_EXAM", label: "بانتظار العملي" },
  { value: "WAITING_FOR_THEORETICAL_EXAM", label: "بانتظار النظري" },
  { value: "COMPLETED", label: "مكتمل" },
  { value: "FAILED", label: "راسب" },
  { value: "CANCELLED", label: "ملغي" },
];

function CertBadge({s,t}){
  const m=CERT_STATUS_MAP[s]||{label:s||"—",tk:"expired"};
  const c=t[m.tk]||t.expired;
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,background:c.bg,color:c.text,padding:"2px 9px",borderRadius:20,fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}><span style={{width:6,height:6,borderRadius:"50%",background:c.dot,flexShrink:0}}/>{m.label}</span>;
}

function SectionCertificate({t}){
  const [certs,setCerts]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [fStatus,setFStatus]=useState("");
  const [sel,setSel]=useState(null);

  const [cancelModal,setCancelModal]=useState(null);
  const [cancelReason,setCancelReason]=useState("");
  const [cancelBusy,setCancelBusy]=useState(false);

  const [courseModal,setCourseModal]=useState(null);
  const [courseNum,setCourseNum]=useState("");
  const [courseBusy,setCourseBusy]=useState(false);

  const [sessionsModal,setSessionsModal]=useState(null);
  const [sessionDates,setSessionDates]=useState(["","",""]);
  const [sessionsBusy,setSessionsBusy]=useState(false);

  const [examModal,setExamModal]=useState(null);
  const [examDate,setExamDate]=useState("");
  const [examBusy,setExamBusy]=useState(false);

  const [resultModal,setResultModal]=useState(null);
  const [resultBusy,setResultBusy]=useState(false);

  const [exportBusy,setExportBusy]=useState(false);

  const cName=(c)=>c?.student?.name||c?.studentName||"—";
  const cPhone=(c)=>c?.student?.phoneNumber||c?.student?.phone||"—";

  const loadCerts=async()=>{
    try{
      const params={};
      if(fStatus)params.status=fStatus;
      if(search.trim())params.search=search.trim();
      const res=await certificatesService.getAll(params);
      const body=res.data?.data??res.data;
      const arr=Array.isArray(body)?body:(body?.data||body?.certificates||[]);
      setCerts(arr);
      setSel(prev=>prev?(arr.find(c=>c.id===prev.id)||null):(arr[0]||null));
    }catch{setCerts([]);setSel(null);}
  };

  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      setLoading(true);
      try{
        const params={};
        if(fStatus)params.status=fStatus;
        if(search.trim())params.search=search.trim();
        const res=await certificatesService.getAll(params);
        const body=res.data?.data??res.data;
        const arr=Array.isArray(body)?body:(body?.data||body?.certificates||[]);
        if(!cancelled){setCerts(arr);setSel(prev=>prev?(arr.find(c=>c.id===prev.id)||null):(arr[0]||null));}
      }catch{if(!cancelled){setCerts([]);setSel(null);}}
      finally{if(!cancelled)setLoading(false);}
    })();
    return()=>{cancelled=true;};
  },[search,fStatus]);

  const certStepIdx=(c)=>{
    if(!c)return -1;
    if(c.status==="COMPLETED")return 3;
    if(c.status==="WAITING_FOR_PRACTICAL_EXAM"||c.status==="WAITING_FOR_THEORETICAL_EXAM")return 2;
    if(c.status==="IN_GOVERNMENT_TRAINING")return 1;
    return 0;
  };

  const handleCancel=async()=>{
    if(!cancelModal||!cancelReason.trim())return;
    setCancelBusy(true);
    try{
      await certificatesService.cancel(cancelModal.id,{reason:cancelReason});
      setCancelModal(null);setCancelReason("");
      await loadCerts();
    }catch(e){alert(e.response?.data?.message||"حدث خطأ");}
    finally{setCancelBusy(false);}
  };

  const handleAssignCourse=async()=>{
    if(!courseModal||!courseNum.trim())return;
    setCourseBusy(true);
    try{
      await certificatesService.assignCourseNumber({certificateIds:[courseModal.id],courseNumber:courseNum.trim()});
      setCourseModal(null);setCourseNum("");
      await loadCerts();
    }catch(e){alert(e.response?.data?.message||"حدث خطأ");}
    finally{setCourseBusy(false);}
  };

  const handleScheduleSessions=async()=>{
    if(!sessionsModal)return;
    const sessions=sessionDates.map((d,i)=>({sessionNumber:i+1,scheduledAt:d?new Date(d).toISOString():null})).filter(s=>s.scheduledAt);
    if(!sessions.length)return;
    setSessionsBusy(true);
    try{
      await certificatesService.setTrainingSessions(sessionsModal.id,{sessions});
      setSessionsModal(null);setSessionDates(["","",""]);
      await loadCerts();
    }catch(e){alert(e.response?.data?.message||"حدث خطأ");}
    finally{setSessionsBusy(false);}
  };

  const handleScheduleExam=async()=>{
    if(!examModal||!examDate)return;
    setExamBusy(true);
    try{
      await certificatesService.setExamSchedule(examModal.id,{scheduledAt:new Date(examDate).toISOString()});
      setExamModal(null);setExamDate("");
      await loadCerts();
    }catch(e){alert(e.response?.data?.message||"حدث خطأ");}
    finally{setExamBusy(false);}
  };

  const handleRecordResult=async(examType,result)=>{
    if(!resultModal)return;
    setResultBusy(true);
    try{
      await certificatesService.recordExamResult(resultModal.id,{examType,attemptNumber:1,result});
      setResultModal(null);
      await loadCerts();
    }catch(e){alert(e.response?.data?.message||"حدث خطأ");}
    finally{setResultBusy(false);}
  };

  const handleExport=async(format)=>{
    setExportBusy(true);
    try{
      const ids=sel?[sel.id]:certs.map(c=>c.id);
      const res=await certificatesService.exportFile({format,certificateIds:ids});
      const url=URL.createObjectURL(new Blob([res.data]));
      const a=document.createElement("a");
      a.href=url;a.download=`certificates.${format}`;a.click();
      URL.revokeObjectURL(url);
    }catch(e){alert(e.response?.data?.message||"حدث خطأ في التصدير");}
    finally{setExportBusy(false);}
  };

  const canCancel=(c)=>c&&!["COMPLETED","CANCELLED"].includes(c.status);
  const si=certStepIdx(sel);

  return(
    <div style={{display:"flex",height:"100%"}}>
      {/* List panel */}
      <div style={{width:290,flexShrink:0,display:"flex",flexDirection:"column",borderLeft:`1px solid ${t.border}`}}>
        <div style={{padding:"10px 10px 7px",borderBottom:`1px solid ${t.border}`,display:"flex",flexDirection:"column",gap:7}}>
          <SearchBar placeholder="بحث باسم الطالب..." t={t} value={search} onChange={setSearch}/>
          <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
            {CERT_STATUS_OPTS.map(opt=>(
              <button key={opt.value} onClick={()=>setFStatus(opt.value)} style={{padding:"3px 8px",borderRadius:20,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:10,fontWeight:fStatus===opt.value?700:400,background:fStatus===opt.value?t.accent:"transparent",color:fStatus===opt.value?"#fff":t.textMuted}}>{opt.label}</button>
            ))}
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {loading?(
            <div style={{padding:24,textAlign:"center",color:t.textMuted,fontSize:13}}>جاري التحميل...</div>
          ):certs.length===0?(
            <div style={{padding:24,textAlign:"center",color:t.textMuted,fontSize:13}}>لا توجد شهادات</div>
          ):certs.map(c=>(
            <div key={c.id} onClick={()=>setSel(c)} style={{padding:"11px 12px",cursor:"pointer",borderBottom:`1px solid ${t.border}`,background:sel?.id===c.id?t.accentLight:t.bgSurface,borderRight:sel?.id===c.id?`3px solid ${t.accent}`:"3px solid transparent"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:600,color:t.text}}>{cName(c)}</span>
                <CertBadge s={c.status} t={t}/>
              </div>
              <div style={{fontSize:11,color:t.textMuted}}>
                {c.courseNumber?`دورة: ${c.courseNumber}`:"بدون رقم دورة"} • {c.category||"—"} {c.transmissionType==="AUTOMATIC"?"أوتوماتيك":c.transmissionType==="MANUAL"?"يدوي":""}
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:"10px",borderTop:`1px solid ${t.border}`,display:"flex",gap:6}}>
          <Btn label={exportBusy?"...":"↓ PDF"} onClick={()=>handleExport("pdf")} t={t} sz="sm" v="secondary" disabled={exportBusy} style={{flex:1}}/>
          <Btn label={exportBusy?"...":"↓ Excel"} onClick={()=>handleExport("xlsx")} t={t} sz="sm" v="ghost" disabled={exportBusy} style={{flex:1}}/>
        </div>
      </div>

      {/* Detail panel */}
      {sel?(
        <div style={{flex:1,overflowY:"auto",padding:"20px 22px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div>
              <div style={{fontSize:17,fontWeight:700,color:t.text}}>{cName(sel)}</div>
              <div style={{marginTop:5}}><CertBadge s={sel.status} t={t}/></div>
            </div>
            <div style={{display:"flex",gap:7}}>
              {canCancel(sel)&&<Btn label="إلغاء الشهادة" onClick={()=>setCancelModal(sel)} t={t} sz="sm" v="danger"/>}
            </div>
          </div>

          <Card t={t} p={18} mb={14}>
            <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:14}}>مسار الشهادة</div>
            <div style={{display:"flex",alignItems:"center"}}>
              {CERT_STEP_LABELS.map((step,i)=>{
                const done=i<=si;
                return(
                  <div key={step} style={{flex:1,display:"flex",alignItems:"center"}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:"0 0 auto",minWidth:70}}>
                      <div style={{width:26,height:26,borderRadius:"50%",background:done?t.grad:t.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700,boxShadow:i===si?`0 0 0 3px ${t.accent}40`:"none"}}>{done?"✓":i+1}</div>
                      <div style={{fontSize:9,color:done?t.accentText:t.textMuted,marginTop:4,textAlign:"center",lineHeight:1.3}}>{step}</div>
                    </div>
                    {i<CERT_STEP_LABELS.length-1&&<div style={{flex:1,height:2,background:i<si?t.accent:t.border,margin:"0 3px",marginBottom:18}}/>}
                  </div>
                );
              })}
            </div>
          </Card>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Card t={t} p={14}>
              <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:8}}>تفاصيل الشهادة</div>
              <InfoRow k="اسم الطالب" v={cName(sel)} t={t}/>
              <InfoRow k="هاتف" v={cPhone(sel)} t={t}/>
              <InfoRow k="الفئة" v={sel.category||"—"} t={t}/>
              <InfoRow k="ناقل الحركة" v={sel.transmissionType==="AUTOMATIC"?"أوتوماتيك":sel.transmissionType==="MANUAL"?"يدوي":"—"} t={t}/>
              <InfoRow k="رقم الدورة" v={sel.courseNumber||"غير مُعيَّن"} t={t}/>
              <InfoRow k="خدمة النقل" v={sel.transportRequested?"مطلوبة":"غير مطلوبة"} t={t}/>
              {sel.trainingSessions?.length>0&&(
                <div style={{marginTop:8}}>
                  <div style={{fontSize:11,color:t.textMuted,fontWeight:600,marginBottom:4}}>جلسات التدريب الحكومي:</div>
                  {sel.trainingSessions.map((s,i)=>(
                    <div key={i} style={{fontSize:11,color:t.text,padding:"2px 0"}}>جلسة {s.sessionNumber}: {s.scheduledAt?new Date(s.scheduledAt).toLocaleDateString("ar-SY"):"—"}</div>
                  ))}
                </div>
              )}
              {sel.examSchedule&&(
                <InfoRow k="موعد الامتحان" v={new Date(sel.examSchedule.scheduledAt).toLocaleDateString("ar-SY")} t={t}/>
              )}
            </Card>
            <Card t={t} p={14}>
              <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:8}}>الإجراءات المتاحة</div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {sel.status==="WAITING_FOR_TRAINING_SCHEDULE"&&(<>
                  <Btn label="تعيين رقم الدورة" onClick={()=>{setCourseModal(sel);setCourseNum(sel.courseNumber||"");}} t={t} sz="sm" style={{width:"100%"}}/>
                  <Btn label="جدولة جلسات التدريب" onClick={()=>setSessionsModal(sel)} t={t} sz="sm" v="secondary" style={{width:"100%"}}/>
                </>)}
                {sel.status==="IN_GOVERNMENT_TRAINING"&&(<>
                  <Btn label="جدولة موعد الامتحان" onClick={()=>setExamModal(sel)} t={t} sz="sm" style={{width:"100%"}}/>
                  <Btn label="تسجيل نتيجة الامتحان" onClick={()=>setResultModal(sel)} t={t} sz="sm" v="secondary" style={{width:"100%"}}/>
                </>)}
                {(sel.status==="WAITING_FOR_PRACTICAL_EXAM"||sel.status==="WAITING_FOR_THEORETICAL_EXAM")&&(<>
                  <Btn label="جدولة موعد الامتحان" onClick={()=>setExamModal(sel)} t={t} sz="sm" v="secondary" style={{width:"100%"}}/>
                  <Btn label="تسجيل نتيجة الامتحان" onClick={()=>setResultModal(sel)} t={t} sz="sm" style={{width:"100%"}}/>
                </>)}
                {sel.status==="COMPLETED"&&<div style={{padding:"9px 12px",borderRadius:8,background:t.completed.bg,fontSize:12,color:t.completed.text,fontWeight:600}}>🎉 اكتملت الشهادة — يمكن للطالب استلامها</div>}
                {sel.status==="FAILED"&&<div style={{padding:"9px 12px",borderRadius:8,background:t.failed.bg,fontSize:12,color:t.failed.text,fontWeight:600}}>✗ راسب — يمكن إعادة الامتحان</div>}
                {sel.status==="CANCELLED"&&<div style={{padding:"9px 12px",borderRadius:8,background:t.cancelled.bg,fontSize:12,color:t.cancelled.text,fontWeight:600}}>ملغية — لا يمكن إجراء أي تعديل</div>}
              </div>
              {sel.examResults?.length>0&&(
                <div style={{marginTop:12}}>
                  <div style={{fontSize:11,color:t.textMuted,fontWeight:600,marginBottom:4}}>نتائج الامتحانات:</div>
                  {sel.examResults.map((r,i)=>(
                    <div key={i} style={{fontSize:11,color:t.text,padding:"2px 0",display:"flex",justifyContent:"space-between"}}>
                      <span>{r.examType==="PRACTICAL"?"عملي":"نظري"} — محاولة {r.attemptNumber}</span>
                      <span style={{fontWeight:600,color:r.result==="PASS"?t.completed.text:r.result==="FAIL"?t.failed.text:t.pending.text}}>{r.result==="PASS"?"ناجح":r.result==="FAIL"?"راسب":"غائب"}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      ):(
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:t.textMuted,fontSize:14}}>
          {loading?"جاري التحميل...":"اختر شهادة من القائمة"}
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal&&<Modal title="إلغاء الشهادة" onClose={()=>setCancelModal(null)} t={t} width={420}>
        <InfoRow k="الطالب" v={cName(cancelModal)} t={t}/>
        <div style={{marginBottom:14,marginTop:10}}>
          <label style={{fontSize:12,fontWeight:600,color:t.textSec,display:"block",marginBottom:5}}>سبب الإلغاء</label>
          <textarea value={cancelReason} onChange={e=>setCancelReason(e.target.value)} rows={3} placeholder="أدخل سبب الإلغاء..." style={{width:"100%",padding:"9px 10px",borderRadius:9,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",outline:"none",resize:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn label={cancelBusy?"جاري الإلغاء...":"✓ تأكيد الإلغاء"} onClick={handleCancel} t={t} v="danger" disabled={cancelBusy||!cancelReason.trim()} style={{flex:1}}/>
          <Btn label="إلغاء" onClick={()=>setCancelModal(null)} t={t} v="ghost"/>
        </div>
      </Modal>}

      {/* Assign Course Number Modal */}
      {courseModal&&<Modal title="تعيين رقم الدورة" onClose={()=>setCourseModal(null)} t={t} width={380}>
        <InfoRow k="الطالب" v={cName(courseModal)} t={t}/>
        <div style={{margin:"12px 0"}}>
          <label style={{fontSize:12,fontWeight:600,color:t.textSec,display:"block",marginBottom:5}}>رقم الدورة</label>
          <input value={courseNum} onChange={e=>setCourseNum(e.target.value)} placeholder="مثال: 181" style={{width:"100%",padding:"9px 10px",borderRadius:9,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn label={courseBusy?"جاري الحفظ...":"✓ حفظ"} onClick={handleAssignCourse} t={t} disabled={courseBusy||!courseNum.trim()} style={{flex:1}}/>
          <Btn label="إلغاء" onClick={()=>setCourseModal(null)} t={t} v="ghost"/>
        </div>
      </Modal>}

      {/* Training Sessions Modal */}
      {sessionsModal&&<Modal title="جدولة جلسات التدريب الحكومي" onClose={()=>setSessionsModal(null)} t={t} width={440}>
        <InfoRow k="الطالب" v={cName(sessionsModal)} t={t}/>
        <div style={{marginTop:12}}>
          {["الجلسة الأولى","الجلسة الثانية","الجلسة الثالثة"].map((label,i)=>(
            <div key={i} style={{marginBottom:10}}>
              <label style={{fontSize:12,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>{label}</label>
              <input type="datetime-local" value={sessionDates[i]} onChange={e=>{const d=[...sessionDates];d[i]=e.target.value;setSessionDates(d);}} style={{width:"100%",padding:"8px 10px",borderRadius:9,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn label={sessionsBusy?"جاري الحفظ...":"✓ حفظ الجلسات"} onClick={handleScheduleSessions} t={t} disabled={sessionsBusy} style={{flex:1}}/>
          <Btn label="إلغاء" onClick={()=>setSessionsModal(null)} t={t} v="ghost"/>
        </div>
      </Modal>}

      {/* Exam Schedule Modal */}
      {examModal&&<Modal title="جدولة موعد الامتحان" onClose={()=>setExamModal(null)} t={t} width={380}>
        <InfoRow k="الطالب" v={cName(examModal)} t={t}/>
        <div style={{margin:"12px 0"}}>
          <label style={{fontSize:12,fontWeight:600,color:t.textSec,display:"block",marginBottom:5}}>موعد الامتحان</label>
          <input type="datetime-local" value={examDate} onChange={e=>setExamDate(e.target.value)} style={{width:"100%",padding:"8px 10px",borderRadius:9,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn label={examBusy?"جاري الحفظ...":"✓ حفظ الموعد"} onClick={handleScheduleExam} t={t} disabled={examBusy||!examDate} style={{flex:1}}/>
          <Btn label="إلغاء" onClick={()=>setExamModal(null)} t={t} v="ghost"/>
        </div>
      </Modal>}

      {/* Exam Result Modal */}
      {resultModal&&<Modal title="تسجيل نتيجة الامتحان" onClose={()=>setResultModal(null)} t={t} width={420}>
        <InfoRow k="الطالب" v={cName(resultModal)} t={t}/>
        <InfoRow k="نوع الامتحان" v={resultModal.status==="WAITING_FOR_PRACTICAL_EXAM"?"عملي":resultModal.status==="WAITING_FOR_THEORETICAL_EXAM"?"نظري":"—"} t={t}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,margin:"14px 0"}}>
          {[{label:"✓ ناجح",res:"PASS",style:{border:`2px solid ${t.completed.dot}`,background:t.completed.bg,color:t.completed.text}},{label:"✗ راسب",res:"FAIL",style:{border:`2px solid ${t.failed.dot}`,background:t.failed.bg,color:t.failed.text}},{label:"غائب",res:"ABSENT",style:{border:`2px solid ${t.pending.dot}`,background:t.pending.bg,color:t.pending.text}}].map(btn=>(
            <button key={btn.res} onClick={()=>handleRecordResult(resultModal.status==="WAITING_FOR_PRACTICAL_EXAM"?"PRACTICAL":"THEORY",btn.res)} disabled={resultBusy} style={{padding:"16px",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",opacity:resultBusy?0.5:1,...btn.style}}>{btn.label}</button>
          ))}
        </div>
        <div style={{padding:"9px 12px",borderRadius:9,background:t.accentLight,fontSize:11,color:t.accentText}}>💡 سيُحدَّث وضع الشهادة تلقائياً بعد تسجيل النتيجة</div>
      </Modal>}
    </div>
  );
}

const NAV = [
  { id: "students", label: "إدارة الطلاب", icon: <PiUsersThin /> },
  { id: "instructors", label: "إدارة المدربين", icon: <FaUserTie /> },
  { id: "bookings", label: "الحجوزات", icon: <IoIosCalendar /> },
  { id: "vehicles", label: "المركبات", icon: <FaCar /> },
  { id: "transport", label: "خدمة النقل", icon: <TbBus /> },
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
    students:<SectionStudents t={t}/>,
    instructors:<SectionInstructors t={t}/>,
    bookings:<SectionBookings t={t}/>,
    vehicles:<SectionVehicles t={t}/>,
    transport:<SectionTransport t={t}/>,
    certificate:<SectionCertificate t={t}/>,
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
