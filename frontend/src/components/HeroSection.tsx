import { useState } from "react";
import UserFormModal from "./UserFormModal";
import Button from "./Button";

export default function HeroSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="text-center py-20 bg-white min-h-screen">
      <h1 className="text-4xl font-bold mb-4">찾아줘 등기히어로</h1>
      <p className="mb-6 text-gray-600">빠르고 간결한 법인설립</p>
      <Button onClick={() => setModalOpen(true)}>비용 안내서 받기</Button>
      <UserFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}