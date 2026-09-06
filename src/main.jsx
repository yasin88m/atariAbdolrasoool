import React, { useEffect, useState, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  ChevronLeft,
  Menu,
  Search,
  Sparkles,
  X,
  Plus,
  Pencil,
  Trash2,
  Download,
  FolderOpen,
  Upload,
  Save,
  Package,
  CheckCircle2,
  AlertCircle,
  ListChecks,
  Phone,
  MapPin,
  Users,
  Clock,
  Heart,
  Leaf,
  ShieldCheck,
  Coffee,
  ChevronRight,
} from "./icons.jsx";

import "./styles.css";
import { products as fallbackProducts } from "./data/products";
import {
  autoFillProduct,
  getApiKey,
  setApiKey,
} from "./ai.js";

/* =========================================================
   CONSTANTS
========================================================= */

const categories = [
  {
    title: "گیاهان دارویی",
    subtitle: "تازه و پاک‌شده",
    icon: "🌿",
  },
  {
    title: "دمنوش و چای",
    subtitle: "آرامش در هر فنجان",
    icon: "🍵",
  },
  {
    title: "عرقیات گیاهی",
    subtitle: "خالص و اصیل",
    icon: "💧",
  },
  {
    title: "روغن‌های گیاهی",
    subtitle: "طبیعی و کاربردی",
    icon: "🌱",
  },
  {
    title: "ادویه و چاشنی",
    subtitle: "عطر و طعم طبیعت",
    icon: "🫚",
  },
  {
    title: "محصولات طبیعی",
    subtitle: "انتخاب‌های ویژه",
    icon: "✨",
  },
];

const categoryNames = categories.map((category) => category.title);

const ADMIN_PASSWORD = "yasin@23188";

/* =========================================================
   HELPERS
========================================================= */

function searchProducts(list, query) {
  const q = String(query || "")
    .trim()
    .toLocaleLowerCase("fa");

  if (!q) {
    return list;
  }

  return list.filter((product) =>
    [product.name, product.type, product.description, product.badge]
      .filter(Boolean)
      .some((field) =>
        String(field).toLocaleLowerCase("fa").includes(q)
      )
  );
}

function downloadFile(name, content, type = "application/octet-stream") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

/* =========================================================
   ARTICLES
========================================================= */

