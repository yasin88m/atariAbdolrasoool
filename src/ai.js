const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export function getApiKey() {
  return localStorage.getItem("attari_gemini_key") || "";
}

export function setApiKey(key) {
  localStorage.setItem("attari_gemini_key", key);
}

export async function autoFillProduct(name, category) {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("کلید API تنظیم نشده است.");
  }

  if (!name.trim()) {
    throw new Error("نام محصول را وارد کنید.");
  }

  const prompt = `یک محصول عطاری و گیاهی به نام «${name}» در دسته‌بندی «${category}» داریم.

لطفاً اطلاعات زیر را به صورت JSON برگردانید (فقط JSON، بدون متن اضافی):
{
  "description": "توضیحات کامل و جذاب محصول به فارسی (۲ تا ۴ جمله درباره خواص، نحوه مصرف و ویژگی‌های بارز)",
  "badge": "یک برچسب کوتاه فارسی مناسب محصول (مثلاً «محبوب»، «ویژه»، «پرفروش»، «جدید») یا رشته خالی",
  "attributes": [
    { "key": "طبع", "value": "طبع گیاه به فارسی" },
    { "key": "خواص", "value": "خواص اصلی به فارسی" },
    { "key": "نحوه مصرف", "value": "نحوه مصرف به فارسی" },
    { "key": "وزن", "value": "وزن یا حجم تقریبی بسته‌بندی رایج" },
    { "key": "نوع بسته‌بندی", "value": "نوع بسته‌بندی رایج" }
  ]
}

نکات:
- تمام مقادیر باید به فارسی باشند.
- توضیحات باید مفید و مناسب فروشگاه آنلاین باشد.
- اگر اطلاعاتی را نمی‌دانید، مقدار مناسب و واقع‌بینانه بنویسید.
- فقط و فقط JSON برگردانید، هیچ متن اضافی نفرستید.`;

  const response = await fetch(
    `${GEMINI_URL}?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData?.error?.message || `خطای سرور (${response.status})`;
    throw new Error(message);
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("پاسخ AI قابل پردازش نیست.");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    description: String(parsed.description || "").trim(),
    badge: String(parsed.badge || "").trim(),
    attributes: Array.isArray(parsed.attributes)
      ? parsed.attributes
          .map((attr) => ({
            key: String(attr.key || "").trim(),
            value: String(attr.value || "").trim(),
          }))
          .filter((attr) => attr.key && attr.value)
      : [],
  };
}
