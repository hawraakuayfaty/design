import { useState } from "react";
import { TbReportMoney } from "react-icons/tb";
import { FaUserTie } from "react-icons/fa";
import { PiChartLineDown } from "react-icons/pi";



const T={
  light:{bgApp:"#F0F7F0",bgSurface:"#FFFFFF",bgElevated:"#F8FCF8",bgList:"#FAFCFA",bgSidebar:"#0B3D27",bgSidebarActive:"#1A6B42",text:"#0D2E1A",textSec:"#3A6B4F",textMuted:"#7A9E87",textSidebar:"#A8D5BA",textSidebarActive:"#FFFFFF",border:"rgba(13,46,26,0.08)",borderCard:"rgba(13,46,26,0.06)",accent:"#059669",accentLight:"#ECFDF5",accentText:"#065F46",grad:"linear-gradient(135deg,#059669 0%,#34D399 100%)",confirmed:{bg:"#EFF6FF",text:"#1D4ED8",dot:"#3B82F6"},pending:{bg:"#FFFBEB",text:"#92400E",dot:"#F59E0B"},cancelled:{bg:"#FFF1F2",text:"#9F1239",dot:"#F43F5E"},completed:{bg:"#F0FDF4",text:"#166534",dot:"#22C55E"},noshow:{bg:"#FDF4FF",text:"#6B21A8",dot:"#A855F7"},expired:{bg:"#F8FAFC",text:"#475569",dot:"#94A3B8"},shadow:"0 1px 3px rgba(0,0,0,0.06)",shadowMd:"0 4px 12px rgba(0,0,0,0.08)",shadowLg:"0 8px 24px rgba(0,0,0,0.10)"},
  dark:{bgApp:"#0D1117",bgSurface:"#161B22",bgElevated:"#21262D",bgList:"#161B22",bgSidebar:"#010409",bgSidebarActive:"#1A4731",text:"#E6EDF3",textSec:"#8B949E",textMuted:"#6E7681",textSidebar:"#7EE8A2",textSidebarActive:"#FFFFFF",border:"rgba(255,255,255,0.08)",borderCard:"rgba(255,255,255,0.05)",accent:"#3FB950",accentLight:"#0D2818",accentText:"#7EE8A2",grad:"linear-gradient(135deg,#238636 0%,#3FB950 100%)",confirmed:{bg:"#0D1B2E",text:"#58A6FF",dot:"#58A6FF"},pending:{bg:"#1F1700",text:"#E3B341",dot:"#E3B341"},cancelled:{bg:"#1F0D12",text:"#FF7B72",dot:"#FF7B72"},completed:{bg:"#0D2818",text:"#56D364",dot:"#56D364"},noshow:{bg:"#1A0D2E",text:"#D2A8FF",dot:"#D2A8FF"},expired:{bg:"#21262D",text:"#8B949E",dot:"#8B949E"},shadow:"0 1px 3px rgba(0,0,0,0.3)",shadowMd:"0 4px 12px rgba(0,0,0,0.4)",shadowLg:"0 8px 24px rgba(0,0,0,0.5)"},
};

