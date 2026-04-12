# Site Audit: campopiedaycare.com/daycare

> Audited 2026-04-12 via Playwright MCP

## Color Palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `dark-olive` | `#35392D` | rgb(53, 57, 45) | Primary text, headings |
| `sage-green` | `#B0C997` | rgb(176, 201, 151) | Primary accent, buttons, nav links |
| `light-sage` | `#D6E9B9` | rgb(214, 233, 185) | Nav background, card accents |
| `warm-cream` | `#FAF7D6` | rgb(250, 247, 214) | Page background |
| `gold` | `#EDE0B6` | rgb(237, 224, 182) | Secondary accent, card backgrounds |
| `off-white` | `#FDFBF7` | rgb(253, 251, 247) | Light text on dark bg, card bg |
| `muted-olive` | `#6F7660` | rgb(111, 118, 96) | Secondary/muted text |
| `forest-green` | `#3BA03B` | rgb(59, 160, 59) | Footer background, CTA banner |
| `dark-charcoal` | `#1B1B1B` | rgb(27, 27, 27) | Dark section bg |
| `border-gray` | `#C5C1B9` | rgb(197, 193, 185) | Borders, dividers |

## Typography

| Element | Font Family | Size | Weight | Line Height |
|---------|-------------|------|--------|-------------|
| Body | Nunito, sans-serif | 16px | 400 | 24px |
| H2 (section headings) | Fredoka, sans-serif | 36px | 700 | 40px |
| H3 (card/sub headings) | Fredoka, sans-serif | 18px | 700 | 28px |
| H4 (pricing titles) | Fredoka, sans-serif | 20px | 600 | 28px |
| Nav links | Nunito, sans-serif | 14px | 500 | 20px |
| Small text | Nunito, sans-serif | 12px | 400 | 16px |

## Border Radii

| Token | Value | Usage |
|-------|-------|-------|
| `pill` | 9999px | Buttons, tags |
| `card-lg` | 24px | Large cards |
| `card` | 20px | Standard cards |
| `sm` | 6px | Inputs, small elements |

## Section Inventory (top to bottom)

1. **Top Banner** — Thin bar with announcement text (rescue dogs CTA)
2. **Navigation** — Logo left, links center, two CTA buttons right. Semi-transparent light-sage bg
3. **Hero Image Grid** — Horizontal auto-scrolling carousel of dog photos (20 images, duplicated for infinite loop)
4. **Two Locations** — H2 heading + description, two location cards side by side with image, address, expandable details
5. **Daily Experience** — H2 + 6 timeline phases (Morning Dropoff → Evening Play), each with emoji icon + description
6. **Benefits Grid** — 6 icon cards in 3x2 grid: Mental Stimulation, Supervised Structure, Socialization, Reduced Anxiety, Happy Tired Pups, Rest Breaks
7. **Safety Requirements** — H2 + 6 requirement cards in grid (Bordetella, Rabies, DHPP, Fecal Test, Spayed/Neutered, Temperament Test)
8. **Pricing** — H2 + three tiers: Non-Package (Full Day $55, Half Day $45), Packages (10/20/30 day bundles), Unlimited ($800/mo). Cards with "Book Now" pill buttons
9. **CTA Banner** — Forest-green full-width bar: "Ready to Enroll Your Pup?" + "Get Started" button
10. **Footer** — Dark green bg. 3-column: logo+tagline+socials | locations+contact | rescue info. Copyright bar below

## Layout & Spacing

- **Max content width**: ~1200px centered
- **Section padding**: 64-96px vertical, 16-24px horizontal
- **Card padding**: 24px internal
- **Grid gaps**: 16-24px
- **Cards**: rounded-[20px] or rounded-[24px] with subtle shadow
- **Responsive**: Stacks to single column on mobile (appears to have some gaps in mobile optimization)

## Button Styles

- **Primary CTA**: pill shape, sage-green bg (#B0C997), off-white text, 14px/500 Nunito
- **Get Started**: Forest-green bg (#3BA03B), white text, pill, larger padding
- **Book Now**: Small pill buttons in pricing cards, sage-green bg

## Animations

- Hero section: CSS auto-scrolling horizontal carousel (marquee-style)
- No visible hover animations on buttons (opportunity for improvement)
- Location cards appear to have expand/collapse for details

## Notes for Apex Pet Care Adaptation

- Replace daycare phases with pet sitting/dog walking service descriptions
- Replace location cards with service area info
- Replace safety requirements with pet care requirements (vaccinations, temperament)
- Replace pricing tiers with pet sitting / dog walking / drop-in packages
- Keep the warm, natural color palette — perfect for a pet care brand
- Add hover states to buttons (scale + color shift)
- Tighten line heights on headings for more modern feel
