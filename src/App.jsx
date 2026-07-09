import React, { useEffect, useState } from 'react';

const GOVERNMENT_RATE = 0.6;
const PEOPLE_RATE = 0.4;
const DAILY_GOVERNMENT_LIMIT = 200;
const SITE_URL = 'https://thai-help-calculator.pages.dev';

const pageMeta = {
  home: {
    title: 'คำนวณไทยช่วยไทย พลัส 60/40 | รัฐช่วยเท่าไหร่ ต้องจ่ายเองกี่บาท',
    description:
      'เครื่องคำนวณไทยช่วยไทย พลัส 60/40 คำนวณสิทธิรัฐคงเหลือ ยอดที่รัฐช่วย และยอดที่ต้องจ่ายเองแบบง่าย ๆ ใช้งานฟรี ไม่ต้องกรอกข้อมูลส่วนตัว',
    url: `${SITE_URL}/`,
  },
  privacy: {
    title: 'นโยบายความเป็นส่วนตัว | คำนวณไทยช่วยไทย พลัส',
    description:
      'นโยบายความเป็นส่วนตัวของเว็บไซต์เครื่องคำนวณไทยช่วยไทย พลัส อธิบายการใช้ข้อมูล cookies และโฆษณา Google AdSense',
    url: `${SITE_URL}/privacy-policy`,
  },
};

const formatBaht = (value) =>
  `${new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} บาท`;

const calculatorBenefits = [
  'คำนวณยอดที่รัฐช่วย',
  'คำนวณยอดที่ต้องจ่ายเอง',
  'ตรวจสอบสิทธิคงเหลือโดยประมาณ',
  'ใช้คำนวณยอดตามสัดส่วน 60/40',
  'ช่วยวางแผนก่อนใช้สิทธิ',
];

const usageSteps = [
  'ใส่จำนวนเงินที่ต้องการใช้จ่าย',
  'ใส่สิทธิรัฐคงเหลือ',
  'ระบบจะคำนวณยอดที่รัฐช่วยและยอดที่ต้องจ่ายเอง',
  'ตรวจสอบผลลัพธ์ก่อนนำไปใช้จริง',
];

const calculationExamples = [
  'หากซื้อสินค้า 100 บาท รัฐช่วย 60 บาท ประชาชนจ่ายเอง 40 บาท',
  'หากซื้อสินค้า 200 บาท รัฐช่วย 120 บาท ประชาชนจ่ายเอง 80 บาท',
  'หากสิทธิรัฐคงเหลือไม่พอ ระบบจะคำนวณตามสิทธิที่เหลืออยู่',
];

const faqItems = [
  {
    question: 'เครื่องคำนวณนี้เป็นช่องทางของรัฐหรือไม่?',
    answer: 'ไม่ใช่ เว็บนี้เป็นเครื่องมือช่วยคำนวณเบื้องต้นเท่านั้น',
  },
  {
    question: 'ผลลัพธ์ที่ได้ใช้ยืนยันสิทธิได้หรือไม่?',
    answer:
      'ไม่ได้ ผลลัพธ์เป็นการประเมินเบื้องต้น ควรตรวจสอบข้อมูลจากแอปหรือช่องทางทางการอีกครั้ง',
  },
  {
    question: 'ถ้าสิทธิรัฐเหลือน้อยกว่ายอดที่คำนวณจะเป็นอย่างไร?',
    answer: 'ระบบจะคำนวณจากสิทธิที่เหลืออยู่ และแสดงยอดที่ต้องจ่ายเองเพิ่มขึ้น',
  },
  {
    question: 'ใช้งานฟรีไหม?',
    answer: 'ใช้งานฟรี ไม่มีค่าใช้จ่าย',
  },
  {
    question: 'ต้องกรอกข้อมูลส่วนตัวไหม?',
    answer: 'ไม่ต้องกรอกข้อมูลส่วนตัว เครื่องมือนี้ใช้เฉพาะตัวเลขในการคำนวณ',
  },
  {
    question: 'ใช้บนมือถือได้ไหม?',
    answer: 'ใช้ได้ เว็บรองรับการใช้งานบนมือถือ แท็บเล็ต และคอมพิวเตอร์',
  },
];

