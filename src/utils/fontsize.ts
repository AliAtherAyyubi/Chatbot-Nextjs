// ─────────────────────────────────────────────
//  Typography Design Tokens
// ─────────────────────────────────────────────

// Fluid font-size scale (rem)
export const fontSize = {
  "2xs":  "0.625rem",   //  10px
  xs:     "0.75rem",    //  12px
  sm:     "0.8125rem",  //  13px
  base:   "0.9375rem",  //  15px
  md:     "1rem",       //  16px
  lg:     "1.125rem",   //  18px
  xl:     "1.25rem",    //  20px
  "2xl":  "1.5rem",     //  24px
  "3xl":  "1.875rem",   //  30px
  "4xl":  "2.25rem",    //  36px
  "5xl":  "3rem",       //  48px
} as const;

export type FontSizeKey = keyof typeof fontSize;

// Line-height companions
export const lineHeight = {
  tight:   "1.2",
  snug:    "1.375",
  normal:  "1.5",
  relaxed: "1.625",
  loose:   "2",
} as const;

// Font-weight scale
export const fontWeight = {
  thin:       "100",
  light:      "300",
  regular:    "400",
  medium:     "500",
  semibold:   "600",
  bold:       "700",
  extrabold:  "800",
  black:      "900",
} as const;

// Letter-spacing
export const letterSpacing = {
  tighter: "-0.05em",
  tight:   "-0.025em",
  normal:  "0em",
  wide:    "0.025em",
  wider:   "0.05em",
  widest:  "0.1em",
  ultra:   "0.2em",
} as const;

// Font-family stacks — loaded via Next.js font
export const fontFamily = {
  display: "'Syne', sans-serif",
  body:    "'DM Sans', sans-serif",
  mono:    "'JetBrains Mono', monospace",
} as const;

// Composite text-style presets (as CSS-in-JS objects)
export const textStyles = {
  displayLg: {
    fontFamily:    fontFamily.display,
    fontSize:      fontSize["4xl"],
    fontWeight:    fontWeight.bold,
    lineHeight:    lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  displaySm: {
    fontFamily:    fontFamily.display,
    fontSize:      fontSize["2xl"],
    fontWeight:    fontWeight.semibold,
    lineHeight:    lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },
  heading: {
    fontFamily:    fontFamily.body,
    fontSize:      fontSize.lg,
    fontWeight:    fontWeight.semibold,
    lineHeight:    lineHeight.snug,
  },
  bodyBase: {
    fontFamily:    fontFamily.body,
    fontSize:      fontSize.base,
    fontWeight:    fontWeight.regular,
    lineHeight:    lineHeight.relaxed,
  },
  bodySmall: {
    fontFamily:    fontFamily.body,
    fontSize:      fontSize.sm,
    fontWeight:    fontWeight.regular,
    lineHeight:    lineHeight.normal,
  },
  label: {
    fontFamily:    fontFamily.body,
    fontSize:      fontSize.xs,
    fontWeight:    fontWeight.medium,
    letterSpacing: letterSpacing.wide,
  },
  code: {
    fontFamily:    fontFamily.mono,
    fontSize:      fontSize.sm,
    fontWeight:    fontWeight.regular,
    lineHeight:    lineHeight.relaxed,
  },
} as const;
