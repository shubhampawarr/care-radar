/**
 * The window frame that every crystal stage sits inside.
 *
 * Lifted out of StageSystem unchanged. It was exported from there, which
 * meant the Journey stage — which needs the frame and nothing else from that
 * file — pulled in the mode selector, its copy and framer-motion along with
 * it. Mounting the Journey on the employer page made that cost visible.
 * Behaviour is identical; only the address changed.
 */

/**
 * The window frame, present from the very first stage.
 *
 * This is the quiet move that makes the later opening work. If the frame only
 * appeared when it was needed, the opening would be a reveal — a thing the site
 * does. Because it has been sitting at the edge of every stage since the top of
 * the page, the opening is instead something the reader was always looking at.
 */
export function FrameEdge({ opacity = 1 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ opacity }}
    >
      {/* Outer reveal — the depth of the frame against the glass. */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(129,178,200,0.14), inset 0 0 130px 6px rgba(2,10,18,0.4)",
        }}
      />
      {/* Head, sill and jambs. Anodised, catching the same light as the pane. */}
      <div
        className="absolute inset-x-0 top-0 h-[10px] md:h-[14px]"
        style={{
          background:
            "linear-gradient(180deg, #16303f 0%, #0d2233 55%, rgba(13,34,51,0) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[14px] md:h-[20px]"
        style={{
          background:
            "linear-gradient(0deg, #16303f 0%, #0d2233 55%, rgba(13,34,51,0) 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 left-0 w-[10px] md:w-[14px]"
        style={{
          background:
            "linear-gradient(90deg, #16303f 0%, #0d2233 55%, rgba(13,34,51,0) 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[10px] md:w-[14px]"
        style={{
          background:
            "linear-gradient(270deg, #16303f 0%, #0d2233 55%, rgba(13,34,51,0) 100%)",
        }}
      />
    </div>
  );
}
