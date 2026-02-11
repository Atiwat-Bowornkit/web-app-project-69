// ฟังก์ชันแปลงข้อความ "1/2" -> 0.5
export function parseFraction(amountStr: string): number {
  if (!amountStr) return 0;
  
  const cleanStr = amountStr.trim();

  // ถ้าเจอเครื่องหมาย / ให้จับหารกัน
  if (cleanStr.includes('/')) {
    const [numerator, denominator] = cleanStr.split('/').map(Number);
    if (denominator !== 0) {
      return numerator / denominator;
    }
  }

  // ถ้าไม่มี / ก็แปลงเป็นตัวเลขปกติ
  return parseFloat(cleanStr) || 0;
}

// ฟังก์ชันแปลงตัวเลข 0.5 -> "1/2"
export function formatFraction(amount: number): string {
  // ปัดเศษทศนิยมให้เหลือ 2 ตำแหน่งก่อนเปรียบเทียบ
  const val = Math.round(amount * 100) / 100;

  // จัดการเคสยอดฮิตในการทำอาหาร
  if (val === 0.25) return "1/4";
  if (val === 0.33) return "1/3";
  if (val === 0.5) return "1/2";
  if (val === 0.66) return "2/3";
  if (val === 0.75) return "3/4";

  // ถ้ามีจำนวนเต็มด้วย เช่น 1.5 -> "1 1/2"
  if (val > 1) {
    const integer = Math.floor(val);
    const decimal = val - integer;
    
    if (decimal === 0.25) return `${integer} 1/4`;
    if (decimal === 0.33) return `${integer} 1/3`;
    if (decimal === 0.5) return `${integer} 1/2`;
    if (decimal === 0.66) return `${integer} 2/3`;
    if (decimal === 0.75) return `${integer} 3/4`;
  }

  // ถ้าไม่เข้าเคสเศษส่วน ให้แสดงทศนิยมปกติ (ตัด .00 ออกถ้าเป็นจำนวนเต็ม)
  return parseFloat(val.toFixed(2)).toString();
}