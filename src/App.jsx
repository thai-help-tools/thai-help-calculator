import React, { useState } from 'react';

const GOVERNMENT_RATE = 0.6;
const PEOPLE_RATE = 0.4;
const DAILY_GOVERNMENT_LIMIT = 200;

const formatBaht = (value) =>
  `${new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} บาท`;

function App() {
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
          <p className="eyebrow">เครื่องคำนวณอย่างไม่เป็นทางการ</p>
          <h1>คำนวณไทยช่วยไทย พลัส</h1>
          <p className="hero__lead">
            กรอกสิทธิรัฐที่เหลือ แล้วดูว่าซื้อของได้เท่าไหร่ และต้องจ่ายเองกี่บาท
          </p>
          <p className="official-note">
            เว็บไซต์นี้ไม่ใช่เว็บทางการของรัฐบาล และไม่เกี่ยวข้องกับหน่วยงานรัฐ
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

        <section className="content-section" aria-labelledby="seo-heading">
          <article className="article">
            <h2 id="seo-heading">ไทยช่วยไทย พลัส 60/40 คำนวณยังไง?</h2>
            <p>
              วิธีคิดคือให้รัฐช่วย 60% ของยอดซื้อ และประชาชนจ่ายเอง 40% โดยเริ่มจากดูว่า
              “สิทธิรัฐคงเหลือ” ใช้ได้จริงเท่าไหร่เมื่อเทียบกับสิทธิที่ใช้ได้ต่อวัน
            </p>
            <p>
              สูตรหลักคือ สิทธิรัฐที่ใช้ได้จริง = ค่าน้อยกว่าระหว่างสิทธิรัฐคงเหลือกับสิทธิที่ใช้ได้ต่อวัน
              จากนั้นนำสิทธิรัฐที่ใช้ได้จริงหารด้วย 0.60 เพื่อหายอดซื้อสูงสุด และคูณด้วย 0.40
              เพื่อหาเงินที่ต้องจ่ายเอง
            </p>

            <div className="example-box">
              <h3>ตัวอย่างการคำนวณ</h3>
              <p>
                ถ้าสิทธิรัฐคงเหลือ {formatBaht(200)} และสิทธิที่ใช้ได้ต่อวัน {formatBaht(200)}
                รัฐช่วยได้จริง {formatBaht(200)} ซื้อของได้สูงสุด {formatBaht(333.33)}
                และประชาชนจ่ายเอง {formatBaht(133.33)}
              </p>
            </div>

            <div className="ad-placeholder ad-placeholder--article" role="complementary" aria-label="พื้นที่โฆษณากลางบทความ">
              พื้นที่โฆษณา
            </div>

            <section className="faq" aria-labelledby="faq-heading">
              <h2 id="faq-heading">คำถามที่พบบ่อย</h2>

              <div className="faq-item">
                <h3>เว็บนี้ลงทะเบียนได้ไหม?</h3>
                <p>
                  ไม่ได้ เว็บนี้เป็นเพียงเครื่องมือคำนวณยอดเงินอย่างไม่เป็นทางการ
                  ไม่สามารถลงทะเบียนหรือยืนยันสิทธิใด ๆ ได้
                </p>
              </div>

              <div className="faq-item">
                <h3>ทำไมรัฐช่วยไม่ถึง 60%?</h3>
                <p>
                  ถ้าสิทธิรัฐคงเหลือน้อยกว่าวงเงินที่ใช้ได้ต่อวัน รัฐจะช่วยได้ตามสิทธิที่เหลือจริง
                  ทำให้ยอดซื้อสูงสุดลดลงตามไปด้วย
                </p>
              </div>

              <div className="faq-item">
                <h3>ถ้าสิทธิเหลือน้อยกว่าวันละ 200 คำนวณยังไง?</h3>
                <p>
                  ระบบจะใช้สิทธิที่เหลือเป็นตัวตั้ง เช่น เหลือ 120 บาท จะคิดยอดซื้อสูงสุดจาก
                  120 ÷ 0.60 และคำนวณเงินที่ต้องจ่ายเองจากยอดซื้อนั้น
                </p>
              </div>

              <div className="faq-item">
                <h3>ใช้เว็บนี้แทนข้อมูลทางการได้ไหม?</h3>
                <p>
                  ไม่ควรใช้แทนข้อมูลทางการ ผลลัพธ์เป็นการคำนวณเพื่อช่วยประเมินเบื้องต้นเท่านั้น
                  ควรตรวจสอบเงื่อนไขล่าสุดจากหน่วยงานรัฐหรือช่องทางทางการเสมอ
                </p>
              </div>
            </section>
          </article>
        </section>
      </main>

      <footer>
        เว็บไซต์นี้เป็นเครื่องมือคำนวณอย่างไม่เป็นทางการ ไม่เกี่ยวข้องกับหน่วยงานรัฐ
      </footer>
    </div>
  );
}

export default App;
