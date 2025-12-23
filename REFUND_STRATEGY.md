# Refund Strategy

This document defines the refund policy for the HomeProFinder platform. The strategy is designed to minimize disputes, automate decisions, and protect lead quality while maintaining contractor trust.

---

## Core Refund Philosophy

- Refunds are based on **objective, verifiable criteria only**
- Subjective outcomes (booking success, pricing disagreements) are not refundable
- Rules are visible to contractors before purchase

Target refund rate: **< 5% of delivered leads**

---

## Refundable Scenarios (Auto-Approved)

A refund or credit is issued automatically if the lead meets any of the following conditions:

- Invalid contact information (disconnected or incorrect phone/email)
- Lead location is outside the contractor’s selected service area
- Incorrect service category (e.g., plumbing lead sent to HVAC-only contractor)
- Duplicate lead from the same homeowner within 7 days

These conditions can be validated by system data or logs.

---

## Non-Refundable Scenarios

No refund will be issued for the following reasons:

- Homeowner did not answer the phone
- Homeowner chose another contractor
- Lead was price shopping or collecting quotes
- Job was not booked
- Contractor followed up late or not at all

These outcomes are considered normal business risk.

---

## Refund Request UX Flow

1. Contractor selects “Request Review” on a lead
2. Contractor must choose a reason from a predefined dropdown
3. System evaluates eligibility
   - If criteria match refundable rules → auto-approve
   - If criteria match non-refundable rules → auto-deny

4. Manual review triggered only for ambiguous edge cases

Manual reviews should be rare and time-boxed.

---

## Transparency & Dispute Reduction

- Refund rules are displayed during onboarding
- Refund eligibility is shown before lead acceptance
- Each lead includes a visible quality score and qualification summary

Clear expectations reduce support load and contractor frustration.

---

## Enforcement Notes

- No refunds for non-response or non-booking
- Abuse patterns (excessive refund requests) may trigger throttling or account review
- Refunds are issued as credits by default, not cash

---

## Long-Term Benefits

- Predictable revenue
- Minimal support overhead
- Contractor trust through consistency
- Scalable automation-friendly policy
