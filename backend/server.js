require('dotenv').config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const app = express();

// ✅ Vercel frontend 배포 주소를 여기에 넣으세요
const allowedOrigin = "https://final-brown-phi.vercel.app/"; // 예: https://hero-app.vercel.app

// CORS 허용 도메인 설정
app.use(cors({
  origin: allowedOrigin,
}));

app.use(express.json());

app.post("/api/send-quote", async (req, res) => {
  console.log("📥 수신된 데이터:", req.body);
  const { name, email, phone, serviceType } = req.body;

  try {
    // PDF 생성
    const fileName = `quote_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, "uploads", fileName);

    const doc = new PDFDocument({ size: "A4" });
    doc.registerFont('NotoSansKR', path.join(__dirname, 'fonts', 'NotoSansKR-Medium.ttf'));
    doc.font('NotoSansKR');

    doc.fontSize(18).text("히어로 견적서", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`이름: ${name}`);
    doc.text(`연락처: ${phone}`);
    doc.text(`이메일: ${email}`);
    doc.text(`서비스: ${serviceType === "setup" ? "신규법인 설립" : "법인변경등기"}`);
    doc.moveDown();
    doc.text(`총 예상 비용: 199,000원`, { underline: true });

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    doc.end();

    writeStream.on("finish", async () => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: '등기히어로 <no-reply@hero.com>',
        to: email,
        subject: "히어로 견적서 도착 ✉️",
        text: `${name} 님, 요청하신 견적서를 첨부해드립니다.`,
        attachments: [
          {
            filename: "견적서.pdf",
            path: filePath,
          },
        ],
      });

      fs.unlinkSync(filePath); // 생성한 PDF 삭제
      res.status(200).json({ message: "메일 전송 완료" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "메일 전송 실패", error: err });
  }
});

// 포트 설정 (로컬에서 테스트할 때만 사용)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ 백엔드 실행 중: http://localhost:${PORT}`));
