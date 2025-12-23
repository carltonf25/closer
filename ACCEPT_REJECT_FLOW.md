# Accept / Reject Lead Flow – UI Design

This document defines the end‑to‑end UI/UX for how contractors receive, preview, accept, or reject leads. The goal is speed, clarity, and trust — while preventing gaming and minimizing refunds.

---

## Design Principles

- **Speed first**: Contractors should be able to accept a lead in under 5 seconds
- **Control without abuse**: Enough info to decide, not enough to cherry‑pick
- **Transparency**: Price, reason, and quality are always clear
- **Mobile‑first**: Most accepts happen on phones

---

## Screen 1: Lead Notification (SMS / Push / Email)

**Purpose:** Create urgency and drive immediate action

### Notification Content

- Service type (HVAC / Plumbing)
- High‑level location (city or zip)
- Urgency label (Emergency / Same Day / Soon)
- Lead price
- Acceptance countdown

**Example SMS**

```
🔥 New Emergency Plumbing Lead
📍 Austin (78704)
💰 $62
⏱ Accept within 120 seconds
👉 View Lead
```

CTA deep‑links directly to the Lead Preview screen.

---

## Screen 2: Lead Preview (Pre‑Acceptance)

**Purpose:** Allow a confident decision _before_ charging

### Visible Information

- Service requested (plain language)
- City + ZIP (no street address)
- Urgency level
- Property type (SFH, condo, commercial, etc.)
- Lead price
- Lead quality badge

### Lead Quality Badge

- 🔥 Hot – verified & responsive
- 👍 Good – verified, non‑urgent
- 🧊 Cold – researching

Include a small “Why?” tooltip:

> “Verified phone, emergency request, decision maker confirmed”

### Hidden Until Acceptance

- Homeowner name
- Phone number
- Exact address

---

## Screen 3: Acceptance Countdown

**Purpose:** Drive fast decisions and fair routing

### UI Elements

- Countdown timer (e.g. “01:43 remaining”)
- Primary CTA: **Accept Lead**
- Secondary CTA: **Pass**

### Behavior Rules

- Accept → charge immediately and unlock details
- Pass → lead routes to next contractor
- No action → auto‑pass when timer expires

Optional (Pro / Elite tiers):

- Toggle: “Auto‑accept matching leads”

---

## Screen 4: Lead Accepted (Details Unlocked)

**Purpose:** Enable immediate contact

### Newly Revealed Information

- Homeowner full name
- Phone number (tap to call)
- Email address
- Full address

### Action Buttons

- 📞 Call Now
- 💬 Text Homeowner
- 🧭 Open in Maps

### System Message

Displayed prominently:

> “We’ve notified the homeowner that you’ll be contacting them shortly.”

This primes the homeowner to answer.

---

## Screen 5: Post‑Acceptance Summary

**Purpose:** Reinforce value and reduce buyer’s remorse

### Summary Card

- Price charged
- Why this lead was qualified
- Timestamp

Example:

> “This lead was classified as HOT because it was submitted within the last 3 minutes, marked as an emergency, and confirmed via SMS.”

---

## Screen 6: Pass Confirmation (Optional)

**Purpose:** Discourage abuse without adding friction

If a contractor taps **Pass**:

- Optional dropdown: “Why are you passing?”
  - Outside service area
  - Too busy
  - Not my service
  - Other

Used for internal scoring only — never punitive on a single pass.

---

## Screen 7: Follow‑Up Status (Later)

**Purpose:** Improve lead scoring (not refunds)

After X hours or days:

Prompt:

> “Did you make contact with this homeowner?”

Options:

- Contacted & booked
- Contacted, not booked
- No response yet

This data feeds quality scoring and pricing, not refunds.

---

## Anti‑Gaming Safeguards (UX‑Level)

- No contact info shown pre‑acceptance
- Pass‑rate monitoring in the background
- High pass rates reduce routing priority
- Auto‑accept available for trusted contractors

---

## UX Metrics to Monitor

- Time to accept
- Accept vs pass ratio
- Lead response time
- Conversion feedback
- Refund request correlation

---

## Outcome

This flow creates:

- Faster contractor response
- Higher homeowner pickup rates
- Fewer disputes
- Strong perception of fairness and control

The result is higher contractor retention with minimal support overhead.
