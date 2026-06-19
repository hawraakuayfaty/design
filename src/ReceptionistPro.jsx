import { useState } from "react";
import { TbBus } from "react-icons/tb";
import { IoIosCalendar } from "react-icons/io";

import { IoDocumentTextOutline } from "react-icons/io5";
import {  PiUsersThin } from "react-icons/pi";
import { FaUserTie } from "react-icons/fa";
import { FaCar } from "react-icons/fa";


const T = {
  light: {
    bgApp:"#F8F9F5",bgSurface:"#FFFFFF",bgElevated:"#EEF2E4",bgList:"#F5F7F0",
    bgSidebar:"linear-gradient(180deg,#778A3B 0%,#6B7C35 52%,#5F702D 100%)",bgSidebarActive:"#5F702D",
    text:"#1C1F18",textSec:"#4F5548",textMuted:"#747A70",
    textSidebar:"#F8F9F5",textSidebarActive:"#FFFFFF",
    border:"#DDE1D7",borderCard:"rgba(119,138,59,0.14)",
    accent:"#778A3B",accentLight:"#EEF2E4",accentText:"#5F702D",
    grad:"linear-gradient(135deg,#778A3B 0%,#5F702D 100%)",
    confirmed:{bg:"rgba(119,138,59,0.12)",text:"#5F702D",dot:"#778A3B"},
    pending:{bg:"rgba(201,138,40,0.14)",text:"#C98A28",dot:"#C98A28"},
    cancelled:{bg:"rgba(199,72,72,0.12)",text:"#C74848",dot:"#C74848"},
    completed:{bg:"rgba(63,107,58,0.14)",text:"#3F6B3A",dot:"#3F6B3A"},
    noshow:{bg:"rgba(199,72,72,0.12)",text:"#C74848",dot:"#C74848"},
    inprogress:{bg:"rgba(119,138,59,0.12)",text:"#778A3B",dot:"#778A3B"},
    expired:{bg:"rgba(183,189,178,0.16)",text:"#747A70",dot:"#B7BDB2"},
    accepted:{bg:"rgba(63,107,58,0.14)",text:"#3F6B3A",dot:"#3F6B3A"},
    qualified:{bg:"rgba(119,138,59,0.12)",text:"#5F702D",dot:"#778A3B"},
    passed:{bg:"rgba(63,107,58,0.14)",text:"#3F6B3A",dot:"#3F6B3A"},
    failed:{bg:"rgba(199,72,72,0.12)",text:"#C74848",dot:"#C74848"},
    applied:{bg:"rgba(201,138,40,0.14)",text:"#C98A28",dot:"#C98A28"},
    shadow:"0 12px 28px rgba(119,138,59,0.10)",shadowMd:"0 14px 32px rgba(119,138,59,0.12)",shadowLg:"0 20px 48px rgba(119,138,59,0.16)",
  },
  dark:{
    bgApp:"#20241D",bgSurface:"#2B3127",bgElevated:"#353D31",bgList:"#2B3127",
    bgSidebar:"linear-gradient(180deg,#5F702D 0%,#4F5F29 52%,#414E24 100%)",bgSidebarActive:"#778A3B",
    text:"#F4F5EF",textSec:"#DDE1D7",textMuted:"#B7BDB2",
    textSidebar:"#F8F9F5",textSidebarActive:"#FFFFFF",
    border:"rgba(255,255,255,0.08)",borderCard:"rgba(221,225,215,0.12)",
    accent:"#778A3B",accentLight:"rgba(119,138,59,0.18)",accentText:"#EEF2E4",
    grad:"linear-gradient(135deg,#778A3B 0%,#5F702D 100%)",
    confirmed:{bg:"rgba(119,138,59,0.20)",text:"#EEF2E4",dot:"#EEF2E4"},
    pending:{bg:"rgba(201,138,40,0.20)",text:"#F0CB8C",dot:"#F0CB8C"},
    cancelled:{bg:"rgba(199,72,72,0.20)",text:"#F2B1B1",dot:"#F2B1B1"},
    completed:{bg:"rgba(63,107,58,0.24)",text:"#B8D4B5",dot:"#B8D4B5"},
    noshow:{bg:"rgba(199,72,72,0.18)",text:"#F2B1B1",dot:"#F2B1B1"},
    inprogress:{bg:"rgba(119,138,59,0.18)",text:"#EEF2E4",dot:"#EEF2E4"},
    expired:{bg:"rgba(183,189,178,0.14)",text:"#D0D5CB",dot:"#D0D5CB"},
    accepted:{bg:"rgba(63,107,58,0.24)",text:"#B8D4B5",dot:"#B8D4B5"},
    qualified:{bg:"rgba(119,138,59,0.20)",text:"#EEF2E4",dot:"#EEF2E4"},
    passed:{bg:"rgba(63,107,58,0.24)",text:"#B8D4B5",dot:"#B8D4B5"},
    failed:{bg:"rgba(199,72,72,0.20)",text:"#F2B1B1",dot:"#F2B1B1"},
    applied:{bg:"rgba(201,138,40,0.20)",text:"#F0CB8C",dot:"#F0CB8C"},
    shadow:"0 12px 28px rgba(28,31,24,0.30)",shadowMd:"0 14px 32px rgba(28,31,24,0.34)",shadowLg:"0 20px 48px rgba(28,31,24,0.40)",
  }
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
function Btn({label,onClick,v="primary",sz="md",t,style={},disabled=false}){const base={padding:sz==="sm"?"4px 12px":"9px 18px",borderRadius:8,border:"none",cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",fontSize:sz==="sm"?12:14,fontWeight:600,transition:"all 0.15s",opacity:disabled?0.5:1};const vs={primary:{background:t.grad,color:"#fff"},secondary:{background:t.accentLight,color:t.accentText,border:`1px solid ${t.accent}30`},danger:{background:"#FFF1F2",color:"#9F1239",border:"1px solid #FECDD3"},ghost:{background:"transparent",color:t.textSec,border:`1px solid ${t.border}`}};return <button disabled={disabled} onClick={onClick} style={{...base,...vs[v],...style}}>{label}</button>;}
function Divider({t}){return <div style={{height:1,background:t.border,margin:"12px 0"}}/>;}
function InfoRow({k,v,t}){return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${t.border}`,fontSize:13}}><span style={{color:t.textMuted}}>{k}</span><span style={{fontWeight:600,color:t.text}}>{SL.includes(v)?<Badge s={v} t={t}/>:v}</span></div>;}
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

const STUDENTS=[
  {id:1,name:"أحمد محمد الحسن",phone:"0991234567",status:"قيد التدريب",gender:"ذكر",type:"عادي",id_num:"١٢٣٤٥٦٧",bookings:8,last:"٤ يونيو",cert:"لا"},
  {id:2,name:"سارة خالد يوسف",phone:"0997654321",status:"نشط",gender:"أنثى",type:"أوتوماتيك",id_num:"٧٦٥٤٣٢١",bookings:3,last:"٢ يونيو",cert:"لا"},
  {id:3,name:"علي حسن محمود",phone:"0994444444",status:"قيد التدريب",gender:"ذكر",type:"عادي",id_num:"٤٤٤٤٤٤٤",bookings:6,last:"٤ يونيو",cert:"لا"},
  {id:4,name:"منى العلي سالم",phone:"0993333333",status:"أنهى التدريب",gender:"أنثى",type:"أوتوماتيك",id_num:"٣٣٣٣٣٣٣",bookings:12,last:"٢٨ مايو",cert:"تم التقديم"},
  {id:5,name:"نورا الأحمد",phone:"0995555555",status:"طلب شهادة",gender:"أنثى",type:"عادي",id_num:"٥٥٥٥٥٥٥",bookings:14,last:"٢٥ مايو",cert:"مقبول"},
  {id:6,name:"كريم عبدو",phone:"0996666666",status:"نشط",gender:"ذكر",type:"أوتوماتيك",id_num:"٦٦٦٦٦٦٦",bookings:4,last:"٣٠ مايو",cert:"لا"},
  {id:7,name:"هناء الصالح",phone:"0997777777",status:"جديد",gender:"أنثى",type:"عادي",id_num:"٧٧٧٧٧٧٧",bookings:0,last:"—",cert:"لا"},
];

const ST_BOOKINGS=[
  {id:"#١٢٥٠",date:"١٠ يونيو",time:"٠٩:٠٠",inst:"خالد عمر",type:"عادي",status:"مؤكد",pay:"معلق",remaining:1500},
  {id:"#١٢٤٥",date:"٤ يونيو",time:"٠٩:٠٠",inst:"خالد عمر",type:"عادي",status:"مكتمل",pay:"مدفوع",remaining:0},
  {id:"#١٢٤٠",date:"٢٨ مايو",time:"٠٩:٠٠",inst:"أحمد الزيد",type:"عادي",status:"مكتمل",pay:"مدفوع",remaining:0},
  {id:"#١٢٣٥",date:"٢٠ مايو",time:"١٠:٣٠",inst:"خالد عمر",type:"عادي",status:"ملغي",pay:"معلق",remaining:0},
  {id:"#١٢٣٠",date:"١٢ مايو",time:"٠٩:٠٠",inst:"خالد عمر",type:"عادي",status:"لم يحضر",pay:"معلق",remaining:0},
];

function SectionStudents({t}){
  const [search,setSearch]=useState("");
  const [fSt,setFSt]=useState("الكل");
  const [sel,setSel]=useState(STUDENTS[0]);
  const [dTab,setDTab]=useState("info");
  const [bFilt,setBFilt]=useState("الكل");
  const [invModal,setInvModal]=useState(null);
  const [nsModal,setNsModal]=useState(null);
  const statuses=["الكل","جديد","نشط","قيد التدريب","أنهى التدريب","طلب شهادة"];
  const filtered=STUDENTS.filter(s=>(fSt==="الكل"||s.status===fSt)&&(s.name.includes(search)||s.phone.includes(search)));
  const bFilters=["الكل","مؤكد","مكتمل","ملغي","لم يحضر"];
  const fBookings=ST_BOOKINGS.filter(b=>bFilt==="الكل"||b.status===bFilt);
  return(
    <div style={{display:"flex",height:"100%"}}>
      <div className="hide-scrollbar" style={{width:290,flexShrink:0,display:"flex",flexDirection:"column",borderLeft:`1px solid ${t.border}`}}>
        <div style={{padding:"12px 12px 8px",borderBottom:`1px solid ${t.border}`}}>
          <SearchBar placeholder="بحث..." t={t} value={search} onChange={setSearch}/>
          <div style={{display:"flex",gap:3,marginTop:8,flexWrap:"wrap"}}>
            {statuses.map(s=><button key={s} onClick={()=>setFSt(s)} style={{padding:"3px 9px",borderRadius:20,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:10,fontWeight:fSt===s?700:400,background:fSt===s?t.accent:"transparent",color:fSt===s?"#fff":t.textMuted}}>{s}</button>)}
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {filtered.map(s=>(
            <div key={s.id} onClick={()=>setSel(s)} style={{padding:"11px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:9,borderBottom:`1px solid ${t.border}`,background:sel?.id===s.id?t.accentLight:t.bgSurface,borderRight:sel?.id===s.id?`3px solid ${t.accent}`:"3px solid transparent"}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:t.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",fontWeight:700,flexShrink:0}}>{s.name[0]}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</div>
                <div style={{fontSize:11,color:t.textMuted,marginTop:1}}>{s.phone}</div>
              </div>
              <Badge s={s.status} t={t}/>
            </div>
          ))}
        </div>
        <div style={{padding:"10px 12px",borderTop:`1px solid ${t.border}`,background:t.bgElevated}}>
          <Btn label="+ تسجيل طالب جديد" t={t} sz="sm" style={{width:"100%"}}/>
        </div>
      </div>
      {sel&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"16px 22px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:14,background:t.bgSurface,flexShrink:0}}>
            <div style={{width:50,height:50,borderRadius:"50%",background:t.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff",fontWeight:700}}>{sel.name[0]}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:17,fontWeight:700,color:t.text}}>{sel.name}</div>
              <div style={{fontSize:12,color:t.textSec,marginTop:2}}>{sel.phone}</div>
              <div style={{marginTop:5,display:"flex",gap:5}}><Badge s={sel.status} t={t}/><Badge s={sel.gender} t={t}/><Badge s={sel.type} t={t}/></div>
            </div>
            <div style={{display:"flex",gap:7}}><Btn label="+ حجز جديد" t={t} sz="sm"/><Btn label="تعديل" t={t} sz="sm" v="ghost"/></div>
          </div>
          <div style={{display:"flex",borderBottom:`1px solid ${t.border}`,background:t.bgSurface,padding:"0 22px",flexShrink:0}}>
            {[["info","البيانات"],["bookings","الحجوزات"],["docs","الوثائق"]].map(([id,label])=>(
              <button key={id} onClick={()=>setDTab(id)} style={{padding:"11px 15px",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:dTab===id?700:400,background:"transparent",color:dTab===id?t.accent:t.textSec,borderBottom:`2px solid ${dTab===id?t.accent:"transparent"}`,marginBottom:-1}}>{label}</button>
            ))}
          </div>
          <div style={{flex:1,overflowY:"hidden",padding:"18px 22px"}}>
            {dTab==="info"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <Card t={t} p={16}>
                  <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:10}}>البيانات الشخصية</div>
                  <InfoRow k="رقم الهوية" v={sel.id_num} t={t}/><InfoRow k="رقم الهاتف" v={sel.phone} t={t}/>
                  <InfoRow k="الجنس" v={sel.gender} t={t}/><InfoRow k="التدريب المفضل" v={sel.type} t={t}/>
                  <InfoRow k="عدد الحجوزات" v={`${sel.bookings} جلسات`} t={t}/><InfoRow k="آخر درس" v={sel.last} t={t}/>
                </Card>
                <Card t={t} p={16}>
                  <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:10}}>الشهادة والإجراءات</div>
                  {sel.cert!=="لا"?<InfoRow k="حالة الشهادة" v={sel.cert} t={t}/>:<div style={{fontSize:12,color:t.textMuted,marginBottom:10}}>لا يوجد طلب شهادة</div>}
                  <Divider t={t}/>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    <Btn label="تغيير الحالة" t={t} sz="sm" v="ghost" style={{width:"100%"}}/>
                    <Btn label="أرشفة الطالب" t={t} sz="sm" v="danger" style={{width:"100%"}}/>
                  </div>
                </Card>
              </div>
            )}
            {dTab==="bookings"&&(
              <div>
                <div style={{display:"flex",gap:3,marginBottom:12,background:t.bgElevated,borderRadius:8,padding:3}}>
                  {bFilters.map(f=><button key={f} onClick={()=>setBFilt(f)} style={{flex:1,padding:"6px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:bFilt===f?700:400,background:bFilt===f?t.bgSurface:"transparent",color:bFilt===f?t.text:t.textMuted,boxShadow:bFilt===f?t.shadow:"none"}}>{f}</button>)}
                </div>
                {fBookings.map(b=>(
                  <div key={b.id} style={{background:t.bgSurface,borderRadius:10,border:`1px solid ${t.borderCard}`,padding:"12px 14px",marginBottom:7,borderRight:`3px solid ${b.status==="مكتمل"?t.completed.dot:b.status==="مؤكد"?t.confirmed.dot:b.status==="ملغي"?t.cancelled.dot:b.status==="لم يحضر"?t.noshow.dot:t.expired.dot}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div><span style={{fontSize:13,fontWeight:700,color:t.text}}>{b.date}</span><span style={{fontSize:12,color:t.textMuted,marginRight:8}}> {b.time} • {b.inst}</span></div>
                      <div style={{display:"flex",gap:5}}><Badge s={b.pay} t={t}/><Badge s={b.status} t={t}/></div>
                    </div>
                    {b.status==="مؤكد"&&<div style={{display:"flex",gap:7,marginTop:5}}>
                      <Btn label={`إكمال الدفع • ${b.remaining.toLocaleString()} ل.س`} onClick={()=>setInvModal(b)} t={t} sz="sm"/>
                      <Btn label="لم يحضر" onClick={()=>setNsModal(b)} t={t} sz="sm" v="danger"/>
                    </div>}
                  </div>
                ))}
              </div>
            )}
            {dTab==="docs"&&(
              <Card t={t} p={16}>
                <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:12}}>وثائق الشهادة الحكومية</div>
                {["صورة شخصية حديثة","صورة الهوية (أمامي)","صورة الهوية (خلفي)"].map((d,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${t.border}`}}>
                    <span style={{fontSize:12,fontWeight:600,color:t.text}}>{d}</span>
                    <span style={{fontSize:11,color:t.textMuted}}>تُسلَّم للمركز — لا تُخزَّن</span>
                  </div>
                ))}
                <div style={{marginTop:10,padding:"9px 12px",borderRadius:8,background:t.accentLight,fontSize:11,color:t.accentText}}>💡 الوثائق تُسلَّم للمركز الحكومي مباشرةً — يكفي تأكيدها هنا</div>
              </Card>
            )}
          </div>
        </div>
      )}
      {invModal&&<InvoiceModal booking={invModal} t={t} onClose={()=>setInvModal(null)}/>}
      {nsModal&&<Modal title="الطالب لم يحضر؟" onClose={()=>setNsModal(null)} t={t} width={380}>
        <div style={{padding:"10px 12px",borderRadius:9,background:t.noshow.bg,marginBottom:12,fontSize:12,color:t.noshow.text}}>العربون غير مسترد — ستُسجَّل الجلسة كـ No-Show</div>
        <InfoRow k="الطالب" v={sel?.name||""} t={t}/><InfoRow k="الجلسة" v={`${nsModal.date} • ${nsModal.time}`} t={t}/>
        <div style={{display:"flex",gap:8,marginTop:14}}><Btn label="✓ تأكيد No-Show" onClick={()=>setNsModal(null)} t={t} v="danger" style={{flex:1}}/><Btn label="إلغاء" onClick={()=>setNsModal(null)} t={t} v="ghost"/></div>
      </Modal>}
    </div>
  );
}

const INSTRUCTORS=[
  {id:1,name:"خالد عمر الزيد",phone:"0991111111",gender:"ذكر",type:"داخلي",caps:"عادي + أوتوماتيك",fee:500,status:"نشط",lessons:3,rating:4.8},
  {id:2,name:"ليلى سعد حمود",phone:"0992222222",gender:"أنثى",type:"داخلي",caps:"أوتوماتيك",fee:500,status:"نشط",lessons:3,rating:4.7},
  {id:3,name:"أحمد الزيد محمد",phone:"0993333333",gender:"ذكر",type:"خارجي",caps:"عادي",fee:450,status:"نشط",lessons:2,rating:4.6},
  {id:4,name:"سمر يوسف سالم",phone:"0994444444",gender:"أنثى",type:"داخلي",caps:"عادي + أوتوماتيك",fee:500,status:"في إجازة",lessons:0,rating:4.5},
  {id:5,name:"ماهر العلي",phone:"0995555555",gender:"ذكر",type:"خارجي",caps:"عادي",fee:450,status:"نشط",lessons:1,rating:4.4},
];
const DAYS=["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const HOURS=["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];
const AVAIL={0:[2,3,4,5,6],1:[2,3,4,5,6],2:[2,3,4,5,6],3:[2,3,4,5,6],4:[2,3,4,5,6]};

function SectionInstructors({t}){
  const [search,setSearch]=useState("");
  const [gF,setGF]=useState("الكل");
  const [sel,setSel]=useState(INSTRUCTORS[0]);
  const [dTab,setDTab]=useState("info");
  const [avModal,setAvModal]=useState(false);
  const filtered=INSTRUCTORS.filter(i=>(gF==="الكل"||i.gender===gF)&&(i.name.includes(search)||i.phone.includes(search)));
  return(
    <div style={{display:"flex",height:"100%"}}>
      <div className="hide-scrollbar" style={{width:290,flexShrink:0,display:"flex",flexDirection:"column",borderLeft:`1px solid ${t.border}`}}>
        <div style={{padding:"12px 12px 8px",borderBottom:`1px solid ${t.border}`}}>
          <SearchBar placeholder="بحث عن مدرب..." t={t} value={search} onChange={setSearch}/>
          <div style={{display:"flex",gap:3,marginTop:8}}>
            {["الكل","ذكر","أنثى"].map(g=><button key={g} onClick={()=>setGF(g)} style={{flex:1,padding:"5px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:gF===g?700:400,background:gF===g?t.accent:"transparent",color:gF===g?"#fff":t.textMuted}}>{g}</button>)}
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {filtered.map(inst=>(
            <div key={inst.id} onClick={()=>setSel(inst)} style={{padding:"11px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:9,borderBottom:`1px solid ${t.border}`,background:sel?.id===inst.id?t.accentLight:t.bgSurface,borderRight:sel?.id===inst.id?`3px solid ${t.accent}`:"3px solid transparent"}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:inst.gender==="ذكر"?t.confirmed.bg:t.noshow.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:inst.gender==="ذكر"?t.confirmed.text:t.noshow.text,fontWeight:700,flexShrink:0}}>{inst.name[0]}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:t.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{inst.name}</div>
                <div style={{fontSize:11,color:t.textMuted,marginTop:1}}>{inst.caps} • {inst.lessons} دروس</div>
              </div>
              <Badge s={inst.status} t={t}/>
            </div>
          ))}
        </div>
        <div style={{padding:"10px 12px",borderTop:`1px solid ${t.border}`,background:t.bgElevated}}>
          <Btn label="+ إضافة مدرب" t={t} sz="sm" style={{width:"100%"}}/>
        </div>
      </div>
      {sel&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"16px 22px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:14,background:t.bgSurface,flexShrink:0}}>
            <div style={{width:50,height:50,borderRadius:"50%",background:sel.gender==="ذكر"?t.confirmed.bg:t.noshow.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:sel.gender==="ذكر"?t.confirmed.text:t.noshow.text,fontWeight:700}}>{sel.name[0]}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:17,fontWeight:700,color:t.text}}>{sel.name}</div>
              <div style={{fontSize:12,color:t.textSec,marginTop:2}}>⭐ {sel.rating} • {sel.phone}</div>
              <div style={{marginTop:5,display:"flex",gap:5}}><Badge s={sel.status} t={t}/><Badge s={sel.gender} t={t}/><Badge s={sel.type} t={t}/></div>
            </div>
            <div style={{display:"flex",gap:7}}>
              <Btn label="إجازة" t={t} sz="sm" v="ghost"/>
              <Btn label="غياب اليوم" t={t} sz="sm" v="danger"/>
            </div>
          </div>
          <div style={{display:"flex",borderBottom:`1px solid ${t.border}`,background:t.bgSurface,padding:"0 22px",flexShrink:0}}>
            {[["info","البيانات"],["schedule","جدول اليوم"],["availability","أوقات التوفر"]].map(([id,label])=>(
              <button key={id} onClick={()=>setDTab(id)} style={{padding:"11px 14px",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:dTab===id?700:400,background:"transparent",color:dTab===id?t.accent:t.textSec,borderBottom:`2px solid ${dTab===id?t.accent:"transparent"}`,marginBottom:-1}}>{label}</button>
            ))}
          </div>
          <div style={{flex:1,overflowY:"hidden",padding:"18px 22px"}}>
            {dTab==="info"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <Card t={t} p={16}>
                  <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:10}}>بيانات المدرب</div>
                  <InfoRow k="الهاتف" v={sel.phone} t={t}/><InfoRow k="الجنس" v={sel.gender} t={t}/>
                  <InfoRow k="نوع التعاقد" v={sel.type} t={t}/><InfoRow k="القدرات" v={sel.caps} t={t}/>
                  <InfoRow k="أجر الجلسة" v={`${sel.fee} ل.س`} t={t}/><InfoRow k="دروس اليوم" v={`${sel.lessons}`} t={t}/>
                </Card>
                <Card t={t} p={16}>
                  <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:10}}>الإحصاءات</div>
                  {[["جلسات الشهر","٤٢"],["معدل الإتمام","٩٢٪"],["No-Show الشهر","٢"],["مستحق اليوم",`${sel.lessons*sel.fee} ل.س`]].map(([k,v])=><InfoRow key={k} k={k} v={v} t={t}/>)}
                </Card>
              </div>
            )}
            {dTab==="schedule"&&(
              <div>
                <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:10}}>الخميس ٤ يونيو</div>
                {[{time:"٠٩:٠٠–١٠:٣٠",student:"أحمد محمد",type:"عادي",vehicle:"أ·ب·ج ١٠١",status:"مكتمل"},{time:"١٢:٠٠–١٣:٣٠",student:"علي حسن",type:"عادي",vehicle:"سيارة الطالب",status:"جاري"},{time:"١٥:٣٠–١٧:٠٠",student:"محمود سالم",type:"عادي",vehicle:"أ·ب·ج ١٠١",status:"مؤكد"}].map((l,i)=>(
                  <div key={i} style={{background:t.bgSurface,borderRadius:9,border:`1px solid ${t.borderCard}`,padding:"12px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,borderRight:`3px solid ${l.status==="مكتمل"?t.completed.dot:l.status==="جاري"?t.inprogress.dot:t.confirmed.dot}`}}>
                    <div style={{textAlign:"center",minWidth:65}}><div style={{fontSize:12,fontWeight:700,color:t.accent}}>{l.time}</div></div>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:t.text}}>{l.student}</div><div style={{fontSize:11,color:t.textSec,marginTop:2}}>{l.type} • {l.vehicle}</div></div>
                    <Badge s={l.status} t={t}/>
                  </div>
                ))}
              </div>
            )}
            {dTab==="availability"&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontSize:13,fontWeight:700,color:t.text}}>الجدول الأسبوعي</div>
                  <Btn label="+ إضافة وقت توفر" onClick={()=>setAvModal(true)} t={t} sz="sm"/>
                </div>
                <Card t={t} p={0} style={{overflow:"hidden"}}>
                  <div style={{display:"grid",gridTemplateColumns:"55px repeat(7,1fr)",borderBottom:`1px solid ${t.border}`}}>
                    <div style={{padding:"7px 5px"}}/>
                    {DAYS.map(d=><div key={d} style={{padding:"7px 4px",textAlign:"center",fontSize:10,fontWeight:600,color:t.text,borderRight:`1px solid ${t.border}`}}>{d}</div>)}
                  </div>
                  {HOURS.map((h,hi)=>(
                    <div key={h} style={{display:"grid",gridTemplateColumns:"55px repeat(7,1fr)",borderBottom:`1px solid ${t.border}`}}>
                      <div style={{padding:"5px",textAlign:"center",fontSize:10,color:t.textMuted,background:t.bgElevated}}>{h}</div>
                      {DAYS.map((_,di)=>{const a=AVAIL[di]?.includes(hi)||false;return <div key={di} style={{height:28,borderRight:`1px solid ${t.border}`,background:a?t.accentLight:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{a&&<div style={{width:7,height:7,borderRadius:"50%",background:t.accent}}/>}</div>;})}
                    </div>
                  ))}
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
      {avModal&&<Modal title="إضافة وقت توفر" onClose={()=>setAvModal(false)} t={t} width={380}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{l:"اليوم",t2:"select",opts:DAYS},{l:"من",t2:"time"},{l:"إلى",t2:"time"},{l:"النوع",t2:"select",opts:["يوم عمل ثابت","استثناء ليوم واحد"]}].map((f,i)=>(
            <div key={i}><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>{f.l}</label>
            {f.t2==="select"?<select style={{width:"100%",padding:"8px 9px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:12,fontFamily:"inherit"}}>{f.opts.map(o=><option key={o}>{o}</option>)}</select>
            :<input type={f.t2} defaultValue={f.l==="من"?"08:00":"17:00"} style={{width:"100%",padding:"8px 9px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:12,fontFamily:"inherit",boxSizing:"border-box"}}/>}</div>
          ))}
        </div>
        <div style={{display:"flex",gap:8,marginTop:14}}><Btn label="حفظ" onClick={()=>setAvModal(false)} t={t} style={{flex:1}}/><Btn label="إلغاء" onClick={()=>setAvModal(false)} t={t} v="ghost"/></div>
      </Modal>}
    </div>
  );
}

const ALL_BOOKINGS=[
  {id:"#١٢٥٠",student:"أحمد محمد",inst:"خالد عمر",vehicle:"أ·ب·ج ١٠١",date:"١٠ يونيو",time:"٠٩:٠٠",type:"عادي",status:"مؤكد",pay:"معلق",remaining:1500},
  {id:"#١٢٤٩",student:"منى العلي",inst:"ليلى سعد",vehicle:"أ·ب·ج ٢٠١",date:"٤ يونيو",time:"١٤:٠٠",type:"أوتوماتيك",status:"مؤكد",pay:"مدفوع",remaining:0},
  {id:"#١٢٤٨",student:"علي حسن",inst:"خالد عمر",vehicle:"سيارة الطالب",date:"٤ يونيو",time:"١٢:٠٠",type:"عادي",status:"بانتظار العربون",pay:"معلق",remaining:1500},
  {id:"#١٢٤٧",student:"سارة خالد",inst:"ليلى سعد",vehicle:"أ·ب·ج ٢٠١",date:"٤ يونيو",time:"١٠:٣٠",type:"أوتوماتيك",status:"مؤكد",pay:"تم الإثبات",remaining:1500},
  {id:"#١٢٤٦",student:"محمود سالم",inst:"أحمد الزيد",vehicle:"أ·ب·ج ١٠١",date:"٣ يونيو",time:"١٥:٣٠",type:"عادي",status:"مكتمل",pay:"مدفوع",remaining:0},
  {id:"#١٢٤٤",student:"كريم عبدو",inst:"خالد عمر",vehicle:"أ·ب·ج ١٠١",date:"٢ يونيو",time:"١١:٠٠",type:"عادي",status:"ملغي",pay:"معلق",remaining:0},
  {id:"#١٢٤٣",student:"هناء الصالح",inst:"أحمد الزيد",vehicle:"أ·ب·ج ١٠١",date:"٢ يونيو",time:"١٤:٠٠",type:"عادي",status:"لم يحضر",pay:"معلق",remaining:0},
];

function SectionBookings({t}){
  const [tab,setTab]=useState("الكل");
  const [search,setSearch]=useState("");
  const [invModal,setInvModal]=useState(null);
  const [nsModal,setNsModal]=useState(null);
  const tabs=["الكل","مؤكد","بانتظار العربون","تم الإثبات","مكتمل","ملغي","لم يحضر"];
  const counts=Object.fromEntries(tabs.map(tb=>[tb,ALL_BOOKINGS.filter(b=>tb==="الكل"||b.status===tb).length]));
  const filtered=ALL_BOOKINGS.filter(b=>(tab==="الكل"||b.status===tab)&&(b.student.includes(search)||b.id.includes(search)));
  const dotColor=s=>s==="مكتمل"?t.completed.dot:s==="مؤكد"?t.confirmed.dot:s==="بانتظار العربون"?t.pending.dot:s==="تم الإثبات"?t.qualified.dot:s==="ملغي"?t.cancelled.dot:s==="لم يحضر"?t.noshow.dot:t.expired.dot;
  return (
    <div style={{ padding: "18px 22px", overflowY: "auto", flex: 1 }}>
      <div
        style={{
          display: "flex",
          gap: 3,
          marginBottom: 14,
          background: t.bgElevated,
          borderRadius: 9,
          padding: 3,
          overflowX: "auto",
        }}
      >
        {tabs.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            style={{
              padding: "7px 12px",
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 11,
              fontWeight: tab === tb ? 700 : 400,
              whiteSpace: "nowrap",
              background: tab === tb ? t.bgSurface : "transparent",
              color: tab === tb ? t.text : t.textMuted,
              boxShadow: tab === tb ? t.shadow : "none",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            {tb}
            <span
              style={{
                padding: "1px 6px",
                borderRadius: 20,
                fontSize: 9,
                fontWeight: 700,
                background: tab === tb ? t.accentLight : t.border,
                color: tab === tb ? t.accentText : t.textMuted,
              }}
            >
              {counts[tb]}
            </span>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <SearchBar
          placeholder="بحث باسم الطالب أو رقم الحجز..."
          t={t}
          value={search}
          onChange={setSearch}
        />
        <Btn label="+ حجز جديد" t={t} />
      </div>
      {filtered.map((b) => (
        <div
          key={b.id}
          style={{
            background: t.bgSurface,
            borderRadius: 11,
            border: `1px solid ${t.borderCard}`,
            padding: "13px 16px",
            marginBottom: 7,
            boxShadow: t.shadow,
            borderRight: `4px solid ${dotColor(b.status)}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  gap: 7,
                  alignItems: "center",
                  marginBottom: 3,
                }}
              >
                <span
                  style={{ fontSize: 11, fontWeight: 700, color: t.textMuted }}
                >
                  {b.id}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>
                  {b.student}
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: t.textSec,
                  display: "flex",
                  gap: 10,
                }}
              >
                <span> {b.inst}</span>
                <span>
                  <IoIosCalendar /> {b.date} {b.time}
                </span>
                <span>  {b.vehicle}</span>
                <span style={{ fontWeight: 600 }}>{b.type}</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 5,
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Badge s={b.pay} t={t} />
              <Badge s={b.status} t={t} />
            </div>
            <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
              {b.status === "مؤكد" && b.remaining > 0 && (
                <Btn
                  label={`دفع متبقٍ • ${b.remaining.toLocaleString()}`}
                  onClick={() => setInvModal(b)}
                  t={t}
                  sz="sm"
                />
              )}
              {b.status === "مؤكد" && (
                <Btn
                  label="لم يحضر"
                  onClick={() => setNsModal(b)}
                  t={t}
                  sz="sm"
                  v="danger"
                />
              )}
              {b.status === "تم الإثبات" && (
                <Btn label="تحقق" t={t} sz="sm" v="secondary" />
              )}
              <Btn label="تفاصيل" t={t} sz="sm" v="ghost" />
            </div>
          </div>
        </div>
      ))}
      {invModal && (
        <InvoiceModal
          booking={invModal}
          t={t}
          onClose={() => setInvModal(null)}
        />
      )}
      {nsModal && (
        <Modal
          title="تأكيد: لم يحضر"
          onClose={() => setNsModal(null)}
          t={t}
          width={370}
        >
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 9,
              background: t.noshow.bg,
              marginBottom: 12,
              fontSize: 12,
              color: t.noshow.text,
            }}
          >
            العربون غير مسترد — تُسجَّل الجلسة كـ No-Show
          </div>
          <InfoRow k="الطالب" v={nsModal.student} t={t} />
          <InfoRow k="الجلسة" v={`${nsModal.date} • ${nsModal.time}`} t={t} />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Btn
              label="تأكيد No-Show"
              onClick={() => setNsModal(null)}
              t={t}
              v="danger"
              style={{ flex: 1 }}
            />
            <Btn
              label="إلغاء"
              onClick={() => setNsModal(null)}
              t={t}
              v="ghost"
            />
          </div>
        </Modal>
      )}
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

