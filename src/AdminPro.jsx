import { useState, useEffect, useMemo } from "react";
import { IoIosUnlock } from "react-icons/io";
import { TbReportMoney } from "react-icons/tb";
import { LuShieldCheck, LuChevronDown } from "react-icons/lu";
import { settingsService, rolesService, employeesService } from "./api";
import { ROLE_LABELS, P } from "./constants/roles";
import RequirePermission from "./components/RequirePermission";



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

function Modal({title,onClose,children,t,width=500}){return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(2px)"}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:t.bgSurface,borderRadius:16,width,maxWidth:"calc(100vw - 40px)",maxHeight:"85vh",overflow:"hidden",boxShadow:t.shadowLg,display:"flex",flexDirection:"column"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:`1px solid ${t.border}`}}><div style={{fontSize:16,fontWeight:700,color:t.text}}>{title}</div><button onClick={onClose} style={{width:28,height:28,borderRadius:7,border:"none",background:t.bgElevated,cursor:"pointer",fontSize:16,color:t.textMuted}}>✕</button></div><div style={{padding:"18px 20px",overflowY:"auto"}}>{children}</div></div></div>;}
function Btn({label,onClick,v="primary",sz="md",t,style={}}){const base={padding:sz==="sm"?"4px 11px":"9px 18px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:sz==="sm"?12:14,fontWeight:600};const vs={primary:{background:t.grad,color:"#fff"},secondary:{background:t.accentLight,color:t.accentText,border:`1px solid ${t.accent}30`},danger:{background:"#FFF1F2",color:"#9F1239",border:"1px solid #FECDD3"},ghost:{background:"transparent",color:t.textSec,border:`1px solid ${t.border}`}};return <button onClick={onClick} style={{...base,...vs[v],...style}}>{label}</button>;}

// ─── ROLES & PERMISSIONS MANAGEMENT ───

function normalizeRole(r){
  const code=r.title||r.code||r.role||r.name||"";
  return{
    id:r.id??r.roleId??code,
    code,
    label:r.label||ROLE_LABELS[code]||code,
    permissionsCount:r.permissionsCount??r.permissionCount??(Array.isArray(r.permissions)?r.permissions.length:0),
    editable: typeof r.editable==="boolean" ? r.editable : code!=="MANAGER",
  };
}

// Normalizes GET /roles/permissions-catalog and GET /roles/:id into a common
// [{module, moduleLabel, permissions:[{code,label,granted}]}] shape, regardless
// of whether the backend returns permissions already grouped by module or as
// a flat list carrying a module/moduleLabel field on each item.
function normalizeCatalog(raw){
  let list=raw;
  if(!Array.isArray(list)){
    list=raw?.permissionGroups||raw?.modules||raw?.catalog||raw?.permissions||raw?.data||[];
  }
  if(!Array.isArray(list))list=[];

  const alreadyGrouped=list.length>0&&Array.isArray(list[0]?.permissions);
  if(alreadyGrouped){
    return list.map((g,idx)=>({
      module:g.module||g.moduleCode||g.moduleLabel||g.title||`module-${idx}`,
      moduleLabel:g.moduleLabel||g.label||g.title||g.module||"أخرى",
      permissions:(g.permissions||[]).map(p=>({
        code:p.code||p.permissionCode||p.key,
        label:p.label||p.description||p.code,
        granted:!!p.granted,
      })),
    }));
  }

  const groupsMap=new Map();
  list.forEach(p=>{
    const code=p.code||p.permissionCode||p.key;
    if(!code)return;
    const moduleKey=p.module||p.moduleCode||p.moduleLabel||"other";
    const moduleLabel=p.moduleLabel||p.module||"أخرى";
    if(!groupsMap.has(moduleKey))groupsMap.set(moduleKey,{module:moduleKey,moduleLabel,permissions:[]});
    groupsMap.get(moduleKey).permissions.push({
      code,
      label:p.label||p.description||code,
      granted:!!p.granted,
    });
  });
  return Array.from(groupsMap.values());
}

function RoleTabs({roles,activeId,onSelect,t}){
  return(
    <div style={{display:"flex",gap:6,flexWrap:"wrap",borderBottom:`1px solid ${t.border}`,marginBottom:20}}>
      {roles.map(role=>{
        const active=role.id===activeId;
        return(
          <button
            key={role.id}
            onClick={()=>onSelect(role.id)}
            style={{
              display:"flex",alignItems:"center",gap:7,
              padding:"11px 18px",
              borderRadius:"10px 10px 0 0",
              border:"none",
              borderBottom:active?`3px solid ${t.accent}`:"3px solid transparent",
              background:active?t.bgSurface:"transparent",
              color:active?t.text:t.textSec,
              fontWeight:active?700:600,
              fontSize:13.5,
              cursor:"pointer",
              fontFamily:"inherit",
              transition:"all 0.15s",
              marginBottom:-1,
            }}
          >
            {!role.editable&&<LuShieldCheck size={13} style={{color:active?t.accentText:t.textMuted,flexShrink:0}}/>}
            <span>{role.label}</span>
            <span style={{fontSize:10.5,fontWeight:700,padding:"1px 8px",borderRadius:20,background:active?t.accentLight:t.bgElevated,color:active?t.accentText:t.textMuted}}>{role.permissionsCount}</span>
          </button>
        );
      })}
    </div>
  );
}

function RoleTabsSkeleton({t}){
  return(
    <div style={{display:"flex",gap:8,borderBottom:`1px solid ${t.border}`,marginBottom:20,paddingBottom:12}}>
      {[90,110,100,90,80].map((w,i)=>(
        <div key={i} style={{width:w,height:34,borderRadius:9,background:t.bgElevated,overflow:"hidden",position:"relative"}}>
          <div style={{position:"absolute",inset:0,background:`linear-gradient(90deg,transparent,${t.border},transparent)`,animation:"rpShimmer 1.4s infinite"}}/>
        </div>
      ))}
    </div>
  );
}

function ModuleCardSkeleton({t}){
  return(
    <div style={{background:t.bgSurface,border:`1px solid ${t.borderCard}`,borderRadius:14,overflow:"hidden"}}>
      <div style={{padding:"12px 16px",background:t.bgElevated,height:40}}/>
      <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
        {[70,55,62].map((w,i)=>(
          <div key={i} style={{height:14,borderRadius:5,background:t.bgElevated,width:`${w}%`,overflow:"hidden",position:"relative"}}>
            <div style={{position:"absolute",inset:0,background:`linear-gradient(90deg,transparent,${t.border},transparent)`,animation:"rpShimmer 1.4s infinite"}}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManagerBanner({t}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px",borderRadius:12,background:t.accentLight,border:`1px solid ${t.accent}30`,marginBottom:16,color:t.accentText,fontSize:13,fontWeight:600}}>
      <LuShieldCheck size={18} style={{flexShrink:0}}/>
      دور المدير يملك كافة الصلاحيات بشكل ثابت ولا يمكن تعديله
    </div>
  );
}

function ModuleCard({group,checked,onToggle,onToggleAll,disabled,t}){
  const allChecked=group.permissions.length>0&&group.permissions.every(p=>checked.has(p.code));
  return(
    <div style={{background:t.bgSurface,border:`1px solid ${t.borderCard}`,borderRadius:14,overflow:"hidden",boxShadow:t.shadow}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 16px",background:t.bgElevated,borderBottom:`1px solid ${t.border}`}}>
        <span style={{fontSize:13.5,fontWeight:700,color:t.text}}>{group.moduleLabel}</span>
        {!disabled&&(
          <button onClick={()=>onToggleAll(group,!allChecked)} style={{background:"none",border:"none",cursor:"pointer",fontSize:11.5,fontWeight:600,color:t.accentText,fontFamily:"inherit"}}>
            {allChecked?"إلغاء تحديد الكل":"تحديد الكل"}
          </button>
        )}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:"3px 14px",padding:"13px 16px"}}>
        {group.permissions.map(p=>(
          <label key={p.code} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",fontSize:12.5,color:disabled?t.textMuted:t.text,cursor:disabled?"default":"pointer"}}>
            <input
              type="checkbox"
              checked={checked.has(p.code)}
              disabled={disabled}
              onChange={()=>onToggle(p.code)}
              style={{width:16,height:16,accentColor:t.accent,cursor:disabled?"default":"pointer",flexShrink:0}}
            />
            <span>{p.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function SaveBar({checked,isDirty,saving,onSave,onReset,t}){
  return(
    <div style={{position:"sticky",bottom:0,marginTop:20,padding:"14px 18px",background:t.bgSurface,border:`1px solid ${t.borderCard}`,borderRadius:14,boxShadow:t.shadowLg,display:"flex",alignItems:"center",justifyContent:"space-between",gap:14,flexWrap:"wrap"}}>
      <div style={{fontSize:12,color:t.textMuted}}>
        {isDirty&&<span style={{color:"#C98A28",fontWeight:700}}>● لديك تغييرات غير محفوظة — </span>}
        المحدد حالياً: <strong style={{color:t.accent}}>{checked.size}</strong> صلاحية
      </div>
      <div style={{display:"flex",gap:8}}>
        {isDirty&&<Btn label="تراجع عن التغييرات" onClick={onReset} t={t} v="ghost" sz="sm"/>}
        <button onClick={onSave} disabled={saving||!isDirty} style={{padding:"9px 22px",borderRadius:10,border:"none",cursor:(saving||!isDirty)?"not-allowed":"pointer",background:(saving||!isDirty)?t.textMuted:t.grad,color:"#fff",fontSize:13,fontWeight:700,fontFamily:"inherit",transition:"background 0.15s"}}>
          {saving?"جارٍ الحفظ...":"حفظ التغييرات"}
        </button>
      </div>
    </div>
  );
}

function RolePermissionsPanel({roleId,roleMeta,t,showToast,onSaved}){
  const [role,setRole]=useState(null);
  const [groups,setGroups]=useState(null);
  const [checked,setChecked]=useState(new Set());
  const [initialChecked,setInitialChecked]=useState(new Set());
  const [loading,setLoading]=useState(true);
  const [loadError,setLoadError]=useState(null);
  const [saving,setSaving]=useState(false);

  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      setLoading(true);setLoadError(null);
      try{
        const res=await rolesService.getById(roleId);
        const body=res.data?.data??res.data;
        const normalized=normalizeCatalog(body);
        const initial=new Set();
        normalized.forEach(g=>g.permissions.forEach(p=>{if(p.granted)initial.add(p.code);}));
        if(!cancelled){
          setRole(body);
          setGroups(normalized);
          setChecked(new Set(initial));
          setInitialChecked(initial);
        }
      }catch(err){
        if(!cancelled)setLoadError(err.response?.data?.message||err.message||"فشل تحميل صلاحيات الدور");
      }finally{
        if(!cancelled)setLoading(false);
      }
    })();
    return()=>{cancelled=true;};
  },[roleId]);

  const isEditable=role?role.editable!==false:(roleMeta?.editable??true);

  const toggle=(code)=>{
    if(!isEditable)return;
    setChecked(prev=>{
      const next=new Set(prev);
      if(next.has(code))next.delete(code);else next.add(code);
      return next;
    });
  };

  const toggleAll=(group,value)=>{
    if(!isEditable)return;
    setChecked(prev=>{
      const next=new Set(prev);
      group.permissions.forEach(p=>{if(value)next.add(p.code);else next.delete(p.code);});
      return next;
    });
  };

  const resetChecked=()=>setChecked(new Set(initialChecked));

  const isDirty=useMemo(()=>{
    if(checked.size!==initialChecked.size)return true;
    for(const c of checked)if(!initialChecked.has(c))return true;
    return false;
  },[checked,initialChecked]);

  const handleSave=async()=>{
    if(saving||!isDirty||!isEditable)return;
    setSaving(true);
    try{
      await rolesService.updatePermissions(roleId,Array.from(checked));
      setInitialChecked(new Set(checked));
      showToast("تم تحديث صلاحيات الدور بنجاح");
      onSaved(checked.size);
    }catch(err){
      const msg=err.response?.data?.message||err.message||"حدث خطأ أثناء حفظ الصلاحيات";
      showToast(Array.isArray(msg)?msg.join("، "):msg,true);
    }finally{
      setSaving(false);
    }
  };

  if(loading)return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
      {[0,1,2,3].map(i=><ModuleCardSkeleton key={i} t={t}/>)}
    </div>
  );

  if(loadError)return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,gap:10}}>
      <div style={{fontSize:13,color:"#c74848",fontWeight:600}}>{loadError}</div>
    </div>
  );

  return(
    <div>
      {!isEditable&&<ManagerBanner t={t}/>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
        {groups.map(g=>(
          <ModuleCard key={g.module} group={g} checked={checked} onToggle={toggle} onToggleAll={toggleAll} disabled={!isEditable} t={t}/>
        ))}
      </div>
      {isEditable&&<SaveBar checked={checked} isDirty={isDirty} saving={saving} onSave={handleSave} onReset={resetChecked} t={t}/>}
    </div>
  );
}

function CatalogInlineSection({t}){
  const [open,setOpen]=useState(false);
  const [groups,setGroups]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);

  const toggleOpen=()=>{
    const next=!open;
    setOpen(next);
    if(next&&!groups&&!loading){
      setLoading(true);setError(null);
      rolesService.getCatalog()
        .then(res=>{
          const body=res.data?.data??res.data;
          setGroups(normalizeCatalog(body));
        })
        .catch(err=>{
          setError(err.response?.data?.message||err.message||"فشل تحميل كتالوج الصلاحيات");
        })
        .finally(()=>setLoading(false));
    }
  };

  return(
    <div style={{marginBottom:24,border:`1px solid ${t.borderCard}`,borderRadius:14,overflow:"hidden"}}>
      <button onClick={toggleOpen} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 18px",background:t.bgElevated,border:"none",cursor:"pointer",fontFamily:"inherit"}}>
        <span style={{fontSize:13.5,fontWeight:700,color:t.text}}>كتالوج الصلاحيات الكامل بالنظام (مرجع للقراءة فقط)</span>
        <LuChevronDown size={16} style={{color:t.textMuted,transform:open?"rotate(180deg)":"none",transition:"transform 0.15s",flexShrink:0}}/>
      </button>
      {open&&(
        <div style={{padding:"16px 18px",background:t.bgSurface,borderTop:`1px solid ${t.border}`}}>
          {loading?(
            <div style={{textAlign:"center",padding:20,color:t.textMuted,fontSize:13}}>جارٍ التحميل...</div>
          ):error?(
            <div style={{textAlign:"center",padding:20,color:"#c74848",fontSize:13,fontWeight:600}}>{error}</div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
              {groups?.map(group=>(
                <div key={group.module} style={{border:`1px solid ${t.border}`,borderRadius:11,overflow:"hidden"}}>
                  <div style={{padding:"8px 12px",background:t.bgElevated,fontSize:12.5,fontWeight:700,color:t.text}}>{group.moduleLabel}</div>
                  <div style={{padding:"8px 12px",display:"flex",flexDirection:"column",gap:5}}>
                    {group.permissions.map(p=>(
                      <div key={p.code} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,fontSize:12,color:t.textSec,padding:"2px 0"}}>
                        <span>{p.label}</span>
                        <code style={{fontSize:10,color:t.textMuted,background:t.bgElevated,padding:"2px 6px",borderRadius:5,direction:"ltr",flexShrink:0}}>{p.code}</code>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const EMP_ROLE_STATUS_LABEL={ACTIVE:"نشط",BLOCKED:"موقوف",ARCHIVED:"مؤرشف"};

function EmpStatusBadge({status,t}){
  const map={
    ACTIVE:t.completed,
    BLOCKED:t.cancelled,
    ARCHIVED:t.expired,
  };
  const c=map[status]||t.expired;
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:5,background:c.bg,color:c.text,padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:c.dot,flexShrink:0}}/>
      {EMP_ROLE_STATUS_LABEL[status]||status}
    </span>
  );
}

function EmployeeRoleSection({t,showToast}){
  const [employees,setEmployees]=useState([]);
  const [loading,setLoading]=useState(true);
  const [updating,setUpdating]=useState(null);
  const [refresh,setRefresh]=useState(0);

  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      setLoading(true);
      try{
        const res=await employeesService.getAll();
        const body=res.data?.data||res.data;
        if(!cancelled)setEmployees(Array.isArray(body)?body:[]);
      }catch{
        if(!cancelled)setEmployees([]);
      }finally{
        if(!cancelled)setLoading(false);
      }
    })();
    return()=>{cancelled=true;};
  },[refresh]);

  const handleRoleChange=async(emp,newRole)=>{
    if(!newRole||newRole===emp.role||updating)return;
    setUpdating(emp.employeeId);
    try{
      await employeesService.updateRole(emp.employeeId,newRole);
      showToast("تم تغيير دور الموظف بنجاح");
      setRefresh(k=>k+1);
    }catch(err){
      const msg=err.response?.data?.message||err.message||"حدث خطأ أثناء تغيير الدور";
      showToast(Array.isArray(msg)?msg.join("، "):msg,true);
    }finally{
      setUpdating(null);
    }
  };

  return(
    <div>
      <div style={{fontSize:16,fontWeight:700,color:t.text,marginBottom:4}}>إسناد الأدوار للموظفين</div>
      <div style={{fontSize:12,color:t.textMuted,marginBottom:12}}>تغيير دور موظف بين استقبال ومحاسبة — يُطبَّق فوراً عند الاختيار</div>
      {loading?(
        <div style={{padding:30,textAlign:"center",color:t.textMuted,fontSize:13}}>جارٍ تحميل الموظفين...</div>
      ):employees.length===0?(
        <div style={{padding:30,textAlign:"center",color:t.textMuted,fontSize:13}}>لا يوجد موظفون مسجلون بعد</div>
      ):(
        <div style={{borderRadius:11,border:`1px solid ${t.border}`,overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:t.bgElevated}}>
                {["الاسم","رقم الهاتف","الحالة","الدور الحالي"].map((h,i)=>(
                  <th key={i} style={{padding:"10px 14px",textAlign:"right",color:t.textMuted,fontWeight:600,fontSize:11,borderBottom:`1px solid ${t.border}`,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp,i)=>{
                const name=emp.user?.name||emp.name||"—";
                const phone=emp.user?.phone||emp.phone||"—";
                const status=emp.user?.accountStatus||emp.accountStatus||"ACTIVE";
                return(
                  <tr key={emp.employeeId??emp.id??i} style={{background:i%2===0?t.bgSurface:t.bgElevated,borderBottom:`1px solid ${t.border}`}}>
                    <td style={{padding:"11px 14px",fontWeight:600,color:t.text}}>{name}</td>
                    <td style={{padding:"11px 14px",color:t.textSec,fontSize:12,direction:"ltr",textAlign:"right"}}>{phone}</td>
                    <td style={{padding:"11px 14px"}}><EmpStatusBadge status={status} t={t}/></td>
                    <td style={{padding:"11px 14px"}}>
                      <select
                        value={emp.role||""}
                        disabled={updating===emp.employeeId}
                        onChange={e=>handleRoleChange(emp,e.target.value)}
                        style={{padding:"6px 10px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:12,fontFamily:"inherit",cursor:updating===emp.employeeId?"not-allowed":"pointer"}}
                      >
                        <option value="RECEPTIONIST">موظف استقبال</option>
                        <option value="ACCOUNTANT">محاسب</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PgPermissions({t}){
  const [roles,setRoles]=useState([]);
  const [rolesLoading,setRolesLoading]=useState(true);
  const [rolesError,setRolesError]=useState(null);
  const [rolesRefreshKey,setRolesRefreshKey]=useState(0);
  const [activeRoleId,setActiveRoleId]=useState(null);
  const [toast,setToast]=useState(null);

  const showToast=(msg,isErr=false)=>{setToast({msg,isErr});setTimeout(()=>setToast(null),3500);};

  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      setRolesLoading(true);setRolesError(null);
      try{
        const res=await rolesService.getAll();
        const body=res.data?.data??res.data;
        const list=Array.isArray(body)?body:(body?.roles||[]);
        const normalized=list.map(normalizeRole);
        if(!cancelled){
          setRoles(normalized);
          setActiveRoleId(prev=>(prev&&normalized.some(r=>r.id===prev))?prev:(normalized[0]?.id??null));
        }
      }catch(err){
        if(!cancelled)setRolesError(err.response?.data?.message||err.message||"فشل تحميل الأدوار");
      }finally{
        if(!cancelled)setRolesLoading(false);
      }
    })();
    return()=>{cancelled=true;};
  },[rolesRefreshKey]);

  const activeRoleMeta=roles.find(r=>r.id===activeRoleId)||null;

  return(
    <div style={{padding:"20px 24px",overflowY:"auto",flex:1,position:"relative"}}>
      <style>{`@keyframes rpShimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
      {toast&&(
        <div style={{position:"fixed",top:22,left:"50%",transform:"translateX(-50%)",zIndex:3000,background:toast.isErr?"#9F1239":"#3F6B3A",color:"#fff",padding:"11px 26px",borderRadius:12,fontSize:13,fontWeight:600,boxShadow:"0 8px 28px rgba(0,0,0,0.22)",whiteSpace:"nowrap",pointerEvents:"none"}}>
          {toast.msg}
        </div>
      )}

      <div style={{marginBottom:18}}>
        <div style={{fontSize:20,fontWeight:700,color:t.text}}>إدارة الأدوار والصلاحيات</div>
        <div style={{fontSize:13,color:t.textSec,marginTop:2}}>اختر دوراً من الأعلى لعرض صلاحياته وتعديلها</div>
      </div>

      <CatalogInlineSection t={t}/>

      {rolesLoading?(
        <RoleTabsSkeleton t={t}/>
      ):rolesError?(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,gap:10}}>
          <div style={{fontSize:13,color:"#c74848",fontWeight:600}}>{rolesError}</div>
          <Btn label="إعادة المحاولة" onClick={()=>setRolesRefreshKey(k=>k+1)} t={t}/>
        </div>
      ):(
        <>
          <RoleTabs roles={roles} activeId={activeRoleId} onSelect={setActiveRoleId} t={t}/>
          {activeRoleId&&(
            <RolePermissionsPanel
              key={activeRoleId}
              roleId={activeRoleId}
              roleMeta={activeRoleMeta}
              t={t}
              showToast={showToast}
              onSaved={(newCount)=>{
                setRoles(prev=>prev.map(r=>r.id===activeRoleId?{...r,permissionsCount:newCount}:r));
              }}
            />
          )}
        </>
      )}

      <div style={{marginTop:32,paddingTop:24,borderTop:`1px solid ${t.border}`}}>
        <EmployeeRoleSection t={t} showToast={showToast}/>
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
  { id: "permissions", label: "الصلاحيات", icon: <IoIosUnlock /> },
  { id: "pricing", label: "الأسعار وإعدادات النظام", icon: <TbReportMoney /> },
];

export default function AdminPro({embedded=false,page:forcedPage,darkMode}){
  const [localDark,setLocalDark]=useState(false);
  const dark = (embedded && typeof darkMode !== 'undefined') ? darkMode : localDark;
  const [page,setPage]=useState(forcedPage||"permissions");
  const [collapsed,setCollapsed]=useState(false);
  const t=T[dark?"dark":"light"];
  const sidebarWidth = collapsed ? 84 : 320;
  // sync when parent forces a page (embedded mode)
  if(forcedPage && forcedPage!==page){ setPage(forcedPage); }
  const pages={
    permissions:<RequirePermission permission={P.ROLES_MANAGE} t={t}><PgPermissions t={t}/></RequirePermission>,
    pricing:<RequirePermission permission={P.SETTINGS_READ} t={t}><PgPricing t={t}/></RequirePermission>,
  };
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
