require('dotenv').config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const app = express();

// ✅ CORS 설정 (프론트 배포 주소로 수정)
const cors = require("cors");
app.use(cors({
  origin: process.env.FRONTEND_URL, // Vercel 주소
  credentials: true
}));


app.use(express.json());

// ✅ uploads 폴더 자동 생성
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.post("/api/send-quote", async (req, res) => {
  console.log("📥 수신된 데이터:", req.body);
  const { name, email, phone, serviceType } = req.body;

  try {
    // ✅ PDF 경로 설정
    const fileName = `quote_${Date.now()}.pdf`;
    const filePath = path.join(uploadsDir, fileName);

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

      fs.unlinkSync(filePath); // 파일 삭제
      res.status(200).json({ message: "메일 전송 완료" });
    });
  } catch (err) {
    console.error("❌ 오류:", err);
    res.status(500).json({ message: "메일 전송 실패", error: err });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
