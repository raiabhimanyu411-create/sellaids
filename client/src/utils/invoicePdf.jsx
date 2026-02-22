import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ===== image loader (PUBLIC FOLDER) ===== */
const getBase64FromUrl = async (url) => {
  const res = await fetch(url);
  const blob = await res.blob();

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

/* ===== STATIC DUMMY DATA ===== */
const STATIC_ORDER = {
  companyName: "Stylekins Private Limited",
  companyAddress1: "A 105-A Unitech Arcadia",
  companyAddress2: "South City 2",
  companyCity: "Gurgaon - 120018",
  companyPhone: "+91 9876543210",
  pan: "ABCDE1234F",
  cin: "U12345HR2023PTC123456",

  customerName: "Rahul Sharma",
  customerAddress: "Flat 402, Green Residency",
  customerAddress2: "Sector 57",
  customerCity: "Gurgaon",
  customerPincode: "122011",
  customerCountry: "India",
  customerEmail: "rahul.sharma@gmail.com",
  customerPhone: "+91 9999999999",

  shipName: "Rahul Sharma",
  shipAddress: "Flat 402, Green Residency",
  shipAddress2: "Sector 57",
  shipCity: "Gurgaon",
  shipPincode: "122011",
  shipCountry: "India",
  shipPhone: "+91 9999999999",

  invoiceNumber: "INV-2025-001",
  orderNumber: "ORD-987654",
  orderDate: "2025-01-10",
  paymentMethod: "Cash on Delivery",

  items: [
    { name: "Bluetooth Headphones", sku: "BH-101", qty: 1, price: 1999 },
    { name: "Wireless Mouse", sku: "WM-202", qty: 2, price: 799 },
  ],

  subtotal: 3597,
  shipping_fee: 99,
  platform_fee: 50,
  total: 3746,
};

export const generateDummyInvoice = async () => {
  const order = STATIC_ORDER;
  const doc = new jsPDF("p", "mm", "a4");

  const PAGE_WIDTH = 210;
  const MARGIN = 15;
  const RIGHT_X = PAGE_WIDTH - MARGIN;
  const RIGHT_COL = 130;

  /* ================= LOGO ================= */
  try {
    const logoBase64 = await getBase64FromUrl("/site.png");
    doc.addImage(logoBase64, "PNG", MARGIN, 10, 15, 15);
  } catch (e) {}

  /* ================= HEADER LEFT ================= */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("SELLAIDS", MARGIN + 15, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("USE TO REUSE", MARGIN + 15, 24);

  /* ================= HEADER RIGHT ================= */
  doc.setFont("helvetica", "bold");
  doc.text("SELLAIDS", RIGHT_COL, 18);

  doc.setFont("helvetica", "normal");
  doc.text("A 105-A Unitech Arcadia", RIGHT_COL, 24);
  doc.text("South City 2 Gurgaon", RIGHT_COL, 29);
  doc.text("120018", RIGHT_COL, 34);

  doc.text("Company Address:", RIGHT_COL, 44);
  doc.text(order.companyName, RIGHT_COL, 49);
  doc.text(order.companyAddress1, RIGHT_COL, 54);
  doc.text(order.companyAddress2, RIGHT_COL, 59);
  doc.text(order.companyCity, RIGHT_COL, 64);

  doc.setFont("helvetica", "bold");
  doc.text("PAN NO:", RIGHT_COL, 74);
  doc.text("CIN NO:", RIGHT_COL, 80);

  doc.setFont("helvetica", "normal");
  doc.text(order.pan, RIGHT_X, 74, { align: "right" });
  doc.text(order.cin, RIGHT_X, 80, { align: "right" });
  doc.text(order.companyPhone, RIGHT_COL, 86);

  /* ================= INVOICE TITLE ================= */
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", MARGIN, 100);

  /* ================= BILL TO ================= */
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(order.customerName, MARGIN, 110);
  doc.text(order.customerAddress, MARGIN, 115);
  doc.text(order.customerAddress2, MARGIN, 120);
  doc.text(order.customerCity, MARGIN, 125);
  doc.text(order.customerPincode, MARGIN, 130);
  doc.text(order.customerCountry, MARGIN, 135);
  doc.text(order.customerEmail, MARGIN, 140);
  doc.text(order.customerPhone, MARGIN, 145);

  /* ================= SHIP TO ================= */
  doc.setFont("helvetica", "bold");
  doc.text("Ship To:", 80, 110);

  doc.setFont("helvetica", "normal");
  doc.text(order.shipName, 80, 115);
  doc.text(order.shipAddress, 80, 120);
  doc.text(order.shipAddress2, 80, 125);
  doc.text(order.shipCity, 80, 130);
  doc.text(order.shipPincode, 80, 135);
  doc.text(order.shipCountry, 80, 140);
  doc.text(order.shipPhone, 80, 145);

  /* ================= INVOICE META ================= */
  doc.text("Invoice Number:", RIGHT_COL, 110);
  doc.text("Order Number:", RIGHT_COL, 117);
  doc.text("Order Date:", RIGHT_COL, 124);
  doc.text("Payment Method:", RIGHT_COL, 131);

  doc.text(order.invoiceNumber, RIGHT_X, 110, { align: "right" });
  doc.text(order.orderNumber, RIGHT_X, 117, { align: "right" });
  doc.text(new Date(order.orderDate).toDateString(), RIGHT_X, 124, {
    align: "right",
  });
  doc.text(order.paymentMethod, RIGHT_X, 131, { align: "right" });

  /* ================= PRODUCT TABLE ================= */
  autoTable(doc, {
    startY: 155,
    head: [["Product", "Qty", "Price"]],
    body: order.items.map((item) => [
      `${item.name}\nSKU: ${item.sku}`,
      item.qty,
      `₹${item.price}`,
    ]),
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [0, 0, 0], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 113 },
      1: { cellWidth: 50 },
      2: { cellWidth: 35 },
    },
  });

  /* ================= TOTALS ================= */
  const y = doc.lastAutoTable.finalY + 10;

  doc.setFont("helvetica", "bold");
  doc.text("Subtotal", RIGHT_COL, y);
  doc.text("Shipping", RIGHT_COL, y + 7);
  doc.text("Platform Fee", RIGHT_COL, y + 14);

  doc.setFont("helvetica", "normal");
  doc.text(`₹${order.subtotal}`, RIGHT_X, y, { align: "right" });
  doc.text(`₹${order.shipping_fee}`, RIGHT_X, y + 7, { align: "right" });
  doc.text(`₹${order.platform_fee}`, RIGHT_X, y + 14, { align: "right" });

  doc.line(RIGHT_COL, y + 18, RIGHT_X, y + 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total", RIGHT_COL, y + 26);
  doc.text(`₹${order.total}`, RIGHT_X, y + 26, { align: "right" });

  /* ================= FOOTER ================= */
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Thanks for Shopping with us!", PAGE_WIDTH / 2, 280, {
    align: "center",
  });
  doc.text(
    "For any queries mail us at contact@sellaids.com",
    PAGE_WIDTH / 2,
    286,
    { align: "center" }
  );

  return doc;
};
