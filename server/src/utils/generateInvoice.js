import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

const drawProductTable = (doc, items, startY) => {
  const MARGIN = 40;
  const RIGHT_X = 555;
  const PRICE_COL_X = 450;       // price column start
  const PRICE_COL_WIDTH = 100;
  let y = startY;

  const drawHeader = () => {
    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("Product", MARGIN, y);
    doc.text("Qty", 340, y);
    doc.text("Price", PRICE_COL_X, y, {
      width: PRICE_COL_WIDTH,
      align: "right",
    });

    doc.moveTo(MARGIN, y + 12).lineTo(RIGHT_X, y + 12).stroke();
    y += 20;
    doc.font("Helvetica");
  };

  drawHeader();

  items.forEach((item) => {
    if (y > 720) {
      doc.addPage();
      y = 60;
      drawHeader();
    }

    const text = `${item.name}\nSKU: ${item.sku}`;
    const height = doc.heightOfString(text, { width: 280 });

    doc.text(text, MARGIN, y, { width: 280 });
    doc.text(String(item.qty), 340, y);
    doc.text(
      `${item.price}`,
      PRICE_COL_X,
      y,
      {
        width: PRICE_COL_WIDTH,
        align: "right",
      }
    );

    y += height + 10;
  });

  return y;
};

