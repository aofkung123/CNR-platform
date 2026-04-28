'use client';

import { useState, useEffect } from 'react';

export interface GalleryItem {
  id:       string;
  imageUrl: string;
  caption:  string | null;
  sortOrder: number;
}

/**
 * Fetch gallery images for a given site+section.
 * Returns DB images if any exist; otherwise returns [] so callers can
 * fall back to their own static arrays.
 */
export function useGallery(site: string, section: string): GalleryItem[] {
  const [images, setImages] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetch(`/api/v1/gallery/public?site=${site}&section=${section}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setImages(data);
        }
      })
      .catch(() => {/* silently fall back to static */});
  }, [site, section]);

  return images;
}
