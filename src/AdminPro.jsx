import { useState } from "react";
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



const T={
  light:{bgApp:"#F8F9F5",bgSurface:"#FFFFFF",bgElevated:"#EEF2E4",bgSidebar:"linear-gradient(180deg,#778A3B 0%,#6B7C35 52%,#5F702D 100%)",bgSidebarActive:"#5F702D",text:"#1C1F18",textSec:"#4F5548",textMuted:"#747A70",textSidebar:"#F8F9F5",textSidebarActive:"#FFFFFF",border:"#DDE1D7",borderCard:"rgba(119,138,59,0.14)",accent:"#778A3B",accentLight:"#EEF2E4",accentText:"#5F702D",grad:"linear-gradient(135deg,#778A3B 0%,#5F702D 100%)",completed:{bg:"rgba(63,107,58,0.14)",text:"#3F6B3A",dot:"#3F6B3A"},pending:{bg:"rgba(201,138,40,0.14)",text:"#C98A28",dot:"#C98A28"},cancelled:{bg:"rgba(199,72,72,0.12)",text:"#C74848",dot:"#C74848"},confirmed:{bg:"rgba(119,138,59,0.12)",text:"#5F702D",dot:"#778A3B"},expired:{bg:"rgba(183,189,178,0.16)",text:"#747A70",dot:"#B7BDB2"},admin:{bg:"rgba(119,138,59,0.10)",text:"#5F702D",dot:"#778A3B"},shadow:"0 12px 28px rgba(119,138,59,0.10)",shadowLg:"0 20px 48px rgba(119,138,59,0.16)"},
  dark:{bgApp:"#20241D",bgSurface:"#2B3127",bgElevated:"#353D31",bgSidebar:"linear-gradient(180deg,#5F702D 0%,#4F5F29 52%,#414E24 100%)",bgSidebarActive:"#778A3B",text:"#F4F5EF",textSec:"#DDE1D7",textMuted:"#B7BDB2",textSidebar:"#F8F9F5",textSidebarActive:"#FFFFFF",border:"rgba(255,255,255,0.08)",borderCard:"rgba(221,225,215,0.12)",accent:"#778A3B",accentLight:"rgba(119,138,59,0.18)",accentText:"#EEF2E4",grad:"linear-gradient(135deg,#778A3B 0%,#5F702D 100%)",completed:{bg:"rgba(63,107,58,0.24)",text:"#B8D4B5",dot:"#B8D4B5"},pending:{bg:"rgba(201,138,40,0.20)",text:"#F0CB8C",dot:"#F0CB8C"},cancelled:{bg:"rgba(199,72,72,0.20)",text:"#F2B1B1",dot:"#F2B1B1"},confirmed:{bg:"rgba(119,138,59,0.20)",text:"#EEF2E4",dot:"#EEF2E4"},expired:{bg:"rgba(183,189,178,0.14)",text:"#D0D5CB",dot:"#D0D5CB"},admin:{bg:"rgba(119,138,59,0.18)",text:"#EEF2E4",dot:"#EEF2E4"},shadow:"0 12px 28px rgba(28,31,24,0.30)",shadowLg:"0 20px 48px rgba(28,31,24,0.40)"},
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
      icon: <IoIosCalendar />,
    },
    {
      label: "مكتملة اليوم",
      value: "٦",
      color: "#166534",
      sub: "٤٣٪",
      icon: "✔",
    },
    {
      label: "إيرادات اليوم",
      value: "٤,٥٠٠ ل.س",
      color: t.accent,
      sub: "تقديري",
      icon: <TbReportMoney />,
    },
    { label: "No-Show اليوم", value: "١", color: "#6B21A8", icon: "⚠" },
  ];
  const kpis2 = [
    {
      label: "إيرادات الشهر",
      value: "١٢٠,٠٠٠ ل.س",
      color: t.accent,
      icon: <PiChartLineUp size={38} color="#10B981" />,
    },
    {
      label: "مصاريف الشهر",
      value: "٣٥,٠٠٠ ل.س",
      color: "#b91c1c",
      icon: <PiChartLineDown size={38} color="#10B981" />,
    },
    {
      label: "صافي الربح",
      value: "٨٥,٠٠٠ ل.س",
      color: "#166534",
      icon: <MdOutlineAttachMoney size={38} color="#10B981" />,
    },
    {
      label: "ضريبة مستحقة",
      value: "١٧,٠٠٠ ل.س",
      color: "#b91c1c",
      icon: <TbReceiptTax size={38} color="#10B981" />,
    },
    {
      label: "طلاب جدد الشهر",
      value: "١٢",
      color: "#1D4ED8",
      icon: <PiUsersThin size={38} color="#10B981" />,
    },
    {
      label: "دروس مكتملة",
      value: "٨٦",
      color: t.accent,
      icon: <PiMedalFill size={38} color=" #10B981" />,
    },
    {
      label: "طلبات شهادة",
      value: "٨",
      color: "#6B21A8",
      icon: <IoDocumentTextOutline size={38} color="#10B981" />,
    },
    {
      label: "رحلات نقل",
      value: "٢",
      color: "#92400E",
      icon: <TbBus size={38} color="#10B981" />,
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
function PgEmployees({t}){
  const [addModal,setAddModal]=useState(false);
  const employees=[
    {name:"محمد هاشم سرحان",user:"mhashm",roles:["مدير"],status:"نشط",last:"الآن"},
    {name:"أم كمال الرشيد",user:"umkamal",roles:["موظف إداري","محاسب"],status:"نشط",last:"منذ ساعة"},
    {name:"سلمى الأحمد",user:"salma.admin",roles:["موظف إداري"],status:"نشط",last:"منذ ساعتين"},
    {name:"خالد عمر الزيد",user:"khalid.omar",roles:["مدرب"],status:"نشط",last:"أمس"},
    {name:"ليلى سعد حمود",user:"layla.saad",roles:["مدرب"],status:"نشط",last:"أمس"},
    {name:"أحمد محمد الحسن",user:"ahmed.student",roles:["طالب"],status:"نشط",last:"اليوم"},
    {name:"سعد القديمي",user:"saad.old",roles:["موظف إداري"],status:"موقوف",last:"منذ ٦ أشهر"},
  ];
  const roleColors={"مدير":"#6B21A8","موظف إداري":"#1D4ED8","محاسب":"#92400E","مدرب":"#C2410C","طالب":"#166534"};
  return(
    <div style={{padding:"20px 24px",overflowY:"auto",flex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><div style={{fontSize:20,fontWeight:700,color:t.text}}>الموظفون والمستخدمون</div><div style={{fontSize:13,color:t.textSec,marginTop:2}}>{employees.length} مستخدم مسجل</div></div>
        <Btn label="+ إضافة موظف" onClick={()=>setAddModal(true)} t={t}/>
      </div>
      <div style={{borderRadius:11,border:`1px solid ${t.border}`,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:t.bgElevated}}>{["الاسم","اسم المستخدم","الأدوار","الحالة","آخر دخول",""].map((h,i)=><th key={i} style={{padding:"10px 14px",textAlign:"right",color:t.textMuted,fontWeight:600,fontSize:11,borderBottom:`1px solid ${t.border}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {employees.map((emp,i)=>(
              <tr key={i} style={{background:i%2===0?t.bgSurface:t.bgElevated,borderBottom:`1px solid ${t.border}`}}>
                <td style={{padding:"11px 14px",fontWeight:600,color:t.text}}>{emp.name}</td>
                <td style={{padding:"11px 14px",color:t.textSec,fontSize:12}}>{emp.user}</td>
                <td style={{padding:"11px 14px"}}>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {emp.roles.map(r=><span key={r} style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:600,background:`${roleColors[r]}18`,color:roleColors[r]}}>{r}</span>)}
                  </div>
                </td>
                <td style={{padding:"11px 14px"}}><Badge s={emp.status} t={t}/></td>
                <td style={{padding:"11px 14px",color:t.textMuted,fontSize:12}}>{emp.last}</td>
                <td style={{padding:"11px 14px"}}>
                  <div style={{display:"flex",gap:5}}>
                    <Btn label="تعديل" t={t} sz="sm" v="ghost"/>
                    <Btn label={emp.status==="نشط"?"تعطيل":"تفعيل"} t={t} sz="sm" v={emp.status==="نشط"?"danger":"secondary"}/>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {addModal&&<Modal title="إضافة موظف جديد" onClose={()=>setAddModal(false)} t={t} width={500}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          {[{l:"الاسم الكامل",type:"text",ph:"محمد أحمد..."},{l:"رقم الهاتف",type:"tel",ph:"09X XXX XXXX"},{l:"اسم المستخدم",type:"text",ph:"user.name"},{l:"كلمة المرور الابتدائية",type:"password",ph:"••••••••"}].map((f,i)=>(
            <div key={i}><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>{f.l}</label><input type={f.type} placeholder={f.ph} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:12,fontFamily:"inherit",boxSizing:"border-box"}}/></div>
          ))}
        </div>
        <div style={{marginBottom:12}}><div style={{fontSize:11,fontWeight:600,color:t.textSec,marginBottom:8}}>الأدوار والصلاحيات</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {["موظف إداري","محاسب","مدرب"].map(role=>(
              <div key={role} style={{display:"flex",gap:8,alignItems:"center",padding:"6px 10px",borderRadius:7,border:`1px solid ${t.border}`}}>
                <input type="checkbox" style={{accentColor:t.accent}}/>
                <span style={{fontSize:12,fontWeight:600,color:t.text}}>{role}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:8}}><Btn label="✓ إنشاء الحساب" onClick={()=>setAddModal(false)} t={t} style={{flex:1}}/><Btn label="إلغاء" onClick={()=>setAddModal(false)} t={t} v="ghost"/></div>
      </Modal>}
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
function PgPricing({t}){
  const [editModal,setEditModal]=useState(null);
  const prices=[
    {label:"درس عادي — مدرب ذكر",value:"٣,٠٠٠",key:"m_manual"},
    {label:"درس أوتوماتيك — مدرب ذكر",value:"٣,٥٠٠",key:"m_auto"},
    {label:"درس عادي — مدربة أنثى",value:"٣,٢٠٠",key:"f_manual"},
    {label:"درس أوتوماتيك — مدربة أنثى",value:"٣,٧٠٠",key:"f_auto"},
    {label:"رسوم الشهادة الحكومية",value:"٥,٠٠٠",key:"cert"},
    {label:"رسوم نقل المحاضرات",value:"٢,٠٠٠",key:"transport_lec"},
    {label:"رسوم نقل يوم الامتحان",value:"٨٠٠",key:"transport_exam"},
  ];
  return(
    <div style={{padding:"20px 24px",overflowY:"auto",flex:1}}>
      <div style={{fontSize:20,fontWeight:700,color:t.text,marginBottom:6}}>الأسعار والرسوم</div>
      <div style={{padding:"10px 14px",borderRadius:9,background:"#FFF1F2",border:"1px solid #FECDD3",marginBottom:16,fontSize:12,color:"#9F1239",fontWeight:600}}>⚠ التعديل من هنا يطبق على الحجوزات الجديدة فقط ويُسجَّل في سجل النشاط باسمك</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[["أسعار دروس التدريب (٤ أسعار)",prices.slice(0,4)],["رسوم الخدمات الأخرى",prices.slice(4)]].map(([title,group],gi)=>(
          <div key={gi}>
            <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:10,paddingRight:4,borderRight:`3px solid ${t.accent}`}}>{title}</div>
            <div style={{background:t.bgSurface,borderRadius:12,border:`1px solid ${t.borderCard}`,padding:16}}>
              {group.map(p=>(
                <div key={p.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${t.border}`}}>
                  <span style={{fontSize:12,color:t.textSec}}>{p.label}</span>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:15,fontWeight:700,color:t.accent}}>{p.value} ل.س</span>
                    <Btn label="تعديل" onClick={()=>setEditModal(p)} t={t} sz="sm" v="secondary"/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {editModal&&<Modal title="تعديل السعر" onClose={()=>setEditModal(null)} t={t} width={360}>
        <div style={{marginBottom:10}}><label style={{fontSize:12,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>الخدمة</label><div style={{padding:"9px 12px",borderRadius:9,background:t.accentLight,color:t.accentText,fontSize:13,fontWeight:600}}>{editModal.label}</div></div>
        <div style={{marginBottom:10}}><label style={{fontSize:12,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>السعر الجديد (ل.س)</label><input type="number" placeholder={editModal.value.replace(",","")} style={{width:"100%",padding:"9px 12px",borderRadius:9,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}}/></div>
        <div style={{padding:"9px 12px",borderRadius:9,background:"#FFFBEB",fontSize:11,color:"#92400E",marginBottom:12}}>⚠ سيُسجَّل التعديل في سجل النشاط</div>
        <div style={{display:"flex",gap:8}}><Btn label="✓ حفظ التعديل" onClick={()=>setEditModal(null)} t={t} style={{flex:1}}/><Btn label="إلغاء" onClick={()=>setEditModal(null)} t={t} v="ghost"/></div>
      </Modal>}
    </div>
  );
}

const NAV = [
  { id: "dash", label: "لوحة التحكم", icon: "⊞" },
  { id: "employees", label: "الموظفون", icon: <FaUserTie /> },
  { id: "permissions", label: "الصلاحيات", icon: <IoIosUnlock /> },
  { id: "pricing", label: "الأسعار والرسوم", icon: <TbReportMoney /> },
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
