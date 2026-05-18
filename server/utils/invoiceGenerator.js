import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const invoicesDir = path.join(__dirname, "../invoices");

// Ensure invoices directory exists
if (!fs.existsSync(invoicesDir)) {
  fs.mkdirSync(invoicesDir, { recursive: true });
}

export const generateInvoicePDF = async (job, payment) => {
  return new Promise((resolve, reject) => {
    try {
      const filename = `invoice_${payment._id}.pdf`;
      const filepath = path.join(invoicesDir, filename);
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // --- COLORS & STYLES ---
      const gold = "#C89B3C";
      const lightGold = "#E8C170";
      const deepBlack = "#0A0A0A";
      const softDark = "#1A1A1A";
      const textMuted = "#94A3B8";
      const white = "#FFFFFF";
      const emerald = "#10B981";

      // Helper for drawing rounded rectangles with background
      const drawCard = (x, y, w, h, color = softDark, strokeColor = "rgba(255,255,255,0.05)") => {
        doc.roundedRect(x, y, w, h, 12).fill(color);
        doc.roundedRect(x, y, w, h, 12).lineWidth(0.5).stroke(strokeColor);
      };

      // --- HEADER ---
      // Logo (Placeholder text for now, but styled)
      doc.fillColor(gold).font("Helvetica-Bold").fontSize(24).text("AUTOMEND", 40, 40);
      doc.fillColor(textMuted).font("Helvetica").fontSize(8).text("PREMIUM GARAGE SERVICES", 40, 65);

      // Company Info (Right Aligned)
      doc.fillColor(white).font("Helvetica-Bold").fontSize(22).text("INVOICE", 400, 40, { align: "right" });
      
      doc.fillColor(textMuted).font("Helvetica").fontSize(9);
      doc.text("Invoice No.", 400, 75, { continued: true }).fillColor(white).text(`  :  ${job.invoiceNumber || 'INV-DRAFT'}`, { align: "right" });
      doc.fillColor(textMuted).text("Invoice Date", 400, 90, { continued: true }).fillColor(white).text(` :  ${new Date(payment.updatedAt || payment.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}`, { align: "right" });
      doc.fillColor(textMuted).text("Payment Status", 400, 105, { continued: true }).fillColor(emerald).text(` :  ${payment.paymentStatus.toUpperCase()}`, { align: "right" });

      // Company Address Info (Left)
      doc.fillColor(gold).fontSize(10).text("AutoMend Premium Garage", 40, 100);
      doc.fillColor(textMuted).fontSize(8).text("123, AutoMend Street, Vijay Nagar,", 40, 115);
      doc.text("Indore, Madhya Pradesh - 452010", 40, 127);
      doc.text("+91 91234 56789 | support@automend.com", 40, 139);

      // --- INFO CARDS ---
      const cardY = 170;
      const cardW = 175;
      const cardH = 100;

      // Card 1: Billed To
      drawCard(40, cardY, cardW, cardH, "#F8FAFC", "#E2E8F0");
      doc.fillColor("#475569").font("Helvetica-Bold").fontSize(8).text("BILLED TO", 55, cardY + 12);
      doc.fillColor("#1E293B").fontSize(9).text(`Name     :  ${String(job.customerId?.name || "N/A")}`, 55, cardY + 35);
      doc.text(`Phone    :  ${String(job.customerId?.phone || "N/A")}`, 55, cardY + 50);
      doc.text(`Email     :  ${String(job.customerId?.email || "N/A")}`, 55, cardY + 65);
      doc.fontSize(8).text(`Address :  ${String(job.customerId?.address || "N/A").slice(0, 30)}...`, 55, cardY + 80);

      // Card 2: Vehicle Details
      drawCard(40 + cardW + 10, cardY, cardW, cardH, "#F8FAFC", "#E2E8F0");
      doc.fillColor("#475569").font("Helvetica-Bold").fontSize(8).text("VEHICLE DETAILS", 40 + cardW + 25, cardY + 12);
      doc.fillColor("#1E293B").fontSize(9).text(`Brand    :  ${String(job.vehicleId?.brand || "N/A")}`, 40 + cardW + 25, cardY + 35);
      doc.text(`Model    :  ${String(job.vehicleId?.model || "N/A")}`, 40 + cardW + 25, cardY + 50);
      doc.text(`Year       :  ${String(job.vehicleId?.yearBought || "N/A")}`, 40 + cardW + 25, cardY + 65);
      doc.text(`Reg No.  :  ${String(job.vehicleId?.numberPlate || "N/A")}`, 40 + cardW + 25, cardY + 80);

      // Card 3: Mechanic Details
      drawCard(40 + (cardW + 10) * 2, cardY, cardW, cardH, "#F8FAFC", "#E2E8F0");
      doc.fillColor("#475569").font("Helvetica-Bold").fontSize(8).text("MECHANIC DETAILS", 40 + (cardW + 10) * 2 + 15, cardY + 12);
      doc.fillColor("#1E293B").fontSize(9).text(`Name          :  ${String(job.mechanicId?.name || "N/A")}`, 40 + (cardW + 10) * 2 + 15, cardY + 35);
      doc.text(`Employee ID :  AM-MECH-${String(job.mechanicId?._id || "0000").slice(-4).toUpperCase()}`, 40 + (cardW + 10) * 2 + 15, cardY + 50);
      doc.text(`Contact       :  ${String(job.mechanicId?.phone || "N/A")}`, 40 + (cardW + 10) * 2 + 15, cardY + 65);

      // --- SERVICES TABLE ---
      let currentY = cardY + cardH + 30;
      doc.fillColor(deepBlack).rect(40, currentY, 515, 25).fill("#F1F5F9");
      doc.fillColor("#475569").font("Helvetica-Bold").fontSize(9).text("SERVICES PERFORMED", 55, currentY + 8);
      
      currentY += 25;
      doc.fillColor("#64748B").font("Helvetica-Bold").fontSize(8);
      doc.text("#", 55, currentY + 10);
      doc.text("SERVICE", 85, currentY + 10);
      doc.text("LABOR CHARGE (₹)", 450, currentY + 10, { align: "right" });
      
      doc.moveTo(40, currentY + 25).lineTo(555, currentY + 25).lineWidth(0.5).stroke("#E2E8F0");
      currentY += 25;

      doc.font("Helvetica").fontSize(9).fillColor("#334155");
      job.servicesUsed.forEach((service, index) => {
        doc.text(String(index + 1), 55, currentY + 10);
        doc.text(String(service.name || "Service"), 85, currentY + 10);
        doc.text(String((service.price || 0).toFixed(2)), 450, currentY + 10, { align: "right" });
        currentY += 25;
        doc.moveTo(40, currentY).lineTo(555, currentY).lineWidth(0.1).stroke("#F1F5F9");
      });

      // --- PARTS TABLE ---
      currentY += 20;
      doc.fillColor(deepBlack).rect(40, currentY, 515, 25).fill("#F1F5F9");
      doc.fillColor("#475569").font("Helvetica-Bold").fontSize(9).text("PARTS USED", 55, currentY + 8);
      
      currentY += 25;
      doc.fillColor("#64748B").font("Helvetica-Bold").fontSize(8);
      doc.text("#", 55, currentY + 10);
      doc.text("PART NAME", 85, currentY + 10);
      doc.text("QTY", 300, currentY + 10, { align: "center" });
      doc.text("PRICE (₹)", 380, currentY + 10, { align: "right" });
      doc.text("TOTAL (₹)", 480, currentY + 10, { align: "right" });
      
      doc.moveTo(40, currentY + 25).lineTo(555, currentY + 25).lineWidth(0.5).stroke("#E2E8F0");
      currentY += 25;

      const servicesTotal = job.servicesUsed.reduce((sum, s) => sum + (s.price || 0), 0);
      const partsTotal = job.partsUsed.reduce((sum, p) => sum + ((p.price || 0) * (p.quantity || 1)), 0);

      doc.font("Helvetica").fontSize(9).fillColor("#334155");
      job.partsUsed.forEach((part, index) => {
        const rowTotal = (part.price || 0) * (part.quantity || 1);
        doc.text(String(index + 1), 55, currentY + 10);
        doc.text(String(part.name || "Part"), 85, currentY + 10);
        doc.text(String(part.quantity || 1), 300, currentY + 10, { align: "center" });
        doc.text(String((part.price || 0).toFixed(2)), 380, currentY + 10, { align: "right" });
        doc.text(String(rowTotal.toFixed(2)), 480, currentY + 10, { align: "right" });
        currentY += 25;
        doc.moveTo(40, currentY).lineTo(555, currentY).lineWidth(0.1).stroke("#F1F5F9");
      });

      // --- SUMMARY & PAYMENT ---
      currentY += 20;
      // Payment Info (Left)
      drawCard(40, currentY, 240, 100, "#F8FAFC", "#E2E8F0");
      doc.fillColor("#475569").font("Helvetica-Bold").fontSize(8).text("PAYMENT INFORMATION", 55, currentY + 12);
      doc.fillColor("#1E293B").fontSize(8).text(`Payment Method :  Online`, 55, currentY + 35);
      doc.text(`Transaction ID    :  TXN-${String(payment._id).slice(-8).toUpperCase()}`, 55, currentY + 50);
      doc.text(`Payment Status  :  `, 55, currentY + 65, { continued: true });
      if (payment.paymentStatus === 'Completed') {
        doc.fillColor(emerald).text("PAID");
      } else {
        doc.fillColor("#F59E0B").text("Pending");
      }
      
      // Totals (Right)
      const subtotal = servicesTotal + partsTotal;
      const total = subtotal;

      doc.fillColor("#64748B").font("Helvetica").fontSize(9);
      doc.text("Total Labor Charges", 300, currentY + 10);
      doc.fillColor("#1E293B").text(`₹ ${String(servicesTotal.toFixed(2))}`, 450, currentY + 10, { align: "right" });
      
      doc.fillColor("#64748B").text("Total Parts Amount", 300, currentY + 25);
      doc.fillColor("#1E293B").text(`₹ ${String(partsTotal.toFixed(2))}`, 450, currentY + 25, { align: "right" });
      
      doc.moveTo(300, currentY + 40).lineTo(555, currentY + 40).lineWidth(0.5).dash(2, { space: 2 }).stroke("#CBD5E1");
      
      doc.fillColor("#64748B").text("Total Amount", 300, currentY + 50);
      doc.fillColor("#1E293B").text(`₹ ${String(total.toFixed(2))}`, 450, currentY + 50, { align: "right" });

      currentY += 80;
      doc.fillColor("#F1F5F9").rect(300, currentY, 255, 40).fill();
      doc.fillColor("#475569").font("Helvetica-Bold").fontSize(10).text("TOTAL AMOUNT (INR)", 315, currentY + 15);
      doc.fillColor(gold).fontSize(14).text(`₹ ${String(total.toFixed(2))}`, 400, currentY + 15, { align: "right" });

      // --- FOOTER ---
      doc.fillColor(textMuted).font("Helvetica-Oblique").fontSize(10).text("Your Car. Our Care.", 40, 780, { align: "center" });

      doc.end();

      stream.on("finish", () => {
        resolve(filepath);
      });

      stream.on("error", (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
};