const articles = [
  {
    id: 1,
    number: "۰۱",
    title: "روش‌های درمانی تیروئید با گیاهان دارویی",
    category: "تیروئید",
    summary: "آشنایی با روش‌های طبیعی و گیاهی برای بهبود عملکرد غده تیروئید.",
    readTime: "۸ دقیقه",
    content: `غده تیروئید یکی از مهم‌ترین غدد درون‌ریز بدن است که نقش کلیدی در تنظیم متابولیسم، دمای بدن، ضربان قلب و سطح انرژی ایفا می‌کند. اختلال در عملکرد این غده می‌تواند منجر به مشکلات متعددی شود که زندگی روزمره را تحت تأثیر قرار می‌دهد.

گیاهان دارویی از دیرباز در طب سنتی برای حمایت از سلامت تیروئید مورد استفاده قرار گرفته‌اند. گیاه آشواگاندا (Ashwagandha) یکی از شناخته‌شده‌ترین گیاهان در این زمینه است. تحقیقات نشان داده است که مصرف منظم عصاره آشواگاندا می‌تواند سطح TSH (هورمون محرک تیروئید) را کاهش داده و سطح T3 و T4 را بهبود بخشد.

گیاه بلدرچین (Bladderwramp) نیز به دلیل داشتن ید طبیعی، برای افراد مبتلا به کم‌کاری تیروئید مفید است. این گیاه به تولید هورمون‌های تیروئیدی کمک می‌کند. همچنین، گل‌گاوزبان با خواص آرام‌بخش و ضدالتهابی خود می‌تواند در مدیریت علائم پرکاری تیروئید مؤثر باشد.

نکته مهم: قبل از مصرف هرگونه گیاه دارویی برای مشکلات تیروئید، حتماً با پزشک متخصص مشورت کنید. گیاهان دارویی مکمل درمان هستند، نه جایگزین آن.`
  },
  {
    id: 2,
    number: "۰۲",
    title: "علائم کم‌کاری تیروئید و راهکارهای طبیعی",
    category: "تیروئید",
    summary: "شناخت علائم هیپوتیروئیدیسم و راهکارهای گیاهی برای بهبود وضعیت عمومی بدن.",
    readTime: "۷ دقیقه",
    content: `کم‌کاری تیروئید (هیپوتیروئیدیسم) وضعیتی است که در آن غده تیروئید به اندازه کافی هورمون تیروئید تولید نمی‌کند. این وضعیت می‌تواند علائم متنوعی داشته باشد که اغلب نادیده گرفته می‌شوند.

از مهم‌ترین علائم کم‌کاری تیروئید می‌توان به خستگی مزمن، افزایش وزن بدون دلیل، احساس سرما، خشکی پوست و مو، یبوست مزمن، افسردگی و کاهش تمرکز اشاره کرد. زنان بالای ۶۰ سال بیشتر در معرض ابتلا به این بیماری هستند.

از نظر طب سنتی، مصرف دمنوش گزنه یکی از بهترین روش‌ها برای حمایت از تیروئید است. گزنه سرشار از ید و آنتی‌اکسیدان است که به تولید هورمون‌های تیروئیدی کمک می‌کند. دمنوش ریشه شیرین‌بیان نیز با خواص ضدالتهابی خود می‌تواند در کاهش التهاب تیروئید مؤثر باشد.

مصرف غذاهای غنی از سلنیوم مانند آجیل برزیلی و دانه‌های آفتابگردان نیز برای سلامت تیروئید ضروری است. سلنیوم نقش مهمی در تبدیل T4 به T3 فعال دارد.`
  },
  {
    id: 3,
    number: "۰۳",
    title: "خواص بی‌نظیر گل سرخ دمشقی",
    category: "گیاهان دارویی",
    summary: "بررسی خواص درمانی، آرایشی و غذایی گل سرخ دمشقی و روش‌های استفاده از آن.",
    readTime: "۶ دقیقه",
    content: `گل سرخ دمشقی (Damascena Rosa) یکی از قدیمی‌ترین و باارزش‌ترین گل‌های جهان است که قدمتی بیش از ۳۰۰۰ سال دارد. این گل زیبا نه تنها به خاطر عطر دل‌انگیزش شناخته شده، بلکه خواص درمانی فراوانی نیز دارد.

گلاب حاصل از تقطیر گل سرخ دمشقی یکی از محبوب‌ترین محصولات طبیعی در ایران است. گلاب خالص دارای خواص ضدباکتریایی، ضدالتهابی و آنتی‌اکسیدانی قوی است. استفاده از گلاب به عنوان تونر طبیعی پوست می‌تواند به کاهش قرمزی، التهاب و جوش‌های پوستی کمک کند.

از گلاب برای درمان سردرد و میگرن نیز استفاده می‌شود. کمپرس گلاب روی پیشانی می‌تواند به کاهش درد کمک کند. همچنین، مصرف خوراکی گلاب خالص در تقویت معده و بهبود عملکرد گوارشی مؤثر است.

در صنایع غذایی، گلاب در تهیه شیرینی‌ها، مرباها و نوشیدنی‌ها کاربرد فراوانی دارد. گلاب به عنوان طعم‌دهنده طبیعی، جایگزین مناسبی برای مواد شیمیایی مصنوعی است.`
  },
  {
    id: 4,
    number: "۰۴",
    title: "خواص درمانی زردچوبه و زنجبیل",
    category: "ادویه‌جات",
    summary: "بررسی فواید شگفت‌انگیز زردچوبه و زنجبیل برای سلامت بدن و پیشگیری از بیماری‌ها.",
    readTime: "۹ دقیقه",
    content: `زردچوبه یکی از ارزشمندترین ادویه‌های جهان است که قرن‌هاست در طب سنتی هند و ایران برای درمان بیماری‌های مختلف استفاده می‌شود. ماده موثر زردچوبه، کورکومین نام دارد که خواص ضدالتهابی و آنتی‌اکسیدانی قوی دارد.

تحقیقات علمی نشان داده است که کورکومین می‌تواند در کاهش درد مفاصل، بهبود عملکرد مغز و تقویت سیستم ایمنی بدن مؤثر باشد. ترکیب زردچوبه با فلفل سیاه جذب کورکومین را تا ۲۰۰۰ درصد افزایش می‌دهد.

زنجبیل نیز یکی دیگر از گیاهان دارویی با خواص بی‌نظیر است. زنجبیل تازه یا پودر آن به کاهش حالت تهوع، درمان سرماخوردگی و بهبود گوارش کمک می‌کند. دمنوش زنجبیل با لیمو یکی از محبوب‌ترین نوشیدنی‌های طبیعی برای تقویت بدن در فصول سرد است.

نکته مهم: مصرف زردچوبه و زنجبیل برای اکثر افراد بی‌خطر است، اما افرادی که داروی رقیق‌کننده خون مصرف می‌کنند باید قبل از مصرف با پزشک مشورت کنند.`
  },
  {
    id: 5,
    number: "۰۵",
    title: "گیاه آلوئه‌ورا: معجزه طبیعت برای پوست و مو",
    category: "گیاهان دارویی",
    summary: "آشنایی با خواص بی‌نظیر آلوئه‌ورا برای زیبایی، سلامت پوست و تقویت مو.",
    readTime: "۷ دقیقه",
    content: `آلوئه‌ورا یکی از محبوب‌ترین گیاهان دارویی جهان است که به «گیاه جاودانگی» معروف است. ژل شفاف داخل برگ‌های این گیاه سرشار از ویتامین‌ها، مواد معدنی و آنتی‌اکسیدان‌ها است.

برای پوست، آلوئه‌ورا یک مرطوب‌کننده طبیعی عالی است که به درمان آفتاب‌سوختگی، کاهش جوش‌های پوستی و بهبود زخم‌ها کمک می‌کند. ژل آلوئه‌ورا خنک‌کننده و ضدالتهاب است و می‌تواند به عنوان ماسک صورت استفاده شود.

برای مو، آلوئه‌ورا به تقویت فولیکول‌های مو، کاهش ریزش مو و درمان شوره سر کمک می‌کند. ماسک موی آلوئه‌ورا با ترکیب روغن زیتون و عسل یک درمان طبیعی عالی برای موهای خشک و آسیب‌دیده است.

مصرف خوراکی ژل آلوئه‌ورا نیز به بهبود گوارش، تقویت سیستم ایمنی و کاهش قند خون کمک می‌کند.`
  },
  {
    id: 6,
    number: "۰۶",
    title: "درمان بی‌خوابی با گیاهان دارویی",
    category: "سلامت خواب",
    summary: "روش‌های طبیعی و گیاهی برای بهبود کیفیت خواب و درمان بی‌خوابی مزمن.",
    readTime: "۸ دقیقه",
    content: `بی‌خوابی یکی از شایع‌ترین مشکلات بهداشتی در جهان است که میلیون‌ها نفر را تحت تأثیر قرار می‌دهد. کمبود خواب می‌تواند منجر به خستگی مزمن، کاهش تمرکز، تضعیف سیستم ایمنی و افزایش خطر ابتلا به بیماری‌های مزمن شود.

گیاه بابونه یکی از شناخته‌شده‌ترین گیاهان برای درمان بی‌خوابی است. دمنوش بابونه قبل از خواب به آرامش اعصاب و بهبود کیفیت خواب کمک می‌کند. والرین (گیاه سنبل الطیب) نیز اثرات آرام‌بخشی قوی دارد و مصرف منظم آن می‌تواند بی‌خوابی مزمن را بهبود بخشد.

اسطوخودوس (لاوندر) با عطر آرام‌بخش خود به بهبود خواب کمک می‌کند. قرار دادن کیسه اسطوخودوس در کنار بالشت یا استفاده از روغن اسطوخودوس در رایحه‌درمانی تکنیک‌های مؤثری هستند.

نکته مهم: اگر بی‌خوابی شما بیش از چهار هفته ادامه دارد، حتماً با پزشک متخصص مشورت کنید.`
  },
  {
    id: 7,
    number: "۰۷",
    title: "خواص چای سبز برای سلامت قلب",
    category: "نوشیدنی‌ها",
    summary: "بررسی تأثیرات مثبت چای سبز بر سلامت قلب و عروق و پیشگیری از بیماری‌های قلبی.",
    readTime: "۶ دقیقه",
    content: `چای سبز یکی از سالم‌ترین نوشیدنی‌های جهان است که قرن‌هاست در کشورهای آسیایی مصرف می‌شود. این چای سرشار از کاتچین‌ها و آنتی‌اکسیدان‌هایی است که خواص درمانی فراوانی دارند.

تحقیقات گسترده نشان داده است که مصرف منظم چای سبز می‌تواند کلسترول بد خون (LDL) را کاهش داده و کلسترول خوب (HDL) را افزایش دهد. همچنین، کاتچین‌های موجود در چای سبز به کاهش فشار خون و بهبود عملکرد رگ‌های خونی کمک می‌کنند.

EGCG (اپی‌گالوکاتچین گالات) مهم‌ترین آنتی‌اکسیدان موجود در چای سبز است که خواض ضدالتهابی و ضدسرطانی قوی دارد. مطالعات نشان داده است که EGCG می‌تواند رشد سلول‌های سرطانی را مهار کند.

برای بهره‌مندی حداکثری از خواص چای سبز، بهتر است آن را با آب ۸۰ درجه سانتیگراد دم کنید و بدون شکر مصرف کنید.`
  },
  {
    id: 8,
    number: "۰۸",
    title: "گیاه مریم‌گلی و تقویت حافظه",
    category: "گیاهان دارویی",
    summary: "خواص شگفت‌انگیز مریم‌گلی برای تقویت حافظه، بهبود عملکرد مغز و پیشگیری از آلزایمر.",
    readTime: "۷ دقیقه",
    content: `مریم‌گلی (Salvia officinalis) یکی از قدیمی‌ترین گیاهان دارویی جهان است که از دوران باستان برای تقویت حافظه استفاده می‌شده است. نام لاتین این گیاه از کلمه «سالویا» به معنای «نجات‌دهنده» گرفته شده است.

تحقیقات مدرن نشان داده است که ترکیبات موجود در مریم‌گلی می‌تواند عملکرد استیل‌کولین (ماده شیمیایی مسئول حافظه و یادگیری) را بهبود بخشد. مطالعات بالینی نشان داده است که مصرف عصاره مریم‌گلی می‌تواند حافظه کوتاه‌مدت و بلندمدت را بهبود بخشد.

برای پیشگیری از بیماری آلزایمر نیز مریم‌گلی اثرات مثبتی دارد. آنتی‌اکسیدان‌های موجود در این گیاه از سلول‌های مغز در برابر آسیب‌های اکسیداتیو محافظت می‌کنند.

دمنوش مریم‌گلی یکی از ساده‌ترین روش‌های مصرف این گیاه است. همچنین، روغن مریم‌گلی در رایحه‌درمانی برای بهبود تمرکز و هوشیاری ذهنی استفاده می‌شود.`
  },
  {
    id: 9,
    number: "۰۹",
    title: "پیشگیری از سرماخوردگی با گیاهان دارویی",
    category: "سلامت عمومی",
    summary: "روش‌های طبیعی و مؤثر برای تقویت سیستم ایمنی و پیشگیری از سرماخوردگی.",
    readTime: "۸ دقیقه",
    content: `سرماخوردگی شایع‌ترین بیماری عفونی در جهان است که سالانه میلیاردها نفر را مبتلا می‌کند. در حالی که هیچ درمان قطعی برای سرماخوردگی وجود ندارد، گیاهان دارویی می‌توانند به تقویت سیستم ایمنی و کاهش شدت علائم کمک کنند.

اکیناسه (سرخ‌گوش) یکی از محبوب‌ترین گیاهان برای پیشگیری از سرماخوردگی است. تحقیقات نشان داده است که مصرف منظم اکیناسه می‌تواند خطر ابتلا به سرماخوردگی را تا ۵۰ درصد کاهش دهد.

سیر یکی دیگر از گیاهان با خواص ضدباکتریایی و ضدویروسی قوی است. آلیسین موجود در سیر به مهار رشد باکتری‌ها و ویروس‌ها کمک می‌کند. مصرف روزانه ۲ تا ۳ حبه سیر تازه می‌تواند سیستم ایمنی بدن را تقویت کند.

عسل طبیعی نیز خواص ضدباکتریایی و التیام‌بخشی دارد. ترکیب عسل با دارچین و لیمو یک معجون طبیعی عالی برای پیشگیری و درمان سرماخوردگی است.`
  },
  {
    id: 10,
    number: "۱۰",
    title: "خواص روغن آرگان برای پوست و مو",
    category: "مراقبت از زیبایی",
    summary: "بررسی خواص بی‌نظیر روغن آرگان برای جوان‌سازی پوست، تقویت مو و درمان مشکلات پوستی.",
    readTime: "۶ دقیقه",
    content: `روغن آرگان که به «طلای مراکش» معروف است، یکی از باارزش‌ترین روغن‌های طبیعی جهان است. این روغن از میوه درخت آرگان که بومی مراکش است استخراج می‌شود و سرشار از ویتامین E، اسیدهای چرب ضروری و آنتی‌اکسیدان‌ها است.

برای پوست، روغن آرگان یک مرطوب‌کننده عمیق و غیرچرب است که به بهبود خاصیت ارتجاعی پوست، کاهش چین و چروک و درمان اگزما و پسوریازیس کمک می‌کند. روغن آرگان همچنین اثرات ضدپیری قوی دارد و می‌تواند به عنوان سرم ضدپیری استفاده شود.

برای مو، روغن آرگان به تقویت، نرمی و درخشندگی موها کمک می‌کند. ماسک موی روغن آرگان با ترکیب عسل و تخم‌مرغ یک درمان طبیعی عالی برای موهای خشک و آسیب‌دیده است.

روغن آرگان خالص باید بدون بو و رنگ روشن باشد. برای حفظ کیفیت، آن را در جای خنک و تاریک نگهداری کنید.`
  },
  {
    id: 11,
    number: "۱۱",
    title: "درمان درد مفاصل با گیاهان دارویی",
    category: "سلامت استخوان",
    summary: "روش‌های طبیعی و گیاهی برای کاهش درد مفاصل و بهبود حرکت بدن.",
    readTime: "۹ دقیقه",
    content: `درد مفاصل یکی از شایع‌ترین مشکلات بهداشتی است که افراد در سنین مختلف با آن مواجه می‌شوند. آرتریت، آرتروز و التهاب مفاصل می‌توانند کیفیت زندگی را به شدت کاهش دهند.

زردچوبه با ماده موثر کورکومین خواص ضدالتهابی قوی دارد که می‌تواند درد مفاصل را به طور قابل توجهی کاهش دهد. مطالعات نشان داده است که مصرف روزانه ۵۰۰ تا ۱۰۰۰ میلی‌گرم کورکومین می‌تواند درد آرتریت روماتوئید را کاهش دهد.

گیاه بابونه نیز خواص ضدالتهابی و ضددرد دارد. کمپرس گرم بابونه روی مفاصل دردناک می‌تواند به کاهش درد و التهاب کمک کند. دمنوش بابونه نیز اثرات ضدالتهابی داخلی دارد.

روغن اکالیپتوس و روغن نعناع نیز برای مالش روی مفاصل دردناک مؤثر هستند. این روغن‌ها با ایجاد حس خنکی و گرمایش موضعی به کاهش درد کمک می‌کنند.`
  },
  {
    id: 12,
    number: "۱۲",
    title: "خواص دارچین و تأثیر آن بر قند خون",
    category: "ادویه‌جات",
    summary: "بررسی فواید دارچین برای تنظیم قند خون و پیشگیری از دیابت نوع ۲.",
    readTime: "۷ دقیقه",
    content: `دارچین یکی از محبوب‌ترین ادویه‌های جهان است که علاوه بر طعم و عطر دلپذیر، خواص درمانی فراوانی نیز دارد. دارچین به دو نوع دارچین سیلانی (oyal) و دارچین کاسیا تقسیم می‌شود.

تحقیقات گسترده نشان داده است که دارچین می‌تواند حساسیت بدن به انسولین را افزایش دهد و به تنظیم قند خون کمک کند. مصرف روزانه ۱ تا ۶ گرم دارچین می‌تواند سطح قند خون ناشتا را تا ۲۹ درصد کاهش دهد.

دارچین همچنین خواص ضدباکتریایی و ضدویروسی دارد و به تقویت سیستم ایمنی بدن کمک می‌کند. دارچین سیلانی به دلیل داشتن مقدار کم کومارین، برای مصرف روزانه مناسب‌تر است.

ترکیب دارچین با عسل و آب گرم یک نوشیدنی سالم و خوشمزه است که به تنظیم قند خون و تقویت بدن کمک می‌کند.`
  },
  {
    id: 13,
    number: "۱۳",
    title: "گیاه بابونه و خواص ضدالتهابی آن",
    category: "گیاهان دارویی",
    summary: "آشنایی با خواص بی‌نظیر بابونه برای درمان التهاب، مشکلات گوارشی و آرامش اعصاب.",
    readTime: "۸ دقیقه",
    content: `بابونه (Matricaria chamomilla) یکی از محبوب‌ترین و پرکاربردترین گیاهان دارویی جهان است. این گیاه با گل‌های زرد کوچک خود شناخته می‌شود و خواص درمانی فوق‌العاده‌ای دارد.

بابونه خواص ضدالتهابی، ضداسپاسم و آرام‌بخشی قوی دارد. دمنوش بابونه برای درمان مشکلات گوارشی مانند نفخ، دل‌پیچه و سندرم روده تحریک‌پذیر بسیار مؤثر است. بابونه به آرامش عضلات صاف دستگاه گوارش کمک می‌کند.

برای پوست نیز بابونه مفید است. عصاره بابونه به کاهش التهاب پوستی، بهبود زخم‌ها و درمان اگزما کمک می‌کند. کمپرس بابونه روی پوست‌های ملتهب و قرمز بسیار مؤثر است.

برای آرامش اعصاب و بهبود خواب، دمنوش بابونه قبل از خواب یکی از بهترین انتخاب‌ها است. بابونه با افزایش سطح سروتونین و ملاتونین به بهبود کیفیت خواب کمک می‌کند.`
  },
  {
    id: 14,
    number: "۱۴",
    title: "روغن‌های ضروری و رایحه‌درمانی",
    category: "آروماتراپی",
    summary: "راهنمای جامع استفاده از روغن‌های ضروری برای بهبود سلامت جسمی و روحی.",
    readTime: "۱۰ دقیقه",
    content: `رایحه‌درمانی (آروماتراپی) یک روش درمانی طبیعی است که از روغن‌های ضروری گیاهان برای بهبود سلامت جسمی و روحی استفاده می‌کند. این روش قرن‌هاست که در فرهنگ‌های مختلف جهان مورد استفاده قرار می‌گیرد.

روغن اسطوخودوس (لاوندر) محبوب‌ترین روغن ضروری است که خواص آرام‌بخش، ضدبی‌خوابی و ضداسترس دارد. استنشاق روغن اسطوخودوس می‌تواند اضطراب را کاهش دهد و به آرامش ذهن کمک کند.

روغن درخت چای خواص ضدباکتریایی و ضدویروسی قوی دارد و برای درمان مشکلات پوستی مانند آکنه و قارچ پا استفاده می‌شود. روغن نعناع نیز خواص ضددرد و تقویت‌کنندگی حافظه دارد.

برای استفاده از روغن‌های ضروری، آن‌ها را با یک روغن حامل مانند روغن نارگیل یا بادام رقیق کنید. هرگز روغن ضروری را مستقیماً روی پوست استفاده نکنید.`
  },
  {
    id: 15,
    number: "۱۵",
    title: "گیاه جینسینگ و افزایش انرژی",
    category: "گیاهان دارویی",
    summary: "خواص شگفت‌انگیز جینسینگ برای افزایش انرژی، تقویت حافظه و پیشگیری از پیری زودرس.",
    readTime: "۸ دقیقه",
    content: `جینسینگ یکی از ارزشمندترین گیاهان دارویی جهان است که به «ریشه زندگی» معروف است. این گیاه بومی شرق آسیا است و قرن‌هاست در طب سنتی چینی برای تقویت بدن استفاده می‌شود.

جینسینگ خواص تقویت‌کننده عمومی، افزایش‌دهنده انرژی و ضدپیری دارد. تحقیقات نشان داده است که جینسینگ می‌تواند خستگی مزمن را کاهش دهد و عملکرد جسمی و ذهنی را بهبود بخشد.

جینسینگ همچنین خواص آنتی‌اکسیدانی قوی دارد و از سلول‌ها در برابر آسیب‌های رادیکال‌های آزاد محافظت می‌کند. مطالعات نشان داده است که جینسینگ می‌تواند عملکرد مغز، حافظه و تمرکز را بهبود بخشد.

برای مصرف جینسینگ، دمنوش جینسینگ یا عصاره جینسینگ در داروخانه‌ها موجود است. مصرف روزانه ۱ تا ۳ گرم جینسینگ خشک توصیه می‌شود.`
  },
  {
    id: 16,
    number: "۱۶",
    title: "پاکسازی بدن با دمنوش‌های گیاهی",
    category: "سم‌زدایی",
    summary: "روش‌های طبیعی و مؤثر برای پاکسازی کبد، کلیه و دستگاه گوارش با دمنوش‌های گیاهی.",
    readTime: "۹ دقیقه",
    content: `پاکسازی بدن از سموم یکی از مهم‌ترین اقدامات برای حفظ سلامت عمومی است. کبد و کلیه‌ها اندام‌های اصلی سم‌زدایی بدن هستند که نیاز به مراقبت ویژه دارند.

دمنوش گزنه یکی از بهترین دمنوش‌ها برای پاکسازی کلیه و مجاری ادراری است. گزنه خواص ادرارآوری دارد و به دفع سموم از بدن کمک می‌کند. همچنین، گزنه سرشار از آهن و ویتامین‌ها است.

دمنوش کاسنی برای پاکسازی کبد بسیار مفید است. کاسنی به تولید صفرا کمک می‌کند و عملکرد کبد را بهبود می‌بخشد. دمنوش شیرین‌بیان نیز خواص ضدالتهابی و پاکسازی‌کنندگی دارد.

برای پاکسازی دستگاه گوارش، دمنوش زنجبیل با لیمو و عسل یک انتخاب عالی است. این ترکیب به هضم غذا، کاهش نفخ و بهبود عملکرد روده کمک می‌کند.`
  },
  {
    id: 17,
    number: "۱۷",
    title: "خواص عسل طبیعی و عسل‌درمانی",
    category: "محصولات زنبوری",
    summary: "بررسی خواص درمانی عسل طبیعی، انواع عسل و روش‌های صحیح مصرف آن.",
    readTime: "۷ دقیقه",
    content: `عسل طبیعی یکی از قدیمی‌ترین مواد غذایی و دارویی بشر است که از هزاران سال پیش مورد استفاده قرار می‌گرفته است. عسل سرشار از آنتی‌اکسیدان‌ها، آنزیم‌ها و مواد مغذی است.

خواص ضدباکتریایی عسل به دلیل وجود هیدروژن پراکسید و pH اسیدی آن است. عسل مانوکا از نیوزیلند خواص ضدباکتریایی فوق‌العاده‌ای دارد و برای درمان زخم‌ها و عفونت‌ها استفاده می‌شود.

برای سلامت گوارش، عسل طبیعی به عنوان پروبیوتیک طبیعی عمل می‌کند و باکتری‌های مفید روده را تقویت می‌کند. ترکیب عسل با دارچین می‌تواند مشکلات گوارشی را بهبود بخشد.

نکته مهم: عسل خام و غیرپاستوریزه خواص بیشتری دارد. همچنین، هرگز عسل را در آب جوش حل نکنید زیرا آنزیم‌های مفید آن از بین می‌روند.`
  },
  {
    id: 18,
    number: "۱۸",
    title: "گیاه گزنه و فواید شگفت‌انگیز آن",
    category: "گیاهان دارویی",
    summary: "آشنایی با خواص درمانی گزنه برای تقویت مو، بهبود گوارش و پیشگیری از کم‌خونی.",
    readTime: "۸ دقیقه",
    content: `گزنه (Urtica dioica) یکی از مغذی‌ترین گیاهان دارویی جهان است که به دلیل خواص درمانی فراوان به «ملکه گیاهان» معروف است. اگرچه برگ‌های گزنه می‌توانند باعث خارش شوند، اما پس از پختن یا خشک کردن، این خاصیت از بین می‌رود.

گزنه سرشار از آهن، کلسیم، منیزیم، پتاسیم و ویتامین‌های A، C و K است. مصرف منظم گزنه می‌تواند کم‌خونی ناشی از فقر آهن را بهبود بخشد و انرژی بدن را افزایش دهد.

برای تقویت مو، گزنه یکی از بهترین گیاهان است. دمنوش گزنه به تقویت فولیکول‌های مو، کاهش ریزش مو و بهبود رشد مو کمک می‌کند. ماسک موی گزنه با ترکیب روغن زیتون نیز بسیار مؤثر است.

برای گوارش، دمنوش گزنه به بهبود عملکرد معده و روده کمک می‌کند و نفخ و یبوست را کاهش می‌دهد.`
  },
];

