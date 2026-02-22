# Social Media Best Practices

Reference guide for generating effective social media posts. Claude should consult this when creating marketing assets.

## General Principles

- **Visual hierarchy**: One focal point per image. Don't compete for attention.
- **Readability**: Text should be legible at mobile size. Minimum ~28px for body text on a 1080px canvas.
- **Contrast**: Ensure text passes WCAG contrast ratios against backgrounds. Use overlays on photos.
- **Breathing room**: Don't fill every pixel. White space (or dark space) makes content feel premium.
- **Brand consistency**: Same fonts, colors, and tone across all posts for a brand.

## Instagram

### Feed Posts (1080x1080 or 1080x1350)
- Portrait 1080x1350 gets more screen real estate in the feed — prefer it over square
- Keep text within the center 900px to avoid edge clipping on some devices
- First slide of a carousel is the hook — make it stop the scroll
- Use 5-10 slides for carousels. Each slide should stand alone but flow as a story.
- End with a CTA slide (follow, download, visit link, etc.)

### Carousel Best Practices
- **Slide 1**: Bold hook — big text, striking visual, or provocative question
- **Slides 2-4**: Value delivery — tips, features, story progression
- **Last slide**: CTA — tell them exactly what to do next
- Maintain visual continuity across slides (same background style, colors, position of elements)
- Add slide indicator dots for context

### Stories/Reels (1080x1920)
- Safe zone: Keep critical content within center 1080x1420 area (top/bottom are covered by UI)
- Top 200px: Often covered by username/camera icons
- Bottom 250px: Swipe-up area, sticker tray
- Use full-bleed photos/backgrounds
- Text should be large and punchy — people swipe fast

## Twitter/X (1200x675)
- 1.91:1 aspect ratio
- Images get cropped in timeline — keep focal point centered
- Less text is more — tweets with images already get 150% more engagement
- Dark backgrounds tend to pop more in the feed
- Logo placement: bottom-right corner, subtle

## Facebook (1200x630)
- Similar to Twitter but slightly taller
- Text overlay should be under 20% of image area (old rule but still good practice)
- High-contrast images perform better
- Include faces when possible — 38% more engagement

## LinkedIn (1200x627)
- Professional tone, clean design
- Data visualizations and infographics perform well
- Use brand colors consistently
- Text-heavy posts are acceptable here (unlike Instagram)

## App Store Screenshots

### iOS (1320x2868)
- First 2 screenshots are most important — visible without scrolling
- Show the actual app UI inside a device frame
- Headline above the phone: benefit-focused, not feature-focused
- "Track Your Progress" > "Analytics Dashboard"
- Consistent layout across all screenshots
- 4-6 screenshots is the sweet spot

### Android / Play Store (1080x1920)
- Similar principles to iOS but different device frame
- Feature graphic (1024x500) is the hero banner — make it count
- Feature graphic should work without text (some views crop it)

## Typography Rules for Marketing

### Size Guidelines (on 1080px canvas)
| Element | Minimum Size | Recommended |
|---------|-------------|-------------|
| Headline | 48px | 64-96px |
| Subheadline | 28px | 32-42px |
| Body text | 20px | 24-28px |
| Fine print | 14px | 16-18px |

### Weight Usage
- **Headlines**: Bold, Black, or UltraBlack (700-950)
- **Subtext**: Light or Regular (300-400)
- **Body**: Regular (400)
- **CTAs**: Bold or Black (700-900), uppercase with letter-spacing

### Line Height
- Headlines: 0.95-1.1 (tight)
- Body text: 1.4-1.6 (comfortable)

## Color Tips

- Use 2-3 colors max per asset. Primary bg + accent + text.
- If using a photo background, overlay it with a gradient (60-90% opacity) before placing text
- Gradients: Subtle > dramatic. 5-15% color shift looks premium. Rainbow gradients look amateur.
- Dark backgrounds feel premium and make colors pop
- Neon/bright accents on dark backgrounds is a proven pattern for tech/fitness brands

## Photo Overlays

When placing text over photos:
```css
/* Subtle darkening */
background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%);

/* Bottom fade for text placement */
background: linear-gradient(180deg, transparent 0%, transparent 40%, rgba(0,0,0,0.8) 100%);

/* Moody with color tint */
background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(YOUR_COLOR,0.6) 100%);
```

## CTA Buttons

- Rounded corners (border-radius 50-60px) feel modern
- Padding: generous (20px 48px minimum)
- Contrast: Button color should contrast with both background AND text
- Add subtle box-shadow for depth: `0 4px 20px rgba(0,0,0,0.3)`
- Uppercase + letter-spacing (2-3px) for authority