const privacySections = [
  {
    title: 'ข้อมูลที่เว็บไซต์นี้เก็บ',
    body:
      'เว็บไซต์นี้ไม่ได้ขอให้ผู้ใช้งานกรอกชื่อ นามสกุล เลขบัตรประชาชน เบอร์โทรศัพท์ หรือข้อมูลส่วนตัวอื่น ๆ การคำนวณบนเว็บไซต์ใช้เฉพาะตัวเลขที่ผู้ใช้งานกรอกเพื่อประมวลผลบนหน้าเว็บเท่านั้น',
  },
  {
    title: 'การใช้ข้อมูลการคำนวณ',
    body:
      'ข้อมูลตัวเลขที่ผู้ใช้งานกรอก ใช้เพื่อแสดงผลการคำนวณบนหน้าเว็บเท่านั้น เว็บไซต์ไม่ได้ใช้ข้อมูลดังกล่าวเพื่อยืนยันสิทธิ ไม่ได้เชื่อมต่อกับระบบของรัฐ และไม่ได้รับรองความถูกต้องแทนหน่วยงานทางการ',
  },
  {
    title: 'Cookies และเทคโนโลยีที่เกี่ยวข้อง',
    body:
      'เว็บไซต์นี้อาจมีการใช้ cookies หรือเทคโนโลยีที่คล้ายกัน เพื่อช่วยปรับปรุงประสบการณ์การใช้งาน วิเคราะห์การใช้งานเว็บไซต์ และรองรับการแสดงโฆษณาจากผู้ให้บริการภายนอก เช่น Google AdSense',
  },
  {
    title: 'Google AdSense และโฆษณา',
    body:
      'เว็บไซต์นี้อาจแสดงโฆษณาจาก Google AdSense หรือพันธมิตรโฆษณาอื่น ๆ ซึ่งอาจใช้ cookies เพื่อแสดงโฆษณาที่เกี่ยวข้องกับผู้ใช้งาน การใช้ข้อมูลของ Google เป็นไปตามนโยบายความเป็นส่วนตัวและข้อกำหนดของ Google',
  },
  {
    title: 'ลิงก์ไปยังเว็บไซต์ภายนอก',
    body:
      'เว็บไซต์นี้อาจมีลิงก์ไปยังเว็บไซต์ภายนอก ผู้ใช้งานควรตรวจสอบนโยบายความเป็นส่วนตัวของเว็บไซต์ปลายทางด้วยตนเอง เนื่องจากเว็บไซต์นี้ไม่สามารถควบคุมเนื้อหา นโยบาย หรือการทำงานของเว็บไซต์ภายนอกได้',
  },
  {
    title: 'ความถูกต้องของข้อมูล',
    body:
      'ข้อมูลและผลลัพธ์จากเครื่องคำนวณเป็นการประเมินเบื้องต้นเท่านั้น เงื่อนไข มาตรการ หรือสัดส่วนการช่วยจ่ายอาจเปลี่ยนแปลงได้ ผู้ใช้งานควรตรวจสอบข้อมูลล่าสุดจากช่องทางทางการก่อนนำผลลัพธ์ไปใช้งานจริง',
  },
  {
    title: 'การเปลี่ยนแปลงนโยบายความเป็นส่วนตัว',
    body:
      'เว็บไซต์อาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว หากมีการเปลี่ยนแปลง จะปรับปรุงเนื้อหาในหน้านี้ให้เป็นปัจจุบัน',
  },
];

function updatePageMeta(meta) {
  document.title = meta.title;

  const setAttribute = (selector, attribute, value) => {
    const element = document.head.querySelector(selector);
    if (element) {
      element.setAttribute(attribute, value);
    }
  };

  setAttribute('meta[name="description"]', 'content', meta.description);
  setAttribute('meta[property="og:title"]', 'content', meta.title);
  setAttribute('meta[property="og:description"]', 'content', meta.description);
  setAttribute('meta[property="og:url"]', 'content', meta.url);
  setAttribute('link[rel="canonical"]', 'href', meta.url);
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>
        เว็บไซต์นี้เป็นเครื่องมือช่วยคำนวณเบื้องต้น ไม่เกี่ยวข้องกับหน่วยงานรัฐ
        และไม่บันทึกข้อมูลส่วนตัวของผู้ใช้งาน
      </p>
      <nav className="footer-links" aria-label="ลิงก์ท้ายเว็บไซต์">
        <a href="/privacy-policy">นโยบายความเป็นส่วนตัว</a>
      </nav>
    </footer>
  );
}

