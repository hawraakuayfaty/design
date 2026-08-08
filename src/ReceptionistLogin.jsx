import { useState } from "react";
import axios from "axios";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { FaBellConcierge } from "react-icons/fa6";

import {
  FiLock,
  FiUser,
  FiLoader,
  FiAlertCircle,
  FiUserPlus,
  FiMail,
  FiDollarSign,
  FiCheckCircle,
} from "react-icons/fi";
import { PiStudent } from "react-icons/pi";

// ===================================================================
// 1. التنسيقات الشاملة والرسوم المتحركة
// ===================================================================

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Tajawal', sans-serif;
    background-color: #f4f5f0; 
  }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f5f0;
  direction: rtl;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border: 1px solid rgba(113, 83, 23, 0.15);
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 10px 25px -5px rgba(113, 83, 23, 0.08);
  animation: ${fadeInUp} 0.5s ease both;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 28px;
  h2 {
    font-size: 24px;
    font-weight: 800;
    color: #715317;
    margin-bottom: 6px;
  }
  p {
    font-size: 13px;
    color: #796c2c;
  }
`;

const RoleContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 24px;
`;

const RoleCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  background: ${(props) => (props.$active ? "#e9e3d6" : "#f4f5f0")};
  border: 2px solid
    ${(props) => (props.$active ? "#715317" : "rgba(113, 83, 23, 0.1)")};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  color: ${(props) => (props.$active ? "#715317" : "#796c2c")};

  svg {
    font-size: 20px;
    margin-bottom: 6px;
    color: ${(props) => (props.$active ? "#715317" : "#a89b6c")};
  }

  &:hover {
    border-color: #715317;
    background: #e9e3d6;
    color: #715317;
    svg {
      color: #715317;
    }
  }
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 18px;
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  color: #a89b6c;
  display: flex;
  align-items: center;
  font-size: 18px;
  pointer-events: none;
  transition: color 0.2s ease;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 13px 46px 13px 16px;
  background: #fcfcf9;
  border: 1px solid rgba(113, 83, 23, 0.15);
  border-radius: 12px;
  font-family: inherit;
  font-size: 14px;
  color: #2c3024;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #a89b6c;
  }

  &:focus {
    border-color: #715317;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(113, 83, 23, 0.08);
    & ~ ${InputIcon} {
      color: #715317;
    }
  }
`;

const MessageBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 20px;
  animation: ${fadeInUp} 0.3s ease;

  background: ${(props) => (props.type === "success" ? "#e9e3d6" : "#fff8f8")};
  border: 1px solid
    ${(props) =>
      props.type === "success"
        ? "rgba(113, 83, 23, 0.2)"
        : "rgba(220, 38, 38, 0.2)"};
  color: ${(props) => (props.type === "success" ? "#715317" : "#b91c1c")};
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #778a3b 0%, #778a3b 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(119, 138, 59, 0.2);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(119, 138, 59, 0.3);
  }

  &:disabled {
    background: #a89b6c;
    cursor: not-allowed;
    box-shadow: none;
  }

  .loader {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// ===================================================================
// 3. المكون الأساسي لإنشاء الحسابات من قبل المسؤول
// ===================================================================

export default function CreateAccount() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("receptionist"); // الخيار الافتراضي موظف إداري
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!role) {
      setError("الرجاء تحديد صلاحية/رتبة الحساب أولاً.");
      return;
    }

    setLoading(true);

    try {
      // قراءة رابط السيرفر من ملف الـ .env واستدعاء مسار التسجيل (Register)
      const token = localStorage.getItem("token"); // جلب توكن المشرف للتحقق من الصلاحية

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://20.250.144.221:3000/api/v1"}/admin/create-user`,
        {
          name: fullName,
          email,
          password,
          role,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // إرسال التوكن لضمان أن المنشئ هو الأدمن فقط
        },
      );

      if (response.data) {
        setSuccess(
          `تم إنشاء حساب (${fullName}) بنجاح كـ ${
            role === "receptionist"
              ? "موظف إداري"
              : role === "accountant"
                ? "محاسب"
                : "طالب"
          }.`,
        );
        // تفريغ الحقول بعد النجاح
        setFullName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "خطأ في الاتصال بالسيرفر، تأكد من تشغيل الباك إيند.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <FormCard>
          <HeaderSection>
            <h2>إنشاء حساب جديد</h2>
            <p>
              قم بتعبئة البيانات واختيار الصلاحية المناسبة لإضافة مستخدم للنظام
            </p>
          </HeaderSection>

          <form onSubmit={handleCreateAccount}>
            {/* خيارات تحديد الرتبة للحساب الجديد */}
            <RoleContainer>
              <RoleCard
                type="button"
                $active={role === "receptionist"}
                onClick={() => {
                  setRole("receptionist");
                  setError("");
                }}
              >
                <FaBellConcierge />
                <span>موظف إداري</span>
              </RoleCard>

              <RoleCard
                type="button"
                $active={role === "accountant"}
                onClick={() => {
                  setRole("accountant");
                  setError("");
                }}
              >
                <FiDollarSign />
                <span>محاسب</span>
              </RoleCard>

              <RoleCard
                type="button"
                $active={role === "student"}
                onClick={() => {
                  setRole("student");
                  setError("");
                }}
              >
                <PiStudent />
                <span>طالب</span>
              </RoleCard>
            </RoleContainer>

            {error && (
              <MessageBar type="error">
                <FiAlertCircle size={18} />
                <span>{error}</span>
              </MessageBar>
            )}

            {success && (
              <MessageBar type="success">
                <FiCheckCircle size={18} />
                <span>{success}</span>
              </MessageBar>
            )}

            <InputGroup>
              <StyledInput
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="الاسم الكامل للمستخدم"
              />
              <InputIcon>
                <FiUser />
              </InputIcon>
            </InputGroup>

            <InputGroup>
              <StyledInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="البريد الإلكتروني / اسم المستخدم المعتمد"
              />
              <InputIcon>
                <FiMail />
              </InputIcon>
            </InputGroup>

            <InputGroup>
              <StyledInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="كلمة المرور الأولية"
              />
              <InputIcon>
                <FiLock />
              </InputIcon>
            </InputGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? (
                <>
                  <FiLoader className="loader" />
                  <span>جاري حفظ البيانات...</span>
                </>
              ) : (
                <>
                  <FiUserPlus />
                  <span>تأكيد إنشاء الحساب</span>
                </>
              )}
            </SubmitButton>
          </form>
        </FormCard>
      </PageContainer>
    </>
  );
}
