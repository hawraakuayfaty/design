import { useState, useEffect } from "react";
import { TbReportMoney } from "react-icons/tb";
import { FaUserTie } from "react-icons/fa";
import { PiChartLineDown } from "react-icons/pi";
import { generalExpensesService } from "./api";
import { FiTrash2 } from "react-icons/fi";



const T = {
  light: {
    bgApp: "#F8F9F5",
    bgSurface: "#FFFFFF",
    bgElevated: "#EEF2E4",
    bgList: "#F5F7F0",
    bgSidebar: "linear-gradient(180deg,#778A3B 0%,#6B7C35 52%,#5F702D 100%)",
    bgSidebarActive: "#5F702D",
    text: "#1C1F18",
    textSec: "#4F5548",
    textMuted: "#747A70",
    textSidebar: "#F8F9F5",
    textSidebarActive: "#FFFFFF",
    border: "#DDE1D7",
    borderCard: "rgba(119,138,59,0.14)",
    accent: "#715317",
    accentLight: "#EEF2E4",
    accentText: "#715317",
    grad: "linear-gradient(135deg,#778A3B 0%,#5F702D 100%)",
    confirmed: { bg: "rgba(119,138,59,0.12)", text: "#5F702D", dot: "#778A3B" },
    pending: { bg: "rgba(201,138,40,0.14)", text: "#C98A28", dot: "#C98A28" },
    cancelled: { bg: "rgba(199,72,72,0.12)", text: "#C74848", dot: "#C74848" },
    completed: { bg: "rgba(63,107,58,0.14)", text: "#3F6B3A", dot: "#3F6B3A" },
    noshow: { bg: "rgba(199,72,72,0.12)", text: "#C74848", dot: "#C74848" },
    expired: { bg: "rgba(183,189,178,0.16)", text: "#747A70", dot: "#B7BDB2" },
    shadow: "0 12px 28px rgba(119,138,59,0.10)",
    shadowMd: "0 14px 32px rgba(119,138,59,0.12)",
    shadowLg: "0 20px 48px rgba(119,138,59,0.16)",
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
    expired: { bg: "rgba(161,161,170,0.14)", text: "#A1A1AA", dot: "#A1A1AA" },
    shadow: "0 12px 28px rgba(0,0,0,0.40)",
    shadowMd: "0 14px 32px rgba(0,0,0,0.44)",
    shadowLg: "0 20px 48px rgba(0,0,0,0.50)",
  },
};

