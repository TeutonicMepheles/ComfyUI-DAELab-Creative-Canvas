# Creative Canvas ownership

- This repository owns the canvas, base upload node, shared controls, theme, fonts, and auxiliary gallery. Do not add business-generation dependencies.
- Keep `DAELAB.MediaUpload`, serialized slot indices, material JSON, and `daelabCreativeCanvasV1` compatible with existing workflows.
- Read `docs/adapter-contract.md` and `docs/architecture/CONTRIBUTING_CONTROLS.md` before frontend changes. Access business panels only through the public adapter API. ComfyTV is read-only upstream.
- Reuse `web/creative_button.mjs`, `web/creative_field.mjs`, `web/creative_theme.css` and `web/creative_panel_state.mjs`. Owned panels must collapse and restore in inactive/active modes. Business packages retain their own App Mode handling.
- Use scoped Material Design 3 tokens and bundled Alibaba PuHuiTi 3 fonts. Preserve original WOFF2 bytes, manifests, and third-party notices. Icons use bundled Remix assets.
- Every frontend change needs actual ComfyUI inspection of two instances, overflow/focus, mode switching, save/reload, and relevant zoom/viewports. A gallery build or pure test is not product acceptance.
- Test both standalone and optional combined installation when changing integrations. Never submit paid generation merely to validate the canvas.
