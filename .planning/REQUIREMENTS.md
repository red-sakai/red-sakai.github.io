# Requirements: jhered.me Portfolio

**Defined:** 2026-07-08
**Core Value:** Provide a fast, visually clean portfolio that showcases Jhered's work and lets visitors explore with a smooth, polished experience.

## v1 Requirements

### Lenis Smooth Scroll

- [ ] **LENIS-01**: Lenis installed via `npm install lenis`
- [ ] **LENIS-02**: Client provider component wraps root layout with `<ReactLenis>` from `lenis/react`
- [ ] **LENIS-03**: Standard config applied (lerp: 0.1, duration: 1.2, smoothWheel: true, autoRaf: true)
- [ ] **LENIS-04**: `prefers-reduced-motion` respected — Lenis skipped when user prefers reduced motion

### Lenis-Driven Reveal Animations

- [ ] **REVEAL-01**: `useRevealOnScroll` refactored to use Lenis `scroll` event instead of IntersectionObserver
- [ ] **REVEAL-02**: Elements revealed when they enter viewport (threshold ~85% from top)
- [ ] **REVEAL-03**: Fire-once behavior preserved — revealed elements stay revealed
- [ ] **REVEAL-04**: Fade-in/slide-up animation styling preserved from current implementation

### Compatibility

- [ ] **COMPAT-01**: Easter-egg pages (`/shell`, `/grub-bootloader`, `/gui-loading`) use `data-lenis-prevent` to allow native scroll
- [ ] **COMPAT-02**: Route changes reset scroll position correctly
- [ ] **COMPAT-03**: Three.js ShapeBlur component works correctly alongside Lenis
- [ ] **COMPAT-04**: Build succeeds (`npm run build`) with no errors or warnings
- [ ] **COMPAT-05**: No lint regressions (`npm run lint` passes)

## v2 Requirements

- **LENIS-06**: Custom speed/easing per section
- **LENIS-07**: Scroll progress indicator driven by Lenis

## Out of Scope

| Feature | Reason |
|---------|--------|
| GSAP integration | Not requested; Lenis scroll events suffice for reveals |
| Parallax effects | Not requested for this iteration |
| Horizontal scroll | Not applicable to this portfolio |
| Scroll snapping | Not requested |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LENIS-01 | Phase 1 | Pending |
| LENIS-02 | Phase 1 | Pending |
| LENIS-03 | Phase 1 | Pending |
| LENIS-04 | Phase 1 | Pending |
| REVEAL-01 | Phase 1 | Pending |
| REVEAL-02 | Phase 1 | Pending |
| REVEAL-03 | Phase 1 | Pending |
| REVEAL-04 | Phase 1 | Pending |
| COMPAT-01 | Phase 1 | Pending |
| COMPAT-02 | Phase 1 | Pending |
| COMPAT-03 | Phase 1 | Pending |
| COMPAT-04 | Phase 1 | Pending |
| COMPAT-05 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-08*
*Last updated: 2026-07-08 after initial definition*