/* =========================================================
   NAVIGATION
========================================================= */

function navigateTo(path) {
  history.pushState(null, "", path);
  window.dispatchEvent(new Event("popstate"));
}

function goToProducts() {
  navigateTo("/products");
}

function goHome(section = "") {
  navigateTo(section ? `/${section}` : "/");
}

function goAdmin() {
  navigateTo("/admin");
}

function goToProduct(id) {
  navigateTo(`/product/${id}`);
}

/* =========================================================
   PLANT ART
========================================================= */

function PlantArt({ type = "hero" }) {
  return (
    <div
      className={`plant-art plant-art--${type}`}
      aria-hidden="true"
    >
      <span className="plant-orb" />
      <span className="plant-stem" />
      <span className="leaf leaf-a" />
      <span className="leaf leaf-b" />
      <span className="leaf leaf-c" />
      <span className="leaf leaf-d" />
    </div>
  );
}

function LogoFallback() {
  return (
    <div className="logo-fallback-wrap" aria-hidden="true">
      <img src="/logoattari.svg" className="logo-fallback-img" alt="" />
    </div>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({ product }) {
  const cardAttributes = Array.isArray(product.attributes)
    ? product.attributes.slice(0, 3)
    : [];

  return (
    <article
      className="product-card"
      onClick={() => goToProduct(product.id)}
      style={{ cursor: "pointer" }}
    >
      <div
        className={`product-image product-image--${
          product.art || "hero"
        }`}
      >
        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}

        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-photo"
          />
        ) : (
          <LogoFallback />
        )}
      </div>

      <div className="product-info">
        <span>{product.type}</span>

        <h3>{product.name}</h3>

        {cardAttributes.length > 0 && (
          <div className="product-card-attrs">
            {cardAttributes.map((attr, i) => (
              <span className="product-card-attr" key={i}>
                <strong>{attr.key}</strong>: {attr.value}
              </span>
            ))}
          </div>
        )}

        <div className="product-bottom">
          <button
            className="product-link"
            aria-label={`مشاهده ${product.name}`}
            onClick={(event) => {
              event.stopPropagation();
              goToProduct(product.id);
            }}
          >
            <ArrowLeft size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   LAZY SECTION
========================================================= */

function LazySection({ children, className, style, eager }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(!!eager);

  useEffect(() => {
    if (eager) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [eager]);

  return (
    <div
      ref={ref}
      className={`lazy-section${className ? ` ${className}` : ""}`}
      style={style}
    >
      {isVisible ? children : <div className="lazy-placeholder" />}
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

function Header({
  menuOpen,
  setMenuOpen,
  productsPage,
}) {
  return (
    <header className="header">
      <div className="container header-inner">
        <button
          className="brand brand-button"
          onClick={() => {
            goHome();
            setMenuOpen(false);
          }}
        >
          <span className="brand-mark">
            <img src="/logoattari.svg" className="brand-logo" alt="" />
          </span>

          <span>
            <strong>سلامتکده عبدالرسول</strong>
            <small>عطاری و محصولات طبیعی</small>
          </span>
        </button>

        <nav
          className={`nav ${
            menuOpen ? "nav--open" : ""
          }`}
        >
          <button
            className={!productsPage ? "active" : ""}
            onClick={() => {
              goHome();
              setMenuOpen(false);
            }}
          >
            خانه
          </button>

          <button
            onClick={() => {
              goHome("categories");
              setMenuOpen(false);
            }}
          >
            دسته‌بندی‌ها
          </button>

          <button
            className={productsPage ? "active" : ""}
            onClick={() => {
              goToProducts();
              setMenuOpen(false);
            }}
          >
            محصولات
          </button>

          <button
            onClick={() => {
              goHome("about");
              setMenuOpen(false);
            }}
          >
            درباره ما
          </button>

          <button
            onClick={() => {
              goHome("journal");
              setMenuOpen(false);
            }}
          >
            مجله
          </button>
        </nav>

        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="جستجو"
          >
            <Search size={20} />
          </button>

          <button
            className="header-cta"
            onClick={goToProducts}
          >
            مشاهده محصولات
            <ArrowLeft size={17} />
          </button>

          <button
            className="mobile-menu"
            aria-label="منو"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   HOME SECTIONS
========================================================= */

const DEFAULT_HOME_SECTIONS = [
  {
    id: "hero",
    type: "hero",
    enabled: true,
    kicker: "انتخابی از دل طبیعت",
    title: "طبیعت را به\nخانه‌تان بیاورید.",
    text:
      "سلامتکده عبدالرسول با حدود ۸ سال تجربه در زمینه گیاهان دارویی، محصولات طبیعی و ساخت محصولاتی مانند معجون عبدالرسول، همراه شماست.",
    image: "",
    buttonText: "مشاهده محصولات",
    buttonLink: "/products",
  },

  {
    id: "categories",
    type: "categories",
    enabled: true,
    kicker: "دسته‌بندی محصولات",
    title: "هر آنچه از طبیعت می‌خواهید",
    text: "",
    buttonText: "همه محصولات",
    buttonLink: "/products",
  },

  {
    id: "products",
    type: "products",
    enabled: true,
    kicker: "منتخب سلامتکده",
    title: "محصولات محبوب",
    text: "",
    buttonText: "مشاهده همه",
    buttonLink: "/products",
    limit: 4,
    productIds: [],
  },

  {
    id: "about",
    type: "about",
    enabled: true,
    kicker: "درباره سلامتکده",
    title: "تجربه‌ای از دل طبیعت، با نگاه به سلامت.",
    text:
      "سلامتکده عبدالرسول به مدیریت عبدالرسول میثاق‌پور، حدود ۸ سال است در زمینه درمان با گیاهان دارویی و معرفی محصولات طبیعی فعالیت می‌کند. از محصولات شناخته‌شده این مجموعه می‌توان به معجون عبدالرسول اشاره کرد.",
    items: [
      {
        title: "تجربه در گیاهان دارویی",
        text: "حدود ۸ سال فعالیت و تجربه در این حوزه.",
      },
      {
        title: "محصولات اختصاصی",
        text: "تجربه ساخت محصولاتی مانند معجون عبدالرسول.",
      },
      {
        title: "آدرس سلامتکده",
        text:
          "طاهرآباد، روبروی شاهزاده طاهر، عطاری عبدالرسول.",
      },
    ],
  },

  {
    id: "featured",
    type: "featured",
    enabled: true,
    kicker: "محصول ویژه و اختصاصی سلامتکده",
    title: "معجون عبدالرسول",
    text:
      "محصولی اختصاصی از سلامتکده عبدالرسول، با ترکیبی از مواد طبیعی و گیاهی که با دقت برای مصرف سنتی و روزمره آماده شده است.",
    image:
      "/images/Gemini_Generated_Image_yszjvvyszjvvyszj.png",
    buttonText: "مشاهده محصولات",
    buttonLink: "/products",
    items: [
      {
        title: "ترکیبات گیاهی",
        text: "بر پایه مواد اولیه طبیعی و گیاهی",
      },
      {
        title: "تهیه اختصاصی",
        text: "محصول ویژه و اختصاصی سلامتکده",
      },
      {
        title: "مصرف سنتی",
        text:
          "مناسب برای علاقه‌مندان به فرآورده‌های گیاهی",
      },
      {
        title: "کیفیت و دقت",
        text:
          "تهیه و عرضه با توجه به کیفیت مواد اولیه",
      },
    ],
  },

  {
    id: "benefits",
    type: "benefits",
    enabled: true,
    title: "",
    items: [
      {
        title: "گیاهان دارویی",
        text: "انتخاب با دقت و تجربه",
        icon: "🌿",
      },
      {
        title: "تجربه ۸ ساله",
        text: "فعالیت در زمینه گیاهان دارویی",
        icon: "✦",
      },
      {
        title: "محصولات اختصاصی",
        text: "مانند معجون عبدالرسول",
        icon: "♧",
      },
      {
        title: "مشتری‌مداری",
        text: "همراه شما برای انتخاب بهتر",
        icon: "♡",
      },
    ],
  },

  {
    id: "journal",
    type: "journal",
    enabled: true,
    kicker: "مجله سلامت",
    title: "چیزهایی که خوب است بدانید",
    text: "",
    buttonText: "مطالب بیشتر",
    buttonLink: "/journal",
    articleIds: [],
    limit: 3,
    items: [],
  },

  {
    id: "final-cta",
    type: "cta",
    enabled: true,
    kicker: "یک انتخاب سبز",
    title: "کمی نزدیک‌تر به طبیعت.",
    text:
      "محصولات سلامتکده عبدالرسول را ببینید و انتخاب خودتان را پیدا کنید.",
    buttonText: "شروع انتخاب",
    buttonLink: "/products",
  },
];

/* =========================================================
   HOME STORAGE
========================================================= */

function loadHomeSections() {
  try {
    const raw = localStorage.getItem(
      "attari_home_sections"
    );

    if (raw) {
      const parsed = JSON.parse(raw);

      if (
        Array.isArray(parsed) &&
        parsed.length
      ) {
        return parsed;
      }
    }
  } catch (error) {
    console.error(
      "Unable to load homepage sections:",
      error
    );
  }

  return JSON.parse(
    JSON.stringify(DEFAULT_HOME_SECTIONS)
  );
}

function saveHomeSections(sections) {
  try {
    localStorage.setItem(
      "attari_home_sections",
      JSON.stringify(sections)
    );
  } catch (error) {
    console.error(
      "Unable to save homepage sections:",
      error
    );
  }
}

function homeLink(link) {
  if (!link) {
    return;
  }

  if (link === "/products") {
    goToProducts();
    return;
  }

  if (
    ["/about", "/categories", "/journal"].includes(
      link
    )
  ) {
    goHome(link.slice(1));
    return;
  }

  navigateTo(link.startsWith("/") ? link : `/${link}`);
}

/* =========================================================
   HOME PAGE
========================================================= */

function HomePage({ products }) {
  const [heroQuery, setHeroQuery] = useState("");
  const [sections, setSections] = useState(
    loadHomeSections
  );

  useEffect(() => {
    const sync = () => {
      setSections(loadHomeSections());
    };

    window.addEventListener(
      "attari-home-update",
      sync
    );

    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(
        "attari-home-update",
        sync
      );

      window.removeEventListener(
        "storage",
        sync
      );
    };
  }, []);

  const heroResults = searchProducts(
    products,
    heroQuery
  );

  const runHeroSearch = (event) => {
    event?.preventDefault();

    if (!heroQuery.trim()) {
      goToProducts();
      return;
    }

    sessionStorage.setItem(
      "attari_product_search",
      heroQuery.trim()
    );

    navigateTo("/products");
  };

  const render = (section) => {
    if (!section.enabled) {
      return null;
    }

    /* ================= HERO ================= */

    if (section.type === "hero") {
      return (
        <section
          className="hero"
          id={section.id}
          key={section.id}
        >
          <div className="hero-pattern" />

          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <Sparkles size={15} />
                {section.kicker}
              </div>

              <h1>
                {(section.title || "")
                  .split("\n")
                  .map((line, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
              </h1>

              <p>{section.text}</p>

              <form
                className="hero-search"
                onSubmit={runHeroSearch}
              >
                <Search size={20} />

                <input
                  value={heroQuery}
                  onChange={(event) =>
                    setHeroQuery(event.target.value)
                  }
                  placeholder="جستجو بین محصولات..."
                />

                <button type="submit">
                  جستجو
                </button>
              </form>

              {heroQuery.trim() && (
                <div className="hero-search-results">
                  <span>
                    {heroResults.length} محصول پیدا شد
                  </span>

                  {heroResults
                    .slice(0, 3)
                    .map((product) => (
                      <button
                        type="button"
                        key={product.id}
                        onClick={() => {
                          sessionStorage.setItem(
                            "attari_product_search",
                            heroQuery.trim()
                          );

                          navigateTo("/products");
                        }}
                      >
                        {product.name}
                      </button>
                    ))}
                </div>
              )}

              <div className="hero-actions">
                <button
                  className="primary-button"
                  type="button"
                  onClick={() =>
                    homeLink(section.buttonLink)
                  }
                >
                  {section.buttonText}
                  <ArrowLeft size={18} />
                </button>

                <button
                  className="text-button"
                  type="button"
                  onClick={() => goHome("about")}
                >
                  درباره ما
                  <ChevronLeft size={17} />
                </button>
              </div>

              <div className="hero-trust">
                <div className="trust-avatars">
                  <span>ع</span>
                  <span>م</span>
                  <span>۸</span>
                </div>

                <div>
                  <strong>تجربه و اعتماد</strong>
                  <small>
                    حدود ۸ سال فعالیت در زمینه
                    گیاهان دارویی
                  </small>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              {section.image ? (
                <img
                  className="hero-managed-image"
                  src={section.image}
                  alt=""
                />
              ) : (
                <>
                  <div className="hero-glow" />
                  <div className="hero-card hero-card--back" />

                  <div className="hero-bowl">
                    <PlantArt type="hero" />
                  </div>

                  <div className="floating-note note-top">
                    <span>🌿</span>

                    <div>
                      <strong>گیاهان دارویی</strong>
                      <small>
                        انتخاب‌شده با دقت
                      </small>
                    </div>
                  </div>

                  <div className="floating-note note-bottom">
                    <strong>۸ سال</strong>
                    <span>تجربه و فعالیت</span>
                  </div>

                  <div className="hero-arch" />
                </>
              )}
            </div>
          </div>
        </section>
      );
    }

    /* ================= CATEGORIES ================= */

    if (section.type === "categories") {
      return (
        <section
          className="category-section section"
          id="categories"
          key={section.id}
        >
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-kicker">
                  {section.kicker}
                </span>

                <h2>{section.title}</h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  homeLink(section.buttonLink)
                }
                className="outline-button"
              >
                {section.buttonText}
                <ArrowLeft size={17} />
              </button>
            </div>

            <div className="category-grid">
              {categories.map((item) => (
                <button
                  className="category-card"
                  onClick={() => {
                    sessionStorage.setItem(
                      "attari_product_category",
                      item.title
                    );
                    goToProducts();
                  }}
                  key={item.title}
                  type="button"
                >
                  <span className="category-icon">
                    {item.icon}
                  </span>

                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.subtitle}</small>
                  </span>

                  <ChevronLeft size={18} />
                </button>
              ))}
            </div>
          </div>
        </section>
      );
    }

    /* ================= PRODUCTS ================= */

    if (section.type === "products") {
      return (
        <section
          className="products-section section"
          id="products"
          key={section.id}
        >
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-kicker">
                  {section.kicker}
                </span>

                <h2>{section.title}</h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  homeLink(section.buttonLink)
                }
                className="text-button"
              >
                {section.buttonText}
                <ArrowLeft size={17} />
              </button>
            </div>

            <div className={`product-grid${(!section.productIds || section.productIds.length === 0) ? "" : " product-grid--selected"}`}>
              {(section.productIds && section.productIds.length > 0
                ? section.productIds
                    .map((id) => products.find((p) => p.id === id))
                    .filter(Boolean)
                : products.slice(0, section.limit || 4)
              ).map((product) => (
                  <ProductCard
                    product={product}
                    key={product.id}
                  />
                ))}
            </div>
          </div>
        </section>
      );
    }

    /* ================= ABOUT ================= */

    if (section.type === "about") {
      return (
        <section
          className="about-section section"
          id="about"
          key={section.id}
        >
          <div className="container about-grid">
            <div className="about-visual">
              <div className="about-tile about-tile--large">
                {section.image ? (
                  <img
                    src={section.image}
                    alt={section.title || ""}
                    className="about-photo"
                  />
                ) : (
                  <PlantArt type="about" />
                )}
              </div>
            </div>

            <div className="about-copy">
              <span className="section-kicker">
                {section.kicker}
              </span>

              <h2>{section.title}</h2>

              <p>{section.text}</p>

              <div className="feature-list">
                {(section.items || []).map(
                  (item, index) => (
                    <div key={index}>
                      <span>
                        {String(index + 1).padStart(
                          2,
                          "۰"
                        )}
                      </span>

                      <div>
                        <strong>{item.title}</strong>
                        <small>{item.text}</small>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      );
    }

    /* ================= FEATURED ================= */

    if (section.type === "featured") {
      return (
        <section
          className="featured-product section"
          id="featured-product"
          key={section.id}
        >
          <div className="container featured-product-grid">
            <div className="featured-product-visual">
              <div className="featured-product-image">
                {section.image && (
                  <img
                    src={section.image}
                    alt=""
                  />
                )}

                <span>محصول اختصاصی</span>
              </div>
            </div>

            <div className="featured-product-copy">
              <span className="section-kicker">
                {section.kicker}
              </span>

              <h2>{section.title}</h2>

              <p>{section.text}</p>

              <div className="featured-benefits">
                {(section.items || []).map(
                  (item, index) => (
                    <article key={index}>
                      <span>
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <div>
                        <strong>{item.title}</strong>
                        <small>{item.text}</small>
                      </div>
                    </article>
                  )
                )}
              </div>

              <button
                className="primary-button"
                type="button"
                onClick={() =>
                  homeLink(section.buttonLink)
                }
              >
                {section.buttonText}
                <ArrowLeft size={18} />
              </button>
            </div>
          </div>
        </section>
      );
    }

    /* ================= BENEFITS ================= */

    if (section.type === "benefits") {
      return (
        <section
          className="benefits-section"
          key={section.id}
        >
          <div className="container benefits-grid">
            {(section.items || []).map(
              (item, index) => (
                <div key={index}>
                  <span>{item.icon}</span>

                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.text}</small>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      );
    }

    /* ================= JOURNAL ================= */

    if (section.type === "journal") {
      return (
        <section
          className="journal-section section"
          id="journal"
          key={section.id}
        >
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-kicker">
                  {section.kicker}
                </span>

                <h2>{section.title}</h2>
              </div>

              <button
                className="outline-button"
                type="button"
                onClick={() =>
                  homeLink(section.buttonLink)
                }
              >
                {section.buttonText}
                <ArrowLeft size={17} />
              </button>
            </div>

            <div className="article-grid">
              {(section.articleIds && section.articleIds.length > 0
                ? section.articleIds
                    .map((id) => articles.find((a) => a.id === id))
                    .filter(Boolean)
                : articles.slice(0, section.limit || 3)
              ).map(
                (article, index) => (
                  <article
                    className="article-card"
                    key={article.id}
                    onClick={() => {
                      navigateTo("/journal");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="article-number">
                      {article.number}
                    </span>

                    <div>
                      <h3>{article.title}</h3>
                      <p>{article.summary}</p>
                    </div>

                    <button type="button">
                      <ArrowLeft size={18} />
                    </button>
                  </article>
                )
              )}
            </div>
          </div>
        </section>
      );
    }

    /* ================= CTA ================= */

    if (section.type === "cta") {
      return (
        <section
          className="final-cta"
          key={section.id}
        >
          <div className="container final-cta-inner">
            <div>
              <span>{section.kicker}</span>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>

            <button
              type="button"
              onClick={() =>
                homeLink(section.buttonLink)
              }
              className="light-button"
            >
              {section.buttonText}
              <ArrowLeft size={18} />
            </button>
          </div>
        </section>
      );
    }

    /* ================= CUSTOM ================= */

    return (
      <section
        className="section custom-home-section"
        id={section.id}
        key={section.id}
      >
        <div className="container">
          <span className="section-kicker">
            {section.kicker}
          </span>

          <h2>{section.title}</h2>

          <p>{section.text}</p>

          {section.image && (
            <img src={section.image} alt="" />
          )}

          {section.buttonText && (
            <button
              className="primary-button"
              type="button"
              onClick={() =>
                homeLink(section.buttonLink)
              }
            >
              {section.buttonText}
              <ArrowLeft size={18} />
            </button>
          )}
        </div>
      </section>
    );
  };

  return (
    <main id="home">
      {sections.map((section, index) => (
        <LazySection key={section.id} eager={index === 0}>
          {render(section)}
        </LazySection>
      ))}
    </main>
  );
}

/* =========================================================
   PRODUCT DETAIL
========================================================= */

function ProductDetail({ products }) {
  const id = Number(
    window.location.pathname.split("/").pop()
  );

  const product = products.find(
    (item) => item.id === id
  );

  if (!product) {
    return (
      <main className="product-detail-page">
        <div className="container">
          <div className="product-detail-empty">
            <AlertCircle size={36} />

            <h2>محصول پیدا نشد</h2>

            <p>
              محصول مورد نظر وجود ندارد یا حذف شده است.
            </p>

            <button
              className="primary-button"
              type="button"
              onClick={goToProducts}
            >
              بازگشت به محصولات
              <ArrowLeft size={17} />
            </button>
          </div>
        </div>
      </main>
    );
  }

  const attributes = Array.isArray(
    product.attributes
  )
    ? product.attributes
    : [];

  return (
    <main className="product-detail-page">
      <LazySection eager>
        <section className="product-detail-hero">
          <div className="container">
            <button
              className="text-button product-detail-back"
              type="button"
              onClick={goToProducts}
            >
              <ArrowLeft size={17} />
              بازگشت به محصولات
            </button>
          </div>
        </section>
      </LazySection>

      <LazySection>
        <section className="section">
          <div className="container">
            <div className="product-detail-grid">
              <div className="product-detail-visual">
                <div
                  className={`product-detail-image product-image--${
                    product.art || "hero"
                  }`}
                >
                  {product.badge && (
                    <span className="product-badge">
                      {product.badge}
                    </span>
                  )}

                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-photo"
                    />
                  ) : (
                    <LogoFallback />
                  )}
                </div>
              </div>

              <div className="product-detail-info">
                <span className="product-detail-type">
                  {product.type}
                </span>

                <h1 className="product-detail-name">
                  {product.name}
                </h1>

                {product.description && (
                  <p className="product-detail-desc">
                    {product.description}
                  </p>
                )}

                {attributes.length > 0 && (
                  <div className="product-detail-specs">
                    <div className="product-detail-specs-head">
                      <ListChecks size={18} />
                      <h3>
                        مشخصات و ویژگی‌ها
                      </h3>
                    </div>

                    <div className="product-detail-specs-list">
                      {attributes.map(
                        (attribute, index) => (
                          <div
                            className="product-detail-spec-row"
                            key={index}
                          >
                            <span className="product-detail-spec-key">
                              {attribute.key}
                            </span>

                            <span className="product-detail-spec-val">
                              {attribute.value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="product-detail-contact">
                  <h3>
                    خرید فقط به‌صورت حضوری
                  </h3>

                  <p>
                    برای خرید محصولات به فروشگاه مراجعه کنید. شماره‌های تماس صرفاً جهت مشاوره و راهنمایی در دسترس شما هستند.
                  </p>

                  <div className="product-detail-contact-list">
                    <div className="product-detail-contact-item">
                      <Phone size={18} />
                      <div>
                        <span>تلفن سفارش</span>
                        <strong dir="ltr">0914-002-6313</strong>
                      </div>
                    </div>

                    <div className="product-detail-contact-item">
                      <Phone size={18} />
                      <div>
                        <span>تلفن سلامتکده</span>
                        <strong dir="ltr">031-555-22936</strong>
                      </div>
                    </div>

                    <div className="product-detail-contact-item">
                      <MapPin size={18} />
                      <div>
                        <span>آدرس</span>
                        <strong>طاهرآباد، روبروی شاهزاده طاهر، سلامتکده عبدالرسول</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className="primary-button product-detail-cta"
                  type="button"
                  onClick={goToProducts}
                >
                  مشاهده همه محصولات
                  <ArrowLeft size={17} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}

/* =========================================================
   PRODUCTS PAGE
========================================================= */

function ProductsPage({ products }) {
  const [query, setQuery] = useState(
    () =>
      sessionStorage.getItem(
        "attari_product_search"
      ) || ""
  );

  const [category, setCategory] =
    useState(() =>
      sessionStorage.getItem(
        "attari_product_category"
      ) || "همه دسته‌ها"
    );

  const [sort, setSort] =
    useState("default");

  useEffect(() => {
    sessionStorage.removeItem(
      "attari_product_category"
    );
    sessionStorage.removeItem(
      "attari_product_search"
    );
  }, []);

  const filtered = searchProducts(
    products,
    query
  ).filter(
    (product) =>
      category === "همه دسته‌ها" ||
      product.type === category
  );

  const visibleProducts = [...filtered].sort(
    (a, b) => {
      if (sort === "name") {
        return a.name.localeCompare(
          b.name,
          "fa"
        );
      }

      return 0;
    }
  );

  return (
    <main className="products-page">
      <LazySection eager>
        <section className="products-page-hero">
          <div className="container">
            <span className="section-kicker">
              فروشگاه سلامتکده عبدالرسول
            </span>

            <h1>
              محصولات طبیعی و گیاهان دارویی
            </h1>

            <p>
              محصولات سلامتکده را در یک صفحه جستجو و
              دسته‌بندی کنید.
            </p>
          </div>
        </section>
      </LazySection>

      <LazySection>
        <section className="products-section section products-page-grid-section">
          <div className="container">
            <div className="products-filter-bar">
              <div className="products-search">
                <Search size={20} />

                <input
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="جستجوی نام محصول، دسته‌بندی..."
                  aria-label="جستجوی محصولات"
                />
              </div>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                aria-label="فیلتر دسته‌بندی"
              >
                <option>همه دسته‌ها</option>

                {categoryNames.map((categoryName) => (
                  <option
                    key={categoryName}
                    value={categoryName}
                  >
                    {categoryName}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value)
                }
                aria-label="مرتب‌سازی"
              >
                <option value="default">
                  مرتب‌سازی پیش‌فرض
                </option>

                <option value="name">
                  نام محصول
                </option>
              </select>
            </div>

            <div className="section-head">
              <div>
                <span className="section-kicker">
                  فهرست محصولات
                </span>

                <h2>
                  {visibleProducts.length} محصول
                </h2>
              </div>

              <button
                className="outline-button"
                type="button"
                onClick={goHome}
              >
                بازگشت به خانه
                <ArrowLeft size={17} />
              </button>
            </div>

            {visibleProducts.length ? (
              <div className="product-grid products-page-grid">
                {visibleProducts.map((product) => (
                  <ProductCard
                    product={product}
                    key={product.id}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-products">
                <Search size={28} />

                <h3>محصولی پیدا نشد</h3>

                <p>
                  عبارت جستجو یا دسته‌بندی را تغییر دهید.
                </p>
              </div>
            )}
          </div>
        </section>
      </LazySection>
    </main>
  );
}

/* =========================================================
   HOMEPAGE EDITOR
========================================================= */

function HomepageEditor({ onMessage, products }) {
  const [sections, setSections] = useState(
    loadHomeSections
  );

  const [selected, setSelected] =
    useState(0);

  const [pendingImages, setPendingImages] =
    useState({});

  const current = sections[selected];

  const commit = (list) => {
    setSections(list);
    saveHomeSections(list);

    window.dispatchEvent(
      new Event("attari-home-update")
    );
  };

  const update = (key, value) => {
    const updated = sections.map(
      (section, index) =>
        index === selected
          ? {
              ...section,
              [key]: value,
            }
          : section
    );

    commit(updated);
  };

  const add = (type) => {
    const newSection = {
      id: `section-${Date.now()}`,
      type,
      enabled: true,
      kicker: "عنوان سکشن",
      title: "سکشن جدید",
      text: "توضیحات سکشن جدید",
      buttonText: "مشاهده بیشتر",
      buttonLink: "/products",
    };

    if (type === "benefits") {
      newSection.items = [];
    }

    if (type === "journal") {
      newSection.items = [];
    }

    const list = [...sections, newSection];

    commit(list);
    setSelected(list.length - 1);
  };

  const remove = () => {
    if (!current) {
      return;
    }

    if (!window.confirm("این سکشن حذف شود؟")) {
      return;
    }

    const list = sections.filter(
      (_, index) => index !== selected
    );

    setPendingImages((previous) => {
      const next = { ...previous };
      delete next[current.id];
      return next;
    });

    commit(list);

    setSelected(
      Math.max(0, selected - 1)
    );
  };

  const move = (direction) => {
    const target = selected + direction;

    if (
      target < 0 ||
      target >= sections.length
    ) {
      return;
    }

    const list = [...sections];

    [
      list[selected],
      list[target],
    ] = [
      list[target],
      list[selected],
    ];

    commit(list);
    setSelected(target);
  };

  const duplicate = () => {
    if (!current) {
      return;
    }

    const copy = JSON.parse(
      JSON.stringify(current)
    );

    copy.id = `section-${Date.now()}`;

    copy.title = `${
      copy.title || "سکشن"
    } (کپی)`;

    const list = [
      ...sections.slice(0, selected + 1),
      copy,
      ...sections.slice(selected + 1),
    ];

    commit(list);
    setSelected(selected + 1);
  };

  const exportHome = () => {
    downloadFile(
      "homepage.json",
      JSON.stringify(
        sections,
        null,
        2
      ),
      "application/json"
    );

    onMessage(
      "homepage.json دانلود شد."
    );
  };

  const uploadImage = (file) => {
    if (!file || !current) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      update("image", reader.result);
    };

    reader.readAsDataURL(file);

    setPendingImages((previous) => ({
      ...previous,
      [current.id]: file,
    }));
  };

  const saveProject = async () => {
    if (!window.showDirectoryPicker) {
      onMessage(
        "برای ذخیره مستقیم Chrome یا Edge دسکتاپ را استفاده کن."
      );
      return;
    }

    try {
      const directory =
        await window.showDirectoryPicker({
          mode: "readwrite",
        });

      const dataToSave =
        await Promise.all(
          sections.map(
            async (section) => {
              const file =
                pendingImages[section.id];

              if (!file) {
                return {
                  ...section,
                };
              }

              const dataUrl =
                await new Promise(
                  (resolve, reject) => {
                    const reader =
                      new FileReader();

                    reader.onload = () =>
                      resolve(
                        reader.result
                      );

                    reader.onerror = reject;

                    reader.readAsDataURL(
                      file
                    );
                  }
                );

              return {
                ...section,
                image: dataUrl,
              };
            }
          )
        );

      const publicDir =
        await directory.getDirectoryHandle(
          "public",
          {
            create: true,
          }
        );

      const fileHandle =
        await publicDir.getFileHandle(
          "homepage.json",
          {
            create: true,
          }
        );

      const writable =
        await fileHandle.createWritable();

      await writable.write(
        JSON.stringify(
          dataToSave,
          null,
          2
        )
      );

      await writable.close();

      setPendingImages({});

      commit(dataToSave);

      onMessage(
        "homepage.json با موفقیت داخل پروژه ذخیره شد."
      );
    } catch (error) {
      console.error(error);

      onMessage(
        `خطا در ذخیره: ${
          error?.message ||
          "ذخیره مستقیم لغو شد."
        }`
      );
    }
  };

  const updateItem = (
    index,
    key,
    value
  ) => {
    const items = [
      ...(current.items || []),
    ];

    items[index] = {
      ...items[index],
      [key]: value,
    };

    update("items", items);
  };

  const addItem = () => {
    const items = [
      ...(current.items || []),
    ];

    if (current.type === "journal") {
      items.push({
        number: String(
          items.length + 1
        ).padStart(2, "0"),
        title: "عنوان مطلب",
        text: "متن مطلب",
      });
    } else {
      items.push({
        title: "عنوان آیتم",
        text: "توضیحات آیتم",
      });
    }

    update("items", items);
  };

  const removeItem = (index) => {
    const items = (
      current.items || []
    ).filter(
      (_, itemIndex) =>
        itemIndex !== index
    );

    update("items", items);
  };

  return (
    <div className="homepage-admin">
      <div className="homepage-admin-toolbar">
        <div>
          <span className="section-kicker">
            مدیریت صفحه اصلی
          </span>

          <h2>
            سکشن‌ها و محتوای صفحه اصلی
          </h2>

          <p>
            تغییرات فوراً روی صفحه اصلی اعمال و
            در مرورگر ذخیره می‌شوند.
          </p>
        </div>

        <div className="homepage-admin-actions">
          <button
            className="outline-button"
            type="button"
            onClick={exportHome}
          >
            <Download size={16} />
            دریافت JSON
          </button>

          <button
            className="primary-button"
            type="button"
            onClick={saveProject}
          >
            <Save size={16} />
            ذخیره داخل پروژه
          </button>
        </div>
      </div>

      <div className="homepage-type-buttons">
        <button
          type="button"
          onClick={() => add("hero")}
        >
          + Hero
        </button>

        <button
          type="button"
          onClick={() =>
            add("categories")
          }
        >
          + دسته‌بندی
        </button>

        <button
          type="button"
          onClick={() =>
            add("products")
          }
        >
          + محصولات
        </button>

        <button
          type="button"
          onClick={() => add("about")}
        >
          + درباره ما
        </button>

        <button
          type="button"
          onClick={() =>
            add("featured")
          }
        >
          + محصول ویژه
        </button>

        <button
          type="button"
          onClick={() =>
            add("benefits")
          }
        >
          + مزایا
        </button>

        <button
          type="button"
          onClick={() =>
            add("journal")
          }
        >
          + مجله
        </button>

        <button
          type="button"
          onClick={() => add("cta")}
        >
          + CTA
        </button>

        <button
          type="button"
          onClick={() =>
            add("custom")
          }
        >
          + سفارشی
        </button>
      </div>

      <div className="homepage-admin-layout">
        <aside className="homepage-section-list">
          <div className="homepage-list-head">
            <strong>
              {sections.length} سکشن
            </strong>
          </div>

          {sections.map(
            (section, index) => (
              <button
                key={section.id}
                type="button"
                className={`homepage-section-row ${
                  index === selected
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelected(index)
                }
              >
                <span>☷</span>

                <span className="homepage-row-text">
                  <strong>
                    {section.title ||
                      "بدون عنوان"}
                  </strong>

                  <small>
                    {section.type}

                    {!section.enabled &&
                      " · مخفی"}
                  </small>
                </span>

                <span
                  className={`section-status ${
                    section.enabled
                      ? "on"
                      : "off"
                  }`}
                />
              </button>
            )
          )}
        </aside>

        <section className="homepage-editor-panel">
          {!current ? (
            <div className="homepage-empty">
              یک سکشن را انتخاب کن.
            </div>
          ) : (
            <>
              <div className="editor-top">
                <div>
                  <span className="section-kicker">
                    ویرایش سکشن
                  </span>

                  <h3>
                    {current.title ||
                      "بدون عنوان"}
                  </h3>
                </div>

                <div className="editor-tools">
                  <button
                    type="button"
                    onClick={() => move(-1)}
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => move(1)}
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={duplicate}
                  >
                    ⧉
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={remove}
                  >
                    حذف
                  </button>
                </div>
              </div>

              <div className="editor-grid">
                <label>
                  نوع سکشن

                  <select
                    value={current.type}
                    onChange={(event) =>
                      update(
                        "type",
                        event.target.value
                      )
                    }
                  >
                    <option value="hero">
                      Hero
                    </option>

                    <option value="categories">
                      دسته‌بندی‌ها
                    </option>

                    <option value="products">
                      محصولات
                    </option>

                    <option value="about">
                      درباره ما
                    </option>

                    <option value="featured">
                      محصول ویژه
                    </option>

                    <option value="benefits">
                      مزایا
                    </option>

                    <option value="journal">
                      مجله
                    </option>

                    <option value="cta">
                      دعوت به اقدام
                    </option>

                    <option value="custom">
                      سفارشی
                    </option>
                  </select>
                </label>

                <label className="editor-switch">
                  <input
                    type="checkbox"
                    checked={!!current.enabled}
                    onChange={(event) =>
                      update(
                        "enabled",
                        event.target.checked
                      )
                    }
                  />

                  <span>
                    نمایش سکشن
                  </span>
                </label>

                <label>
                  تیتر کوچک

                  <input
                    value={
                      current.kicker || ""
                    }
                    onChange={(event) =>
                      update(
                        "kicker",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  عنوان اصلی

                  <textarea
                    rows="2"
                    value={
                      current.title || ""
                    }
                    onChange={(event) =>
                      update(
                        "title",
                        event.target.value
                      )
                    }
                  />
                </label>

                {current.type !==
                  "categories" &&
                  current.type !==
                    "products" && (
                    <label className="full-editor-field">
                      متن و توضیحات

                      <textarea
                        rows="5"
                        value={
                          current.text || ""
                        }
                        onChange={(event) =>
                          update(
                            "text",
                            event.target.value
                          )
                        }
                      />
                    </label>
                  )}

                {current.type !==
                  "benefits" &&
                  current.type !==
                    "journal" &&
                  current.type !== "cta" && (
                    <label className="upload-box full-editor-field">
                      <span>
                        <Upload size={20} />
                        تصویر سکشن
                      </span>

                      <small>
                        تصویر انتخاب‌شده فوراً روی
                        صفحه اصلی اعمال می‌شود.
                      </small>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          uploadImage(
                            event.target
                              .files?.[0]
                          )
                        }
                      />

                      {current.image && (
                        <img
                          className="homepage-upload-preview"
                          src={current.image}
                          alt=""
                        />
                      )}
                    </label>
                  )}

                {current.type !== "about" && (
                  <>
                    <label>
                      متن دکمه

                      <input
                        value={
                          current.buttonText ||
                          ""
                        }
                        onChange={(event) =>
                          update(
                            "buttonText",
                            event.target.value
                          )
                        }
                      />
                    </label>

                    <label>
                      لینک دکمه

                      <input
                        value={
                          current.buttonLink ||
                          ""
                        }
                        onChange={(event) =>
                          update(
                            "buttonLink",
                            event.target.value
                          )
                        }
                      />
                    </label>
                  </>
                )}

                {current.type ===
                  "products" && (
                  <>
                    <label>
                      تعداد محصولات (پیش‌فرض)

                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={
                          current.limit || 4
                        }
                        onChange={(event) =>
                          update(
                            "limit",
                            parseInt(
                              event.target.value,
                              10
                            ) || 4
                          )
                        }
                      />
                    </label>

                    <label className="full-editor-field">
                      انتخاب محصولات ویژه

                      <small style={{marginBottom:8,display:"block",color:"var(--muted)",fontSize:11}}>
                        اگر هیچ محصولی انتخاب نشود، اولین {current.limit || 4} محصول نمایش داده می‌شود.
                      </small>

                      <div className="product-selector">
                        {(products || []).map((product) => {
                          const selectedIds = current.productIds || [];
                          const isChecked = selectedIds.includes(product.id);

                          return (
                            <label
                              key={product.id}
                              className={`product-selector-item${isChecked ? " active" : ""}`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  const newIds = isChecked
                                    ? selectedIds.filter((id) => id !== product.id)
                                    : [...selectedIds, product.id];
                                  update("productIds", newIds);
                                }}
                              />
                              <span className="product-selector-name">{product.name}</span>
                              <span className="product-selector-type">{product.type}</span>
                            </label>
                          );
                        })}
                      </div>
                    </label>
                  </>
                )}

                {current.type ===
                  "journal" && (
                  <>
                    <label>
                      تعداد مقالات نمایشی (پیش‌فرض)

                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={
                          current.limit || 3
                        }
                        onChange={(event) =>
                          update(
                            "limit",
                            parseInt(
                              event.target.value,
                              10
                            ) || 3
                          )
                        }
                      />
                    </label>

                    <label className="full-editor-field">
                      انتخاب مقالات ویژه

                      <small style={{marginBottom:8,display:"block",color:"var(--muted)",fontSize:11}}>
                        اگر هیچ مقاله‌ای انتخاب نشود، اولین {current.limit || 3} مقاله نمایش داده می‌شود.
                      </small>

                      <div className="product-selector">
                        {(articles || []).map((article) => {
                          const selectedIds = current.articleIds || [];
                          const isChecked = selectedIds.includes(article.id);

                          return (
                            <label
                              key={article.id}
                              className={`product-selector-item${isChecked ? " active" : ""}`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  const newIds = isChecked
                                    ? selectedIds.filter((id) => id !== article.id)
                                    : [...selectedIds, article.id];
                                  update("articleIds", newIds);
                                }}
                              />
                              <span className="product-selector-name">{article.title}</span>
                              <span className="product-selector-type">{article.category}</span>
                            </label>
                          );
                        })}
                      </div>
                    </label>
                  </>
                )}
              </div>

              {[
                "benefits",
                "journal",
                "about",
                "featured",
              ].includes(
                current.type
              ) && (
                <div className="items-editor">
                  <div className="items-head">
                    <h4>
                      {current.type ===
                      "journal"
                        ? "مطالب مجله"
                        : current.type ===
                          "about"
                        ? "آیتم‌های لیست ویژگی"
                        : current.type ===
                          "featured"
                        ? "آیتم‌های مزایا"
                        : "آیتم‌های مزایا"}
                    </h4>

                    <button
                      className="outline-button"
                      type="button"
                      onClick={addItem}
                    >
                      <Plus size={15} />
                      افزودن آیتم
                    </button>
                  </div>

                  {(current.items || []).map(
                    (item, index) => (
                      <div
                        className="editable-item"
                        key={index}
                      >
                        {current.type ===
                          "benefits" && (
                          <input
                            value={
                              item.icon || ""
                            }
                            onChange={(event) =>
                              updateItem(
                                index,
                                "icon",
                                event.target
                                  .value
                              )
                            }
                            placeholder="آیکون"
                          />
                        )}

                        {current.type ===
                          "journal" && (
                          <input
                            value={
                              item.number ||
                              ""
                            }
                            onChange={(event) =>
                              updateItem(
                                index,
                                "number",
                                event.target
                                  .value
                              )
                            }
                            placeholder="شماره"
                          />
                        )}

                        <input
                          value={
                            item.title || ""
                          }
                          onChange={(event) =>
                            updateItem(
                              index,
                              "title",
                              event.target.value
                            )
                          }
                          placeholder="عنوان"
                        />

                        <textarea
                          value={
                            item.text || ""
                          }
                          onChange={(event) =>
                            updateItem(
                              index,
                              "text",
                              event.target.value
                            )
                          }
                          placeholder="توضیحات"
                        />

                        <button
                          className="danger-icon"
                          type="button"
                          onClick={() =>
                            removeItem(index)
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   ADMIN PAGE
========================================================= */

function AdminPage({
  products,
  setProducts,
}) {
  const blankProduct = {
    id: "",
    name: "",
    type: categoryNames[0],
    badge: "",
    description: "",
    art: "hero",
    image: "",
    imageFile: null,
    attributes: [],
  };

  const [tab, setTab] =
    useState("products");

  const [form, setForm] =
    useState(blankProduct);

  const [editing, setEditing] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [projectDir, setProjectDir] =
    useState(null);

  const [pendingImages, setPendingImages] =
    useState({});

  const [adminQuery, setAdminQuery] =
    useState("");

  const [geminiKey, setGeminiKey] =
    useState(getApiKey);

  const [autoFilling, setAutoFilling] =
    useState(false);

  /* ================= FORM HELPERS ================= */

  const updateForm = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      ...blankProduct,
      attributes: [],
    });

    setPreview("");
    setEditing(null);
  };

  const onImage = (file) => {
    if (!file) {
      return;
    }

    const previewUrl =
      URL.createObjectURL(file);

    setPreview(previewUrl);

    const reader = new FileReader();
    reader.onload = (event) => {
      setForm((previous) => ({
        ...previous,
        imageFile: file,
        image: event.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  /* ================= ATTRIBUTES ================= */

  const addAttribute = () => {
    setForm((previous) => ({
      ...previous,
      attributes: [
        ...(previous.attributes || []),
        {
          key: "",
          value: "",
        },
      ],
    }));
  };

  const updateAttribute = (
    index,
    key,
    value
  ) => {
    setForm((previous) => ({
      ...previous,
      attributes: (
        previous.attributes || []
      ).map((attribute, attributeIndex) =>
        attributeIndex === index
          ? {
              ...attribute,
              [key]: value,
            }
          : attribute
      ),
    }));
  };

  const removeAttribute = (index) => {
    setForm((previous) => ({
      ...previous,
      attributes: (
        previous.attributes || []
      ).filter(
        (_, attributeIndex) =>
          attributeIndex !== index
      ),
    }));
  };

  /* ================= AI AUTO-FILL ================= */

  const handleAutoFill = async () => {
    if (!form.name.trim()) {
      setMessage("نام محصول را وارد کنید.");
      return;
    }

    if (!geminiKey.trim()) {
      setMessage("کلید Gemini API را تنظیم کنید.");
      return;
    }

    setApiKey(geminiKey.trim());
    setAutoFilling(true);
    setMessage("");

    try {
      const result = await autoFillProduct(
        form.name,
        form.type
      );

      setForm((previous) => ({
        ...previous,
        description:
          result.description ||
          previous.description,
        badge:
          result.badge || previous.badge,
        attributes:
          result.attributes.length > 0
            ? result.attributes
            : previous.attributes,
      }));

      setMessage(
        "اطلاعات محصول با موفقیت دریافت شد."
      );
    } catch (error) {
      setMessage(
        `خطا: ${
          error?.message || "دریافت اطلاعات انجام نشد"
        }`
      );
    } finally {
      setAutoFilling(false);
    }
  };

  /* ================= SAVE PRODUCT ================= */

  const saveProduct = () => {
    if (!form.name.trim()) {
      setMessage(
        "نام محصول الزامی است."
      );
      return;
    }

    const cleanAttributes = (
      form.attributes || []
    )
      .map((attribute) => ({
        key: String(
          attribute.key || ""
        ).trim(),

        value: String(
          attribute.value || ""
        ).trim(),
      }))
      .filter(
        (attribute) =>
          attribute.key &&
          attribute.value
      );

    const cleanProduct = {
      id:
        form.id ||
        Date.now(),

      name: form.name.trim(),

      type: form.type,

      badge:
        form.badge.trim(),

      description:
        form.description.trim(),

      art:
        form.art || "hero",

      image:
        form.image || "",

      attributes:
        cleanAttributes,
    };

    if (form.imageFile) {
      setPendingImages((previous) => ({
        ...previous,
        [cleanProduct.id]:
          form.imageFile,
      }));
    }

    if (editing) {
      setProducts((list) =>
        list.map((product) =>
          product.id === editing
            ? cleanProduct
            : product
        )
      );

      setMessage(
        "محصول با موفقیت ویرایش شد."
      );
    } else {
      setProducts((list) => [
        ...list,
        cleanProduct,
      ]);

      setMessage(
        "محصول با موفقیت اضافه شد."
      );
    }

    resetForm();
  };

  /* ================= EDIT ================= */

  const editProduct = (product) => {
    setEditing(product.id);

    setForm({
      ...blankProduct,
      ...product,
      imageFile: null,
      attributes: Array.isArray(
        product.attributes
      )
        ? product.attributes
        : [],
    });

    setPreview(product.image || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================= DELETE ================= */

  const deleteProduct = (id) => {
    if (
      !window.confirm(
        "این محصول حذف شود؟"
      )
    ) {
      return;
    }

    setProducts((list) =>
      list.filter(
        (product) =>
          product.id !== id
      )
    );

    setPendingImages((previous) => {
      const next = {
        ...previous,
      };

      delete next[id];

      return next;
    });

    if (editing === id) {
      resetForm();
    }

    setMessage(
      "محصول حذف شد."
    );
  };

  /* ================= EXPORT ================= */

  const exportJson = () => {
    downloadFile(
      "products.json",
      JSON.stringify(
        products,
        null,
        2
      ),
      "application/json"
    );

    setMessage(
      "products.json آماده شد."
    );
  };

  const exportJs = () => {
    const content = `export const products = ${JSON.stringify(
      products,
      null,
      2
    )};\n`;

    downloadFile(
      "products.js",
      content,
      "text/javascript"
    );

    setMessage(
      "products.js آماده شد."
    );
  };

  /* ================= PROJECT DIRECTORY ================= */

  const chooseProject = async () => {
    if (!window.showDirectoryPicker) {
      setMessage(
        "Chrome یا Edge دسکتاپ را استفاده کن."
      );
      return;
    }

    try {
      const directory =
        await window.showDirectoryPicker(
          {
            mode: "readwrite",
          }
        );

      setProjectDir(directory);

      setMessage(
        "پوشه پروژه انتخاب شد."
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= SAVE TO PROJECT ================= */

  const saveToProject = async () => {
    if (!projectDir) {
      setMessage(
        "اول «انتخاب پوشه پروژه» را بزن."
      );
      return;
    }

    try {
      const publicDir =
        await projectDir.getDirectoryHandle(
          "public",
          {
            create: true,
          }
        );

      const imagesDir =
        await publicDir.getDirectoryHandle(
          "images",
          {
            create: true,
          }
        );

      const productsFile =
        await publicDir.getFileHandle(
          "products.json",
          {
            create: true,
          }
        );

      const writable =
        await productsFile.createWritable();

      await writable.write(
        JSON.stringify(
          products,
          null,
          2
        )
      );

      await writable.close();

      for (const product of products) {
        const file =
          pendingImages[product.id];

        if (!file) {
          continue;
        }

        const imageHandle =
          await imagesDir.getFileHandle(
            file.name,
            {
              create: true,
            }
          );

        const imageWritable =
          await imageHandle.createWritable();

        await imageWritable.write(file);

        await imageWritable.close();
      }

      setPendingImages({});

      setMessage(
        "products.json و تصاویر با موفقیت داخل پروژه ذخیره شدند."
      );
    } catch (error) {
      console.error(
        "Save project error:",
        error
      );

      setMessage(
        `ذخیره انجام نشد: ${
          error?.message ||
          "خطای نامشخص"
        }`
      );
    }
  };

  /* ================= AUTO-SAVE TO PROJECT ================= */

  useEffect(() => {
    if (!projectDir || !products.length) return;

    const timer = setTimeout(async () => {
      try {
        const publicDir = await projectDir.getDirectoryHandle("public", { create: true });
        const fileHandle = await publicDir.getFileHandle("products.json", { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(products, null, 2));
        await writable.close();
      } catch (error) {
        console.error("Auto-save products error:", error);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [products, projectDir]);

  const filteredAdminProducts =
    searchProducts(
      products,
      adminQuery
    );

  /* ================= RENDER ================= */

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <div className="container">
          <button
            type="button"
            className="outline-button admin-back"
            onClick={goHome}
          >
            <ArrowLeft size={17} />
            بازگشت به صفحه اصلی
          </button>

          <span className="section-kicker">
            مدیریت فروشگاه
          </span>

          <h1>پنل مدیریت</h1>

          <p>
            محصولات و محتوای صفحه اصلی را از یکجا
            مدیریت کن.
          </p>
        </div>
      </section>

      <section className="section admin-section">
        <div className="container">
          {/* TABS */}

          <div className="admin-tabs">
            <button
              type="button"
              className={
                tab === "products"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setTab("products")
              }
            >
              <Package size={18} />
              مدیریت محصولات
            </button>

            <button
              type="button"
              className={
                tab === "homepage"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setTab("homepage")
              }
            >
              <Pencil size={18} />
              مدیریت صفحه اصلی
            </button>
          </div>

          {/* MESSAGE */}

          {message && (
            <div className="admin-message">
              <CheckCircle2 size={17} />
              {message}
            </div>
          )}

          {/* HOMEPAGE */}

          {tab === "homepage" ? (
            <HomepageEditor
              onMessage={setMessage}
              products={products}
            />
          ) : (
            <>
              {/* AI SETTINGS */}

              <div className="admin-ai-settings">
                <label>
                  <span>
                    <Sparkles size={16} />
                    {" "}کلید Gemini API
                  </span>

                  <input
                    type="password"
                    value={geminiKey}
                    onChange={(event) =>
                      setGeminiKey(
                        event.target.value
                      )
                    }
                    placeholder="کلید API را اینجا وارد کنید..."
                  />
                </label>
              </div>

              {/* TOOLBAR */}

              <div className="admin-toolbar">
                <div>
                  <span className="section-kicker">
                    ابزار انتشار
                  </span>

                  <h2>
                    آماده‌سازی فایل‌های سایت
                  </h2>
                </div>

                <div className="admin-toolbar-actions">
                  <button
                    className="outline-button"
                    type="button"
                    onClick={
                      chooseProject
                    }
                  >
                    <FolderOpen size={17} />
                    انتخاب پوشه پروژه
                  </button>

                  <button
                    className="outline-button"
                    type="button"
                    onClick={
                      exportJson
                    }
                  >
                    <Download size={17} />
                    دریافت JSON
                  </button>

                  <button
                    className="outline-button"
                    type="button"
                    onClick={
                      exportJs
                    }
                  >
                    <Download size={17} />
                    دریافت JS
                  </button>

                  <button
                    className="primary-button"
                    type="button"
                    onClick={
                      saveToProject
                    }
                  >
                    <Save size={17} />
                    ذخیره مستقیم در پروژه
                  </button>
                </div>
              </div>

              <div className="admin-layout">
                {/* PRODUCT FORM */}

                <form
                  className="admin-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    saveProduct();
                  }}
                >
                  <div className="admin-form-head">
                    <div>
                      <span className="section-kicker">
                        {editing
                          ? "ویرایش محصول"
                          : "محصول جدید"}
                      </span>

                      <h2>
                        {editing
                          ? "ویرایش اطلاعات"
                          : "افزودن محصول"}
                      </h2>
                    </div>

                    {editing && (
                      <button
                        type="button"
                        className="text-button"
                        onClick={
                          resetForm
                        }
                      >
                        لغو ویرایش
                      </button>
                    )}
                  </div>

                  {/* NAME */}

                  <label>
                    نام محصول

                    <input
                      value={form.name}
                      onChange={(event) =>
                        updateForm(
                          "name",
                          event.target
                            .value
                        )
                      }
                      placeholder="مثلاً گل محمدی"
                    />
                  </label>

                  {/* AI AUTO-FILL */}

                  <button
                    type="button"
                    className="outline-button ai-fill-button"
                    onClick={handleAutoFill}
                    disabled={
                      autoFilling ||
                      !form.name.trim()
                    }
                  >
                    <Sparkles size={16} />
                    {autoFilling
                      ? "در حال دریافت..."
                      : "تکمیل خودکار با AI"}
                  </button>

                  {/* CATEGORY */}

                  <label>
                    دسته‌بندی

                    <select
                      value={form.type}
                      onChange={(event) =>
                        updateForm(
                          "type",
                          event.target
                            .value
                        )
                      }
                    >
                      {categoryNames.map(
                        (categoryName) => (
                          <option
                            key={
                              categoryName
                            }
                            value={
                              categoryName
                            }
                          >
                            {categoryName}
                          </option>
                        )
                      )}
                    </select>
                  </label>

                  {/* BADGE */}

                  <label>
                    برچسب محصول{" "}
                    <small>
                      (اختیاری)
                    </small>

                    <input
                      value={form.badge}
                      onChange={(event) =>
                        updateForm(
                          "badge",
                          event.target
                            .value
                        )
                      }
                      placeholder="محبوب / ویژه"
                    />
                  </label>

                  {/* DESCRIPTION */}

                  <label>
                    توضیحات

                    <textarea
                      value={
                        form.description
                      }
                      onChange={(event) =>
                        updateForm(
                          "description",
                          event.target
                            .value
                        )
                      }
                      rows="4"
                    />
                  </label>

                  {/* IMAGE */}

                  <label className="upload-box">
                    <span>
                      <Upload size={22} />
                      تصویر محصول
                    </span>

                    <small>
                      تصویر انتخاب‌شده در
                      public/images ذخیره می‌شود.
                    </small>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        onImage(
                          event.target
                            .files?.[0]
                        )
                      }
                    />
                  </label>

                  {/* IMAGE PREVIEW */}

                  {preview && (
                    <div className="admin-preview">
                      <img
                        src={preview}
                        alt=""
                      />

                      <div>
                        <strong>
                          {form.name ||
                            "پیش‌نمایش"}
                        </strong>

                        <small>
                          {form.image}
                        </small>
                      </div>
                    </div>
                  )}

                  {/* ATTRIBUTES */}

                  <div className="admin-attributes-section">
                    <div className="admin-attributes-head">
                      <div>
                        <strong>
                          مشخصات محصول
                        </strong>

                        <small>
                          ویژگی‌هایی مثل وزن،
                          طبع، نوع بسته‌بندی و...
                        </small>
                      </div>

                      <button
                        type="button"
                        className="outline-button"
                        onClick={
                          addAttribute
                        }
                      >
                        <Plus size={16} />
                        افزودن ویژگی
                      </button>
                    </div>

                    <div className="admin-attributes-editor">
                      {(
                        form.attributes || []
                      ).length === 0 ? (
                        <div className="admin-attributes-empty">
                          هنوز ویژگی‌ای اضافه نشده است.
                        </div>
                      ) : (
                        (
                          form.attributes ||
                          []
                        ).map(
                          (
                            attribute,
                            index
                          ) => (
                            <div
                              className="editable-attr"
                              key={index}
                            >
                              <input
                                value={
                                  attribute.key ||
                                  ""
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateAttribute(
                                    index,
                                    "key",
                                    event
                                      .target
                                      .value
                                  )
                                }
                                placeholder="نام ویژگی"
                              />

                              <input
                                value={
                                  attribute.value ||
                                  ""
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateAttribute(
                                    index,
                                    "value",
                                    event
                                      .target
                                      .value
                                  )
                                }
                                placeholder="مقدار ویژگی"
                              />

                              <button
                                type="button"
                                className="danger-icon"
                                onClick={() =>
                                  removeAttribute(
                                    index
                                  )
                                }
                                aria-label="حذف ویژگی"
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>
                            </div>
                          )
                        )
                      )}
                    </div>
                  </div>

                  {/* SAVE */}

                  <button
                    className="primary-button admin-save"
                    type="submit"
                  >
                    {editing ? (
                      <>
                        <Save size={18} />
                        ذخیره تغییرات
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        افزودن محصول
                      </>
                    )}
                  </button>
                </form>

                {/* PRODUCT LIST */}

                <div className="admin-list">
                  <div className="admin-list-head">
                    <div>
                      <span className="section-kicker">
                        فهرست
                      </span>

                      <h2>
                        {
                          filteredAdminProducts.length
                        }{" "}
                        محصول
                      </h2>
                    </div>

                    <span className="admin-hint">
                      <Package size={16} />
                      public/products.json
                    </span>
                  </div>

                  {/* SEARCH */}

                  <div className="admin-search">
                    <Search size={18} />

                    <input
                      value={adminQuery}
                      onChange={(event) =>
                        setAdminQuery(
                          event.target
                            .value
                        )
                      }
                      placeholder="جستجوی محصول..."
                    />
                  </div>

                  {/* LIST */}

                  <div className="admin-product-list">
                    {filteredAdminProducts.map(
                      (product) => (
                        <article
                          className="admin-product"
                          key={product.id}
                        >
                          <div className="admin-product-thumb">
                            {product.image ? (
                              <img
                                src={
                                  product.image
                                }
                                alt={
                                  product.name
                                }
                              />
                            ) : (
                              <span className="admin-thumb-placeholder">بدون تصویر</span>
                            )}
                          </div>

                          <div className="admin-product-main">
                            <strong>
                              {product.name}
                            </strong>

                            <span>
                              {product.type}
                            </span>
                          </div>

                          <div className="admin-product-actions">
                            <button
                              type="button"
                              onClick={() =>
                                editProduct(
                                  product
                                )
                              }
                              aria-label="ویرایش محصول"
                            >
                              <Pencil
                                size={17}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteProduct(
                                  product.id
                                )
                              }
                              aria-label="حذف محصول"
                            >
                              <Trash2
                                size={17}
                              />
                            </button>
                          </div>
                        </article>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* NOTE */}

              <div className="admin-note">
                <AlertCircle size={18} />

                <div>
                  <strong>
                    ذخیره مستقیم
                  </strong>

                  <p>
                    در Chrome یا Edge دسکتاپ
                    می‌توانی پوشه پروژه را انتخاب
                    کنی و فایل‌ها را مستقیم داخل
                    public ذخیره کنی.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   ADMIN LOGIN
========================================================= */

function AdminLogin({ onSuccess }) {
  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const submit = (event) => {
    event.preventDefault();

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(
        "attari_admin_auth",
        "1"
      );

      onSuccess();
      return;
    }

    setError(
      "رمز ورود اشتباه است."
    );

    setPassword("");
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-icon">
          <Package size={30} />
        </div>

        <span className="section-kicker">
          مدیریت سلامتکده
        </span>

        <h1>
          ورود به پنل مدیریت
        </h1>

        <p>
          برای مدیریت محصولات، رمز ورود مدیر را
          وارد کنید.
        </p>

        <form onSubmit={submit}>
          <label>
            رمز ورود

            <input
              autoFocus
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(
                  event.target.value
                );
                setError("");
              }}
              placeholder="رمز ورود مدیر"
            />
          </label>

          {error && (
            <div className="admin-login-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button
            className="primary-button"
            type="submit"
          >
            ورود به پنل
            <ArrowLeft size={18} />
          </button>
        </form>
      </div>
    </main>
  );
}

/* =========================================================
   ADMIN GATE
========================================================= */

function AdminGate({
  products,
  setProducts,
}) {
  const [
    authenticated,
    setAuthenticated,
  ] = useState(
    () =>
      sessionStorage.getItem(
        "attari_admin_auth"
      ) === "1"
  );

  if (authenticated) {
    return (
      <AdminPage
        products={products}
        setProducts={setProducts}
      />
    );
  }

  return (
    <AdminLogin
      onSuccess={() =>
        setAuthenticated(true)
      }
    />
  );
}

/* =========================================================
   FOOTER
========================================================= */

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <button
            className="brand brand-button"
            onClick={goHome}
            type="button"
          >
            <span className="brand-mark">
              <img src="/logoattari.svg" className="brand-logo" alt="" />
            </span>

            <span>
              <strong>
                سلامتکده عبدالرسول
              </strong>

              <small>
                عطاری و محصولات طبیعی
              </small>
            </span>
          </button>

          <p>
            طاهرآباد، روبروی شاهزاده طاهر،
            عطاری عبدالرسول.
          </p>
        </div>

        <div>
          <h4>دسترسی سریع</h4>

          <button
            onClick={goHome}
            type="button"
          >
            خانه
          </button>

          <button
            onClick={goToProducts}
            type="button"
          >
            محصولات
          </button>

          <button
            onClick={() =>
              goHome("about")
            }
            type="button"
          >
            درباره ما
          </button>
        </div>

        <div>
          <h4>تماس با ما</h4>

          <p style={{marginBottom: 6}}>
            <Phone size={13} style={{display: 'inline', verticalAlign: 'middle', marginLeft: 6}} />
            <span dir="ltr">0914-002-6313</span>
          </p>

          <p style={{marginBottom: 6}}>
            <Phone size={13} style={{display: 'inline', verticalAlign: 'middle', marginLeft: 6}} />
            <span dir="ltr">031-555-22936</span>
          </p>

          <p>
            <MapPin size={13} style={{display: 'inline', verticalAlign: 'middle', marginLeft: 6}} />
            طاهرآباد، روبروی شاهزاده طاهر
          </p>
        </div>

        <div>
          <h4>مدیریت</h4>

          <button
            onClick={goAdmin}
            type="button"
          >
            پنل مدیریت
          </button>

          <p>عبدالرسول میثاق‌پور</p>
          <p>حدود ۸ سال تجربه</p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © ۱۴۰۵ سلامتکده عبدالرسول. تمامی حقوق
          محفوظ است.
        </span>

        <span>
          ساخته‌شده با احترام به طبیعت.
        </span>
      </div>
    </footer>
  );
}

/* =========================================================
   ABOUT PAGE
========================================================= */

function useCountUp(end, duration = 2000, startOnView = true) {
  const [value, setValue] = useState(0);
  const ref = React.useRef(null);
  const started = React.useRef(false);

  useEffect(() => {
    if (!startOnView) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(eased * end));
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration, startOnView]);

  return [value, ref];
}

function CountStat({ end, suffix, label, description, icon }) {
  const [display, ref] = useCountUp(end, 2200);

  return (
    <div className="about-page-stat" ref={ref}>
      <div className="about-page-stat-icon">
        {icon}
      </div>
      <strong>
        {display.toLocaleString("fa-IR")}
        {suffix}
      </strong>
      <span>{label}</span>
      <p>{description}</p>
    </div>
  );
}

function AboutPage() {
  return (
    <main className="about-page">

      {/* ===== HERO ===== */}
      <LazySection eager>
        <section className="about-page-hero">
          <div className="about-page-hero-bg">
            <img
              src="/images/natural-various-herbs-wooden-box-high-view.jpg"
              alt=""
            />
            <div className="about-page-hero-overlay" />
          </div>

          {/* Floating decorative elements */}
          <div className="about-hero-float about-hero-float--1" aria-hidden="true">
            <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 0C40 0 10 30 10 60C10 80 24 100 40 100C56 100 70 80 70 60C70 30 40 0 40 0Z" fill="rgba(255,255,255,.12)"/>
              <path d="M40 15V85" stroke="rgba(255,255,255,.18)" strokeWidth="1.5"/>
              <path d="M40 35C30 30 22 40 22 40" stroke="rgba(255,255,255,.15)" strokeWidth="1" fill="none"/>
              <path d="M40 50C50 45 58 55 58 55" stroke="rgba(255,255,255,.15)" strokeWidth="1" fill="none"/>
            </svg>
          </div>

          <div className="about-hero-float about-hero-float--2" aria-hidden="true">
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="30" cy="30" r="28" stroke="rgba(184,149,82,.25)" strokeWidth="1.5" fill="none"/>
              <circle cx="30" cy="30" r="18" stroke="rgba(184,149,82,.18)" strokeWidth="1" fill="none"/>
              <circle cx="30" cy="30" r="6" fill="rgba(184,149,82,.2)"/>
            </svg>
          </div>

          <div className="about-hero-float about-hero-float--3" aria-hidden="true">
            <svg viewBox="0 0 70 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M35 5C35 5 5 25 5 50C5 70 18 85 35 85C52 85 65 70 65 50C65 25 35 5 35 5Z" fill="rgba(255,255,255,.08)"/>
              <path d="M35 15V75" stroke="rgba(255,255,255,.14)" strokeWidth="1.2"/>
              <path d="M35 30C25 28 18 36 18 36" stroke="rgba(255,255,255,.12)" strokeWidth=".8" fill="none"/>
              <path d="M35 45C45 43 52 51 52 51" stroke="rgba(255,255,255,.12)" strokeWidth=".8" fill="none"/>
              <path d="M35 60C28 58 22 64 22 64" stroke="rgba(255,255,255,.1)" strokeWidth=".8" fill="none"/>
            </svg>
          </div>

          <div className="about-hero-float about-hero-float--4" aria-hidden="true">
            <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 2L30 18H47L33 28L38 45L25 34L12 45L17 28L3 18H20L25 2Z" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.12)" strokeWidth=".8"/>
            </svg>
          </div>

          <div className="about-hero-float about-hero-float--5" aria-hidden="true">
            <svg viewBox="0 0 90 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 50C10 50 20 10 45 10C70 10 80 50 80 50" stroke="rgba(255,255,255,.15)" strokeWidth="1.2" fill="none"/>
              <path d="M15 48C15 48 25 18 45 18C65 18 75 48 75 48" stroke="rgba(255,255,255,.1)" strokeWidth=".8" fill="none"/>
              <circle cx="45" cy="8" r="3" fill="rgba(184,149,82,.2)"/>
            </svg>
          </div>

          <div className="about-hero-float about-hero-float--6" aria-hidden="true">
            <svg viewBox="0 0 40 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="20" cy="15" rx="12" ry="14" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.1)" strokeWidth=".8"/>
              <path d="M20 28V50" stroke="rgba(255,255,255,.12)" strokeWidth="1"/>
              <path d="M14 38L20 32L26 38" stroke="rgba(255,255,255,.1)" strokeWidth=".7" fill="none"/>
            </svg>
          </div>

          <div className="container about-page-hero-content">
            <span className="section-kicker">
              سلامتکده عبدالرسول
            </span>

            <h1>
              داستان ما، طبیعت
              <br />
              در خدمت سلامتی شما.
            </h1>

            <p>
              سلامتکده عبدالرسول با بیش از هشت سال
              تجربه، همراه شما در مسیر سلامتی و
              آرامش از دل طبیعت است.
            </p>

            <button
              className="primary-button"
              type="button"
              onClick={() => {
                window.location.href = "tel:+989140026313";
              }}
            >
              تماس با ما
              <Phone size={18} />
            </button>
          </div>
        </section>
      </LazySection>

      {/* ===== STATS ===== */}
      <LazySection>
        <section className="about-page-stats section">
          <div className="container">
            <div className="about-page-stats-grid">
              <CountStat
                end={3000}
                suffix="+"
                label="مشتری"
                description="بیش از سه هزار مشتری راضی از سراسر کشور"
                icon={<Users size={36} />}
              />
              <CountStat
                end={8}
                suffix="+"
                label="سال تجربه"
                description="هشت سال فعالیت تخصصی در حوزه گیاهان دارویی"
                icon={<Clock size={36} />}
              />
              <CountStat
                end={1500}
                suffix="+"
                label="درمان موفق"
                description="هزار و پانصد درمان موفق با گیاهان دارویی طبیعی"
                icon={<Heart size={36} />}
              />
            </div>
          </div>
        </section>
      </LazySection>

      {/* ===== OUR STORY ===== */}
      <LazySection>
        <section className="about-page-story section">
          <div className="container about-page-story-grid">
            <div className="about-page-story-visual">
              <img
                src="/images/still-life-loose-tea.jpg"
                alt=""
              />
            </div>

            <div className="about-page-story-copy">
              <span className="section-kicker">
                داستان ما
              </span>

              <h2>
                از عشق به طبیعت، تا خدمت
                به سلامتی.
              </h2>

              <p>
                سلامتکده عبدالرسول از عشق به طبیعت
                و باور به قدرت شفابخش گیاهان
                متولد شد. عبدالرسول میثاق‌پور
                با سال‌ها تجربه و تحقیق در
                حوزه گیاهان دارویی، این مجموعه
                را با هدف ارائه محصولات طبیعی و
                خالص تأسیس کرد.
              </p>

              <p>
                ما باور داریم که طبیعت بهترین
                داروخانه است و با معرفی محصولاتی
                مانند معجون عبدالرسول، تلاش
                می‌کنیم تا نعمت‌های طبیعی را به
                زندگی روزمره شما بیاوریم.
              </p>
            </div>
          </div>
        </section>
      </LazySection>

      {/* ===== WHY CHOOSE ===== */}
      <LazySection>
        <section className="about-page-why section">
          <div className="container">
            <div className="about-page-why-head">
              <span className="section-kicker">
                چرا ما؟
              </span>

              <h2>
                چرا سلامتکده عبدالرسول؟
              </h2>

              <p>
                ما با تعهد به کیفیت، طبیعت و
                صداقت، تجربه‌ای متفاوت از خرید
                محصولات گیاهی را برای شما فراهم
                می‌کنیم.
              </p>
            </div>

            <div className="about-page-why-grid">

              <div className="about-page-why-card">
                <div className="about-page-why-icon">
                  <Leaf size={32} />
                </div>
                <h3>
                  محصولات طبیعی و اختصاصی
                </h3>
                <p>
                  تمامی محصولات ما از بهترین
                  مواد اولیه طبیعی و با فرمول‌های
                  اختصاصی تهیه می‌شوند.
                </p>
              </div>

              <div className="about-page-why-card">
                <div className="about-page-why-icon">
                  <ShieldCheck size={32} />
                </div>
                <h3>
                  استانداردهای بهداشتی سختگیرانه
                </h3>
                <p>
                  رعایت کامل استانداردهای بهداشتی
                  در تمام مراحل تولید و نگهداری
                  محصولات.
                </p>
              </div>

              <div className="about-page-why-card">
                <div className="about-page-why-icon">
                  <Coffee size={32} />
                </div>
                <h3>
                  فضای سنتی و حس نوستالژیک
                </h3>
                <p>
                  تجربه خرید در فضایی سنتی و
                  صمیمی با حسی نوستالژیک و
                  دلنشین.
                </p>
              </div>

            </div>
          </div>
        </section>
      </LazySection>

      {/* ===== FINAL CTA ===== */}
      <LazySection>
        <section className="final-cta">
          <div className="container final-cta-inner">
            <div>
              <span>همراه شما در مسیر سلامتی</span>
              <h2>همین حالا شروع کنید.</h2>
              <p>
                محصولات طبیعی سلامتکده عبدالرسول
                را ببینید و انتخاب خودتان را پیدا
                کنید.
              </p>
            </div>

            <button
              className="light-button"
              type="button"
              onClick={goToProducts}
            >
              مشاهده محصولات
              <ArrowLeft size={18} />
            </button>
          </div>
        </section>
      </LazySection>

    </main>
  );
}

/* =========================================================
   JOURNAL PAGE
========================================================= */

const ARTICLES_PER_PAGE = 5;

function JournalPage() {
  const [query, setQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = articles.filter((article) => {
    const q = query.trim().toLocaleLowerCase("fa");
    if (!q) return true;
    return (
      article.title.toLocaleLowerCase("fa").includes(q) ||
      article.category.toLocaleLowerCase("fa").includes(q) ||
      article.summary.toLocaleLowerCase("fa").includes(q) ||
      article.content.toLocaleLowerCase("fa").includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
  const paginatedArticles = filtered.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  if (selectedArticle) {
    const article = articles.find(
      (a) => a.id === selectedArticle
    );
    if (!article) return null;

    return (
      <main className="journal-page">
        <LazySection eager>
          <section className="journal-page-hero">
            <div className="container">
              <button
                className="outline-button"
                type="button"
                onClick={() => setSelectedArticle(null)}
              >
                بازگشت به فهرست
                <ArrowLeft size={17} />
              </button>

              <span className="section-kicker">
                {article.category}
              </span>

              <h1>{article.title}</h1>

              <div className="journal-page-meta">
                <span>{article.readTime} مطالعه</span>
                <span>شماره {article.number}</span>
              </div>
            </div>
          </section>
        </LazySection>

        <LazySection>
          <section className="journal-page-body section">
            <div className="container journal-page-body-inner">
              {article.content.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>
        </LazySection>
      </main>
    );
  }

  return (
    <main className="journal-page">
      <LazySection eager>
        <section className="journal-page-hero">
          <div className="journal-hero-illustration" aria-hidden="true">
            <svg className="journal-illust-book" viewBox="0 0 200 140" fill="none">
              <path d="M100 20C80 20 60 25 40 35V120C60 110 80 105 100 105C120 105 140 110 160 120V35C140 25 120 20 100 20Z" fill="rgba(47,107,79,.15)" stroke="rgba(47,107,79,.3)" strokeWidth="1.5"/>
              <path d="M100 20V105" stroke="rgba(47,107,79,.2)" strokeWidth="1"/>
              <path d="M55 50H85" stroke="rgba(47,107,79,.15)" strokeWidth=".8"/>
              <path d="M55 60H80" stroke="rgba(47,107,79,.12)" strokeWidth=".6"/>
              <path d="M115 50H145" stroke="rgba(47,107,79,.15)" strokeWidth=".8"/>
              <path d="M115 60H140" stroke="rgba(47,107,79,.12)" strokeWidth=".6"/>
            </svg>
            <svg className="journal-illust-magazine" viewBox="0 0 120 160" fill="none">
              <rect x="10" y="30" width="100" height="120" rx="6" fill="rgba(184,149,82,.12)" stroke="rgba(184,149,82,.25)" strokeWidth="1.2"/>
              <rect x="5" y="20" width="100" height="120" rx="6" fill="rgba(47,107,79,.1)" stroke="rgba(47,107,79,.2)" strokeWidth="1.2"/>
              <rect x="0" y="10" width="100" height="120" rx="6" fill="rgba(220,232,220,.25)" stroke="rgba(47,107,79,.18)" strokeWidth="1.2"/>
              <rect x="15" y="25" width="70" height="5" rx="2" fill="rgba(47,107,79,.15)"/>
              <rect x="15" y="36" width="50" height="3" rx="1" fill="rgba(47,107,79,.1)"/>
            </svg>
            <svg className="journal-illust-leaf1" viewBox="0 0 60 80" fill="none">
              <path d="M30 5C30 5 5 25 5 50C5 68 16 78 30 78C44 78 55 68 55 50C55 25 30 5 30 5Z" fill="rgba(47,107,79,.12)" stroke="rgba(47,107,79,.22)" strokeWidth="1"/>
              <path d="M30 15V70" stroke="rgba(47,107,79,.18)" strokeWidth=".8"/>
              <path d="M30 30C22 28 15 35 15 35" stroke="rgba(47,107,79,.14)" strokeWidth=".6" fill="none"/>
            </svg>
            <svg className="journal-illust-leaf2" viewBox="0 0 50 70" fill="none">
              <path d="M25 3C25 3 3 20 3 42C3 58 13 67 25 67C37 67 47 58 47 42C47 20 25 3 25 3Z" fill="rgba(78,128,100,.1)" stroke="rgba(78,128,100,.2)" strokeWidth=".8"/>
              <path d="M25 12V60" stroke="rgba(78,128,100,.15)" strokeWidth=".7"/>
            </svg>
            <svg className="journal-illust-flower" viewBox="0 0 70 70" fill="none">
              <circle cx="35" cy="35" r="8" fill="rgba(184,149,82,.18)" stroke="rgba(184,149,82,.25)" strokeWidth=".8"/>
              <ellipse cx="35" cy="18" rx="7" ry="12" fill="rgba(220,232,220,.2)" stroke="rgba(47,107,79,.15)" strokeWidth=".6"/>
              <ellipse cx="35" cy="52" rx="7" ry="12" fill="rgba(220,232,220,.2)" stroke="rgba(47,107,79,.15)" strokeWidth=".6"/>
              <ellipse cx="18" cy="35" rx="12" ry="7" fill="rgba(220,232,220,.2)" stroke="rgba(47,107,79,.15)" strokeWidth=".6"/>
              <ellipse cx="52" cy="35" rx="12" ry="7" fill="rgba(220,232,220,.2)" stroke="rgba(47,107,79,.15)" strokeWidth=".6"/>
            </svg>
            <svg className="journal-illust-herb" viewBox="0 0 40 60" fill="none">
              <path d="M20 55V15" stroke="rgba(47,107,79,.2)" strokeWidth="1"/>
              <ellipse cx="12" cy="20" rx="8" ry="5" fill="rgba(47,107,79,.1)" stroke="rgba(47,107,79,.16)" strokeWidth=".6" transform="rotate(-30 12 20)"/>
              <ellipse cx="28" cy="28" rx="8" ry="5" fill="rgba(47,107,79,.1)" stroke="rgba(47,107,79,.16)" strokeWidth=".6" transform="rotate(30 28 28)"/>
            </svg>
          </div>

          <div className="container">
            <span className="section-kicker">
              مجله سلامتکده
            </span>

            <h1>
              مجله سلامت و
              <br />
              گیاهان دارویی
            </h1>

            <p>
              مقالات تخصصی درباره گیاهان دارویی،
              روش‌های درمان طبیعی و سبک زندگی سالم.
            </p>
          </div>
        </section>
      </LazySection>

      <LazySection>
        <section className="journal-page-search section">
          <div className="container">
            <div className="journal-search-bar">
              <Search size={20} />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
                placeholder="جستجو در مقالات..."
                aria-label="جستجوی مقالات"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="journal-page-count">
              {filtered.length} مقاله
            </div>
          </div>
        </section>
      </LazySection>

      <LazySection>
        <section className="journal-page-list section">
          <div className="container">
            {filtered.length > 0 ? (
              <>
                <div className="journal-articles-grid">
                  {paginatedArticles.map((article) => (
                    <article
                      className="journal-article-card"
                      key={article.id}
                      onClick={() => setSelectedArticle(article.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setSelectedArticle(article.id);
                      }}
                    >
                      <div className="journal-article-head">
                        <span className="journal-article-number">
                          {article.number}
                        </span>
                        <span className="journal-article-category">
                          {article.category}
                        </span>
                      </div>

                      <h2>{article.title}</h2>
                      <p>{article.summary}</p>

                      <div className="journal-article-foot">
                        <span>{article.readTime} مطالعه</span>
                        <span className="journal-article-arrow">
                          <ArrowLeft size={16} />
                        </span>
                      </div>
                    </article>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="journal-pagination">
                    <button
                      className="journal-pagination-btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      <ChevronRight size={18} />
                      <span>صفحه قبل</span>
                    </button>

                    <div className="journal-pagination-numbers">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            className={`journal-pagination-number ${
                              page === currentPage ? "active" : ""
                            }`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      className="journal-pagination-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      <span>صفحه بعد</span>
                      <ChevronLeft size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="journal-empty">
                <Search size={28} />
                <h3>مقاله‌ای پیدا نشد</h3>
                <p>عبارت جستجو را تغییر دهید.</p>
              </div>
            )}
          </div>
        </section>
      </LazySection>
    </main>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [path, setPath] = useState(
    window.location.pathname
  );

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("attari_products");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (_) {}
    return fallbackProducts;
  });

  /* ================= SAVE PRODUCTS TO LOCALSTORAGE ================= */

  useEffect(() => {
    localStorage.setItem("attari_products", JSON.stringify(products));
  }, [products]);

  /* ================= LOAD PRODUCTS ================= */

  useEffect(() => {
    fetch("./products.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "products.json not found"
          );
        }

        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          try {
            const saved = localStorage.getItem("attari_products");
            if (saved) {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                return;
              }
            }
          } catch (_) {}
          setProducts(data);
        }
      })
      .catch(() => {
        // fallbackProducts or localStorage data استفاده می‌شود
      });
  }, []);

  /* ================= LOAD HOMEPAGE ================= */

  useEffect(() => {
    fetch("./homepage.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "homepage.json not found"
          );
        }

        return response.json();
      })
      .then((data) => {
        if (
          Array.isArray(data) &&
          data.length
        ) {
          localStorage.setItem(
            "attari_home_sections",
            JSON.stringify(data)
          );

          window.dispatchEvent(
            new Event(
              "attari-home-update"
            )
          );
        }
      })
      .catch(() => {
        // localStorage / defaults استفاده می‌شود
      });
  }, []);

  /* ================= HASH ================= */

  useEffect(() => {
    const onRouteChange = () => {
      setPath(window.location.pathname);

      const path = window.location.pathname;
      const sectionMatch = path.match(/^\/(\w+)$/);
      const sectionId = sectionMatch ? sectionMatch[1] : null;

      if (sectionId && ["categories", "about", "journal", "featured-product"].includes(sectionId)) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };

    window.addEventListener(
      "popstate",
      onRouteChange
    );

    return () => {
      window.removeEventListener(
        "popstate",
        onRouteChange
      );
    };
  }, []);

  const currentPath =
    window.location.pathname || path;

  const productsPage =
    currentPath === "/products";

  const adminPage =
    currentPath === "/admin";

  const aboutPage =
    currentPath === "/about";

  const journalPage =
    currentPath === "/journal";

  const productDetailPage =
    currentPath.startsWith(
      "/product/"
    );

  return (
    <div className="site-shell">
      {!adminPage && (
        <Header
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          productsPage={productsPage}
        />
      )}

      {adminPage ? (
        <AdminGate
          products={products}
          setProducts={setProducts}
        />
      ) : aboutPage ? (
        <AboutPage />
      ) : journalPage ? (
        <JournalPage />
      ) : productDetailPage ? (
        <ProductDetail
          products={products}
        />
      ) : productsPage ? (
        <ProductsPage
          products={products}
        />
      ) : (
        <HomePage
          products={products}
        />
      )}

      {!adminPage && <Footer />}
    </div>
  );
}

/* =========================================================
   ROOT
========================================================= */

const rootElement =
  document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found."
  );
}

createRoot(rootElement).render(
  <App />
);