function Card({children,t,p=16,mb=10,style={}}){return <div style={{background:t.bgSurface,borderRadius:12,border:`1px solid ${t.borderCard}`,padding:p,marginBottom:mb,boxShadow:t.shadow,...style}}>{children}</div>;}
function Modal({title,onClose,children,t,width=500}){return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(2px)"}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:t.bgSurface,borderRadius:16,width,maxWidth:"calc(100vw - 40px)",maxHeight:"85vh",overflow:"hidden",boxShadow:t.shadowLg,display:"flex",flexDirection:"column"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:`1px solid ${t.border}`}}><div style={{fontSize:15,fontWeight:700,color:t.text}}>{title}</div><button onClick={onClose} style={{width:28,height:28,borderRadius:7,border:"none",background:t.bgElevated,cursor:"pointer",fontSize:15,color:t.textMuted}}>✕</button></div><div style={{padding:"18px 20px",overflowY:"auto"}}>{children}</div></div></div>;}
function Btn({label,onClick,v="primary",sz="md",t,style={}}){const base={padding:sz==="sm"?"4px 11px":"9px 18px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:sz==="sm"?11:13,fontWeight:600,transition:"all 0.15s"};const vs={primary:{background:t.grad,color:"#fff"},secondary:{background:t.accentLight,color:t.accentText,border:`1px solid ${t.accent}30`},danger:{background:"#FFF1F2",color:"#9F1239",border:"1px solid #FECDD3"},ghost:{background:"transparent",color:t.textSec,border:`1px solid ${t.border}`}};return <button onClick={onClick} style={{...base,...vs[v],...style}}>{label}</button>;}
function InfoRow({k,v,t,bold=false}){return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${t.border}`,fontSize:12}}><span style={{color:t.textMuted}}>{k}</span><span style={{fontWeight:bold?700:600,color:bold?t.accent:t.text}}>{v}</span></div>;}
function Stat({label,value,color,sub,t}){return <Card t={t} p={14} mb={0}><div style={{fontSize:22,fontWeight:700,color,lineHeight:1,marginBottom:3}}>{value}</div><div style={{fontSize:11,fontWeight:600,color:t.text}}>{label}</div>{sub&&<div style={{fontSize:10,color:t.textMuted,marginTop:2}}>{sub}</div>}</Card>;}

// ─── FINANCIAL DASHBOARD ───
function PgDash({t}){
  return(
    <div style={{padding:"20px 24px",overflowY:"auto",flex:1}}>
      <div style={{fontSize:14,fontWeight:700,color:t.textMuted,marginBottom:8}}> اليوم</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}}>
        <Stat label="إيرادات اليوم" value="٤,٥٠٠ ل.س" color={t.accent} sub="٣ دروس مدفوعة" t={t}/>
        <Stat label="مصاريف اليوم" value="١,٢٠٠ ل.س" color="#b91c1c" sub="وقود أ·ب·ج ١٠١" t={t}/>
        <Stat label="صافي اليوم" value="٣,٣٠٠ ل.س" color="#166534" sub="تقديري" t={t}/>
        <Stat label="إثباتات معلقة" value="٣" color="#6B21A8" sub="تحتاج تحققك" t={t}/>
      </div>
      <div style={{fontSize:14,fontWeight:700,color:t.textMuted,marginBottom:8}}> يونيو ٢٠٢٦</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
        <Stat label="الإيرادات" value="١٢٠,٠٠٠ ل.س" color={t.accent} t={t}/>
        <Stat label="المصاريف" value="٣٥,٠٠٠ ل.س" color="#b91c1c" t={t}/>
        <Stat label="صافي الربح" value="٨٥,٠٠٠ ل.س" color="#166534" t={t}/>
        <Stat label="مستحقات مدربين" value="١٨,٠٠٠ ل.س" color="#92400E" t={t}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
        <Card t={t} p={16}>
          <div style={{fontSize:14,fontWeight:700,color:t.text,marginBottom:12}}>إثباتات الدفع المعلقة</div>
          {[{name:"سارة خالد",amount:"١,٥٠٠ ل.س",booking:"#١٢٤٧",method:"شام كاش",time:"منذ ٥ دق"},{name:"علي حسن",amount:"١,٥٠٠ ل.س",booking:"#١٢٤٨",method:"شام كاش",time:"منذ ١٢ دق"},{name:"كريم عبدو",amount:"١,٥٠٠ ل.س",booking:"#١٢٣٩",method:"شام كاش",time:"منذ ٣٠ دق"}].map((p,i)=>(
            <div key={i} style={{padding:"11px 0",borderBottom:`1px solid ${t.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:600,color:t.text}}>{p.name}</span>
                <span style={{fontSize:13,fontWeight:700,color:t.accent}}>{p.amount}</span>
              </div>
              <div style={{fontSize:11,color:t.textMuted,marginBottom:7}}>{p.booking} • {p.method} • {p.time}</div>
              <div style={{display:"flex",gap:6}}>
                <Btn label="✓ قبول وتأكيد الحجز" t={t} sz="sm" style={{flex:1}}/>
                <Btn label="✕ رفض" t={t} sz="sm" v="danger"/>
              </div>
            </div>
          ))}
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Card t={t} p={14}>
            <div style={{fontSize:12,fontWeight:700,color:t.text,marginBottom:8}}>ملخص مالي سريع</div>
            {[["عربونات مستلمة اليوم","٣,٠٠٠ ل.س",t.accent],["مبالغ متبقية مستلمة","١,٥٠٠ ل.س",t.accent],["وقود مدفوع اليوم","١,٢٠٠ ل.س","#b91c1c"],["مستحقات مدربين اليوم","٤,٣٥٠ ل.س","#92400E"]].map(([k,v,c])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${t.border}`,fontSize:11}}>
                <span style={{color:t.textMuted}}>{k}</span><span style={{fontWeight:700,color:c}}>{v}</span>
              </div>
            ))}
          </Card>
          <Card t={t} p={14}>
            <div style={{fontSize:12,fontWeight:700,color:t.text,marginBottom:8}}>ضريبة الشهر</div>
            {[["الدخل الخاضع للضريبة","٨٥,٠٠٠ ل.س"],["نسبة الضريبة","٢٠٪"],["الضريبة المستحقة","١٧,٠٠٠ ل.س"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${t.border}`,fontSize:11}}>
                <span style={{color:t.textMuted}}>{k}</span><span style={{fontWeight:600,color:k==="الضريبة المستحقة"?"#b91c1c":t.text}}>{v}</span>
              </div>
            ))}
            <button style={{marginTop:8,width:"100%",padding:"7px",borderRadius:7,background:t.pending.bg,color:t.pending.text,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>تسجيل دفع الضريبة</button>
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
          <div style={{background:t.grad,padding:"14px 18px",textAlign:"center"}}><div style={{fontSize:13,fontWeight:700,color:"#fff"}}> مدرسة القيادة — {viewModal.id}</div></div>
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
  return(
    <div style={{padding:"20px 24px",overflowY:"auto",flex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{display:"flex",gap:3,background:t.bgElevated,borderRadius:9,padding:3}}>
          {[["revenues","الإيرادات"],["expenses","المصاريف"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"7px 18px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:tab===id?700:400,background:tab===id?t.bgSurface:"transparent",color:tab===id?t.text:t.textMuted,boxShadow:tab===id?t.shadow:"none"}}>{label}</button>
          ))}
        </div>
        <Btn label={tab==="revenues"?"+ إيراد جديد":"+ مصروف جديد"} onClick={()=>setAddModal(tab)} t={t}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        {(tab==="revenues"
          ?[{l:"إجمالي الشهر",v:"١٢٠,٠٠٠",c:t.accent},{l:"عربونات دروس",v:"٤٥,٠٠٠",c:"#1D4ED8"},{l:"مبالغ دروس",v:"٤٨,٠٠٠",c:"#166534"},{l:"خدمات أخرى",v:"٢٧,٠٠٠",c:"#6B21A8"}]
          :[{l:"إجمالي الشهر",v:"٣٥,٠٠٠",c:"#b91c1c"},{l:"مستحقات مدربين",v:"١٨,٠٠٠",c:"#92400E"},{l:"وقود وصيانة",v:"١٠,٠٠٠",c:"#0369a1"},{l:"ضريبة رسمية",v:"١٧,٠٠٠",c:"#b91c1c"}]
        ).map((s,i)=>(
          <div key={i} style={{background:t.bgSurface,borderRadius:10,border:`1px solid ${t.borderCard}`,padding:14}}>
            <div style={{fontSize:18,fontWeight:700,color:s.c}}>{s.v} ل.س</div>
            <div style={{fontSize:11,color:t.textMuted,marginTop:3}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{borderRadius:10,border:`1px solid ${t.border}`,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:t.bgElevated}}>{headers.map((h,i)=><th key={i} style={{padding:"9px 12px",textAlign:"right",color:t.textMuted,fontWeight:600,fontSize:11,borderBottom:`1px solid ${t.border}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {data.map((row,ri)=>(
              <tr key={ri} style={{background:ri%2===0?t.bgSurface:t.bgList,borderBottom:`1px solid ${t.border}`}}>
                {row.map((c,ci)=><td key={ci} style={{padding:"9px 12px",fontWeight:ci===3?700:400,color:ci===3?(tab==="revenues"?t.accent:"#b91c1c"):t.text}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {addModal&&<Modal title={addModal==="revenues"?"إضافة إيراد":"إضافة مصروف"} onClose={()=>setAddModal(null)} t={t} width={440}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          {(addModal==="revenues"
            ?[{l:"نوع الإيراد",type:"select",opts:["عربون درس","باقي مبلغ درس","رسوم شهادة","رسوم نقل","رسوم إعادة فحص","أخرى"]},{l:"المبلغ (ل.س)",type:"number"},{l:"الطالب",type:"select",opts:["—","أحمد محمد","سارة خالد"]},{l:"طريقة الدفع",type:"select",opts:["نقدي","شام كاش","أخرى"]}]
            :[{l:"نوع المصروف",type:"select",opts:["مستحقات مدرب","وقود","صيانة","إيجار","كهرباء","ضريبة رسمية","أخرى"]},{l:"المبلغ (ل.س)",type:"number"},{l:"مرتبط بـ",type:"select",opts:["—","خالد عمر","أ·ب·ج ١٠١","عام"]},{l:"طريقة الدفع",type:"select",opts:["نقدي","تحويل","شام كاش"]}]
          ).map((f,i)=>(
            <div key={i}><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>{f.l}</label>
            {f.type==="select"?<select style={{width:"100%",padding:"8px 9px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:12,fontFamily:"inherit"}}>{f.opts.map(o=><option key={o}>{o}</option>)}</select>
            :<input type="number" placeholder="0" style={{width:"100%",padding:"8px 9px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:12,fontFamily:"inherit",boxSizing:"border-box"}}/>}</div>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}><Btn label="✓ حفظ" onClick={()=>setAddModal(null)} t={t} style={{flex:1}}/><Btn label="إلغاء" onClick={()=>setAddModal(null)} t={t} v="ghost"/></div>
      </Modal>}
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

  { id: "pricing", label: "الأسعار", icon: <TbReportMoney/> },
];

export default function AccountantPro({embedded=false,page:forcedPage,darkMode}){
  const [localDark,setLocalDark]=useState(false);
  const dark = (embedded && typeof darkMode !== 'undefined') ? darkMode : localDark;
  const [page,setPage]=useState(forcedPage||"dash");
  const [collapsed,setCollapsed]=useState(false);
  const t=T[dark?"dark":"light"];
  const pages={dash:<PgDash t={t}/>,payments:<PgPayments t={t}/>,invoices:<PgInvoices t={t}/>,payroll:<PgPayroll t={t}/>,revenues:<PgRevenues t={t}/>,pricing:<PgPricing t={t}/>};
  // sync when parent forces a page (embedded mode)
  if(forcedPage && forcedPage!==page){ setPage(forcedPage); }
  return(
    <div dir="rtl" style={{display:"flex",height: embedded?"100%":"100vh",overflow:"hidden",background:t.bgApp,fontFamily:"'Segoe UI',Tahoma,Arial,sans-serif"}}>
      {!embedded && (
        <div className="hide-scrollbar" style={{width:collapsed?58:215,background:t.bgSidebar,display:"flex",flexDirection:"column",transition:"width 0.2s",flexShrink:0,boxShadow:"2px 0 12px rgba(0,0,0,0.18)"}}>
          <div style={{padding:"16px 12px 12px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#059669 0%,#34D399 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>💰</div>
            {!collapsed&&<div><div style={{fontSize:12,fontWeight:700,color:"#fff",lineHeight:1.2}}>المحاسب</div><div style={{fontSize:10,color:t.textSidebar,marginTop:1}}>مدرسة القيادة</div></div>}
          </div>
          <div style={{flex:1,padding:"7px",overflowY:"auto"}}>
            {NAV.map(item=>{const active=page===item.id;return <button key={item.id} onClick={()=>setPage(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:collapsed?"9px 0":"8px 11px",borderRadius:8,border:"none",cursor:"pointer",background:active?t.bgSidebarActive:"transparent",color:active?t.textSidebarActive:t.textSidebar,fontSize:12,fontWeight:active?600:400,marginBottom:2,justifyContent:collapsed?"center":"flex-start",fontFamily:"inherit",transition:"all 0.15s"}}><span style={{fontSize:15,flexShrink:0}}>{item.icon}</span>{!collapsed&&<span>{item.label}</span>}</button>;})}
          </div>
          <div style={{padding:"9px 7px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
            <button onClick={()=>setCollapsed(!collapsed)} style={{width:"100%",padding:"7px",borderRadius:7,background:"rgba(255,255,255,0.05)",border:"none",color:t.textSidebar,cursor:"pointer",fontSize:13}}>{collapsed?"»":"«"}</button>
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
