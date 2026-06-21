# Pillexis Labs — Brand assets

Drop these into anywhere you need the logo: social profiles, email signatures,
slide decks, partner pages, GitHub repos.

## The logomark (P only)

The bold "P" in a red rounded square. Use this when the **wordmark would be too
small to read** (avatars, favicons, app icons, watermark in corners).

| File | Use case |
|------|----------|
| `logomark.svg`      | Master vector. Use this in code / Figma / anywhere SVG works. |
| `logomark-192.png`  | Small (favicon-adjacent, Slack workspace icon) |
| `logomark-512.png`  | Medium (GitHub org avatar, Twitter/X profile) |
| `logomark-1024.png` | Large (Open Graph fallback, social posts) |

## The wordmark (P + "Pillexis Labs")

Horizontal lockup. Use this **everywhere the logomark alone wouldn't be
recognizable** — headers, email signatures, decks, footers, partner pages.

| File | Background | Use case |
|------|-----------|----------|
| `wordmark-dark.svg` / `wordmark-dark.png`           | Dark (#0a0a0a or similar) | Site headers, dark slide decks, social posts on dark cards |
| `wordmark-light.svg` / `wordmark-light.png`         | Light (white, cream)      | Light slide decks, partner pages, invoices, contracts |
| `wordmark-dark-800.png` / `wordmark-light-800.png`  | half-size raster          | Email signatures (≤ 600px wide) |

## Colors

| Token | Value | Use |
|-------|-------|-----|
| Brand red | `#FF6363` | Logomark fill, accents |
| Brand red (hot) | `#FF4D4D` | Hover / press states |
| Peach | `#FFA48A` | Gradient highlights |
| Background dark | `#0a0a0a` | Primary background |
| Text white | `#F5F5F7` | Primary text on dark |

## Don't

- ❌ Don't change the bowl proportions or the radius of the rounded square
- ❌ Don't put the dark wordmark on a busy red background
- ❌ Don't squeeze the wordmark — keep the aspect ratio (4:1 for the standard lockup)
- ❌ Don't recolor the P. The mark is always white-on-red.

## Source of truth

These files are generated from `logomark.svg`. If you need to tweak the mark
itself (geometry, color), edit the master SVG and re-export with:

```bash
# from /website
rsvg-convert -w 192  -h 192  public/brand/logomark.svg -o public/brand/logomark-192.png
rsvg-convert -w 512  -h 512  public/brand/logomark.svg -o public/brand/logomark-512.png
rsvg-convert -w 1024 -h 1024 public/brand/logomark.svg -o public/brand/logomark-1024.png

# then re-export favicon set + wordmarks similarly
```
