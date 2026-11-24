# Tracking Theme 03 — Figma Source Notes

This theme is a separate standalone implementation. It does not share styles or scripts with `order-tracking` or `order-tracking-fashion`.

## Source frame

- Figma frame: `Version 9` (`2802:9435`)
- Design frame: **1440 × 2934 px**
- Extracted inventory: 474 layers, including 87 text nodes, 27 image nodes and 54 vector nodes.
- Figma design revision included in the supplied bundle: `2425366636762194488`

## Design tokens

- Primary campaign red: `#EB2B31`
- Main text: `#1A1A1A`
- Green shipment completion: `#1FC16B`
- Yellow delivery status: `#DFB400`
- Surface: `#F9F8F8`
- Typography families: Poppins, Inter and Source Sans Pro.
- The normalized tokens are retained in `design-tokens.css`.

## Original assets used

| UI element | Bundle asset | Original dimensions |
|---|---|---:|
| Hero campaign | `image-2760-21028.png` | 2880 × 898 |
| Blue Dart logo | `blue-dart-logo-transparent-1-2802-10094.png` | 316 × 68 |
| Delivery map | `image-4-2802-10054.png` | 1588 × 620 |
| Store video preview | `image-2802-10114.png` | 784 × 656 |
| Shopping bag visual | `pngtree-3d-shopping-bag-empty-18739972-1-2802-10109.png` | 357 × 320 |
| Bottom campaign banner | `bg-2802-10189.png` | 2628 × 624 |
| Product image 1 | `image-2802-10141.png` | 659 × 640 |
| Product image 2 | `image-2802-10147.png` | 659 × 640 |
| Product image 3 | `image-2802-10155.png` | 781 × 660 |
| Product image 4 | `image-2802-10161.png` | 659 × 640 |

The supplied ZIP is the source of these assets. The page no longer requests the ZIP at runtime. `app.js` maps each referenced filename to its original Figma-exported image URL, removing the broken repository-root ZIP dependency. Images load directly in the browser; if an upstream Figma asset URL becomes unavailable, the mapping can be switched to locally hosted repository assets.

## Page sections

1. Store header and navigation
2. Promotional offer strip
3. Red campaign hero and tracking lookup form
4. Shipment delivery summary
5. Six-step progress timeline
6. Scrollable tracking history table
7. Delivery map
8. Order details, shopping promotion and store preview
9. Product recommendations
10. Bottom campaign CTA and footer

## Tracking data

The values currently shown are demonstration content from the supplied visual reference. The lookup form validates input and scrolls to the preview result; it does not make a live carrier/API request. Connect a tracking endpoint before using this as a production tracking service.
