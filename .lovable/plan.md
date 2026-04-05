

# Fix Build Error + Add Partnership Section Component

## Two changes needed:

### 1. Fix Build Error in AssistantPage.tsx (line 250)

`NodeJS.Timeout` isn't recognized. Replace with `ReturnType<typeof setInterval>`:

```typescript
let interval: ReturnType<typeof setInterval> | null = null;
```

### 2. Create New PartnershipSection Component + Swap in LandingPage

**Create `src/components/landing/PartnershipSection.tsx`**
- Static section with `id="pricing"` (keeps nav scroll working)
- Title: "Partnership & Pricing"
- Subtitle about tailored compliance solutions
- "Get in Touch" button linking to `https://partners.zestcomply.com` (new tab)
- Styled consistently with other landing sections

**Modify `src/pages/LandingPage.tsx`**
- Replace `PricingSection` import/usage with `PartnershipSection`
- `PricingSection` file stays untouched for future reuse

| File | Action |
|------|--------|
| `src/pages/app/AssistantPage.tsx` | Fix `NodeJS.Timeout` type |
| `src/components/landing/PartnershipSection.tsx` | Create new component |
| `src/pages/LandingPage.tsx` | Swap `PricingSection` → `PartnershipSection` |

