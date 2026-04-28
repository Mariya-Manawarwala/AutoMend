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
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Header
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("AUTOMEND", { align: "center" });
      doc
        .fontSize(12)
        .font("Helvetica")
        .text("Vehicle Repair Service Invoice", { align: "center" });
      doc
        .moveTo(50, doc.y + 10)
        .lineTo(550, doc.y + 10)
        .stroke();
      doc.moveDown();

      // Invoice info
      doc.fontSize(10);
      doc.text(`Invoice #: ${payment._id.toString().slice(-8).toUpperCase()}`, {
        align: "left",
      });
      doc.text(
        `Date: ${new Date(payment.createdAt).toLocaleDateString("en-IN")}`,
      );
      doc.moveDown();

      // Customer details
      doc.fontSize(12).font("Helvetica-Bold").text("CUSTOMER DETAILS");
      doc.fontSize(10).font("Helvetica");
      doc.text(`Name: ${job.customerId.name || "N/A"}`);
      doc.text(`Phone: ${job.customerId.phone || "N/A"}`);
      doc.text(`Address: ${job.customerId.address || "N/A"}`);
      doc.moveDown();

      // Vehicle details
      doc.fontSize(12).font("Helvetica-Bold").text("VEHICLE DETAILS");
      doc.fontSize(10).font("Helvetica");
      if (job.vehicleId) {
        doc.text(
          `Make/Model: ${job.vehicleId.make} ${job.vehicleId.model} (${job.vehicleId.year})`,
        );
        doc.text(`Registration: ${job.vehicleId.registrationNumber || "N/A"}`);
      }
      doc.moveDown();

      // Services table
      doc.fontSize(12).font("Helvetica-Bold").text("SERVICES");
      doc.fontSize(10).font("Helvetica");
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

      const serviceY = doc.y + 5;
      doc.text("Description", 60, serviceY, { width: 300 });
      doc.text("Amount", 400, serviceY, { width: 100, align: "right" });
      doc
        .moveTo(50, doc.y + 5)
        .lineTo(550, doc.y + 5)
        .stroke();
      doc.moveDown();

      job.servicesUsed.forEach((service) => {
        doc.text(service.name, 60, doc.y, { width: 300 });
        doc.text(`₹${service.price.toFixed(2)}`, 400, doc.y - 15, {
          width: 100,
          align: "right",
        });
        doc.moveDown();
      });

      // Parts table
      if (job.partsUsed && job.partsUsed.length > 0) {
        doc.fontSize(12).font("Helvetica-Bold").text("PARTS");
        doc.fontSize(10).font("Helvetica");
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

        const partsY = doc.y + 5;
        doc.text("Description", 60, partsY, { width: 200 });
        doc.text("Qty", 280, partsY, { width: 50, align: "center" });
        doc.text("Unit Price", 340, partsY, { width: 60, align: "right" });
        doc.text("Total", 430, partsY, { width: 100, align: "right" });
        doc
          .moveTo(50, doc.y + 5)
          .lineTo(550, doc.y + 5)
          .stroke();
        doc.moveDown();

        job.partsUsed.forEach((part) => {
          const totalPrice = part.price * (part.quantity || 1);
          doc.text(part.name, 60, doc.y, { width: 200 });
          doc.text(String(part.quantity || 1), 280, doc.y - 15, {
            width: 50,
            align: "center",
          });
          doc.text(`₹${part.price.toFixed(2)}`, 340, doc.y - 15, {
            width: 60,
            align: "right",
          });
          doc.text(`₹${totalPrice.toFixed(2)}`, 430, doc.y - 15, {
            width: 100,
            align: "right",
          });
          doc.moveDown();
        });
      }

      // Totals
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
      doc.fontSize(11).font("Helvetica");
      doc.text(`Subtotal: ₹${job.subtotal.toFixed(2)}`, 350, doc.y, {
        width: 150,
        align: "right",
      });
      if (job.discountAmount > 0) {
        doc.text(`Discount: -₹${job.discountAmount.toFixed(2)}`, 350, doc.y, {
          width: 150,
          align: "right",
        });
      }
      doc.fontSize(12).font("Helvetica-Bold");
      doc.text(`TOTAL: ₹${job.totalCost.toFixed(2)}`, 350, doc.y, {
        width: 150,
        align: "right",
      });

      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
      doc
        .fontSize(9)
        .font("Helvetica")
        .text("Thank you for choosing AutoMend!", { align: "center" });

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
