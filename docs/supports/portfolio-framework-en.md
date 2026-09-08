# Portfolio Website — Structure & Content Brief
### Win Winarno — "Hospitality & Healthcare Tech-Operator"
*This document is ready to hand to Claude Code as a build brief.*

---

## 0. Positioning Statement

> Win isn't a typical developer, and isn't a typical hospitality manager. Win is a **senior field operator (30+ years) who uses code as an operational tool** — not the other way around. This portfolio must prove that through *real evidence* (case studies with real numbers from the CV), not empty claims.

**Biographical facts used (source: CV Win_Winarno_Operasional_Manager.docx — treat this as the primary reference, not the earlier brainstorming drafts, which sometimes overstated things):**

| Fact | Detail |
|---|---|
| Career start | 1993, Bellboy & Telephone Operator, Puri Garden Hotel Semarang |
| Total hospitality experience | 33 years (1993–2026), "30+ years" |
| Highest operational title | General Manager, Patuno Resort Wakatobi (Mar 2013–May 2014) |
| Pre-opening | Pre-Opening GM, Rumah Kito Resort, Jambi (Jun 2014–Mar 2015) — 80+ staff |
| Hospital HR consulting | 2015–2024, 6 hospital clients (SMC Tlogorejo, RSUD Rembang, Indriati Solo, Santa Elisabeth, Samsoe Hidajat, Brayat Minulya) |
| Head of Operation, LMS platform | AJAR Media Digital, Jan 2018–Mar 2022 — cross-country partnerships (TAFE Queensland, Dusit Thani, École Hôtelière de Lausanne) |
| Current role | Operational Manager, Hanania Kitchen and Brew, Semarang (April 2026–present); previously HR & Operations Consultant at the same company (Dec 2023–Nov 2025) |
| Certifications | TAE40116 Trainer & Assessor, TAFE Queensland, Australia (2017); Certified Virtual Assistant, SGB-VA Singapore (2025) |
| Contact | Semarang, Central Java · linkedin.com/in/win-va |

**Key achievement numbers used in the Hero Proof Strip (see §3.1) — specific per source, no longer generalized:**
- CSI, SMC Tlogorejo: **70% → 92%**
- Google Review, RS Santa Elisabeth: **4.1 → 4.8 ⭐**
- Staff service-charge earnings, Patuno Resort: **12x increase** (Rp 75,000 → Rp 900,000/month)
- Field experience: **33 years** (1993–present)

*Note: the old combined figure (25%→98% engagement across 6 hospitals) is no longer used in the Hero — it's too generic and can't be traced to a single source. It's kept only as internal context, not as headline copy.*

---

## 1. Applying the Design System to the Portfolio

The design system from the CodePen project ("Six Faces") is used as a **visual framework**, not copied literally (the source project is an art gallery, not a professional portfolio). Adaptation:

| Source Token | Application in the Portfolio |
|---|---|
| `--font-display` (Bebas Neue) | Large headlines (hero H1, case study stat numbers) — conveys confidence and impact |
| `--font-mono` (DM Mono) | Body text, labels, navigation, calculator UI — an "operator/technical" feel, fitting the *Tech-Operator* identity |
| `--accent-dark` (gold `#d4a84b`) / `--accent-light` (green `#3a6e00`) | **Swap to Emerald/Teal** per the original brief (`claude-code-portfolio-spec.md`) — a modern tech accent rather than editorial/artistic. Recommendation: `--accent-dark: #10b981` (emerald-500), `--accent-light: #047857` (emerald-700, desaturated for light mode) |
| `--bg` / `--fg` / `--muted` dark & light pair | Used as-is — the warm-neutral dark palette + cream light palette still reads as "premium executive" |
| Hairline borders + wide-letter-spaced caps | Used for section labels, certification badges, nav — fits a "precise operational documentation" feel |
| 3-state theme toggle (System/Dark/Light) | Kept exactly as-is — the `data-theme` + `prefers-color-scheme` implementation from the source CSS can be reused directly |
| Reveal-on-scroll (IntersectionObserver) | Kept for section transitions, in a lighter form (not the 3D-cube scroll-hijack) |

**Additional recommendations from the earlier design system audit** that should be applied here:
- Rationalize spacing to a 4px scale (§6 of design-system.md)
- Add a `prefers-reduced-motion` guard on all reveal animations
- Check text contrast in both modes with a WCAG tool before finalizing

---

## 2. Sitemap / Page Structure

Single Page Application, 6 sections, smooth-scroll nav:

```
1. Hero                  — "The Hook"
2. Interactive Playground — Food Cost Calculator (live demo)
3. Case Studies           — case studies (tab/card)
4. Dual Competency Grid   — Operational vs Tech
5. About / Meet Win       — career journey narrative
6. Contact                — form + social links
```