export const generateInvoicePDF = (invoiceData) => {

  if (!invoiceData.invoiceNumber) {
    throw new Error("Invoice number missing while generating PDF");
  }

  const invoiceDir = path.join(process.cwd(), "src/public/invoices");

  if (!fs.existsSync(invoiceDir)) {
    fs.mkdirSync(invoiceDir, { recursive: true });
  }

  const fileName = `invoice-${invoiceData.invoiceNumber}.pdf`;
  const filePath = path.join(invoiceDir, fileName);
  const doc = new PDFDocument({ size: "A4", margin: 40 });
  doc.pipe(fs.createWriteStream(filePath));

  const PAGE_WIDTH = 595;
  const MARGIN = 40;
  const RIGHT_X = PAGE_WIDTH - MARGIN;
  const RIGHT_COL = 340;
  const RIGHT_VALUE_WIDTH = 160;
  const imagePath = path.join(process.cwd(),  "..", "client/public/site.png")
  console.log(imagePath);

  const subtotal = Number(invoiceData.subtotal);
  const shipping = Number(invoiceData.shipping_fee);
  const platform = Number(invoiceData.platform_fee);

  const total = subtotal + shipping + platform;
  doc.image(imagePath, MARGIN, 30, { width: 50 });

  /* ================= HEADER ================= */
  doc.font("Helvetica-Bold").fontSize(20).text("SELLAIDS", MARGIN + 48, 40);
  doc.font("Helvetica").fontSize(10).text("USE TO REUSE", MARGIN + 48, 64);

  doc.font("Helvetica-Bold").fontSize(12).text("SELLAIDS", RIGHT_COL, 40);
  doc.font("Helvetica").fontSize(10);
  doc.text("A 105-A Unitech Arcadia", RIGHT_COL, 60);
  doc.text("South City 2 Gurgaon", RIGHT_COL, 75);
  doc.text("120018", RIGHT_COL, 90);

  doc.text("Company Address:", RIGHT_COL, 120);
  doc.text("Stylekins Private Limited", RIGHT_COL, 135);
  doc.text("House No231 Ground Floor", RIGHT_COL, 150);
  doc.text("Sector 37 A, Chandigarh", RIGHT_COL, 165);
  doc.text("Chandigarh, 160036", RIGHT_COL, 180);

  doc.font("Helvetica-Bold").text("PAN NO:", RIGHT_COL, 205);
  doc.font("Helvetica").text(
    "ABOCS8826N",
    RIGHT_X - RIGHT_VALUE_WIDTH,
    205,
    {
      width: RIGHT_VALUE_WIDTH,
      align: "right",
    }
  );

  doc.font("Helvetica-Bold").text("CIN NO:", RIGHT_COL, 225);

  doc.font("Helvetica").text(
    "U46901CH2024PTC046006",
    RIGHT_X - RIGHT_VALUE_WIDTH,
    225,
    {
      width: RIGHT_VALUE_WIDTH,
      align: "right",
    }
  );

  doc.font("Helvetica-Bold").text("Contact No:", RIGHT_COL, 245);
  doc.text(
    "+91 88004 25855",
    RIGHT_X - RIGHT_VALUE_WIDTH,
    245,
    {
      width: RIGHT_VALUE_WIDTH,
      align: "right",
    }
  );


  /* ================= TITLE ================= */
  doc.font("Helvetica-Bold").fontSize(26).text("INVOICE", MARGIN, 285);

  /* ================= BILL TO ================= */
  const billY = 330;
  doc.font("Helvetica").fontSize(11);
  doc.text(invoiceData.customerName, MARGIN, billY);
  doc.text(invoiceData.customerAddress, MARGIN, billY + 16);
  doc.text(invoiceData.customerCity, MARGIN, billY + 48);
  doc.text(invoiceData.customerPincode, MARGIN, billY + 64);
  doc.text(invoiceData.customerState, MARGIN, billY + 32);
  doc.text(invoiceData.customerCountry, MARGIN, billY + 80);
  doc.text(invoiceData.customerEmail, MARGIN, billY + 96);
  doc.text(invoiceData.customerPhone, MARGIN, billY + 112);

  /* ================= META ================= */
  doc.text("Invoice Number:", RIGHT_COL, billY);
  doc.text(
    invoiceData.invoiceNumber,
    RIGHT_X - RIGHT_VALUE_WIDTH,
    billY,
    {
      width: RIGHT_VALUE_WIDTH,
      align: "right",
    }
  );

  doc.text("Order Number:", RIGHT_COL, billY + 22);
  doc.text(
    `ORD-${invoiceData.orderNumber}`,
    RIGHT_X - RIGHT_VALUE_WIDTH,
    billY + 22,
    {
      width: RIGHT_VALUE_WIDTH,
      align: "right",
    }
  )

  doc.text("Order Date:", RIGHT_COL, billY + 44);
  doc.text(
    invoiceData.orderDate,
    RIGHT_X - RIGHT_VALUE_WIDTH,
    billY + 44,
    {
      width: RIGHT_VALUE_WIDTH,
      align: "right",
    }
  );

  doc.text("Payment Method:", RIGHT_COL, billY + 66);
  doc.text(
    "Online Paid",
    RIGHT_X - RIGHT_VALUE_WIDTH,
    billY + 66,
    {
      width: RIGHT_VALUE_WIDTH,
      align: "right",
    }
  );

  let tableEndY = drawProductTable(doc, invoiceData.items, billY + 150);

  /* ================= TOTALS ================= */
  let y = tableEndY + 20;

  doc.font("Helvetica-Bold");
  doc.text("Subtotal", RIGHT_COL, y);
  doc.text("Shipping Fee", RIGHT_COL, y + 18);
  doc.text("Platform Fee", RIGHT_COL, y + 36);

  doc.font("Helvetica");
  doc.text(invoiceData.subtotal, RIGHT_X - RIGHT_VALUE_WIDTH, y, { width: RIGHT_VALUE_WIDTH, align: "right" });
  doc.text(invoiceData.shipping_fee, RIGHT_X - RIGHT_VALUE_WIDTH, y + 18, { width: RIGHT_VALUE_WIDTH, align: "right" });
  doc.text(invoiceData.platform_fee, RIGHT_X - RIGHT_VALUE_WIDTH, y + 36, { width: RIGHT_VALUE_WIDTH, align: "right" });

  doc.moveTo(RIGHT_COL, y + 54).lineTo(RIGHT_X, y + 54).stroke();

  doc.font("Helvetica-Bold").fontSize(13);
  doc.text("Total", RIGHT_COL, y + 76);
  doc.text(total, RIGHT_X - RIGHT_VALUE_WIDTH, y + 76, { width: RIGHT_VALUE_WIDTH, align: "right" });

  /* ================= FOOTER ================= */
  const footerY = doc.page.height - 80;

  doc.fontSize(10).font("Helvetica");
  doc.text(
    "Thanks for Shopping with us!",
    MARGIN,
    footerY,
    {
      width: PAGE_WIDTH - MARGIN * 2,
      align: "center",
    }
  );
  doc.text(
    "For any queries mail us at contact@sellaids.com",
    MARGIN,
    footerY + 15,
    {
      width: PAGE_WIDTH - MARGIN * 2,
      align: "center",
    }
  );

  doc.end();
  return `/invoices/${fileName}`;
}
