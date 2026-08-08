type WordmarkTone = "light" | "dark";

/**
 * Two-colour CareRadar wordmark, matching the logo: "Care" in brand teal,
 * "Radar" in brand navy.
 *
 * On dark surfaces the navy is not legible, so the "dark" tone uses the
 * brighter teal already used for accents on the navy footer plus white for
 * "Radar".
 *
 * Typography (size, weight, tracking) is intentionally left to the caller.
 */
const toneClasses: Record<WordmarkTone, { care: string; radar: string }> = {
  light: { care: "text-[#08a99d]", radar: "text-[#08264a]" },
  dark: { care: "text-[#10c4b6]", radar: "text-white" },
};

type WordmarkProps = {
  tone?: WordmarkTone;
};

export default function Wordmark({ tone = "light" }: WordmarkProps) {
  const colors = toneClasses[tone];

  return (
    <>
      <span className={colors.care}>Care</span>
      <span className={colors.radar}>Radar</span>
    </>
  );
}