---

## 3. Content Per Section

### 3.1 Hero Section

**Headline (H1, display font):**
> I Don't Just Write Code. I Build Systems That Optimize Operations.

**Sub-headline:**
> Combining 30+ years of hospitality & healthcare operational leadership with the power of Vibe Coding (Claude Code, n8n, Notion, & AI) to build automation, digital operating systems, and custom solutions that drive your business's profitability.

**Bridge line (one sentence, shown small below the sub-headline — this is what unifies the two Operational vs Tech pillars without making them feel like two different people):**
> I use code as an operational tool — not an end in itself.

**Proof Strip (stat row, in the design system's `.stat-num` style — large display-font numbers + small mono-font labels. Uses specific figures, not a generic combined claim):**

| Number | Context |
|---|---|
| **70% → 92%** | CSI, SMC Tlogorejo |
| **4.1 → 4.8 ⭐** | Google Review, RS Santa Elisabeth |
| **12x** | Staff income increase, Patuno Resort Wakatobi |
| **33 years** | Field experience (1993–present) |

**Achievement badges (horizontal row, design system `.tag` style — uppercase, wide letter-spacing):**
- 30+ Years Industry Experience
- Certified Trainer & Assessor — TAFE Queensland, Australia
- Certified Virtual Assistant — Singapore

**CTA:**
- Primary: "Try My Calculator Demo" → smooth scroll to §3.2
- Secondary: "Consult with Win" → WhatsApp/LinkedIn

---

### 3.2 Interactive Playground — Food Cost & Margin Calculator

A fully functional widget, not a mockup. This is the site's core *proof of work*.

**Inputs:**
| Field | Type | Default |
|---|---|---|
| Menu Item Name | Text | "Kopi Susu Gula Aren" (Palm Sugar Milk Coffee) |
| Target Food Cost % | Slider/Input, 10–50% | 30% |
| Target Selling Price | Number (Rp) | 25,000 |
| Ingredients Table (dynamic, add/remove rows) | — | — |
| &nbsp;&nbsp;↳ Ingredient Name | Text | "UHT Milk" |
| &nbsp;&nbsp;↳ Purchase Price | Number (Rp) | — |
| &nbsp;&nbsp;↳ Package Volume | Number (ml/g) | — |
| &nbsp;&nbsp;↳ Quantity Used | Number (ml/g) | — |
| &nbsp;&nbsp;↳ Yield % | Number | 100 |

**Formula (implement exactly):**
```
Cost Per Unit           = Purchase Price / Package Volume
Effective Cost           = (Cost Per Unit × Quantity Used) / (Yield / 100)
Total Food Cost (COGS)   = Σ Effective Cost
Actual Food Cost %       = (Total Food Cost / Target Selling Price) × 100%
Gross Profit             = Target Selling Price − Total Food Cost
Gross Profit Margin %    = (Gross Profit / Target Selling Price) × 100%
Recommended Selling Price = Total Food Cost / (Target Food Cost % / 100)
```

**Output (KPI Cards):**
- Total COGS (Rp)
- Actual Food Cost Ratio % + status badge:
  - 🟢 HEALTHY MARGIN — Actual ≤ Target
  - 🟡 WARNING — Target < Actual ≤ Target+5%
  - 🔴 CRITICAL MARGIN — Actual > Target+5%
- Ideal Recommended Selling Price (Rp)

*Credibility context for supporting copy around the widget:* this calculator is directly inspired by Win's P&L and cost-ratio analysis work at Hanania Kitchen and Brew — not a generic template.

---

### 3.3 Case Studies

Restructured into **two pillars**, aligned with the Dual Competency Grid (§3.4) — not a flat list. Each case study uses the format: **Starting Condition → Solution → Result**. The combined figures (25%→98% engagement, 65%→90% CSI, 4.1→4.8⭐) used in earlier drafts are now **broken out per hospital** below — far more credible, since each hospital has genuinely different challenges and results, rather than the same generic number repeated three times.

#### Pillar A — Healthcare Service Culture Transformation
*(3 mini case studies, shown as sub-tabs or an accordion within one group)*

---

**A1. SMC Tlogorejo Hospital, Semarang**
*An ambitious hospital aiming for hotel-grade standards — a large-scale culture transformation that ended in a double-digit CSI jump.*

| | |
|---|---|
| **Client** | Private hospital under a religious foundation, 1,800–2,000 staff |
| **Period** | March 2015 – May 2016 (1.5 years) |

- **Starting Condition:** The hospital was expanding with a new building and wanted to deliver service on par with international hotel standards. Across every level of staff and doctors — despite the hospital's long history — a comprehensive Service Excellence refresher was needed.
- **Solution:** Designed and led Train-the-Trainer, Leadership, and Effective Communication training for the full chain of command, from Directors down to Persons-in-Charge (PICs). Coached these leaders directly to cascade **SMART Care** training to all staff in stages.
- **Result:** **CSI rose from 70% → 92%.** Engagement with patients, families, and visitors improved; teamwork across departments and wards got better. Modules applied: *People* & *Process*.

---

**A2. RSUD Rembang (Regional Public Hospital)**
*A government hospital with a bureaucratic mindset — proof that systemic change matters more than instant numbers.*

| | |
|---|---|
| **Client** | Government hospital, 1,000–1,300 employees |
| **Period** | May 2016 – December 2017 (1.5 years) |

- **Starting Condition:** The classic challenges of a government institution — a "work until retirement" mindset, low work motivation, a non-functioning reward-and-punishment system, and very weak frontline leadership.
- **Solution:** Applied the same SMART Care framework used at Tlogorejo, plus intensive one-on-one coaching for every leader to help them drive their own staff's self-awareness and improvement — not just issue top-down instructions. Also overhauled the patient reservation system, which previously required walk-ins only, splitting it into a phone/customer-service channel and WhatsApp.
- **Result:** CSI improvement here was more gradual than at the other two hospitals — clear evidence that shifting a bureaucracy takes longer than shifting a private institution. But the structural changes put in place proved more durable: **RSUD Rembang is now recognized as one of the best-performing regional public hospitals in Indonesia**, with a far more modern reservation experience. Modules applied: *People*, *Process*, partial *Product*.

---

**A3. Santa Elisabeth Hospital**
*A nearly century-old hospital with Dutch-era discipline — the fastest and most satisfying result of the three.*

| | |
|---|---|
| **Client** | Private hospital under a religious foundation, founded during the Dutch colonial era (~100 years old) |
| **Period** | November 2023 – November 2024 (1 year) |

- **Starting Condition:** Work standards inherited across generations from the era of Dutch nuns — highly disciplined, but rigid in its approach to service. Google Review rating stood at just **4.1 stars** (November 2023), signaling significant service-side complaints despite high operational discipline.
- **Solution:** The same SMART Care framework, run with the highest intensity of individual coaching — working directly and consistently with the Directors and Head Sisters.
- **Result:** **Google Review rose from 4.1 → 4.8 stars** within a single year. Engagement between superiors and subordinates rose sharply, and teamwork strengthened as a result. Only the *People* module was applied — but its execution was the most consistent of the three hospitals, producing the most satisfying overall outcome.

---

#### Pillar B — Hospitality & Business Operations

**B1. Operational Digitalization — Hanania Kitchen and Brew**
- **Client:** Hanania Kitchen and Brew, Semarang (current role)
- **Starting Condition:** Complex multi-outlet coordination, margin leakage from food waste, and hard-to-track utility cost fluctuations (LPG).
- **Solution:** Rather than force generic software onto the business, Win engineered three proprietary tools to protect margins: the **Staggered Shift Payroll Optimizer** (maps every staggered shift across outlets to erase silent payroll waste from over- and under-staffing), the **Menu Engineering Worksheet** (scores every dish by real contribution margin, exposing which items earn the profit and which quietly bleed it), and the **Food Cost & Margin Calculator** (sets the ideal selling price for any menu item in seconds — the same engine running live on this page).
- **Result:** Margins are now protected, warehouse audit transparency has improved, and management's administrative time has been significantly cut.

**B2. Resort Incentive Redesign (The 12x Earnings Formula)**
- **Client:** Patuno Resort Wakatobi (GM, Mar 2013–May 2014)
- **Starting Condition:** High staff turnover caused by an opaque service-charge and incentive distribution system.
- **Solution:** Designed a performance-based incentive scheme built on an automated, transparent worksheet available to every level of staff.
- **Result:** Staff service-charge earnings increased **12x (Rp 75,000 → Rp 900,000/month)**, turnover declined, and the resort's net profit margin was preserved.

---

### 3.4 Dual Competency Grid

Side-by-side, in the design system's grid style (2 aligned columns):

| Operational & People Leadership | Vibe Coding & Tech Stack |
|---|---|
| Cafe, Restaurant & Resort Operations | AI Development — Vibe Coding via Claude Code & OpenClaw |
| SOP & Operational Policy Development | Workflow Automation — n8n, Google Workspace |
| Financial P&L & Cost Ratio Control | Custom Notion Databases & Digital Operating Systems |
| Purchasing & Inventory Audits | AI-assisted Reporting & Prompt Engineering |
| Recruitment, Onboarding, Performance Management | Certified Virtual Assistant — Lead Gen & Social Media (Singapore) |
| Certified Master Trainer & Assessor (TAFE Queensland) | LMS/Platform Operations (AJAR Media, 2018–2022) |

---

### 3.5 About — "Meet Win Winarno"

A linear narrative, best visualized as a vertical timeline (fits the design system's hairline aesthetic):

```
1993  Bellboy & Telephone Operator — Puri Garden Hotel Semarang
1996  Assistant Front Office Manager — Ibis Rajawali Surabaya
2000  Duty Manager — Novotel Bogor
2002  Night Manager — Ciputra Hotel Semarang
2006  Food Court Manager — Ciputra Mall Semarang
2007  Front Office Manager — Legian Beach Bali / Sentosa Private Villa & Spa / Harris Tuban Bali
2010  Butler — Raffles Makkah Palace, Saudi Arabia
2012  Duty Manager — JW Marriott Surabaya
2013  General Manager — Patuno Resort Wakatobi (12x incentive redesign)
2014  Pre-Opening GM — Rumah Kito Resort, Jambi
2015  Independent HR & Operations Consultant — 6 hospital clients across Central Java
2018  Head of Operation — AJAR Media Digital (hospitality LMS, cross-country partnerships)
2023  HR & Operations Consultant — Hanania Kitchen and Brew
2026  Operational Manager — Hanania Kitchen and Brew (present)
      + Mastered Vibe Coding: building his own systems & web apps
```

**Closing paragraph (personal tone):**
> From Bellboy in 1993 to an Operational Manager building his own digital systems — this journey was never about changing professions. It was about continually finding the most effective tool to solve real operational problems. Today, that tool is code.

---

### 3.6 Contact

- Message form (name, email, country + phone number with flag picker, message) — delivered straight to Gmail via an open-source PHP endpoint (PHPMailer/SMTP), no paid service

---

## 4. Additional Content Ideas (Optional — Phase 2)

From the supporting brainstorming documents, there are a few *product-thinking* ideas that could reinforce Win's positioning as not just "a developer who can code" but "an operator who can design digital products." These could become a separate **"Product Concepts"** section, or be deferred to v2 of the site:

- **Hotel Rate Shopper SaaS** — a concept tool for monitoring competitor OTA pricing (Traveloka/Tiket.com/Booking.com) for independent hotels, born from Win's experience as a GM
- **AI-Driven Google Review Management SaaS** — a concept tool for auto-drafting review replies with "Hospitality" vs "Healthcare" modes (empathy & medical privacy), born from the CSI 65%→90% track record

**Recommendation:** don't fold this into v1 of the portfolio (risks making the site feel cluttered / not yet backed by real execution proof). Keep it as a separate draft "Lab" / "Ideas" page for if and when one of these concepts actually starts being built.

---

## 5. Tech Stack Decision (Final)

**Final stack: React (Vite) + TypeScript + Tailwind CSS + react-router** (v8, added when the immersive Web Project page `/web-project` was built as a separate route — see §3.6/Case Studies). TanStack Query is not used (no server-side data to cache); TanStack Router is not used since routing needs are just two simple routes.

## 6. Condensed Instructions for Claude Code

```text
Build a complete, responsive single-page portfolio website in React (Vite) + TypeScript
+ Tailwind CSS for Win Winarno, a "Hospitality & Healthcare Tech-Operator".

Design system: dark/light mode via data-theme attribute + prefers-color-scheme,
3-state toggle (System/Dark/Light). Font-display for headlines/stat numbers,
font-mono for body/UI. Accent color: emerald/teal (desaturated in light mode).
Hairline borders (1px), uppercase wide-letter-spacing labels, generous whitespace,
reveal-on-scroll animations with prefers-reduced-motion guard.

Sections (in order): Hero, Interactive Food Cost Calculator (fully functional,
formulas as specified), Case Studies (Pillar A: 3 hospital case studies, tabbed,
Starting Condition→Solution→Result; Pillar B: Hanania & Patuno Resort),
Dual Competency Grid, About/Timeline, Contact form.

Use all copy and data exactly as provided in the content brief. Do not invent
additional statistics. Mobile-first, production-ready code.
```

---

*Compiled from: Win Winarno's official CV, the `claude-code-portfolio-spec.md` brief, `The Vibe Coding Portfolio Framework`, `Win Winarno Strategic Portfolio and Food Cost Calculator Design`, `Revitalizing Healthcare Culture` case study, the case study detail document (`Studi_Kasus.docx`), and the previously audited CodePen design system. Other SaaS idea drafts (Rate Shopper, Google Review AI) are kept as Phase 2 notes and are not part of the v1 structure.*
