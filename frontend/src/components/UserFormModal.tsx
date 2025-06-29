import { Dialog } from "@headlessui/react";
import { useState } from "react";
import axios from "axios";

// 유니언 타입 명시적으로 정의
type TabType = "new" | "returning";
type FormType = "setup" | "change";

export default function UserFormModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<TabType>("new");
  const [type, setType] = useState<FormType>("setup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("https://test-backend-ureq.onrender.com", {
        name,
        phone,
        email,
        serviceType: type,
      });
      alert("✅ 메일이 발송되었습니다!");
      onClose();
    } catch (error) {
      console.error("❌ 백엔드 오류:", error);
      alert("메일 발송 실패: 백엔드 연결 실패");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" />
      <div className="bg-white w-full max-w-md rounded-2xl z-10 p-6 shadow-xl relative">
        {/* 탭 메뉴 */}
        <div className="flex mb-6">
          <button
            onClick={() => setTab("new")}
            className={`w-1/2 text-center py-2 font-semibold border-b-2 ${
              tab === "new" ? "border-blue-600 text-blue-600" : "text-gray-400"
            }`}
          >
            신규 고객
          </button>
          <button
            onClick={() => setTab("returning")}
            className={`w-1/2 text-center py-2 font-semibold border-b-2 ${
              tab === "returning" ? "border-blue-600 text-blue-600" : "text-gray-400"
            }`}
          >
            재방문 고객 로그인
          </button>
        </div>

        {/* 신규 고객 탭 */}
        {tab === "new" && (
          <>
            <div className="flex justify-between mb-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={type === "setup"}
                  onChange={() => setType("setup")}
                />
                신규법인 설립
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={type === "change"}
                  onChange={() => setType("change")}
                />
                기존 법인 변경등기
              </label>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="성함"
                className="w-full px-4 py-2 border rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="휴대폰 번호"
                className="w-full px-4 py-2 border rounded-md"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="이메일 주소"
                className="w-full px-4 py-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="비밀번호 설정"
                className="w-full px-4 py-2 border rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" required />
                회원가입 약관 및 개인정보처리방침에 동의
              </label>

              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                비용 안내서 받아보기
              </button>
            </form>
          </>
        )}

        {/* 재방문 탭 */}
        {tab === "returning" && (
          <div className="text-center text-gray-500 py-10">🔐 로그인 기능은 준비 중입니다.</div>
        )}

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-sm"
        >
          닫기
        </button>
      </div>
    </Dialog>
  );
}
