# Creative Canvas ownership

- This repository owns the canvas, base upload node, shared controls, theme, fonts, and auxiliary gallery. Do not add business-generation dependencies.
- Keep `DAELAB.MediaUpload`, serialized slot indices, material JSON, and `daelabCreativeCanvasV1` compatible with existing workflows.
- For frontend tasks, use the task-to-section table in [Frontend and interaction standards](docs/architecture/FRONTEND_INTERACTION.md); read only the relevant sections and linked contracts. Installation and pure backend tasks do not require the full UI specification. Access business panels only through the public adapter API. ComfyTV is read-only upstream.
- Reuse `web/creative_button.mjs`, `web/creative_field.mjs`, `web/creative_theme.css` and `web/creative_panel_state.mjs`. Owned panels must collapse and restore in inactive/active modes. Business packages retain their own App Mode handling.
- Every frontend change needs actual ComfyUI inspection of two instances, overflow/focus, mode switching, save/reload, and relevant zoom/viewports. A gallery build or pure test is not product acceptance.
- Test both standalone and optional combined installation when changing integrations. Never submit paid generation merely to validate the canvas.

- Use the shared Slot interaction and visual baseline in [Interfaces and wires](docs/architecture/FRONTEND_INTERACTION.md#接口与连线); adapters declare capabilities, not separate port gestures or styling.
