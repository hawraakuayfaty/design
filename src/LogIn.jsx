import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// أضيفي هذا السطر تحت استيرادات الأيقونات القديمة
import { FaBellConcierge } from 'react-icons/fa6';
import styled, { keyframes, createGlobalStyle } from "styled-components";
import {
  FiLock,
  FiLogIn,
  FiLoader,
  FiAlertCircle,
  FiUser,
  FiShield,
  
  FiDollarSign,
} from "react-icons/fi";

// ===================================================================
// 1. التنسيقات الشاملة والرسوم المتحركة المتناسقة مع التطبيق
// ===================================================================

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: 'Tajawal', sans-serif;
    background-color: #f4f5f0; 
    overflow: hidden;
  }
`;

const backgroundAnimation = keyframes`
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(30px, -50px) scale(1.2); }
  100% { transform: translate(0px, 0px) scale(1); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f5f0;
  overflow: hidden;
  direction: rtl;
`;

const BackgroundBlob = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(113, 83, 23, 0.1) 0%,
    rgba(121, 108, 44, 0.05) 70%
  );
  border-radius: 50%;
  top: -150px;
  right: -150px;
  z-index: 1;
  animation: ${backgroundAnimation} 12s infinite ease-in-out;
`;

const BackgroundBlob2 = styled(BackgroundBlob)`
  background: radial-gradient(
    circle,
    rgba(168, 163, 136, 0.15) 0%,
    rgba(244, 245, 240, 0) 60%
  );
  bottom: -200px;
  left: -200px;
  top: auto;
  right: auto;
  animation-delay: 4s;
`;

const LoginCard = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border: 1px solid rgba(113, 83, 23, 0.15);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 25px -5px rgba(113, 83, 23, 0.08);
  animation: ${fadeInUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

const BrandSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
  h1 {
    font-size: 26px;
    font-weight: 800;
    color: #715317;
    margin-bottom: 8px;
  }
  p {
    font-size: 14px;
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
  padding: 14px 10px;
  background: ${(props) => (props.active ? "#e9e3d6" : "#f4f5f0")};
  border: 2px solid
    ${(props) => (props.active ? "#715317" : "rgba(113, 83, 23, 0.1)")};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  color: ${(props) => (props.active ? "#715317" : "#796c2c")};

  svg {
    font-size: 20px;
    margin-bottom: 8px;
    color: ${(props) => (props.active ? "#715317" : "#a89b6c")};
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
  margin-bottom: 20px;
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
  padding: 14px 48px 14px 16px;
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

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff8f8;
  border: 1px solid rgba(220, 38, 38, 0.2);
  color: #b91c1c;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  margin-bottom: 20px;
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
  box-shadow: 0 4px 12px rgba(113, 83, 23, 0.15);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(113, 83, 23, 0.2);
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
// 3. دالة الـ Component الأساسية مع تفعيل الصلاحيات
// ===================================================================

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // لحفظ الدور المختار
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("الرجاء اختيار نوع الحساب أولاً ليتم توجيهك بشكل صحيح.");
      return;
    }

    // ─── الكود التجريبي المؤقت لتخطي الباك إيند للدخول ───
    if (username === "admin" && password === "123") {
      navigate("/DashBoard/Home");
      return;
    }
    // ───────────────────────────────────────────

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/login`,
        {
          username,
          password,
          role,
        },
      );

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", role);
        navigate("/DashBoard/Home");
      } else {
        setError("فشل تسجيل الدخول، يرجى التحقق من البيانات العائدة.");
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
        <BackgroundBlob />
        <BackgroundBlob2 />

        <LoginCard>
          <BrandSection>
            <h1>مدرسة القيادة</h1>
            <p>نظام إدارة ومتابعة شؤون الطلاب والموظفين</p>
          </BrandSection>

          <form onSubmit={handleLogin}>
            {/* أزرار اختيار رتبة أو صلاحية الموظف قبل الدخول */}
            <RoleContainer>
              <RoleCard
                type="button"
                active={role === "admin"}
                onClick={() => {
                  setRole("admin");
                  setError("");
                }}
              >
                <FiShield />
                <span>مدير</span>
              </RoleCard>

              <RoleCard
                type="button"
                active={role === "receptionist"}
                onClick={() => {
                  setRole("receptionist");
                  setError("");
                }}
              >
                <FaBellConcierge />
                <span>استقبال</span>
              </RoleCard>

              <RoleCard
                type="button"
                active={role === "accountant"}
                onClick={() => {
                  setRole("accountant");
                  setError("");
                }}
              >
                <FiDollarSign />
                <span>محاسب</span>
              </RoleCard>
            </RoleContainer>

            {error && (
              <ErrorMessage>
                <FiAlertCircle size={18} />
                <span>{error}</span>
              </ErrorMessage>
            )}

            <InputGroup>
              <StyledInput
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="اسم المستخدم"
              />
              <InputIcon>
                <FiUser />
              </InputIcon>
            </InputGroup>

            <InputGroup>
              <StyledInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="كلمة المرور"
              />
              <InputIcon>
                <FiLock />
              </InputIcon>
            </InputGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? (
                <>
                  <FiLoader className="loader" />
                  <span>جاري التحقق...</span>
                </>
              ) : (
                <>
                  <FiLogIn />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </SubmitButton>
          </form>
        </LoginCard>
      </PageContainer>
    </>
  );
}
