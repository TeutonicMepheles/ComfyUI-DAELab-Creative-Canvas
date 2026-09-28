# Local media upload

The creative canvas Upload menu creates `DAELAB.MediaUpload`. One node owns one
PNG/JPEG/WebP image or MP4/WebM/MOV video. It uses ComfyUI's local `/upload/image`
multipart endpoint (which accepts arbitrary file bytes), stores a unique input
filename, and persists versioned metadata in `asset_data`. No generation is run.

The frontend reuses `createCreativeButton`, shared theme and bundled fonts, and
the canvas panel lease. Existing table upload/groups were evaluated: their
image-only table ownership is unsuitable for a standalone video source, so the
media panel owns its upload, preview and cancellation lifecycle. The canvas only
selects the declared panel and appropriate sockets. No ComfyTV code is modified.

Outputs: image URL, ComfyTV image collection JSON, video URL, native IMAGE, native
VIDEO. Only outputs matching the uploaded type can be connected in the editor.
Creative canvas projects these as a single `素材` outlet. `creative_connections.mjs`
resolves each target independently to an existing typed slot; stored links and
native graph mode stay compatible. Dropping on a socket selects that exact input;
dropping on a card connects its sole compatible input or opens a role chooser.
Reverse dragging and connection-aware creation use the same resolver. Empty
upload nodes expose one disabled outlet. There is no implicit image/video conversion.

DAELab-owned creative cards now project at most one input and one output, floating
outside their sides. Ports appear on hover, focus or a wire gesture. Hidden-port
wires anchor to the card edge. Upload sources have no artificial input. Upstream
ComfyTV cards and node implementations are unchanged. Multiple incoming edges
resolve to real semantic inputs; occupied inputs require explicit replacement.
This does not introduce an unlimited collection input or concatenate media: a
future group/collection node must define ordering and assembly explicitly.

Creative canvas navigation: wheel pans vertically (trackpad deltaX is preserved),
Shift+wheel pans horizontally, Ctrl+wheel zooms around the pointer. Scrollable
panels retain ordinary wheel scrolling. The canvas captures Ctrl zoom before
leased panels handle their own wheel events.

Ctrl+C/V uses browser clipboard events and a versioned serialized node snapshot.
Editable text keeps native clipboard behavior. Paste creates a fresh graph ID,
detaches edges, preserves widget values and media references, offsets copies near
the pointer, and renews generation request IDs. No generation is submitted.

Middle-button drag pans; left-button drag on empty space selects intersecting
cards. Shift adds to the selection; Shift/Ctrl-click toggles individual cards.
Dragging a selected heading moves the selection together. Clipboard snapshots
preserve relative placement and internal links between selected nodes only.
Delete removes the selected set; Escape cancels an unfinished selection box.
Changing type with existing links is rejected. Unsupported/missing files fail
execution; browser codec failures leave a visible preview error and replacement
action. Workflow JSON stores references, not media bytes; transferring workflows
to another machine also requires the input files.

Acceptance: actual local uploads in two instances, playback, errors, replacement
cancellation, type guards, local downstream execution, mode switching, serialization
and reload. Use isolated ComfyUI on port 8199 without touching the user's workflow.