const CERT_STEPS=["تم التقديم","مقبول","أنهى الجلسات","مؤهل للامتحان","ناجح"];
const APPLICANTS=[
  {id:1,name:"نورا الأحمد",status:"مؤهل للامتحان",exam_date:"٢٥ يونيو",paid:true,docs:true,sessions:"٣/٣",transport:true},
  {id:2,name:"كريم عبدو",status:"أنهى الجلسات",exam_date:"—",paid:true,docs:true,sessions:"٣/٣",transport:false},
  {id:3,name:"منى العلي",status:"مقبول",exam_date:"—",paid:true,docs:true,sessions:"١/٣",transport:true},
  {id:4,name:"هناء الصالح",status:"تم التقديم",exam_date:"—",paid:true,docs:false,sessions:"٠/٣",transport:false},
  {id:5,name:"باسل الخطيب",status:"ناجح",exam_date:"٤ يونيو",paid:true,docs:true,sessions:"٣/٣",transport:true},
];

function SectionCertificate({t}){
  const [sel,setSel]=useState(APPLICANTS[0]);
  const [filt,setFilt]=useState("الكل");
  const [notifModal,setNotifModal]=useState(null);
  const [resultModal,setResultModal]=useState(null);
  const [newModal,setNewModal]=useState(false);
  const filtAll=APPLICANTS.filter(a=>filt==="الكل"||a.status===filt);
  const stepIdx=CERT_STEPS.indexOf(sel?.status);
  return(
    <div style={{display:"flex",height:"100%"}}>
      <div style={{width:280,flexShrink:0,display:"flex",flexDirection:"column",borderLeft:`1px solid ${t.border}`}}>
        <div style={{padding:"10px 10px 7px",borderBottom:`1px solid ${t.border}`}}>
          <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
            {["الكل","تم التقديم","مقبول","أنهى الجلسات","مؤهل للامتحان","ناجح"].map(s=>(
              <button key={s} onClick={()=>setFilt(s)} style={{padding:"3px 8px",borderRadius:20,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:10,fontWeight:filt===s?700:400,background:filt===s?t.accent:"transparent",color:filt===s?"#fff":t.textMuted}}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {filtAll.map(a=>(
            <div key={a.id} onClick={()=>setSel(a)} style={{padding:"11px 12px",cursor:"pointer",borderBottom:`1px solid ${t.border}`,background:sel?.id===a.id?t.accentLight:t.bgSurface,borderRight:sel?.id===a.id?`3px solid ${t.accent}`:"3px solid transparent"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:600,color:t.text}}>{a.name}</span>
                <Badge s={a.status} t={t}/>
              </div>
              <div style={{fontSize:11,color:t.textMuted}}>جلسات: {a.sessions} {!a.docs&&"• وثائق ناقصة ⚠"}</div>
            </div>
          ))}
        </div>
        <div style={{padding:"10px 10px",borderTop:`1px solid ${t.border}`}}>
          <Btn label="+ تقديم جديد" onClick={()=>setNewModal(true)} t={t} sz="sm" style={{width:"100%"}}/>
        </div>
      </div>
      {sel&&(
        <div style={{flex:1,overflowY:"auto",padding:"20px 22px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div>
              <div style={{fontSize:17,fontWeight:700,color:t.text}}>{sel.name}</div>
              <div style={{marginTop:5}}><Badge s={sel.status} t={t}/></div>
            </div>
            <div style={{display:"flex",gap:7}}>
              {(sel.status==="مقبول"||sel.status==="أنهى الجلسات")&&<Btn label="📢 إشعار الطالب" onClick={()=>setNotifModal(sel)} t={t} sz="sm" v="secondary"/>}
              {sel.status==="مؤهل للامتحان"&&<Btn label="📢 إشعار موعد الامتحان" onClick={()=>setNotifModal({...sel,type:"exam"})} t={t} sz="sm" v="secondary"/>}
              {sel.status==="مؤهل للامتحان"&&<Btn label="تحديث النتيجة" onClick={()=>setResultModal(sel)} t={t} sz="sm"/>}
            </div>
          </div>
          <Card t={t} p={18} mb={14}>
            <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:14}}>مسار الشهادة</div>
            <div style={{display:"flex",alignItems:"center"}}>
              {CERT_STEPS.map((step,i)=>{
                const done=i<=stepIdx;
                return(
                  <div key={step} style={{flex:1,display:"flex",alignItems:"center"}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:"0 0 auto",minWidth:65}}>
                      <div style={{width:26,height:26,borderRadius:"50%",background:done?t.grad:t.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700,boxShadow:i===stepIdx?`0 0 0 3px ${t.accent}40`:"none"}}>{done?"✓":i+1}</div>
                      <div style={{fontSize:9,color:done?t.accentText:t.textMuted,marginTop:4,textAlign:"center",lineHeight:1.3}}>{step}</div>
                    </div>
                    {i<CERT_STEPS.length-1&&<div style={{flex:1,height:2,background:i<stepIdx?t.accent:t.border,margin:"0 3px",marginBottom:18}}/>}
                  </div>
                );
              })}
            </div>
          </Card>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Card t={t} p={14}>
              <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:8}}>تفاصيل الطلب</div>
              <InfoRow k="الدفع" v={sel.paid?"مدفوع":"معلق"} t={t}/>
              <InfoRow k="الوثائق" v={sel.docs?"مكتملة ✓":"ناقصة ⚠"} t={t}/>
              <InfoRow k="الجلسات الإجبارية" v={sel.sessions} t={t}/>
              <InfoRow k="موعد الامتحان" v={sel.exam_date} t={t}/>
              <InfoRow k="مسجل في النقل" v={sel.transport?"مسجل":"غير مسجل"} t={t}/>
            </Card>
            <Card t={t} p={14}>
              <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:8}}>الإجراءات المتاحة</div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {!sel.docs&&<Btn label="✓ تأكيد تسليم الوثائق" t={t} sz="sm" v="secondary" style={{width:"100%"}}/>}
                {sel.status==="تم التقديم"&&<Btn label="تحديث: مقبول من الوزارة" t={t} sz="sm" v="secondary" style={{width:"100%"}}/>}
                {sel.status==="مقبول"&&<><Btn label="  إشعار بمواعيد الجلسات + النقل" onClick={()=>setNotifModal(sel)} t={t} sz="sm" style={{width:"100%"}}/><Btn label="تحديث: أنهى الجلسات الثلاث" t={t} sz="sm" v="secondary" style={{width:"100%"}}/></>}
                {sel.status==="أنهى الجلسات"&&<Btn label="إدخال موعد الامتحان" t={t} sz="sm" style={{width:"100%"}}/>}
                {sel.status==="مؤهل للامتحان"&&<><Btn label="✓ ناجح" onClick={()=>setResultModal({...sel,res:"ناجح"})} t={t} sz="sm" style={{width:"100%"}}/><Btn label="✗ راسب" onClick={()=>setResultModal({...sel,res:"راسب"})} t={t} sz="sm" v="danger" style={{width:"100%"}}/></>}
                {sel.status==="ناجح"&&<div style={{padding:"9px 12px",borderRadius:8,background:t.completed.bg,fontSize:12,color:t.completed.text,fontWeight:600}}>🎉 ناجح — يمكنه استلام الشهادة</div>}
              </div>
            </Card>
          </div>
        </div>
      )}
      {notifModal&&<Modal title="إرسال إشعار للطالب" onClose={()=>setNotifModal(null)} t={t} width={480}>
        <div style={{marginBottom:10}}><label style={{fontSize:12,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>المستلم</label><div style={{padding:"9px 12px",borderRadius:9,background:t.accentLight,color:t.accentText,fontSize:13,fontWeight:600}}>{notifModal.name}</div></div>
        <div style={{marginBottom:10}}><label style={{fontSize:12,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>نوع الإشعار</label>
          <select style={{width:"100%",padding:"9px 10px",borderRadius:9,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit"}}>
            <option>قبول الطلب + مواعيد الجلسات الثلاث + تذكير بخدمة النقل</option>
            <option>موعد الامتحان + مكانه + تذكير بخدمة النقل</option>
            <option>نتيجة الامتحان — ناجح + موعد استلام الشهادة</option>
          </select>
        </div>
        {notifModal.status==="مقبول"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
          {["اليوم الأول","اليوم الثاني","اليوم الثالث"].map(d=> (
            <div key={d}><label style={{fontSize:10,fontWeight:600,color:t.textSec,display:"block",marginBottom:3}}>{d}</label><input type="date" style={{width:"100%",padding:"7px 8px",borderRadius:7,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:11,fontFamily:"inherit",boxSizing:"border-box"}}/></div>
          ))}
        </div>}
        <div style={{padding:"10px 12px",borderRadius:9,background:t.bgElevated,border:`1px solid ${t.border}`,fontSize:12,color:t.text,lineHeight:1.7,marginBottom:12}}>
          عزيزي/عزيزتي {notifModal.name}، تم قبول طلبك للحصول على رخصة القيادة. يرجى الحضور للجلسات الإجبارية الثلاث. خدمة نقل جماعي متاحة — تواصل معنا للتسجيل. — مدرسة القيادة
        </div>
        <div style={{display:"flex",gap:8}}><Btn label="  إرسال الإشعار الآن" onClick={()=>setNotifModal(null)} t={t} style={{flex:1}}/><Btn label="إلغاء" onClick={()=>setNotifModal(null)} t={t} v="ghost"/></div>
      </Modal>}
      {resultModal&&<Modal title="تحديث نتيجة الامتحان" onClose={()=>setResultModal(null)} t={t} width={380}>
        <InfoRow k="الطالب" v={resultModal.name} t={t}/>
        <InfoRow k="موعد الامتحان" v={resultModal.exam_date} t={t}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,margin:"14px 0"}}>
          <button onClick={()=>setResultModal(null)} style={{padding:"16px",borderRadius:10,border:`2px solid ${t.completed.dot}`,background:t.completed.bg,color:t.completed.text,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✓ ناجح</button>
          <button onClick={()=>setResultModal(null)} style={{padding:"16px",borderRadius:10,border:`2px solid ${t.cancelled.dot}`,background:t.cancelled.bg,color:t.cancelled.text,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✗ راسب</button>
        </div>
        <div style={{padding:"9px 12px",borderRadius:9,background:t.accentLight,fontSize:11,color:t.accentText}}>💡 سيُرسَل إشعار تلقائي للطالب بنتيجته</div>
      </Modal>}
      {newModal&&<Modal title="تقديم طلب شهادة جديد" onClose={()=>setNewModal(false)} t={t} width={440}>
        <div style={{marginBottom:10}}><label style={{fontSize:12,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>الطالب</label>
          <select style={{width:"100%",padding:"9px 10px",borderRadius:9,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit"}}>
            {STUDENTS.filter(s=>s.status==="أنهى التدريب"||s.status==="طلب شهادة").map(s=><option key={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div style={{padding:"12px",borderRadius:9,background:t.accentLight,marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:t.accentText,marginBottom:6}}>الوثائق المطلوبة (لا تُخزَّن في النظام)</div>
          {["صورة شخصية حديثة","صورة الهوية أمامية","صورة الهوية خلفية"].map((d,i)=>(
            <div key={i} style={{display:"flex",gap:7,alignItems:"center",fontSize:12,color:t.accentText,padding:"3px 0"}}>
              <input type="checkbox" style={{accentColor:t.accent}}/><span>{d} — تأكيد التسليم للمركز</span>
            </div>
          ))}
        </div>
        <div style={{padding:"9px 12px",borderRadius:9,background:t.pending.bg,fontSize:13,fontWeight:700,color:t.pending.text,marginBottom:14}}>رسوم الشهادة الحكومية: ٥,٠٠٠ ل.س — تُدفع نقداً</div>
        <div style={{display:"flex",gap:8}}><Btn label="✓ تسجيل الطلب" onClick={()=>setNewModal(false)} t={t} style={{flex:1}}/><Btn label="إلغاء" onClick={()=>setNewModal(false)} t={t} v="ghost"/></div>
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
    <div dir="rtl" style={{display:"flex",height: embedded?"100%":"100vh",overflow:"hidden",background:t.bgApp,fontFamily:"var(--font-body)"}}>
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