function Card({children,t,p=16,mb=10,style={}}){return <div style={{background:t.bgSurface,borderRadius:12,border:`1px solid ${t.borderCard}`,padding:p,marginBottom:mb,boxShadow:t.shadow,...style}}>{children}</div>;}
function Modal({title,onClose,children,t,width=500}){return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(2px)"}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:t.bgSurface,borderRadius:16,width,maxWidth:"calc(100vw - 40px)",maxHeight:"85vh",overflow:"hidden",boxShadow:t.shadowLg,display:"flex",flexDirection:"column"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:`1px solid ${t.border}`}}><div style={{fontSize:16,fontWeight:700,color:t.text}}>{title}</div><button onClick={onClose} style={{width:28,height:28,borderRadius:7,border:"none",background:t.bgElevated,cursor:"pointer",fontSize:16,color:t.textMuted}}>✕</button></div><div style={{padding:"18px 20px",overflowY:"auto"}}>{children}</div></div></div>;}
function Btn({label,onClick,v="primary",sz="md",t,style={}}){const base={padding:sz==="sm"?"4px 11px":"9px 18px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:sz==="sm"?12:14,fontWeight:600,transition:"all 0.15s"};const vs={primary:{background:t.grad,color:"#fff"},secondary:{background:t.accentLight,color:t.accentText,border:`1px solid ${t.accent}30`},danger:{background:"#FFF1F2",color:"#9F1239",border:"1px solid #FECDD3"},ghost:{background:"transparent",color:t.textSec,border:`1px solid ${t.border}`}};return <button onClick={onClick} style={{...base,...vs[v],...style}}>{label}</button>;}
function InfoRow({k,v,t,bold=false}){return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${t.border}`,fontSize:13}}><span style={{color:t.textMuted}}>{k}</span><span style={{fontWeight:bold?700:600,color:bold?t.accent:t.text}}>{v}</span></div>;}
function Stat({label,value,color,sub,t}){return <Card t={t} p={14} mb={0}><div style={{fontSize:24,fontWeight:700,color,lineHeight:1,marginBottom:3}}>{value}</div><div style={{fontSize:12,fontWeight:600,color:t.text}}>{label}</div>{sub&&<div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{sub}</div>}</Card>;}

// ─── FINANCIAL DASHBOARD ───
function PgDash({t}){
  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: t.textMuted,
          marginBottom: 8,
        }}
      >
        {" "}
        اليوم
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <Stat
          label="إيرادات اليوم"
          value="٤,٥٠٠ ل.س"
          color={t.accent}
          sub="٣ دروس مدفوعة"
          t={t}
        />
        <Stat
          label="مصاريف اليوم"
          value="١,٢٠٠ ل.س"
          color="#b91c1c"
          sub="وقود أ·ب·ج ١٠١"
          t={t}
        />
        <Stat
          label="صافي اليوم"
          value="٣,٣٠٠ ل.س"
          color={t.accent}
          sub="تقديري"
          t={t}
        />
        <Stat
          label="إثباتات معلقة"
          value="٣"
          color={t.accent}
          sub="تحتاج تحققك"
          t={t}
        />
      </div>
      <div
        style={{
          fontSize: 14,
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
        <Stat label="الإيرادات" value="١٢٠,٠٠٠ ل.س" color={t.accent} t={t} />
        <Stat label="المصاريف" value="٣٥,٠٠٠ ل.س" color="#b91c1c" t={t} />
        <Stat label="صافي الربح" value="٨٥,٠٠٠ ل.س" color={t.accent} t={t} />
        <Stat
          label="مستحقات مدربين"
          value="١٨,٠٠٠ ل.س"
          color={t.accent}
          t={t}
        />
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
            إثباتات الدفع المعلقة
          </div>
          {[
            {
              name: "سارة خالد",
              amount: "١,٥٠٠ ل.س",
              booking: "#١٢٤٧",
              method: "شام كاش",
              time: "منذ ٥ دق",
            },
            {
              name: "علي حسن",
              amount: "١,٥٠٠ ل.س",
              booking: "#١٢٤٨",
              method: "شام كاش",
              time: "منذ ١٢ دق",
            },
            {
              name: "كريم عبدو",
              amount: "١,٥٠٠ ل.س",
              booking: "#١٢٣٩",
              method: "شام كاش",
              time: "منذ ٣٠ دق",
            },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                padding: "11px 0",
                borderBottom: `1px solid ${t.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 3,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>
                  {p.name}
                </span>
                <span
                  style={{ fontSize: 13, fontWeight: 700, color: t.accent }}
                >
                  {p.amount}
                </span>
              </div>
              <div
                style={{ fontSize: 11, color: t.textMuted, marginBottom: 7 }}
              >
                {p.booking} • {p.method} • {p.time}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn
                  label="✓ قبول وتأكيد الحجز"
                  t={t}
                  sz="sm"
                  style={{ flex: 1 }}
                />
                <Btn label="✕ رفض" t={t} sz="sm" v="danger" />
              </div>
            </div>
          ))}
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card t={t} p={14}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: t.text,
                marginBottom: 8,
              }}
            >
              ملخص مالي سريع
            </div>
            {[
              ["عربونات مستلمة اليوم", "٣,٠٠٠ ل.س", t.accent],
              ["مبالغ متبقية مستلمة", "١,٥٠٠ ل.س", t.accent],
              ["وقود مدفوع اليوم", "١,٢٠٠ ل.س", "#b91c1c"],
              ["مستحقات مدربين اليوم", "٤,٣٥٠ ل.س", "#92400E"],
            ].map(([k, v, c]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px 0",
                  borderBottom: `1px solid ${t.border}`,
                  fontSize: 11,
                }}
              >
                <span style={{ color: t.textMuted }}>{k}</span>
                <span style={{ fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
          </Card>
          <Card t={t} p={14}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: t.text,
                marginBottom: 8,
              }}
            >
              ضريبة الشهر
            </div>
            {[
              ["الدخل الخاضع للضريبة", "٨٥,٠٠٠ ل.س"],
              ["نسبة الضريبة", "٢٠٪"],
              ["الضريبة المستحقة", "١٧,٠٠٠ ل.س"],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px 0",
                  borderBottom: `1px solid ${t.border}`,
                  fontSize: 11,
                }}
              >
                <span style={{ color: t.textMuted }}>{k}</span>
                <span
                  style={{
                    fontWeight: 600,
                    color: k === "الضريبة المستحقة" ? "#b91c1c" : t.text,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
            <button
              style={{
                marginTop: 8,
                width: "100%",
                padding: "7px",
                borderRadius: 7,
                background: t.pending.bg,
                color: t.pending.text,
                border: "none",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              تسجيل دفع الضريبة
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENT VERIFICATION ───
function PgPayments({t}){
  const [tab,setTab]=useState("pending");
  const [showCash,setShowCash]=useState(false);
  return(
    <div style={{padding:"20px 24px",overflowY:"auto",flex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:20,fontWeight:700,color:t.text}}>التحقق من الدفعات</div>
        <Btn label="+ تسجيل دفعة نقدية" onClick={()=>setShowCash(true)} t={t}/>
      </div>
      <div style={{display:"flex",gap:4,marginBottom:16,background:t.bgElevated,borderRadius:9,padding:3}}>
        {[["pending","بانتظار التحقق","٣"],["verified","مقبولة"],["rejected","مرفوضة"]].map(([id,label,count])=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"7px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:tab===id?700:400,background:tab===id?t.bgSurface:"transparent",color:tab===id?t.text:t.textMuted,boxShadow:tab===id?t.shadow:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
            {label}{count&&<span style={{padding:"1px 6px",borderRadius:20,fontSize:9,fontWeight:700,background:"#EF4444",color:"#fff"}}>{count}</span>}
          </button>
        ))}
      </div>
      {tab==="pending"&&(
        <div>
          {[{id:"#٥٠٢",student:"سارة خالد يوسف",booking:"#١٢٤٧",amount:"١,٥٠٠",method:"شام كاش",type:"عربون درس",time:"٤ يونيو ١٠:١٥"},{id:"#٥٠٣",student:"علي حسن محمود",booking:"#١٢٤٨",amount:"١,٥٠٠",method:"شام كاش",type:"عربون درس",time:"٤ يونيو ١١:٢٠"},{id:"#٥٠٤",student:"كريم عبدو",booking:"#١٢٣٩",amount:"١,٥٠٠",method:"شام كاش",type:"عربون درس",time:"٤ يونيو ٠٩:٣٠"}].map(p=>(
            <Card key={p.id} t={t} p={16} mb={10}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
                <div><div style={{fontSize:11,color:t.textMuted,marginBottom:2}}>الطالب</div><div style={{fontSize:13,fontWeight:600,color:t.text}}>{p.student}</div><div style={{fontSize:11,color:t.textMuted}}>حجز {p.booking}</div></div>
                <div><div style={{fontSize:11,color:t.textMuted,marginBottom:2}}>المبلغ</div><div style={{fontSize:20,fontWeight:700,color:t.accent}}>{p.amount} ل.س</div><div style={{fontSize:11,color:t.textMuted}}>{p.method} • {p.type}</div></div>
                <div><div style={{fontSize:11,color:t.textMuted,marginBottom:2}}>الوقت</div><div style={{fontSize:12,color:t.text}}>{p.time}</div></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:10,marginBottom:10}}>
                <div style={{borderRadius:8,border:`1px solid ${t.border}`,height:72,background:t.bgElevated,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                  <div style={{textAlign:"center",color:t.textMuted,fontSize:11}}>🖼️<div style={{fontSize:9,marginTop:2}}>صورة الإثبات</div></div>
                </div>
                <textarea placeholder="ملاحظة القبول أو الرفض (اختيارية)..." style={{padding:"8px 10px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:11,fontFamily:"inherit",resize:"none",outline:"none"}}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn label="✓ قبول وتأكيد الحجز" t={t} style={{flex:1}}/>
                <Btn label="✕ رفض الإثبات" t={t} v="danger"/>
              </div>
            </Card>
          ))}
        </div>
      )}
      {tab==="verified"&&(
        <div style={{borderRadius:10,border:`1px solid ${t.border}`,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:t.bgElevated}}>{["#","الطالب","الحجز","المبلغ","النوع","الطريقة","التاريخ"].map((h,i)=><th key={i} style={{padding:"9px 12px",textAlign:"right",color:t.textMuted,fontWeight:600,fontSize:11,borderBottom:`1px solid ${t.border}`}}>{h}</th>)}</tr></thead>
            <tbody>
              {[["#٥٠١","أحمد محمد","#١٢٤٥","١,٥٠٠ ل.س","عربون درس","نقدي","٤ يونيو"],["#٤٩٨","نورا الأحمد","—","٥,٠٠٠ ل.س","رسوم شهادة","نقدي","١ مايو"]].map((row,ri)=>(
                <tr key={ri} style={{background:ri%2===0?t.bgSurface:t.bgList,borderBottom:`1px solid ${t.border}`}}>
                  {row.map((c,ci)=><td key={ci} style={{padding:"9px 12px",color:t.text}}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab==="rejected"&&(
        <div style={{padding:"24px",textAlign:"center",color:t.textMuted,fontSize:13}}>لا توجد دفعات مرفوضة حديثاً</div>
      )}
      {showCash&&<Modal title="تسجيل دفعة نقدية" onClose={()=>setShowCash(false)} t={t} width={460}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          {[{l:"الطالب",type:"select",opts:["اختر طالباً...","أحمد محمد","سارة خالد","علي حسن"]},{l:"نوع الدفعة",type:"select",opts:["عربون درس","باقي مبلغ درس","رسوم شهادة حكومية","رسوم نقل","رسوم إعادة فحص","أخرى"]},{l:"المبلغ (ل.س)",type:"number",ph:"0"},{l:"الحجز المرتبط",type:"select",opts:["لا يرتبط بحجز","#١٢٤٦","#١٢٤٧","#١٢٤٨"]}].map((f,i)=>(
            <div key={i}><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>{f.l}</label>
            {f.type==="select"?<select style={{width:"100%",padding:"8px 9px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:12,fontFamily:"inherit"}}>{f.opts.map(o=><option key={o}>{o}</option>)}</select>
            :<input type={f.type} placeholder={f.ph} style={{width:"100%",padding:"8px 9px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:12,fontFamily:"inherit",boxSizing:"border-box"}}/>}</div>
          ))}
        </div>
        <div style={{padding:"9px 12px",borderRadius:9,background:t.accentLight,fontSize:11,color:t.accentText,marginBottom:12}}>💡 الدفع النقدي يؤكد الحجز فوراً ويولد فاتورة تلقائياً</div>
        <div style={{display:"flex",gap:8}}><Btn label="✓ تسجيل وإصدار فاتورة" onClick={()=>setShowCash(false)} t={t} style={{flex:1}}/><Btn label="إلغاء" onClick={()=>setShowCash(false)} t={t} v="ghost"/></div>
      </Modal>}
    </div>
  );
}

// ─── INVOICES ───
function PgInvoices({t}){
  const [issueModal,setIssueModal]=useState(false);
  const [viewModal,setViewModal]=useState(null);
  const invoices=[
    {id:"F-0245",student:"أحمد محمد",booking:"#١٢٤٥",type:"درس كامل",deposit:"١,٥٠٠ ل.س (شام كاش)",remaining:"١,٥٠٠ ل.س (نقدي)",total:"٣,٠٠٠ ل.س",date:"٤ يونيو"},
    {id:"F-0240",student:"نورا الأحمد",booking:"—",type:"شهادة حكومية",deposit:"—",remaining:"٥,٠٠٠ ل.س (نقدي)",total:"٥,٠٠٠ ل.س",date:"١ مايو"},
    {id:"F-0235",student:"محمود سالم",booking:"#١٢٣٠",type:"درس كامل",deposit:"١,٥٠٠ ل.س (نقدي)",remaining:"١,٥٠٠ ل.س (نقدي)",total:"٣,٠٠٠ ل.س",date:"٣٠ مايو"},
    {id:"F-0230",student:"كريم عبدو",booking:"—",type:"رسوم نقل",deposit:"—",remaining:"٢,٠٠٠ ل.س (نقدي)",total:"٢,٠٠٠ ل.س",date:"٢٠ مايو"},
  ];
  return(
    <div style={{padding:"20px 24px",overflowY:"auto",flex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:20,fontWeight:700,color:t.text}}>الفواتير</div>
        <Btn label="+ إصدار فاتورة" onClick={()=>setIssueModal(true)} t={t}/>
      </div>
      <div style={{padding:"10px 12px",borderRadius:9,background:t.accentLight,marginBottom:14,fontSize:12,color:t.accentText}}>
        💡 كل جلسة فاتورة واحدة تجمع الدفعتين: العربون (شام كاش) + الباقي (نقدي) — مخزنة في قاعدة البيانات
      </div>
      <div style={{borderRadius:11,border:`1px solid ${t.border}`,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:t.bgElevated}}>{["# الفاتورة","الطالب","نوع الدفع","العربون","الباقي","الإجمالي","التاريخ",""].map((h,i)=><th key={i} style={{padding:"9px 12px",textAlign:"right",color:t.textMuted,fontWeight:600,fontSize:11,borderBottom:`1px solid ${t.border}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {invoices.map((inv,ri)=>(
              <tr key={ri} style={{background:ri%2===0?t.bgSurface:t.bgList,borderBottom:`1px solid ${t.border}`}}>
                <td style={{padding:"10px 12px",fontWeight:700,color:t.accent}}>{inv.id}</td>
                <td style={{padding:"10px 12px",fontWeight:600,color:t.text}}>{inv.student}</td>
                <td style={{padding:"10px 12px",color:t.textSec}}>{inv.type}</td>
                <td style={{padding:"10px 12px",color:t.completed.text,fontWeight:600}}>{inv.deposit}</td>
                <td style={{padding:"10px 12px",color:t.pending.text,fontWeight:600}}>{inv.remaining}</td>
                <td style={{padding:"10px 12px",fontWeight:700,color:t.text}}>{inv.total}</td>
                <td style={{padding:"10px 12px",color:t.textMuted}}>{inv.date}</td>
                <td style={{padding:"10px 12px"}}><Btn label="عرض" onClick={()=>setViewModal(inv)} t={t} sz="sm" v="ghost"/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {issueModal&&<Modal title="إصدار فاتورة جديدة" onClose={()=>setIssueModal(false)} t={t} width={460}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          {[{l:"الطالب",type:"select",opts:["اختر...","أحمد محمد","سارة خالد"]},{l:"نوع الدفعة",type:"select",opts:["درس كامل (عربون + باقي)","رسوم شهادة حكومية","رسوم نقل","باقي مبلغ درس فقط","أخرى"]},{l:"العربون المدفوع (شام كاش)",type:"number",ph:"0"},{l:"الباقي المدفوع (نقدي)",type:"number",ph:"0"}].map((f,i)=>(
            <div key={i}><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>{f.l}</label>
            {f.type==="select"?<select style={{width:"100%",padding:"8px 9px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:12,fontFamily:"inherit"}}>{f.opts.map(o=><option key={o}>{o}</option>)}</select>
            :<input type={f.type} placeholder={f.ph} style={{width:"100%",padding:"8px 9px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:12,fontFamily:"inherit",boxSizing:"border-box"}}/>}</div>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}><Btn label="إصدار وحفظ" onClick={()=>setIssueModal(false)} t={t} style={{flex:1}}/><Btn label="إلغاء" onClick={()=>setIssueModal(false)} t={t} v="ghost"/></div>
      </Modal>}
      {viewModal&&<Modal title={`فاتورة ${viewModal.id}`} onClose={()=>setViewModal(null)} t={t} width={420}>
        <div style={{background:t.bgElevated,borderRadius:10,overflow:"hidden",marginBottom:14}}>
          <div style={{background:t.grad,padding:"14px 18px",textAlign:"center"}}><div style={{fontSize:13,fontWeight:700,color:"#383636"}}> مدرسة القيادة — {viewModal.id}</div></div>
          <div style={{padding:"14px 16px"}}>
            <InfoRow k="الطالب" v={viewModal.student} t={t}/><InfoRow k="نوع الدفع" v={viewModal.type} t={t}/>
            <InfoRow k="العربون" v={viewModal.deposit} t={t}/><InfoRow k="الباقي" v={viewModal.remaining} t={t}/>
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",fontSize:15,fontWeight:700}}><span style={{color:t.text}}>الإجمالي</span><span style={{color:t.accent}}>{viewModal.total}</span></div>
          </div>
        </div>
        <Btn label="🖨️ طباعة" t={t} style={{width:"100%"}}/>
      </Modal>}
    </div>
  );
}

// ─── INSTRUCTOR PAYROLL ───
function PgPayroll({t}){
  const [sel,setSel]=useState(null);
  const [payModal,setPayModal]=useState(null);
  const [bonus,setBonus]=useState("");
  const [deduct,setDeduct]=useState("");
  const instructors=[
    {name:"خالد عمر",sessions:[{id:"#١٢٤٥",date:"٤ يونيو",time:"٠٩:٠٠",type:"عادي",fee:500},{id:"#١٢٤٦",date:"٤ يونيو",time:"١٢:٠٠",type:"عادي",fee:500},{id:"#١٢٤٧",date:"٤ يونيو",time:"١٥:٣٠",type:"عادي",fee:500}],base:1500},
    {name:"ليلى سعد",sessions:[{id:"#١٢٤٨",date:"٤ يونيو",time:"١٠:٣٠",type:"أوتوماتيك",fee:500},{id:"#١٢٤٩",date:"٤ يونيو",time:"١٤:٠٠",type:"أوتوماتيك",fee:500}],base:1000},
    {name:"أحمد الزيد",sessions:[{id:"#١٢٤٣",date:"٣ يونيو",time:"١٤:٠٠",type:"عادي",fee:450}],base:450},
    {name:"ماهر العلي",sessions:[{id:"#١٢٤٤",date:"٢ يونيو",time:"١١:٠٠",type:"عادي",fee:450}],base:450},
  ];
  // calcTotal removed (unused)
  return(
    <div style={{display:"flex",height:"100%"}}>
      <div style={{width:280,flexShrink:0,display:"flex",flexDirection:"column",borderLeft:`1px solid ${t.border}`}}>
        <div style={{padding:"12px 12px 8px",borderBottom:`1px solid ${t.border}`,fontSize:12,fontWeight:700,color:t.text}}>مستحقات المدربين — اليوم</div>
        <div style={{flex:1,overflowY:"auto"}}>
          {instructors.map((inst,i)=>(
            <div key={i} onClick={()=>{setSel(inst);setBonus("");setDeduct("");}} style={{padding:"13px 12px",cursor:"pointer",borderBottom:`1px solid ${t.border}`,background:sel?.name===inst.name?t.accentLight:t.bgSurface,borderRight:sel?.name===inst.name?`3px solid ${t.accent}`:"3px solid transparent"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:600,color:t.text}}>{inst.name}</span>
                <span style={{fontSize:13,fontWeight:700,color:t.accent}}>{inst.base.toLocaleString()} ل.س</span>
              </div>
              <div style={{fontSize:11,color:t.textMuted}}>{inst.sessions.length} جلسات غير مدفوعة</div>
            </div>
          ))}
        </div>
        <div style={{padding:"10px 12px",borderTop:`1px solid ${t.border}`,background:t.bgElevated}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:8}}><span style={{color:t.textMuted}}>إجمالي مستحق</span><span style={{fontWeight:700,color:t.accent}}>٣,٤٠٠ ل.س</span></div>
          <Btn label="صرف الكل دفعة واحدة" t={t} sz="sm" style={{width:"100%"}}/>
        </div>
      </div>
      {sel?(
        <div style={{flex:1,overflowY:"auto",padding:"20px 22px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:16,fontWeight:700,color:t.text}}>مستحقات {sel.name}</div>
            <Btn label="✓ صرف المستحقات" onClick={()=>setPayModal(sel)} t={t}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
            {[{l:"إجمالي الجلسات",v:sel.sessions.length,c:t.text},{l:"المستحق الأساسي",v:`${sel.base.toLocaleString()} ل.س`,c:t.accent},{l:"جلسات هذا الشهر",v:"٤٢",c:t.text}].map((s,i)=>(
              <div key={i} style={{background:t.bgSurface,borderRadius:9,border:`1px solid ${t.borderCard}`,padding:12,textAlign:"center"}}>
                <div style={{fontSize:18,fontWeight:700,color:s.c}}>{s.v}</div>
                <div style={{fontSize:10,color:t.textMuted,marginTop:3}}>{s.l}</div>
              </div>
            ))}
          </div>
          <Card t={t} p={0} style={{overflow:"hidden",marginBottom:14}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:t.bgElevated}}>{["رقم الحجز","التاريخ","الوقت","نوع التدريب","أجر الجلسة"].map((h,i)=><th key={i} style={{padding:"8px 12px",textAlign:"right",color:t.textMuted,fontWeight:600,fontSize:11,borderBottom:`1px solid ${t.border}`}}>{h}</th>)}</tr></thead>
              <tbody>
                {sel.sessions.map((s,i)=>(
                  <tr key={i} style={{background:i%2===0?t.bgSurface:t.bgList,borderBottom:`1px solid ${t.border}`}}>
                    <td style={{padding:"8px 12px",fontWeight:600,color:t.accent}}>{s.id}</td>
                    <td style={{padding:"8px 12px",color:t.text}}>{s.date}</td>
                    <td style={{padding:"8px 12px",color:t.text}}>{s.time}</td>
                    <td style={{padding:"8px 12px",color:t.text}}>{s.type}</td>
                    <td style={{padding:"8px 12px",fontWeight:700,color:t.accent}}>{s.fee} ل.س</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      ):(
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:t.textMuted,fontSize:13}}>اختر مدرباً لعرض جلساته غير المدفوعة</div>
      )}
      {payModal&&<Modal title={`صرف مستحقات ${payModal.name}`} onClose={()=>setPayModal(null)} t={t} width={440}>
        <div style={{background:t.bgElevated,borderRadius:10,padding:14,marginBottom:14}}>
          <InfoRow k="إجمالي الجلسات" v={`${payModal.sessions.length} جلسات`} t={t}/>
          <InfoRow k="المستحق الأساسي" v={`${payModal.base.toLocaleString()} ل.س`} t={t}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"10px 0"}}>
            {[{l:"زيادة (ل.س)",v:bonus,set:setBonus},{l:"حسم (ل.س)",v:deduct,set:setDeduct}].map((f,i)=>(
              <div key={i}><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>{f.l}</label><input value={f.v} onChange={e=>f.set(e.target.value)} type="number" placeholder="0" style={{width:"100%",padding:"7px 9px",borderRadius:7,border:`1px solid ${t.border}`,background:t.bgSurface,color:t.text,fontSize:12,fontFamily:"inherit",boxSizing:"border-box"}}/></div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"9px 0",fontSize:15,fontWeight:700,borderTop:`1px solid ${t.border}`,marginTop:4}}>
            <span style={{color:t.text}}>الإجمالي المدفوع</span>
            <span style={{color:t.accent}}>{(payModal.base+(parseFloat(bonus)||0)-(parseFloat(deduct)||0)).toLocaleString()} ل.س</span>
          </div>
        </div>
        <div style={{padding:"9px 12px",borderRadius:9,background:t.accentLight,fontSize:11,color:t.accentText,marginBottom:14}}>💡 ستُولَّد فاتورة بالجلسات المدفوعة وتُخزَّن في قاعدة البيانات</div>
        <div style={{display:"flex",gap:8}}><Btn label="✓ صرف وإصدار فاتورة" onClick={()=>setPayModal(null)} t={t} style={{flex:1}}/><Btn label="إلغاء" onClick={()=>setPayModal(null)} t={t} v="ghost"/></div>
      </Modal>}
    </div>
  );
}

// ─── REVENUES & EXPENSES ───
function PgRevenues({t}){
  const [tab,setTab]=useState("revenues");
  const [addModal,setAddModal]=useState(null);
  const revenues=[["عربون درس","أحمد محمد","#١٢٤٥","١,٥٠٠ ل.س","شام كاش","٤ يونيو"],["باقي الدرس","أحمد محمد","#١٢٤٥","١,٥٠٠ ل.س","نقدي","٤ يونيو"],["رسوم شهادة","نورا الأحمد","—","٥,٠٠٠ ل.س","نقدي","١ مايو"],["رسوم نقل","كريم عبدو","—","٢,٠٠٠ ل.س","نقدي","٢٠ مايو"]];
  const expenses=[["مستحقات مدرب","خالد عمر","—","١,٥٠٠ ل.س","نقدي","٤ يونيو"],["وقود","أ·ب·ج ١٠١","—","١,٢٠٠ ل.س","نقدي","٤ يونيو"],["صيانة","أ·ب·ج ١٠٢","—","٣,٠٠٠ ل.س","تحويل","٢ يونيو"],["ضريبة شهرية","—","—","١٧,٠٠٠ ل.س","تحويل","١ مايو"]];
  const data=tab==="revenues"?revenues:expenses;
  const headers=tab==="revenues"?["النوع","الطالب","الحجز","المبلغ","الطريقة","التاريخ"]:["النوع","المرتبط بـ","الحجز","المبلغ","الطريقة","التاريخ"];
  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 3,
            background: t.bgElevated,
            borderRadius: 9,
            padding: 3,
          }}
        >
          {[
            ["revenues", "الإيرادات"],
            ["expenses", "المصاريف"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                padding: "7px 18px",
                borderRadius: 7,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: tab === id ? 700 : 400,
                background: tab === id ? t.bgSurface : "transparent",
                color: tab === id ? t.text : t.textMuted,
                boxShadow: tab === id ? t.shadow : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <Btn
          label={tab === "revenues" ? "+ إيراد جديد" : "+ مصروف جديد"}
          onClick={() => setAddModal(tab)}
          t={t}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10,
          marginBottom: 14,
        }}
      >
        {(tab === "revenues"
          ? [
              { l: "إجمالي الشهر", v: "١٢٠,٠٠٠", c: t.accent },
              { l: "عربونات دروس", v: "٤٥,٠٠٠", c: t.accent },
              { l: "مبالغ دروس", v: "٤٨,٠٠٠", c: t.accent },
              { l: "خدمات أخرى", v: "٢٧,٠٠٠", c: t.accent },
            ]
          : [
              { l: "إجمالي الشهر", v: "٣٥,٠٠٠", c: "#b91c1c" },
              { l: "مستحقات مدربين", v: "١٨,٠٠٠", c: t.accent },
              { l: "وقود وصيانة", v: "١٠,٠٠٠", c: t.accent },
              { l: "ضريبة رسمية", v: "١٧,٠٠٠", c: "#b91c1c" },
            ]
        ).map((s, i) => (
          <div
            key={i}
            style={{
              background: t.bgSurface,
              borderRadius: 10,
              border: `1px solid ${t.borderCard}`,
              padding: 14,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: s.c }}>
              {s.v} ل.س
            </div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 3 }}>
              {s.l}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          borderRadius: 10,
          border: `1px solid ${t.border}`,
          overflow: "hidden",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
        >
          <thead>
            <tr style={{ background: t.bgElevated }}>
              {headers.map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: "9px 12px",
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
            {data.map((row, ri) => (
              <tr
                key={ri}
                style={{
                  background: ri % 2 === 0 ? t.bgSurface : t.bgList,
                  borderBottom: `1px solid ${t.border}`,
                }}
              >
                {row.map((c, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: "9px 12px",
                      fontWeight: ci === 3 ? 700 : 400,
                      color:
                        ci === 3
                          ? tab === "revenues"
                            ? t.accent
                            : "#b91c1c"
                          : t.text,
                    }}
                  >
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {addModal && (
        <Modal
          title={addModal === "revenues" ? "إضافة إيراد" : "إضافة مصروف"}
          onClose={() => setAddModal(null)}
          t={t}
          width={440}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 10,
            }}
          >
            {(addModal === "revenues"
              ? [
                  {
                    l: "نوع الإيراد",
                    type: "select",
                    opts: [
                      "عربون درس",
                      "باقي مبلغ درس",
                      "رسوم شهادة",
                      "رسوم نقل",
                      "رسوم إعادة فحص",
                      "أخرى",
                    ],
                  },
                  { l: "المبلغ (ل.س)", type: "number" },
                  {
                    l: "الطالب",
                    type: "select",
                    opts: ["—", "أحمد محمد", "سارة خالد"],
                  },
                  {
                    l: "طريقة الدفع",
                    type: "select",
                    opts: ["نقدي", "شام كاش", "أخرى"],
                  },
                ]
              : [
                  {
                    l: "نوع المصروف",
                    type: "select",
                    opts: [
                      "مستحقات مدرب",
                      "وقود",
                      "صيانة",
                      "إيجار",
                      "كهرباء",
                      "ضريبة رسمية",
                      "أخرى",
                    ],
                  },
                  { l: "المبلغ (ل.س)", type: "number" },
                  {
                    l: "مرتبط بـ",
                    type: "select",
                    opts: ["—", "خالد عمر", "أ·ب·ج ١٠١", "عام"],
                  },
                  {
                    l: "طريقة الدفع",
                    type: "select",
                    opts: ["نقدي", "تحويل", "شام كاش"],
                  },
                ]
            ).map((f, i) => (
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
                    type="number"
                    placeholder="0"
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
          <div style={{ display: "flex", gap: 8 }}>
            <Btn
              label="✓ حفظ"
              onClick={() => setAddModal(null)}
              t={t}
              style={{ flex: 1 }}
            />
            <Btn
              label="إلغاء"
              onClick={() => setAddModal(null)}
              t={t}
              v="ghost"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── GENERAL EXPENSES ───
const EXP_TYPE_LIST=[
  {v:"WATER",       lbl:"ماء",            clr:"#2563EB"},
  {v:"ELECTRICITY", lbl:"كهرباء",         clr:"#D97706"},
  {v:"INTERNET",    lbl:"إنترنت",         clr:"#7C3AED"},
  {v:"KITCHEN",     lbl:"ضيافة ومطبخ",    clr:"#059669"},
  {v:"SUPPLIES",    lbl:"مستلزمات ومواد", clr:"#B45309"},
  {v:"OTHER",       lbl:"أخرى",           clr:"#6B7280"},
];
const EXP_TYPE_MAP=Object.fromEntries(EXP_TYPE_LIST.map(x=>[x.v,x]));
const SUM_KEYS=["water","electricity","internet","kitchen","supplies","other"];
const SUM_META={
  water:       {lbl:"ماء",            clr:"#2563EB"},
  electricity: {lbl:"كهرباء",         clr:"#D97706"},
  internet:    {lbl:"إنترنت",         clr:"#7C3AED"},
  kitchen:     {lbl:"ضيافة ومطبخ",    clr:"#059669"},
  supplies:    {lbl:"مستلزمات ومواد", clr:"#B45309"},
  other:       {lbl:"أخرى",           clr:"#6B7280"},
};
const PAY_LABEL={CASH:"نقداً",SHAM_CASH:"شام كاش"};
const _today=()=>new Date().toISOString().split("T")[0];
const _fom=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-01`;};
const fmtAmt=n=>(n!=null&&n!=="")?(Number(n).toLocaleString("ar-SY")):"—";

const inputSt=(t,err)=>({
  padding:"9px 12px",borderRadius:9,border:`1.5px solid ${err?`#c74848`:t.border}`,
  background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",
  boxSizing:"border-box",outline:"none",width:"100%",
});
const selectSt=(t)=>({
  padding:"8px 12px",borderRadius:9,border:`1.5px solid ${t.border}`,
  background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",
  boxSizing:"border-box",outline:"none",
});

function ExpTypeBadge({type,t}){
  const m=EXP_TYPE_MAP[type]||{lbl:type,clr:"#6B7280"};
  return <span style={{display:"inline-block",padding:"2px 10px",borderRadius:20,background:`${m.clr}18`,color:m.clr,fontSize:12,fontWeight:600}}>{m.lbl}</span>;
}

function PgGeneralExpenses({t}){
  // summary
  const [summary,setSummary]=useState(null);
  const [sumLoading,setSumLoading]=useState(true);
  const [sumFrom,setSumFrom]=useState(_fom());
  const [sumTo,setSumTo]=useState(_today());

  // list
  const [rows,setRows]=useState([]);
  const [meta,setMeta]=useState(null);
  const [totals,setTotals]=useState(null);
  const [listLoading,setListLoading]=useState(true);
  const [page,setPage]=useState(1);
  const LIMIT=15;

  // filters
  const [fType,setFType]=useState("");
  const [fMethod,setFMethod]=useState("");
  const [fFrom,setFFrom]=useState("");
  const [fTo,setFTo]=useState("");

  // refresh trigger
  const [refreshKey,setRefreshKey]=useState(0);
  const refresh=()=>setRefreshKey(k=>k+1);

  // add modal
  const emptyForm={type:"",amount:"",paymentMethod:"CASH",expenseDate:_today(),note:""};
  const [addOpen,setAddOpen]=useState(false);
  const [form,setForm]=useState(emptyForm);
  const [fErr,setFErr]=useState({});
  const [submitting,setSubmitting]=useState(false);

  // delete confirm
  const [delTarget,setDelTarget]=useState(null); // {expenseId, type, amount}
  const [deleting,setDeleting]=useState(false);

  // toast
  const [toast,setToast]=useState(null);
  const showToast=(msg,err=false)=>{setToast({msg,err});setTimeout(()=>setToast(null),3500);};

  // load summary
  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      setSumLoading(true);
      try{
        const res=await generalExpensesService.getSummary({from:sumFrom,to:sumTo});
        const body=res.data?.data??res.data;
        if(!cancelled)setSummary(body);
      }catch(e){
        if(!cancelled)showToast(e.response?.data?.message||"فشل تحميل الملخص",true);
      }finally{
        if(!cancelled)setSumLoading(false);
      }
    })();
    return()=>{cancelled=true;};
  },[sumFrom,sumTo,refreshKey]);

  // load list
  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      setListLoading(true);
      try{
        const params={page,limit:LIMIT};
        if(fType)params.type=fType;
        if(fMethod)params.paymentMethod=fMethod;
        if(fFrom)params.from=fFrom;
        if(fTo)params.to=fTo;
        const res=await generalExpensesService.getAll(params);
        const body=res.data?.data??res.data;
        if(!cancelled){
          setRows(Array.isArray(body?.data)?body.data:Array.isArray(body)?body:[]);
          setMeta(body?.meta||null);
          setTotals(body?.totals||null);
        }
      }catch(e){
        if(!cancelled)showToast(e.response?.data?.message||"فشل تحميل المصاريف",true);
      }finally{
        if(!cancelled)setListLoading(false);
      }
    })();
    return()=>{cancelled=true;};
  },[page,fType,fMethod,fFrom,fTo,refreshKey]);

  const handleAdd=async()=>{
    const errs={};
    if(!form.type)errs.type="النوع مطلوب";
    if(!form.amount||isNaN(Number(form.amount))||Number(form.amount)<=0)errs.amount="المبلغ مطلوب وأكبر من صفر";
    setFErr(errs);
    if(Object.keys(errs).length)return;
    setSubmitting(true);
    try{
      await generalExpensesService.create({
        type:form.type,
        amount:Number(form.amount),
        paymentMethod:form.paymentMethod,
        ...(form.expenseDate&&{expenseDate:form.expenseDate}),
        ...(form.note.trim()&&{note:form.note.trim()}),
      });
      setAddOpen(false);
      setForm(emptyForm);
      setFErr({});
      showToast("تمت إضافة المصروف بنجاح");
      refresh();
    }catch(e){
      const msg=e.response?.data?.message||e.message||"حدث خطأ";
      showToast(Array.isArray(msg)?msg.join("، "):msg,true);
    }finally{
      setSubmitting(false);
    }
  };

  const handleDelete=async()=>{
    if(!delTarget)return;
    setDeleting(true);
    try{
      await generalExpensesService.delete(delTarget.expenseId);
      setRows(prev=>prev.filter(r=>r.expenseId!==delTarget.expenseId));
      setDelTarget(null);
      showToast("تم حذف المصروف بنجاح");
      refresh();
    }catch(e){
      showToast(e.response?.data?.message||"فشل الحذف",true);
    }finally{
      setDeleting(false);
    }
  };

  const clearFilters=()=>{setFType("");setFMethod("");setFFrom("");setFTo("");setPage(1);};
  const hasFilters=fType||fMethod||fFrom||fTo;

  const thSt={padding:"10px 14px",fontSize:12,fontWeight:700,color:t.textSec,textAlign:"right",background:t.bgElevated,borderBottom:`1px solid ${t.border}`,whiteSpace:"nowrap"};
  const tdSt={padding:"11px 14px",fontSize:13,color:t.text,borderBottom:`1px solid ${t.border}`,verticalAlign:"middle"};

  return(
    <div style={{padding:"20px 24px",overflowY:"auto",flex:1,position:"relative"}}>
      {/* Toast */}
      {toast&&<div style={{position:"fixed",top:22,left:"50%",transform:"translateX(-50%)",zIndex:3000,background:toast.err?"#9F1239":"#3F6B3A",color:"#fff",padding:"11px 26px",borderRadius:12,fontSize:13,fontWeight:600,boxShadow:"0 8px 28px rgba(0,0,0,0.22)",whiteSpace:"nowrap",pointerEvents:"none"}}>{toast.msg}</div>}

      {/* Page header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <div style={{fontSize:20,fontWeight:700,color:t.text,marginBottom:2}}>المصاريف العامة</div>
          <div style={{fontSize:13,color:t.textMuted}}>تتبع وإدارة مصاريف المدرسة العامة</div>
        </div>
        <Btn label="+ إضافة مصروف جديد" onClick={()=>{setForm(emptyForm);setFErr({});setAddOpen(true);}} t={t}/>
      </div>

      {/* ── Summary section ── */}
      <div style={{background:t.bgSurface,borderRadius:12,border:`1px solid ${t.borderCard}`,padding:"14px 16px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:700,color:t.text}}>ملخص الفترة</div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:12,color:t.textMuted}}>من</span>
            <input type="date" value={sumFrom} onChange={e=>setSumFrom(e.target.value)} style={{...selectSt(t),width:"auto",fontSize:12,padding:"5px 8px"}}/>
            <span style={{fontSize:12,color:t.textMuted}}>إلى</span>
            <input type="date" value={sumTo} onChange={e=>setSumTo(e.target.value)} style={{...selectSt(t),width:"auto",fontSize:12,padding:"5px 8px"}}/>
          </div>
        </div>
        {sumLoading?(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:80,gap:10}}>
            <style>{`@keyframes acSpin{to{transform:rotate(360deg)}}`}</style>
            <div style={{width:26,height:26,borderRadius:"50%",border:`3px solid ${t.border}`,borderTopColor:t.accent,animation:"acSpin 0.85s linear infinite"}}/>
            <span style={{fontSize:12,color:t.textMuted}}>جارٍ التحميل...</span>
          </div>
        ):summary&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
              {[
                {lbl:"إجمالي المصاريف",val:summary.totalAmount,sub:`${summary.totalCount||0} مصروف`,clr:"#b91c1c"},
                {lbl:"نقداً",val:summary.cash,sub:"",clr:"#374151"},
                {lbl:"شام كاش",val:summary.shamCash,sub:"",clr:"#7C3AED"},
              ].map(c=>(
                <div key={c.lbl} style={{background:t.bgElevated,borderRadius:10,padding:"12px 14px"}}>
                  <div style={{fontSize:18,fontWeight:700,color:c.clr,lineHeight:1,marginBottom:3}}>{fmtAmt(c.val)} <span style={{fontSize:12,fontWeight:500}}>ل.س</span></div>
                  <div style={{fontSize:12,fontWeight:600,color:t.text}}>{c.lbl}</div>
                  {c.sub&&<div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{c.sub}</div>}
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
              {SUM_KEYS.map(k=>{
                const m=SUM_META[k];
                const d=summary.byType?.[k]||{amount:0,count:0};
                const amount=typeof d==="object"?d.amount:d;
                const count=typeof d==="object"?d.count:0;
                return(
                  <div key={k} style={{background:t.bgSurface,borderRadius:9,border:`1px solid ${t.borderCard}`,padding:"10px 10px 8px"}}>
                    <div style={{fontSize:10,fontWeight:700,color:m.clr,marginBottom:5,letterSpacing:0.3}}>{m.lbl}</div>
                    <div style={{fontSize:14,fontWeight:700,color:t.text}}>{fmtAmt(amount)}</div>
                    <div style={{fontSize:10,color:t.textMuted,marginTop:2}}>{count} مصروف</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Filters ── */}
      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:12}}>
        <input type="date" value={fFrom} onChange={e=>{setFFrom(e.target.value);setPage(1);}} style={{...selectSt(t),width:"auto",fontSize:12,padding:"7px 10px"}} title="من تاريخ"/>
        <input type="date" value={fTo} onChange={e=>{setFTo(e.target.value);setPage(1);}} style={{...selectSt(t),width:"auto",fontSize:12,padding:"7px 10px"}} title="إلى تاريخ"/>
        <select value={fType} onChange={e=>{setFType(e.target.value);setPage(1);}} style={{...selectSt(t),width:"auto"}}>
          <option value="">كل الأنواع</option>
          {EXP_TYPE_LIST.map(x=><option key={x.v} value={x.v}>{x.lbl}</option>)}
        </select>
        <select value={fMethod} onChange={e=>{setFMethod(e.target.value);setPage(1);}} style={{...selectSt(t),width:"auto"}}>
          <option value="">كل طرق الدفع</option>
          <option value="CASH">نقداً</option>
          <option value="SHAM_CASH">شام كاش</option>
        </select>
        {hasFilters&&<Btn label="مسح الفلاتر" onClick={clearFilters} t={t} v="ghost" sz="sm"/>}
      </div>

      {/* Filtered totals bar */}
      {totals&&hasFilters&&(
        <div style={{display:"flex",gap:16,padding:"9px 14px",borderRadius:9,background:t.accentLight,marginBottom:12,fontSize:13,flexWrap:"wrap"}}>
          <span style={{color:t.text,fontWeight:600}}>إجمالي الفلتر:</span>
          <span style={{color:"#b91c1c",fontWeight:700}}>{fmtAmt(totals.totalAmount)} ل.س</span>
          <span style={{color:t.textSec}}>نقداً: <strong>{fmtAmt(totals.totalCash)}</strong></span>
          <span style={{color:t.textSec}}>شام كاش: <strong>{fmtAmt(totals.totalShamCash)}</strong></span>
        </div>
      )}

      {/* ── Table ── */}
      <Card t={t} p={0} mb={12} style={{overflow:"hidden"}}>
        {listLoading?(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:120,gap:10}}>
            <div style={{width:26,height:26,borderRadius:"50%",border:`3px solid ${t.border}`,borderTopColor:t.accent,animation:"acSpin 0.85s linear infinite"}}/>
            <span style={{fontSize:12,color:t.textMuted}}>جارٍ تحميل المصاريف...</span>
          </div>
        ):rows.length===0?(
          <div style={{textAlign:"center",padding:"40px 20px",color:t.textMuted,fontSize:13}}>لا توجد مصاريف بهذه المعايير</div>
        ):(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr>
                  <th style={thSt}>#</th>
                  <th style={thSt}>النوع</th>
                  <th style={thSt}>المبلغ</th>
                  <th style={thSt}>طريقة الدفع</th>
                  <th style={thSt}>التاريخ</th>
                  <th style={thSt}>ملاحظات</th>
                  <th style={{...thSt,textAlign:"center"}}>حذف</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row=>(
                  <tr key={row.expenseId} style={{transition:"background 0.1s"}} onMouseEnter={e=>e.currentTarget.style.background=t.bgElevated} onMouseLeave={e=>e.currentTarget.style.background=""}>
                    <td style={{...tdSt,color:t.textMuted,fontSize:11}}>{row.expenseId}</td>
                    <td style={tdSt}><ExpTypeBadge type={row.type} t={t}/></td>
                    <td style={{...tdSt,fontWeight:700,color:"#b91c1c"}}>{fmtAmt(row.amount)} ل.س</td>
                    <td style={tdSt}>{PAY_LABEL[row.paymentMethod]||row.paymentMethod}</td>
                    <td style={{...tdSt,color:t.textSec}}>{row.expenseDate||row.paidAt?.split("T")[0]||"—"}</td>
                    <td style={{...tdSt,color:t.textMuted,maxWidth:180}}>{row.note||"—"}</td>
                    <td style={{...tdSt,textAlign:"center"}}>
                      <button onClick={()=>setDelTarget(row)} style={{background:"none",border:"none",cursor:"pointer",color:"#C74848",padding:"4px 6px",borderRadius:6,display:"flex",alignItems:"center"}}><FiTrash2 size={15}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ── Pagination ── */}
      {meta&&meta.totalPages>1&&(
        <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:12,flexWrap:"wrap"}}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${t.border}`,background:page===1?t.bgElevated:"transparent",color:page===1?t.textMuted:t.text,cursor:page===1?"default":"pointer",fontSize:13,fontFamily:"inherit"}}>السابق</button>
          {Array.from({length:meta.totalPages},(_,i)=>i+1).filter(p=>p===1||p===meta.totalPages||Math.abs(p-page)<=2).map((p,idx,arr)=>(
            <span key={p}>
              {idx>0&&arr[idx-1]!==p-1&&<span style={{padding:"6px 4px",color:t.textMuted}}>…</span>}
              <button onClick={()=>setPage(p)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${page===p?t.accent:t.border}`,background:page===p?t.grad:"transparent",color:page===p?"#fff":t.text,cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:page===p?700:400}}>{p}</button>
            </span>
          ))}
          <button onClick={()=>setPage(p=>Math.min(meta.totalPages,p+1))} disabled={page===meta.totalPages} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${t.border}`,background:page===meta.totalPages?t.bgElevated:"transparent",color:page===meta.totalPages?t.textMuted:t.text,cursor:page===meta.totalPages?"default":"pointer",fontSize:13,fontFamily:"inherit"}}>التالي</button>
        </div>
      )}

      {/* ── Add Expense Modal ── */}
      {addOpen&&(
        <Modal title="إضافة مصروف جديد" onClose={()=>{if(!submitting){setAddOpen(false);setFErr({});}}} t={t} width={460}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            {/* Type */}
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>نوع المصروف <span style={{color:"#c74848"}}>*</span></label>
              <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={{...inputSt(t,fErr.type),appearance:"auto"}}>
                <option value="">اختر النوع...</option>
                {EXP_TYPE_LIST.map(x=><option key={x.v} value={x.v}>{x.lbl}</option>)}
              </select>
              {fErr.type&&<div style={{fontSize:11,color:"#c74848",marginTop:3}}>{fErr.type}</div>}
            </div>
            {/* Amount */}
            <div>
              <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>المبلغ (ل.س) <span style={{color:"#c74848"}}>*</span></label>
              <input type="number" min="1" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="120000" dir="ltr" style={{...inputSt(t,fErr.amount),textAlign:"left"}}/>
              {fErr.amount&&<div style={{fontSize:11,color:"#c74848",marginTop:3}}>{fErr.amount}</div>}
            </div>
            {/* Date */}
            <div>
              <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>تاريخ المصروف</label>
              <input type="date" value={form.expenseDate} onChange={e=>setForm(f=>({...f,expenseDate:e.target.value}))} style={inputSt(t,false)}/>
            </div>
            {/* Payment method */}
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:6}}>طريقة الدفع</label>
              <div style={{display:"flex",gap:8}}>
                {[{v:"CASH",lbl:"نقداً"},{v:"SHAM_CASH",lbl:"شام كاش"}].map(m=>(
                  <button key={m.v} type="button" onClick={()=>setForm(f=>({...f,paymentMethod:m.v}))}
                    style={{flex:1,padding:"9px 8px",borderRadius:9,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,
                      background:form.paymentMethod===m.v?t.grad:t.bgElevated,
                      color:form.paymentMethod===m.v?"#fff":t.textSec,
                      outline:form.paymentMethod===m.v?"none":`1.5px solid ${t.border}`,transition:"all 0.15s"}}>
                    {m.lbl}
                  </button>
                ))}
              </div>
            </div>
            {/* Note */}
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>ملاحظات (اختياري)</label>
              <textarea value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} placeholder="فاتورة تموز..." rows={2} style={{...inputSt(t,false),resize:"vertical",lineHeight:1.5}}/>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={handleAdd} disabled={submitting} style={{flex:1,padding:"11px",borderRadius:10,border:"none",cursor:submitting?"not-allowed":"pointer",background:submitting?t.textMuted:t.grad,color:"#fff",fontSize:14,fontWeight:700,fontFamily:"inherit",transition:"background 0.15s"}}>
              {submitting?"جارٍ الحفظ...":"حفظ المصروف"}
            </button>
            <Btn label="إلغاء" onClick={()=>{if(!submitting){setAddOpen(false);setFErr({});}}} t={t} v="ghost"/>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {delTarget&&(
        <Modal title="تأكيد الحذف" onClose={()=>{if(!deleting)setDelTarget(null);}} t={t} width={360}>
          <div style={{textAlign:"center",padding:"8px 0 16px"}}>
            <div style={{marginBottom:10,color:"#C74848",display:"flex",justifyContent:"center"}}><FiTrash2 size={38}/></div>
            <div style={{fontSize:14,fontWeight:600,color:t.text,marginBottom:6}}>هل تريد حذف هذا المصروف؟</div>
            <div style={{fontSize:13,color:t.textMuted,marginBottom:4}}>
              <ExpTypeBadge type={delTarget.type} t={t}/>
            </div>
            <div style={{fontSize:18,fontWeight:700,color:"#b91c1c",marginBottom:4}}>{fmtAmt(delTarget.amount)} ل.س</div>
            {delTarget.note&&<div style={{fontSize:12,color:t.textMuted}}>{delTarget.note}</div>}
          </div>
          <div style={{padding:"9px 12px",borderRadius:9,background:"#FFF1F2",fontSize:12,color:"#9F1239",marginBottom:14,textAlign:"center"}}>
            هذا الإجراء لا يمكن التراجع عنه
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={handleDelete} disabled={deleting} style={{flex:1,padding:"11px",borderRadius:10,border:"none",cursor:deleting?"not-allowed":"pointer",background:deleting?t.textMuted:"#9F1239",color:"#fff",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>
              {deleting?"جارٍ الحذف...":"تأكيد الحذف"}
            </button>
            <Btn label="إلغاء" onClick={()=>{if(!deleting)setDelTarget(null);}} t={t} v="ghost"/>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── SESSION PRICING ───
function PgPricing({t}){
  const [editModal,setEditModal]=useState(null);
  const prices=[
    {label:"درس عادي — مدرب ذكر",   value:"٣,٠٠٠",key:"m_manual"},
    {label:"درس أوتوماتيك — مدرب ذكر",value:"٣,٥٠٠",key:"m_auto"},
    {label:"درس عادي — مدربة أنثى",  value:"٣,٢٠٠",key:"f_manual"},
    {label:"درس أوتوماتيك — مدربة أنثى",value:"٣,٧٠٠",key:"f_auto"},
    {label:"رسوم الشهادة الحكومية",  value:"٥,٠٠٠",key:"cert"},
    {label:"رسوم نقل المحاضرات (٣ أيام)",value:"٢,٠٠٠",key:"transport_lec"},
    {label:"رسوم نقل يوم الامتحان",  value:"٨٠٠",key:"transport_exam"},
  ];
  return(
    <div style={{padding:"20px 24px",overflowY:"auto",flex:1}}>
      <div style={{fontSize:20,fontWeight:700,color:t.text,marginBottom:6}}>أسعار الجلسات والخدمات</div>
      <div style={{fontSize:13,color:t.textSec,marginBottom:16}}>التعديلات تطبق على الحجوزات الجديدة فقط — الحجوزات القائمة تبقى بسعرها</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:10,paddingRight:4,borderRight:`3px solid ${t.accent}`}}>أسعار دروس التدريب</div>
          <Card t={t} p={16}>
            {prices.slice(0,4).map(p=>(
              <div key={p.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${t.border}`}}>
                <span style={{fontSize:12,color:t.textSec}}>{p.label}</span>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:14,fontWeight:700,color:t.accent}}>{p.value} ل.س</span>
                  <Btn label="تعديل" onClick={()=>setEditModal(p)} t={t} sz="sm" v="secondary"/>
                </div>
              </div>
            ))}
          </Card>
        </div>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:10,paddingRight:4,borderRight:`3px solid ${t.accent}`}}>رسوم الخدمات الأخرى</div>
          <Card t={t} p={16}>
            {prices.slice(4).map(p=>(
              <div key={p.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${t.border}`}}>
                <span style={{fontSize:12,color:t.textSec}}>{p.label}</span>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:14,fontWeight:700,color:t.accent}}>{p.value} ل.س</span>
                  <Btn label="تعديل" onClick={()=>setEditModal(p)} t={t} sz="sm" v="secondary"/>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
      {editModal&&<Modal title="تعديل السعر" onClose={()=>setEditModal(null)} t={t} width={360}>
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,color:t.textSec,display:"block",marginBottom:5}}>الخدمة</label><div style={{padding:"9px 12px",borderRadius:9,background:t.accentLight,color:t.accentText,fontSize:13,fontWeight:600}}>{editModal.label}</div></div>
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,color:t.textSec,display:"block",marginBottom:5}}>السعر الحالي</label><div style={{fontSize:18,fontWeight:700,color:t.accent}}>{editModal.value} ل.س</div></div>
        <div style={{marginBottom:14}}><label style={{fontSize:12,fontWeight:600,color:t.textSec,display:"block",marginBottom:5}}>السعر الجديد (ل.س)</label><input type="number" placeholder={editModal.value.replace(",","")} style={{width:"100%",padding:"9px 12px",borderRadius:9,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}}/></div>
        <div style={{padding:"9px 12px",borderRadius:9,background:t.pending.bg,fontSize:11,color:t.pending.text,marginBottom:14}}>⚠ هذا التعديل يطبق على الحجوزات الجديدة فقط ويُسجَّل في سجل النشاط</div>
        <div style={{display:"flex",gap:8}}><Btn label="✓ حفظ التعديل" onClick={()=>setEditModal(null)} t={t} style={{flex:1}}/><Btn label="إلغاء" onClick={()=>setEditModal(null)} t={t} v="ghost"/></div>
      </Modal>}
    </div>
  );
}

const NAV = [
  { id: "dash", label: "لوحة التحكم", icon: <TbReportMoney /> },
  { id: "payments", label: "تحقق الدفعات", icon: "✔" },
  { id: "invoices", label: "الفواتير", icon: <TbReportMoney /> },
  { id: "payroll", label: "مستحقات المدربين", icon: <FaUserTie/> },
  { id: "revenues", label: "الإيرادات والمصاريف", icon:<PiChartLineDown/>},
  { id: "generalExpenses", label: "المصاريف العامة", icon:<PiChartLineDown/>},
  { id: "pricing", label: "الأسعار", icon: <TbReportMoney/> },
];

export default function AccountantPro({embedded=false,page:forcedPage,darkMode}){
  const [localDark,setLocalDark]=useState(false);
  const dark = (embedded && typeof darkMode !== 'undefined') ? darkMode : localDark;
  const [page,setPage]=useState(forcedPage||"dash");
  const [collapsed,setCollapsed]=useState(false);
  const t=T[dark?"dark":"light"];
  const sidebarWidth = collapsed ? 84 : 308;
  const pages={dash:<PgDash t={t}/>,payments:<PgPayments t={t}/>,invoices:<PgInvoices t={t}/>,payroll:<PgPayroll t={t}/>,revenues:<PgRevenues t={t}/>,generalExpenses:<PgGeneralExpenses t={t}/>,pricing:<PgPricing t={t}/>};
  // sync when parent forces a page (embedded mode)
  if(forcedPage && forcedPage!==page){ setPage(forcedPage); }
  return(
    <div dir="rtl" style={{display:"flex",height: embedded?"100%":"100vh",overflow:"hidden",background:t.bgApp,fontFamily:"var(--font-body)"}}>
      {!embedded && (
        <div style={{width:sidebarWidth,flexShrink:0}} />
      )}
      {!embedded && (
        <div style={{width:sidebarWidth,height:"100svh",minHeight:"100svh",position:"fixed",top:0,right:0,zIndex:40,background:t.bgSidebar,display:"flex",flexDirection:"column",transition:"width 0.2s",overflow:"hidden",boxShadow:"2px 0 18px rgba(0,0,0,0.18)"}}>
          <div style={{padding:"18px 14px 16px",borderBottom:`1px solid ${t.borderCard}`,display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:40,height:40,borderRadius:11,background:"linear-gradient(135deg,#F5D547 0%,#DB3069 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0,color:"#17325C"}}>💰</div>
            {!collapsed&&<div><div style={{fontSize:15,fontWeight:800,color:"#fff",lineHeight:1.2}}>المحاسب</div><div style={{fontSize:12,color:t.textSidebar,marginTop:2}}>مدرسة القيادة</div></div>}
          </div>
          <div style={{flex:1,minHeight:0,padding:"10px",overflowY:"auto"}}>
            {NAV.map(item=>{const active=page===item.id;return <button key={item.id} onClick={()=>setPage(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:11,padding:collapsed?"14px 10px":"13px 15px",borderRadius:14,border:"none",cursor:"pointer",background:active?t.bgSidebarActive:"transparent",color:active?t.textSidebarActive:t.textSidebar,fontSize:15,fontWeight:active?700:500,marginBottom:6,justifyContent:collapsed?"center":"flex-start",fontFamily:"inherit",transition:"all 0.15s",boxShadow:active?"0 10px 24px rgba(0,0,0,0.16)":"none"}}><span style={{fontSize:18,flexShrink:0}}>{item.icon}</span>{!collapsed&&<span>{item.label}</span>}</button>;})}
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
            <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#059669 0%,#34D399 100%)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>م</div>
          </div>
        )}
        <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>{pages[page]}</div>
      </div>
    </div>
  );
}
