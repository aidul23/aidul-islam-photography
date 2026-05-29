/** WebP thumbnail path for a full-size image under /images/ */
export function toThumbPath(src: string): string {
  const relative = src.replace(/^\/images\//, "");
  const withoutExt = relative.replace(/\.[^/.]+$/, "");
  return `/images/thumbs/${withoutExt}.webp`;
}

/** Gallery grid: prefer lightweight thumb; lightbox uses full `src`. */
export function galleryImageSrc(photo: { src: string; thumb?: string }): string {
  return photo.thumb ?? toThumbPath(photo.src);
}
