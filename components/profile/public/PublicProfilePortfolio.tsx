"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/types/user";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

function normalizePortfolio(user: UserProfile) {
  return Array.isArray(user.portfolio)
    ? user.portfolio
        .map((item) => ({
          title: typeof item?.title === "string" ? item.title.trim() : "",
          description:
            typeof item?.description === "string" ? item.description.trim() : "",
          url: typeof item?.url === "string" ? item.url.trim() : "",
          images: Array.isArray(item?.images)
            ? item.images
                .map((img) => (typeof img === "string" ? img.trim() : ""))
                .filter(Boolean)
            : [],
        }))
        .filter((item) => item.title && (item.url || item.images.length > 0))
    : [];
}

export function PublicProfilePortfolio({ user }: { user: UserProfile }) {
  const portfolio = normalizePortfolio(user);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const activeImages = useMemo(() => {
    if (activeItemIndex == null) return [] as string[];
    return portfolio[activeItemIndex]?.images || [];
  }, [activeItemIndex, portfolio]);

  const closeViewer = () => {
    setActiveItemIndex(null);
    setActiveImageIndex(0);
  };

  const openViewer = (itemIndex: number, imageIndex: number) => {
    setActiveItemIndex(itemIndex);
    setActiveImageIndex(imageIndex);
  };

  const showPrev = () => {
    if (activeImages.length <= 1) return;
    setActiveImageIndex((prev) =>
      prev === 0 ? activeImages.length - 1 : prev - 1
    );
  };

  const showNext = () => {
    if (activeImages.length <= 1) return;
    setActiveImageIndex((prev) =>
      prev === activeImages.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    if (activeItemIndex == null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeItemIndex, activeImages.length]);

  if (portfolio.length === 0) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Portfolio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {portfolio.map((item, idx) => {
            const previewImages = item.images.slice(0, 4);
            const showMoreOnLast = previewImages.length > 0;
            const hiddenCount = Math.max(item.images.length - previewImages.length, 0);

            return (
              <div key={`${item.title}-${idx}`} className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>

                {item.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {previewImages.map((src, imageIdx) => (
                      <button
                        type="button"
                        key={`${src}-${imageIdx}`}
                        onClick={() => openViewer(idx, imageIdx)}
                        className="relative h-28 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100 text-left"
                        aria-label={`Open portfolio image ${imageIdx + 1}`}
                      >
                        <Image
                          src={src}
                          alt={`${item.title} image ${imageIdx + 1}`}
                          fill
                          className="object-cover"
                          sizes="176px"
                        />

                        {showMoreOnLast && imageIdx === previewImages.length - 1 ? (
                          <div className="absolute inset-0 bg-slate-900/55 flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {hiddenCount > 0 ? `+${hiddenCount} Show more` : "Show more"}
                            </span>
                          </div>
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : null}

                {item.url ? (
                  <div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-700 hover:text-blue-800 underline break-all"
                    >
                      {item.url}
                    </a>
                  </div>
                ) : null}

                {item.description ? (
                  <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {item.description}
                  </p>
                ) : null}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {activeItemIndex != null && activeImages.length > 0 ? (
        <div className="fixed inset-0 z-50 bg-black/90">
        <button
          type="button"
          onClick={closeViewer}
          className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          aria-label="Close image viewer"
        >
          <X className="h-6 w-6" />
        </button>

        {activeImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={showPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>

            <button
              type="button"
              onClick={showNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </>
        ) : null}

        <div className="h-full w-full flex items-center justify-center p-6">
          <div className="relative h-[min(80vh,760px)] w-[min(92vw,1280px)]">
            <Image
              src={activeImages[activeImageIndex]}
              alt={`Portfolio image ${activeImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="92vw"
              priority
            />
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-4 py-2 text-sm text-white">
          {activeImageIndex + 1} / {activeImages.length}
        </div>
        </div>
      ) : null}
    </>
  );
}