function HomePage() {
  const [remainingRight, setRemainingRight] = useState('');
  const [hasEdited, setHasEdited] = useState(false);

  const trimmedRemainingRight = remainingRight.trim();
  const remainingValue = Number(remainingRight);
  const hasInput = trimmedRemainingRight !== '';
  const isInvalidInput = !hasInput || Number.isNaN(remainingValue) || remainingValue <= 0;
  const error = hasEdited && isInvalidInput ? 'กรุณากรอกสิทธิรัฐคงเหลือมากกว่า 0 บาท' : '';
  const result = hasInput && !isInvalidInput
    ? (() => {
        const governmentHelp = Math.min(remainingValue, DAILY_GOVERNMENT_LIMIT);
        const maximumPurchase = governmentHelp / GOVERNMENT_RATE;
        const peoplePay = maximumPurchase * PEOPLE_RATE;

        return {
          governmentHelp,
          maximumPurchase,
          peoplePay,
        };
      })()
    : null;

  return (
    <div className="site-shell">
      <header className="hero">
        <div className="hero__content">
          <p className="eyebrow">เครื่องมือช่วยคำนวณเบื้องต้น</p>
          <h1>คำนวณไทยช่วยไทย พลัส 60/40</h1>
          <p className="hero__lead">
            กรอกสิทธิรัฐที่เหลือ แล้วดูว่าสามารถซื้อของได้เท่าไหร่ รัฐช่วยกี่บาท
            และต้องจ่ายเองประมาณกี่บาท
          </p>
          <p className="official-note">
            เว็บไซต์นี้เป็นเครื่องมือช่วยคำนวณเบื้องต้น ไม่ใช่บริการของรัฐ
            และไม่เกี่ยวข้องกับหน่วยงานรัฐ
          </p>
        </div>
      </header>

      <main>
        <section className="calculator-section" aria-labelledby="calculator-heading">
          <div className="calculator-grid">
            <div className="calculator-card">
              <div className="section-heading">
                <p className="eyebrow">คำนวณจากสิทธิรัฐคงเหลือ</p>
                <h2 id="calculator-heading">เช็กยอดซื้อสูงสุด</h2>
              </div>

              <div className="calculator-form">
                <label htmlFor="remaining-right">สิทธิรัฐคงเหลือ</label>
                <div className="input-row">
                  <input
                    id="remaining-right"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="เช่น 200"
                    value={remainingRight}
                    onChange={(event) => {
                      setRemainingRight(event.target.value);
                      setHasEdited(true);
                    }}
                    aria-describedby={error ? 'remaining-error daily-limit' : 'daily-limit'}
                  />
                  <span>บาท</span>
                </div>
                <p id="daily-limit" className="input-help">
                  คำนวณโดยจำกัดสิทธิรัฐที่ใช้ได้ต่อวันไว้ที่ {formatBaht(DAILY_GOVERNMENT_LIMIT)}
                </p>
                {error && (
                  <p id="remaining-error" className="error-message" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <div className="results" aria-live="polite">
                <div className="result-box">
                  <span>รัฐช่วยได้จริง</span>
                  <strong>{formatBaht(result?.governmentHelp ?? 0)}</strong>
                </div>
                <div className="result-box result-box--highlight">
                  <span>ซื้อของได้สูงสุด</span>
                  <strong>{formatBaht(result?.maximumPurchase ?? 0)}</strong>
                </div>
                <div className="result-box">
                  <span>เงินที่ต้องจ่ายเอง</span>
                  <strong>{formatBaht(result?.peoplePay ?? 0)}</strong>
                </div>
              </div>
            </div>

            <aside className="summary-panel" aria-label="สรุปสูตร 60/40">
              <div className="formula-line">
                <span>รัฐช่วย</span>
                <strong>60%</strong>
              </div>
              <div className="formula-line">
                <span>ประชาชนจ่าย</span>
                <strong>40%</strong>
              </div>
              <div className="formula-line">
                <span>จำกัดสิทธิรัฐต่อวัน</span>
                <strong>{formatBaht(DAILY_GOVERNMENT_LIMIT)}</strong>
              </div>
              <p>
                ถ้าสิทธิรัฐคงเหลือน้อยกว่าวงเงินต่อวัน ระบบจะใช้สิทธิที่เหลือจริงในการคำนวณ
              </p>
            </aside>
          </div>

          <div className="ad-placeholder" role="complementary" aria-label="พื้นที่โฆษณาใต้เครื่องคำนวณ">
            พื้นที่โฆษณา
          </div>
        </section>

        <section className="content-section" aria-labelledby="about-heading">
          <article className="article">
            <section className="article-section" aria-labelledby="about-heading">
              <h2 id="about-heading">ไทยช่วยไทย พลัส คืออะไร</h2>
              <p>
                ไทยช่วยไทย พลัส เป็นมาตรการช่วยลดภาระค่าใช้จ่ายของประชาชน โดยมีรูปแบบการช่วยจ่ายตามสัดส่วนที่กำหนด
                เช่น รัฐช่วยบางส่วน และประชาชนจ่ายเองบางส่วน เครื่องคำนวณนี้จัดทำขึ้นเพื่อช่วยประเมินยอดเงินเบื้องต้นว่า
                หากมีสิทธิคงเหลืออยู่ จะสามารถใช้ได้เท่าไหร่ และต้องจ่ายเองประมาณกี่บาท
              </p>
            </section>

            <section className="article-section" aria-labelledby="benefits-heading">
              <h2 id="benefits-heading">เครื่องคำนวณนี้ช่วยอะไรได้บ้าง</h2>
              <ul className="feature-list">
                {calculatorBenefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </section>

            <section className="article-section" aria-labelledby="steps-heading">
              <h2 id="steps-heading">วิธีใช้เครื่องคำนวณ</h2>
              <ol className="step-list">
                {usageSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>

            <section className="article-section" aria-labelledby="examples-heading">
              <h2 id="examples-heading">ตัวอย่างการคำนวณ</h2>
              <ul className="example-list">
                {calculationExamples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
              <p className="note-text">
                ตัวเลขเป็นเพียงตัวอย่างเบื้องต้น ควรตรวจสอบเงื่อนไขจริงจากหน่วยงานที่เกี่ยวข้องอีกครั้ง
              </p>
            </section>

            <div className="ad-placeholder ad-placeholder--article" role="complementary" aria-label="พื้นที่โฆษณากลางบทความ">
              พื้นที่โฆษณา
            </div>

            <section className="faq" aria-labelledby="faq-heading">
              <h2 id="faq-heading">คำถามที่พบบ่อย FAQ</h2>

              {faqItems.map((item) => (
                <div className="faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </section>

            <section className="article-section article-section--last" aria-labelledby="limitations-heading">
              <h2 id="limitations-heading">ข้อจำกัดของเครื่องคำนวณ</h2>
              <p>
                เครื่องคำนวณนี้จัดทำขึ้นเพื่อช่วยคำนวณเบื้องต้นเท่านั้น สูตรและเงื่อนไขอาจมีการเปลี่ยนแปลงได้ตามประกาศของหน่วยงานที่เกี่ยวข้อง
                ผู้ใช้งานควรตรวจสอบข้อมูลล่าสุดจากช่องทางทางการก่อนตัดสินใจใช้งานจริง
              </p>
            </section>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function PrivacyPolicyPage() {
  return (
    <div className="site-shell">
      <header className="hero hero--compact">
        <div className="hero__content">
          <p className="eyebrow">Privacy Policy</p>
          <h1>นโยบายความเป็นส่วนตัว</h1>
          <p className="hero__lead">
            รายละเอียดการใช้ข้อมูล cookies และโฆษณาสำหรับเว็บไซต์เครื่องคำนวณไทยช่วยไทย พลัส
          </p>
        </div>
      </header>

      <main>
        <section className="policy-section" aria-labelledby="privacy-heading">
          <article className="policy-card">
            <div>
              <h2 id="privacy-heading">นโยบายความเป็นส่วนตัว</h2>
              <p className="policy-intro">
                เว็บไซต์ thai-help-calculator.pages.dev จัดทำขึ้นเพื่อให้บริการเครื่องคำนวณไทยช่วยไทย พลัสแบบเบื้องต้น
                โดยผู้ใช้งานสามารถคำนวณยอดสิทธิรัฐ ยอดที่ต้องจ่ายเอง และยอดโดยประมาณได้โดยไม่ต้องกรอกข้อมูลส่วนตัว
              </p>
            </div>

            {privacySections.map((section) => (
              <section className="policy-item" key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </section>
            ))}

            <section className="policy-item policy-item--last" aria-labelledby="contact-heading">
              <h2 id="contact-heading">ติดต่อเรา</h2>
              <p>
                หากมีคำถาม ข้อเสนอแนะ หรือต้องการแจ้งปัญหาเกี่ยวกับเว็บไซต์ สามารถติดต่อได้ที่อีเมล:
                <a href="mailto:supportthaihelp@gmail.com">supportthaihelp@gmail.com</a>
              </p>
            </section>

            <a className="back-link" href="/">
              กลับหน้าแรก
            </a>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  const normalizedPath = window.location.pathname
    .replace(/\/index\.html$/, '')
    .replace(/\/+$/, '') || '/';
  const isPrivacyPolicyRoute = normalizedPath === '/privacy-policy';

  useEffect(() => {
    updatePageMeta(isPrivacyPolicyRoute ? pageMeta.privacy : pageMeta.home);
  }, [isPrivacyPolicyRoute]);

  if (isPrivacyPolicyRoute) {
    return <PrivacyPolicyPage />;
  }

  return <HomePage />;
}

export default App;
