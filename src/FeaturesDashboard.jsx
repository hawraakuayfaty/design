import { useState, useMemo } from "react";
import { IoIosCalendar } from "react-icons/io";

import { FaUserTie } from "react-icons/fa";
import { PiUsersThin } from "react-icons/pi";
import { FaCar } from "react-icons/fa";
import { FaRegAddressCard } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaUserLock } from "react-icons/fa";
import { MdOutlineHolidayVillage } from "react-icons/md";
import { TbReportMoney } from "react-icons/tb";
import { TbReport } from "react-icons/tb";
import { FaBell } from "react-icons/fa6";

import { CiSettings } from "react-icons/ci";


const MODULES = [
  {
    id: "student",
    name: "إدارة الطالب",
    icon: <PiUsersThin />,
    header: "#1E40AF",
    bg: "#EFF6FF",
    border: "#BFDBFE",
  },
  {
    id: "instructor",
    name: "إدارة المدربين",
    icon: <FaUserTie />,
    header: "#166534",
    bg: "#F0FDF4",
    border: "#BBF7D0",
  },
  {
    id: "vehicle",
    name: "إدارة المركبات",
    icon: <FaCar />,
    header: "#92400E",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  {
    id: "booking",
    name: "الحجز والجدولة",
    icon: <IoIosCalendar />,
    header: "#991B1B",
    bg: "#FFF1F2",
    border: "#FECDD3",
  },
  {
    id: "payment",
    name: "الدفعات والعربون",
    icon: <FaRegAddressCard />,
    header: "#5B21B6",
    bg: "#FAF5FF",
    border: "#DDD6FE",
  },
  {
    id: "certificate",
    name: "الشهادة الحكومية",
    icon: <IoDocumentTextOutline />,
    header: "#155E75",
    bg: "#ECFEFF",
    border: "#A5F3FC",
  },
  {
    id: "transport",
    name: "خدمة النقل الجماعي",
    icon: "🚌",
    header: "#3B5323",
    bg: "#F7FEE7",
    border: "#BEF264",
  },
  {
    id: "leave",
    name: "إجازات المدربين",
    icon: <MdOutlineHolidayVillage />,
    header: "#9A3412",
    bg: "#FFF7ED",
    border: "#FED7AA",
  },
  {
    id: "accounting",
    name: "المحاسبة التشغيلية",
    icon: <TbReportMoney />,
    header: "#3730A3",
    bg: "#EEF2FF",
    border: "#C7D2FE",
  },
  {
    id: "users",
    name: "المستخدمين والصلاحيات",
    icon: <FaUserLock />,
    header: "#7C2D87",
    bg: "#FDF4FF",
    border: "#F0ABFC",
  },
  {
    id: "settings",
    name: "إعدادات النظام",
    icon: <CiSettings />,
    header: "#134E4A",
    bg: "#F0FDFA",
    border: "#99F6E4",
  },
  {
    id: "dashboard",
    name: "لوحة التحكم",
    icon: "⊞",
    header: "#881337",
    bg: "#FFF1F2",
    border: "#FECDD3",
  },
  {
    id: "reports",
    name: "التقارير الإدارية",
    icon: <TbReport />,
    header: "#0C4A6E",
    bg: "#F0F9FF",
    border: "#BAE6FD",
  },
  {
    id: "notifications",
    name: "الإشعارات",
    icon: <FaBell />,
    header: "#4C1D95",
    bg: "#FAF5FF",
    border: "#DDD6FE",
  },
];

const ROLES = [
  { key:"admin", label:"مدير",  short:"م",  color:"#DC2626", bg:"#FEE2E2", border:"#FCA5A5" },
  { key:"emp",   label:"موظف", short:"و",  color:"#2563EB", bg:"#DBEAFE", border:"#93C5FD" },
  { key:"acc",   label:"محاسب",short:"ح",  color:"#16A34A", bg:"#DCFCE7", border:"#86EFAC" },
  { key:"ins",   label:"مدرب", short:"د",  color:"#D97706", bg:"#FEF3C7", border:"#FCD34D" },
  { key:"stu",   label:"طالب", short:"ط",  color:"#9333EA", bg:"#F3E8FF", border:"#D8B4FE" },
  { key:"auto",  label:"تلقائي",short:"⚡", color:"#475569", bg:"#F1F5F9", border:"#CBD5E1" },
];

const F = [
  // ─── إدارة الطالب ─────────────────────────────────────────────────────────
  {id:1,  m:"student",      name:"إضافة / تعديل بيانات طالب",           desc:"إنشاء ملف طالب جديد أو تعديل بياناته (اسم، هاتف، عنوان، حالة) مع منع تكرار رقم الهاتف تلقائياً",                                                          admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:2,  m:"student",      name:"عرض قائمة الطلاب والبحث",              desc:"استعراض جميع الطلاب مع فلترة بالحالة وبحث بالاسم أو رقم الهاتف",                                                                                           admin:1,emp:1,acc:1,ins:0,stu:0,auto:0},
  {id:3,  m:"student",      name:"عرض ملف الطالب المركزي",               desc:"الصفحة المركزية للطالب: بياناته + حجوزاته + دفعاته + حالة الشهادة الحكومية",                                                                               admin:1,emp:1,acc:1,ins:0,stu:1,auto:0},
  {id:4,  m:"student",      name:"تغيير حالة الطالب",                    desc:"تحديث الحالة: جديد ← نشط ← قيد التدريب ← أنهى التدريب ← طلب شهادة ← مؤرشف",                                                                              admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:5,  m:"student",      name:"أرشفة طالب",                           desc:"أرشفة الطالب مع الحفاظ الكامل على سجلاته التاريخية بدون حذف",                                                                                             admin:1,emp:0,acc:0,ins:0,stu:0,auto:0},
  {id:6,  m:"student",      name:"رفع وثائق الطالب",                     desc:"رفع الهوية الأمامية والخلفية والصورة الشخصية",                                                                                                               admin:1,emp:1,acc:0,ins:0,stu:1,auto:0},
  {id:7,  m:"student",      name:"إضافة ملاحظات إدارية داخلية",          desc:"ملاحظات داخلية على ملف الطالب غير مرئية له",                                                                                                                 admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:8,  m:"student",      name:"اختصار: إنشاء حجز من ملف الطالب",      desc:"زر يفتح شاشة الحجز المركزية مع تحديد الطالب مسبقاً (ليس منطقاً مستقلاً)",                                                                                 admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:9,  m:"student",      name:"اختصار: طلب شهادة من ملف الطالب",      desc:"زر يفتح موديول الشهادة الحكومية مع ربط الطالب مسبقاً",                                                                                                     admin:1,emp:1,acc:0,ins:0,stu:1,auto:0},
  // ─── إدارة المدربين ───────────────────────────────────────────────────────
  {id:10, m:"instructor",   name:"إضافة / تعديل مدرب",                   desc:"إنشاء ملف مدرب مع قدراته (عادي/أوتوماتيك/كليهما)، جنسه، نوعه (داخلي/خارجي)، وأجر الجلسة",                                                               admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:11, m:"instructor",   name:"عرض قائمة المدربين وملف المدرب",        desc:"قائمة مع فلاتر الجنس والقدرة + الصفحة المركزية: جدول + إحصائيات + مستحقات",                                                                               admin:1,emp:1,acc:1,ins:1,stu:0,auto:0},
  {id:12, m:"instructor",   name:"إدارة أوقات التوفر الأسبوعية",          desc:"إضافة وتعديل وحذف أوقات التوفر الافتراضية الأسبوعية للمدرب من لوحة الويب",                                                                               admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:13, m:"instructor",   name:"تسجيل استثناء يوم محدد (غياب طارئ)",   desc:"تسجيل عدم توفر المدرب ليوم معين خارج جدوله الاعتيادي",                                                                                                   admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:14, m:"instructor",   name:"تعطيل المدرب مؤقتاً عن الحجوزات",      desc:"منع استقبال حجوزات جديدة دون إلغاء الحجوزات القائمة",                                                                                                     admin:1,emp:0,acc:0,ins:0,stu:0,auto:0},
  {id:15, m:"instructor",   name:"عرض جدول المدرب",                       desc:"الجدول اليومي والأسبوعي بتفاصيل الحجوزات (وقت، طالب، نوع التدريب، المركبة)",                                                                              admin:1,emp:1,acc:0,ins:1,stu:0,auto:0},
  {id:16, m:"instructor",   name:"إرسال جدول الغد تلقائياً",              desc:"إشعار تلقائي بجدول اليوم التالي في الوقت المحدد بالإعدادات (افتراضي: 9 مساءً)",                                                                          admin:1,emp:1,acc:0,ins:0,stu:0,auto:1},
  {id:17, m:"instructor",   name:"عرض مستحقات وسجل مدفوعات المدرب",      desc:"المستحقات المحسوبة (جلسات مكتملة × أجر الجلسة) وسجل المدفوعات التاريخي",                                                                                 admin:1,emp:0,acc:1,ins:0,stu:0,auto:0},
  {id:18, m:"instructor",   name:"عرض إحصائيات المدرب",                   desc:"عدد الجلسات المكتملة والملغاة والـ No-Show وعدد الطلاب المرتبطين بالمدرب",                                                                                admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  // ─── إدارة المركبات ───────────────────────────────────────────────────────
  {id:19, m:"vehicle",      name:"إضافة / تعديل مركبة",                  desc:"تسجيل مركبة بنوعها (عادي/أوتوماتيك) ولوحتها وموديلها ولونها وحالتها وملاحظاتها",                                                                        admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:20, m:"vehicle",      name:"عرض قائمة المركبات وجدول استخدامها",   desc:"عرض جميع المركبات مع حالاتها وتفصيل الحجوزات المرتبطة بكل مركبة",                                                                                        admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:21, m:"vehicle",      name:"تغيير حالة المركبة (صيانة / عطل)",     desc:"ضبط الحالة مع تحديد فترة الصيانة → تُحجب المركبة تلقائياً من الأوقات المتاحة",                                                                           admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:22, m:"vehicle",      name:"منع التعارض الزمني في حجز المركبة",    desc:"النظام يمنع تلقائياً حجز نفس المركبة في فترات زمنية متداخلة",                                                                                             admin:0,emp:0,acc:0,ins:0,stu:0,auto:1},
  // ─── الحجز والجدولة ───────────────────────────────────────────────────────
  {id:23, m:"booking",      name:"توليد الأوقات المتاحة (Query Engine)",  desc:"يجمع أوقات توفر المدرب → ينشئ Slots بمدة 90 دقيقة → يُزيل التعارضات (حجوزات/إجازات/صيانة) → يُفلتر حسب معايير الحجز → يعرض النتائج",              admin:0,emp:0,acc:0,ins:0,stu:0,auto:1},
  {id:24, m:"booking",      name:"فلترة الحجز (نوع + جنس + مدرب + مركبة)",desc:"اختيار: نوع التدريب (عادي/أوتوماتيك)، جنس المدرب (أي/ذكر/أنثى)، مدرب محدد (اختياري)، مصدر المركبة (مدرسة/طالب)",                                  admin:1,emp:1,acc:0,ins:0,stu:1,auto:0},
  {id:25, m:"booking",      name:"إنشاء حجز من المدرسة (نقدي فوري)",     desc:"الموظف يختار الطالب والوقت → الطالب يدفع العربون نقداً → Confirmed فوراً بدون انتظار",                                                                   admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:26, m:"booking",      name:"إنشاء حجز عبر مكالمة (دفع خارجي)",    desc:"حجز مؤقت + الطالب يدفع خارجياً (شام كاش) + يُرسل إثبات → ينتظر تحقق الإدارة",                                                                          admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:27, m:"booking",      name:"إنشاء حجز ذاتي من تطبيق الطالب",       desc:"الطالب يختار موعداً → حجز مؤقت 15 دق → رفع إثبات دفع → تحقق الإدارة → Confirmed",                                                                       admin:0,emp:0,acc:0,ins:0,stu:1,auto:0},
  {id:28, m:"booking",      name:"إدارة الحجز المؤقت وانتهاء الصلاحية",  desc:"حجز الموارد مؤقتاً وتحريرها تلقائياً عند انتهاء المهلة إذا لم يُرفع إثبات الدفع",                                                                      admin:0,emp:0,acc:0,ins:0,stu:0,auto:1},
  {id:29, m:"booking",      name:"إعادة فحص التوفر لحظة إنشاء الحجز",    desc:"Transaction/Lock تلقائي لحظة الإنشاء لمنع الحجز المزدوج عند تزامن مستخدمين على نفس الـ Slot",                                                           admin:0,emp:0,acc:0,ins:0,stu:0,auto:1},
  {id:30, m:"booking",      name:"قاعدة حجب المواعيد بعد جدول الغد",     desc:"بعد إرسال جدول الغد، التطبيق لا يعرض وقتاً يجعل المدرب يبدأ يومه أبكر من أول درس مؤكد منشور له",                                                      admin:0,emp:0,acc:0,ins:0,stu:0,auto:1},
  {id:31, m:"booking",      name:"إنشاء حجز استثنائي (تجاوز قيود الجدول)",desc:"الإدارة تنشئ حجزاً يتجاوز قاعدة جدول الغد بعد التنسيق المباشر مع المدرب → إشعار فوري",                                                               admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:32, m:"booking",      name:"إلغاء حجز من الطالب أو بطلبه",          desc:"الطالب (أو الإدارة نيابةً عنه) يلغي الحجز مع تحذير واضح ← Cancelled + Deposit Non-Refundable",                                                         admin:1,emp:1,acc:0,ins:0,stu:1,auto:0},
  {id:33, m:"booking",      name:"إلغاء حجز من الإدارة (مدرب/مركبة/إداري)",desc:"الإدارة تلغي مع تحديد السبب ← Cancelled + Deposit Transferable + إشعار الطالب تلقائياً",                                                             admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:34, m:"booking",      name:"إعادة جدولة الحجز",                     desc:"نقل الحجز إلى وقت آخر متاح مع تسجيل السبب وإشعار الطالب والمدرب",                                                                                       admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:35, m:"booking",      name:"إنشاء حجز بديل ونقل العربون",           desc:"إنشاء حجز جديد مرتبط بالملغى (linked_booking_id) ← العربون ينتقل تلقائياً: Transferable→Transferred",                                                   admin:1,emp:1,acc:0,ins:0,stu:1,auto:0},
  {id:36, m:"booking",      name:"تسجيل دفع المبلغ المتبقي قبل الدرس",   desc:"الموظف يسجل استلام باقي المبلغ نقداً من الطالب عند وصوله قبل انطلاقه مع المدرب",                                                                       admin:1,emp:1,acc:1,ins:0,stu:0,auto:0},
  {id:37, m:"booking",      name:"تسجيل الحضور وإكمال الدرس",             desc:"الإدارة تسجل الحضور وإنهاء الدرس بعد عودة المدرب وتأكيد الدفع الكامل → Completed",                                                                    admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:38, m:"booking",      name:"تسجيل عدم الحضور (No-Show)",            desc:"الإدارة تسجل غياب الطالب عن درس مؤكد → No-Show + Deposit Non-Refundable",                                                                               admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:39, m:"booking",      name:"إضافة ملاحظات على الدرس والمركبة",      desc:"ملاحظات تدريبية وإدارية على الحجز + تسجيل أعطال المركبة التي أبلغ عنها المدرب بعد الدرس",                                                               admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  // ─── الدفعات والعربون ─────────────────────────────────────────────────────
  {id:40, m:"payment",      name:"تسجيل عربون نقدي داخل المدرسة",        desc:"الموظف يسجل الدفع النقدي → Verified Deposit + Confirmed مباشرةً بدون انتظار",                                                                            admin:1,emp:1,acc:1,ins:0,stu:0,auto:0},
  {id:41, m:"payment",      name:"رفع إثبات دفع خارجي (شام كاش)",         desc:"الطالب أو الإدارة يرفع صورة الإثبات → Submitted Deposit → ينتظر تحقق المحاسب",                                                                         admin:1,emp:1,acc:0,ins:0,stu:1,auto:0},
  {id:42, m:"payment",      name:"التحقق من إثبات الدفع (قبول / رفض)",   desc:"المحاسب يراجع الإثبات → قبول: Verified + Confirmed | رفض: إضافة ملاحظة + إشعار الطالب",                                                                 admin:1,emp:0,acc:1,ins:0,stu:0,auto:0},
  {id:43, m:"payment",      name:"إصدار فاتورة تشغيلية بسيطة",            desc:"إيصال دفع داخلي (ليس ضريبياً) يُصدر تلقائياً بعد كل دفعة مؤكدة",                                                                                       admin:1,emp:1,acc:1,ins:0,stu:0,auto:1},
  {id:44, m:"payment",      name:"آلة حالات العربون (State Machine)",      desc:"Required→Submitted→Verified→RemainingPending→FullyPaid | NonRefundable | Transferable→Transferred — يتحكم بها النظام تلقائياً حسب الأحداث",          admin:0,emp:0,acc:0,ins:0,stu:0,auto:1},
  // ─── الشهادة الحكومية ─────────────────────────────────────────────────────
  {id:45, m:"certificate",  name:"تقديم طلب شهادة حكومية",               desc:"بدء الطلب مع تسجيل الرسوم واختيار خيار النقل (مع المدرسة أو ذاتياً)",                                                                                   admin:1,emp:1,acc:0,ins:0,stu:1,auto:0},
  {id:46, m:"certificate",  name:"رفع ومراجعة وثائق الشهادة",             desc:"الطالب يرفع الوثائق (هوية/صورة)، الإدارة تراجع وتؤكد اكتمالها قبل التقديم",                                                                            admin:1,emp:1,acc:0,ins:0,stu:1,auto:0},
  {id:47, m:"certificate",  name:"تسجيل مواعيد الفحص النظري والعملي",    desc:"الإدارة تُدخل التواريخ والأماكن يدوياً بعد ورودها من الوزارة أو الطالب",                                                                                admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:48, m:"certificate",  name:"تسجيل نتيجة الفحص",                    desc:"الإدارة تُدخل النتيجة يدوياً (ناجح/راسب/غائب) لكل فحص — لا يوجد تكامل تلقائي مع الوزارة",                                                             admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:49, m:"certificate",  name:"إنشاء طلب إعادة فحص عند الرسوب",       desc:"فتح طلب إعادة فحص جديد + تسجيل رسوم إعادة الفحص + تحديد موعد جديد عند توفره",                                                                         admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  // ─── خدمة النقل الجماعي ───────────────────────────────────────────────────
  {id:50, m:"transport",    name:"إنشاء رحلة نقل (محاضرات أو امتحان)",   desc:"رحلة محاضرات: تغطي 3 أيام دفعةً واحدة | رحلة امتحان: يوم واحد اختياري — مع: التاريخ + وقت التجمع + الوجهة + الطاقة الاستيعابية",               admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:51, m:"transport",    name:"تسجيل الطالب في خدمة النقل",           desc:"تسجيل في رحلة المحاضرات (3 أيام دفعةً — لا تجزئة) أو في رحلة الامتحان (يوم واحد اختياري)",                                                            admin:1,emp:1,acc:0,ins:0,stu:1,auto:0},
  {id:52, m:"transport",    name:"تسجيل دفع رسوم النقل",                  desc:"يُدفع اليوم الأول حضورياً للمحاضرات، أو عند التسجيل للامتحان. يُسجَّل كإيراد 'رسوم نقل'",                                                            admin:1,emp:1,acc:1,ins:0,stu:0,auto:0},
  {id:53, m:"transport",    name:"تسجيل الحضور اليومي للمحاضرات",         desc:"الإدارة تسجل حضور/غياب الطالب لكل يوم من الأيام الثلاثة بشكل مستقل — الغياب لا يلغي الأيام الأخرى",                                                  admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:54, m:"transport",    name:"تسجيل حضور يوم الامتحان",               desc:"الإدارة تسجل حضور/غياب الطالب في رحلة نقل الامتحان",                                                                                                     admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:55, m:"transport",    name:"إلغاء رحلة نقل (المدير فقط)",           desc:"إلغاء رحلة كاملة مع إشعار جميع الطلاب المسجلين فيها",                                                                                                   admin:1,emp:0,acc:0,ins:0,stu:0,auto:0},
  {id:56, m:"transport",    name:"عرض قائمة المسجلين في الرحلة",          desc:"استعراض الطلاب المسجلين وحالاتهم: حضر/غاب/مدفوع/غير مدفوع",                                                                                             admin:1,emp:1,acc:1,ins:0,stu:0,auto:0},
  // ─── إجازات المدربين ──────────────────────────────────────────────────────
  {id:57, m:"leave",        name:"إدخال إجازة مدرب وعرض المتأثرين",       desc:"تسجيل فترة الإجازة (بداية/نهاية/نوع/ملاحظات) + النظام يكشف الحجوزات المتأثرة ويعرضها للإدارة قبل الاعتماد",                                           admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:58, m:"leave",        name:"اعتماد الإجازة وحجب أوقات المدرب",      desc:"تأكيد الإجازة → المدرب يختفي تلقائياً من الـ Slots المتاحة خلال فترة الإجازة",                                                                         admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:59, m:"leave",        name:"معالجة الحجوزات المتأثرة (تلقائي)",     desc:"بعد الاعتماد: إلغاء الحجوزات + Deposit Transferable + إرسال إشعار لكل طالب متأثر تلقائياً",                                                          admin:0,emp:0,acc:0,ins:0,stu:0,auto:1},
  // ─── المحاسبة التشغيلية ───────────────────────────────────────────────────
  {id:60, m:"accounting",   name:"تسجيل الإيرادات وتصنيفها",              desc:"تصنيف الإيراد: عربون / باقي درس / شهادة / نقل / إعادة فحص / أخرى — مرتبط بحجز أو طالب أو خدمة",                                                     admin:1,emp:0,acc:1,ins:0,stu:0,auto:0},
  {id:61, m:"accounting",   name:"تسجيل المصاريف وتصنيفها",               desc:"تصنيف: وقود/صيانة/إيجار/رواتب/ضيافة/مصاريف حكومية/أخرى — مع إمكانية ربط بمركبة أو مدرب",                                                             admin:1,emp:0,acc:1,ins:0,stu:0,auto:0},
  {id:62, m:"accounting",   name:"حساب مستحقات المدربين (تلقائي)",         desc:"كل جلسة تصبح Completed → (عدد الجلسات × أجر الجلسة) لكل مدرب — يُحسب لأي فترة زمنية",                                                               admin:0,emp:0,acc:0,ins:0,stu:0,auto:1},
  {id:63, m:"accounting",   name:"تسجيل دفع مستحقات المدرب",              desc:"تأكيد دفع المستحقات للمدرب وقيدها تلقائياً كمصروف من نوع 'مستحقات مدرب'",                                                                              admin:1,emp:0,acc:1,ins:0,stu:0,auto:0},
  {id:64, m:"accounting",   name:"عرض الدفعات المعلقة والحجوزات الناقصة", desc:"إثباتات الدفع التي تنتظر التحقق + الحجوزات التي لم يكتمل دفعها (باقي مبلغ أو عربون)",                                                                  admin:1,emp:1,acc:1,ins:0,stu:0,auto:0},
  {id:65, m:"accounting",   name:"التقارير المالية التشغيلية",              desc:"ملخص يومي/شهري (إيرادات + مصاريف + صافي) + تقرير ربح وخسارة مبسط + تصنيف حسب نوع الإيراد/المصروف",                                                   admin:1,emp:0,acc:1,ins:0,stu:0,auto:0},
  // ─── المستخدمين والصلاحيات ────────────────────────────────────────────────
  {id:66, m:"users",        name:"إضافة وإدارة المستخدمين",               desc:"إنشاء حساب + تحديد دور أو أدوار متعددة (مثلاً: موظف + محاسب في نفس الوقت) + ربط بملف طالب أو مدرب",                                                   admin:1,emp:0,acc:0,ins:0,stu:0,auto:0},
  {id:67, m:"users",        name:"تفعيل / تعطيل / أرشفة الحساب",          desc:"تفعيل أو منع الدخول أو أرشفة الحساب بدون حذف السجل التاريخي المرتبط به",                                                                               admin:1,emp:0,acc:0,ins:0,stu:0,auto:0},
  {id:68, m:"users",        name:"إعادة تعيين كلمة المرور",               desc:"المدير يعيد ضبط كلمة مرور أي مستخدم في النظام",                                                                                                         admin:1,emp:0,acc:0,ins:0,stu:0,auto:0},
  {id:69, m:"users",        name:"سجل النشاط (Audit Log)",                 desc:"تسجيل تلقائي للعمليات الحساسة: إنشاء حجز + دفع + إلغاء + تعديل صلاحيات + تغيير أسعار — مع timestamp واسم المنفِّذ",                                  admin:1,emp:0,acc:0,ins:0,stu:0,auto:1},
  // ─── إعدادات النظام ───────────────────────────────────────────────────────
  {id:70, m:"settings",     name:"أسعار الدروس",                          desc:"سعر العادي + الأوتوماتيك + سيارة الطالب — وإمكانية سعر مختلف بحسب جنس المدرب (اختياري)",                                                               admin:1,emp:0,acc:0,ins:0,stu:0,auto:0},
  {id:71, m:"settings",     name:"أجر جلسة المدرب (افتراضي + خاص)",       desc:"أجر افتراضي لجميع المدربين + إمكانية أجر خاص لكل مدرب على حدة — يُطبَّق على الحسابات الجديدة فقط",                                                   admin:1,emp:0,acc:0,ins:0,stu:0,auto:0},
  {id:72, m:"settings",     name:"نسبة العربون ومدة الحجز المؤقت",        desc:"نسبة العربون من سعر الدرس (افتراضي: 50%) + مدة الحجز المؤقت (افتراضي: 15 دقيقة) — للحجوزات الجديدة فقط",                                             admin:1,emp:0,acc:0,ins:0,stu:0,auto:0},
  {id:73, m:"settings",     name:"قواعد الحجز (مدة + نافذة + حد أدنى)",  desc:"مدة الدرس (90 دق) + عدد أيام الحجز المعروضة + أقل مدة للحجز الذاتي من التطبيق",                                                                       admin:1,emp:0,acc:0,ins:0,stu:0,auto:0},
  {id:74, m:"settings",     name:"وقت إرسال جدول الغد",                   desc:"الوقت الثابت لإرسال جدول اليوم التالي تلقائياً (افتراضي: 9 مساءً) — التعديل يُطبَّق من الليلة التالية",                                               admin:1,emp:0,acc:0,ins:0,stu:0,auto:0},
  {id:75, m:"settings",     name:"رسوم الشهادة والنقل وإعادة الفحص",      desc:"رسوم خدمة الشهادة + النقل إلى مركز الفحص + إعادة الفحص النظري والعملي",                                                                                admin:1,emp:0,acc:0,ins:0,stu:0,auto:0},
  // ─── لوحة التحكم ──────────────────────────────────────────────────────────
  {id:76, m:"dashboard",    name:"ملخص حجوزات اليوم وأداء المدرسة",       desc:"عدد المؤكدة/المكتملة/الملغاة/No-Show + الدروس القادمة مرتبةً زمنياً مع من يحتاج دفع باقي المبلغ",                                                      admin:1,emp:1,acc:1,ins:0,stu:0,auto:0},
  {id:77, m:"dashboard",    name:"التنبيهات التشغيلية المهمة",             desc:"دفعات معلقة + مركبات في صيانة + مدربون في إجازة + فحوص حكومية قادمة + حجوزات انتهت صلاحيتها",                                                         admin:1,emp:1,acc:1,ins:0,stu:0,auto:0},
  {id:78, m:"dashboard",    name:"الملخص المالي السريع",                   desc:"إجمالي الإيرادات والمصاريف والصافي التشغيلي لليوم — للمدير والمحاسب فقط",                                                                               admin:1,emp:0,acc:1,ins:0,stu:0,auto:0},
  // ─── التقارير الإدارية ────────────────────────────────────────────────────
  {id:79, m:"reports",      name:"تقرير الحجوزات",                         desc:"توزيع الحجوزات بحالاتها (مؤكدة/مكتملة/ملغاة/No-Show/Expired) ضمن فترة يومية/أسبوعية/شهرية/سنوية",                                                   admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:80, m:"reports",      name:"تقرير الدروس المكتملة والطلاب",          desc:"إحصائيات الدروس المنفذة (نوع، مدرب، مركبة) + الطلاب بحالاتهم المختلفة",                                                                               admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:81, m:"reports",      name:"تقرير المدربين والمركبات",               desc:"أداء كل مدرب (مكتملة/ملغاة/No-Show) ومستحقاته + استخدام كل مركبة وحالات صيانتها",                                                                     admin:1,emp:0,acc:1,ins:0,stu:0,auto:0},
  {id:82, m:"reports",      name:"تقرير الشهادة الحكومية وخدمة النقل",    desc:"طلبات الشهادة ونتائج الفحوص وإعادة الفحص + إحصائيات رحلات النقل والمسجلين",                                                                          admin:1,emp:1,acc:0,ins:0,stu:0,auto:0},
  {id:83, m:"reports",      name:"التقرير المالي المختصر",                  desc:"الإيرادات والمصاريف وصافي الربح التشغيلي ومستحقات المدربين — للمدير والمحاسب فقط",                                                                    admin:1,emp:0,acc:1,ins:0,stu:0,auto:0},
  // ─── الإشعارات ────────────────────────────────────────────────────────────
  {id:84, m:"notifications", name:"إشعارات الطالب (حجز + عربون + تذكير)", desc:"تأكيد حجز + انتهاء مهلة دفع + نتيجة تحقق إثبات + تذكير بالدرس + إلغاء من المدرسة + دعوة لحجز بديل",                                                admin:0,emp:0,acc:0,ins:0,stu:1,auto:1},
  {id:85, m:"notifications", name:"إشعارات المدرب (جدول + تعديلات)",       desc:"درس جديد مؤكد + تغيير الجدول بعد نشره (فوري) + ملخص جدول الغد في الوقت المحدد",                                                                      admin:0,emp:0,acc:0,ins:1,stu:0,auto:1},
  {id:86, m:"notifications", name:"إشعارات الشهادة والنقل والفحوص",        desc:"مواعيد الفحص النظري والعملي + تذكير النقل (يوم قبل) + إشعار قبول الشهادة + نتائج الفحص",                                                             admin:0,emp:0,acc:0,ins:0,stu:1,auto:1},
];

export default function App() {
  const [search, setSearch] = useState("");
  const [mod,    setMod]    = useState("all");
  const [role,   setRole]   = useState("all");

  const filtered = useMemo(() => F.filter(f => {
    if (mod !== "all" && f.m !== mod) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!f.name.toLowerCase().includes(q) && !f.desc.toLowerCase().includes(q)) return false;
    }
    if (role !== "all") {
      if (role === "auto") return f.auto === 1;
      return f[role] === 1;
    }
    return true;
  }), [search, mod, role]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(f => { if (!g[f.m]) g[f.m] = []; g[f.m].push(f); });
    return g;
  }, [filtered]);

  const counts = useMemo(() => {
    const c = { all: F.length };
    ROLES.forEach(r => { c[r.key] = F.filter(f => f[r.key] === 1).length; });
    MODULES.forEach(m => { c[m.id] = F.filter(f => f.m === m.id).length; });
    return c;
  }, []);

  const chip = (label, active, color, onClick, count) => (
    <button onClick={onClick} style={{
      padding: "5px 12px", borderRadius: "20px", fontSize: "12px",
      cursor: "pointer", fontWeight: active ? 700 : 400, fontFamily: "inherit",
      background: active ? color : "transparent",
      color: active ? "white" : "#64748B",
      border: `1.5px solid ${active ? color : "#E2E8F0"}`,
      transition: "all 0.15s", display: "inline-flex", alignItems: "center", gap: "5px",
      whiteSpace: "nowrap"
    }}>
      {label}
      <span style={{ background: active ? "rgba(255,255,255,0.25)" : "#F1F5F9", borderRadius: "10px", padding: "1px 6px", fontSize: "11px" }}>
        {count}
      </span>
    </button>
  );

  return (
    <div dir="rtl" style={{ fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif", background: "#F1F5F9", minHeight: "100vh", padding: "16px", boxSizing: "border-box" }}>

      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)", borderRadius: "14px", padding: "22px 26px", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#F8FAFC", letterSpacing: "0.02em" }}>🚗  جدول الفيتشرات — نظام إدارة مدرسة القيادة</h1>
          <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#94A3B8" }}>
            {F.length} فيتشر · {MODULES.length} موديول · {ROLES.filter(r => r.key !== "auto").length} أدوار + النظام
          </p>
        </div>
        <div style={{ color: "#CBD5E1", fontSize: "12px", textAlign: "left" }}>
          <div>🟢 فيتشر تلقائي <span style={{ color: "#64748B" }}>= النظام ينفذه</span></div>
          <div style={{ marginTop: "3px" }}>✦ = يملك صلاحية التنفيذ</div>
        </div>
      </div>

      {/* ── Role stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px", marginBottom: "14px" }}>
        {ROLES.map(r => (
          <div key={r.key} onClick={() => setRole(role === r.key ? "all" : r.key)}
            style={{ background: role === r.key ? r.color : "white", border: `2px solid ${role === r.key ? r.color : r.border}`, borderRadius: "10px", padding: "10px 8px", textAlign: "center", cursor: "pointer", transition: "all 0.15s" }}>
            <div style={{ fontSize: "20px", fontWeight: 700, color: role === r.key ? "white" : r.color }}>{counts[r.key]}</div>
            <div style={{ fontSize: "11px", color: role === r.key ? "rgba(255,255,255,0.85)" : "#64748B", marginTop: "2px" }}>{r.label}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{ background: "white", borderRadius: "10px", padding: "12px 16px", marginBottom: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginBottom: "10px" }}>
          <input type="text" placeholder="🔍  ابحث في الفيتشرات..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: "1 1 200px", padding: "8px 12px", border: "1.5px solid #E2E8F0", borderRadius: "8px", fontSize: "13px", outline: "none", textAlign: "right", fontFamily: "inherit", background: "#FAFAFA", minWidth: "180px" }} />
          <select value={mod} onChange={e => setMod(e.target.value)}
            style={{ padding: "8px 12px", border: "1.5px solid #E2E8F0", borderRadius: "8px", fontSize: "13px", cursor: "pointer", outline: "none", background: "white", fontFamily: "inherit" }}>
            <option value="all">الكل ({F.length})</option>
            {MODULES.map(m => <option key={m.id} value={m.id}>{m.icon} {m.name} ({counts[m.id]})</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {chip("الكل", role === "all", "#0F172A", () => setRole("all"), counts.all)}
          {ROLES.map(r => chip(r.label, role === r.key, r.color, () => setRole(role === r.key ? "all" : r.key), counts[r.key]))}
        </div>
      </div>

      <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "10px", padding: "0 2px" }}>
        عرض <strong style={{ color: "#475569" }}>{filtered.length}</strong> من {F.length} فيتشر
        {role !== "all" && <span style={{ color: "#6366F1", marginRight: "8px" }}>· فلتر: {ROLES.find(r => r.key === role)?.label}</span>}
        {mod !== "all" && <span style={{ color: "#6366F1", marginRight: "8px" }}>· {MODULES.find(m => m.id === mod)?.name}</span>}
      </div>

      {/* ── Tables by module ── */}
      {filtered.length === 0 ? (
        <div style={{ background: "white", borderRadius: "10px", padding: "40px", textAlign: "center", color: "#94A3B8" }}>لا توجد نتائج مطابقة</div>
      ) : (
        MODULES.filter(m => grouped[m.id]).map(m => {
          const rows = grouped[m.id];
          return (
            <div key={m.id} style={{ marginBottom: "16px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              {/* Module header */}
              <div style={{ background: m.header, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "14px", color: "white" }}>{m.icon}  {m.name}</span>
                <span style={{ background: "rgba(255,255,255,0.2)", color: "white", borderRadius: "20px", padding: "2px 10px", fontSize: "12px" }}>{rows.length} فيتشر</span>
              </div>
              {/* Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "white", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: m.bg }}>
                      <th style={{ ...th, width: "28px", color: "#9CA3AF" }}>#</th>
                      <th style={{ ...th, minWidth: "175px" }}>الفيتشر</th>
                      <th style={{ ...th }}>الوصف والتفاصيل</th>
                      {ROLES.map(r => (
                        <th key={r.key} style={{ ...th, width: "52px", textAlign: "center", color: r.color, fontSize: "11px" }}>{r.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((f, i) => (
                      <tr key={f.id} style={{ background: i % 2 === 0 ? "white" : "#FAFAFA", borderBottom: `1px solid ${m.border}` }}>
                        <td style={{ ...td, color: "#CBD5E1", fontSize: "11px", textAlign: "center" }}>{f.id}</td>
                        <td style={{ ...td, fontWeight: 600, color: "#1E293B" }}>
                          {f.auto === 1 && <span style={{ fontSize: "10px", background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0", borderRadius: "4px", padding: "1px 5px", marginLeft: "5px", fontWeight: 600, display: "inline-block", verticalAlign: "middle" }}>تلقائي</span>}
                          {f.name}
                        </td>
                        <td style={{ ...td, color: "#64748B", lineHeight: "1.55" }}>{f.desc}</td>
                        {ROLES.map(r => (
                          <td key={r.key} style={{ ...td, textAlign: "center", padding: "8px 4px" }}>
                            {f[r.key] === 1
                              ? <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", background: r.bg, border: `1.5px solid ${r.border}`, borderRadius: "50%", color: r.color, fontSize: "13px", fontWeight: 700 }}>✓</span>
                              : <span style={{ color: "#E2E8F0", fontSize: "16px" }}>—</span>
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}

      {/* ── Legend ── */}
      <div style={{ background: "white", borderRadius: "10px", padding: "14px 18px", marginTop: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>الأدوار ومعنى العلامات</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {ROLES.map(r => (
            <div key={r.key} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "22px", height: "22px", background: r.bg, border: `1.5px solid ${r.border}`, borderRadius: "50%", color: r.color, fontSize: "12px", fontWeight: 700 }}>✓</span>
              <span style={{ fontSize: "12px", color: "#475569" }}><strong style={{ color: r.color }}>{r.label}</strong> — {
                { admin:"المدير / الأدمن — صلاحيات كاملة", emp:"الموظف الإداري — تشغيل يومي", acc:"المحاسب — مالي ودفعات", ins:"المدرب — جدوله فقط", stu:"الطالب — تطبيقه فقط", auto:"النظام ينفذ تلقائياً دون تدخل بشري" }[r.key]
              }</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const th = { padding: "10px 12px", textAlign: "right", fontWeight: 600, color: "#374151", borderBottom: "2px solid rgba(0,0,0,0.07)", fontSize: "12px", whiteSpace: "nowrap" };
const td = { padding: "10px 12px", textAlign: "right", verticalAlign: "top" };
