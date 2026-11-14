import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { CMS } from "./client";
import type { CmsImage } from "./types";

/**
 * URLs for images uploaded to the CMS.
 *
 * These images stay on Sanity's CDN and deliberately do not go through
 * next/image: the site is statically exported with `images.unoptimized`, so the
 * Next optimizer never runs. Asking the CDN for the crops instead (it can
 * resize, recompress and serve AVIF/WebP) gives a real srcset, which
 * `unoptimized` would otherwise take away.
 *
 * The URLs are built with @sanity/image-url rather than by hand, for one
 * reason: the hotspot. Both image fields in the Studio schema enable it, so an
 * author can mark the part of a picture that must survive cropping — and honour
 * it is something only the builder does, by turning the stored hotspot and crop
 * into the right `rect`/`fp-x`/`fp-y` parameters. Hand-rolled URLs had to fall
 * back to `crop=entropy`, which guesses, and cheerfully guesses wrong on the
 * 1:1 crops the index cards ask for.
 */

// The builder needs no client, only the coordinates: it is pure URL assembly
// with no network access, which is why it can run during a static export.
const builder = createImageUrlBuilder({
  projectId: CMS.projectId,
  dataset: CMS.dataset,
});

interface Transform {
  width?: number;
  height?: number;
  quality?: number;
  /**
   * Crop to the requested box around the image's point of interest. Needed by
   * fixed-ratio cards, where the original can have any shape.
   */
  crop?: boolean;
}

/**
 * The shape the builder expects. The GROQ projection flattens the asset to a
 * bare reference (see queries.ts), so it is rebuilt here.
 */
function toSource(image: CmsImage): SanityImageSource {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: image.ref },
    ...(image.hotspot ? { hotspot: image.hotspot } : {}),
    ...(image.crop ? { crop: image.crop } : {}),
  };
}

export function imageUrl(
  image: CmsImage,
  { width, height, quality = 80, crop = false }: Transform = {},
): string | null {
  if (!image.ref) return null;

  let url = builder.image(toSource(image)).quality(quality).auto("format");
  if (width) url = url.width(width);
  if (height) url = url.height(height);
  if (crop) {
    // `focalpoint` is what makes the hotspot count; without a hotspot on the
    // asset the builder falls back to the centre of the image.
    url = url.fit("crop").crop("focalpoint");
  }

  return url.url();
}

/**
 * Candidates for a srcset. They stop at the original's width: asking the CDN to
 * upscale costs bytes and buys nothing.
 *
 * `ratio` (width/height) is for fixed-ratio crops: each candidate's height is
 * derived from its width, so every variant has the same shape and the layout
 * does not shift depending on which one the browser picks.
 */
export function imageSrcSet(
  image: CmsImage,
  widths: number[],
  {
    ratio,
    ...transform
  }: Omit<Transform, "width" | "height"> & { ratio?: number } = {},
): string | undefined {
  const max = image.width ?? Infinity;
  const usable = widths.filter((w) => w <= max);
  const selected = usable.length > 0 ? usable : [Math.min(...widths, max)];

  const entries = selected
    .map((w) => {
      const url = imageUrl(image, {
        ...transform,
        width: w,
        height: ratio ? Math.round(w / ratio) : undefined,
      });
      return url ? `${url} ${w}w` : null;
    })
    .filter((entry): entry is string => entry !== null);

  return entries.length > 0 ? entries.join(", ") : undefined;
}

/** The original's aspect ratio, used to reserve space and avoid layout shift. */
export function aspectRatio(image: CmsImage): number | undefined {
  if (!image.width || !image.height) return undefined;
  return image.width / image.height;
}
