import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { epitrochoidPath } from "@/lib/guilloche";

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
};

export const OG_IMAGE_ALT = `${siteConfig.legalName} — Online Banking`;

const MARK_PATH = epitrochoidPath({ R: 20, r: 3, d: 9 });
const BACKDROP_PATH = epitrochoidPath({ R: 110, r: 9, d: 40 });

export function createSocialCardImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 35%, rgba(16, 185, 129, 0.28), transparent 60%), linear-gradient(145deg, #061510 0%, #0d231c 52%, #064e3b 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle engraved guilloche watermark */}
        <svg
          width="680"
          height="680"
          viewBox="-162 -162 324 324"
          fill="none"
          style={{
            position: "absolute",
            opacity: 0.1,
          }}
        >
          <path d={BACKDROP_PATH} stroke="#6ee7b7" strokeWidth="1.1" />
        </svg>

        {/* Centered clean bank lockup */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #10b981 0%, #059669 55%, #047857 100%)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(167, 243, 208, 0.3)",
            }}
          >
            <svg width="72" height="72" viewBox="-34 -34 68 68" fill="none">
              <path d={MARK_PATH} stroke="#ffffff" strokeWidth="2.1" />
            </svg>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 72,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "#ffffff",
              }}
            >
              {siteConfig.legalName}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#a7f3d0",
              }}
            >
              {"Online Banking"}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE },
  );
}
