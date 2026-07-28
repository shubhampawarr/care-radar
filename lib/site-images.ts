/** Stock photography bundled under /public/images/stock (Unsplash, free to use). */

export const siteImages = {
  nurseCandidate: {
    src: "/images/stock/nurse-candidate.jpg",
    alt: "Nursing professional in a healthcare setting",
  },
  nurseCare: {
    src: "/images/stock/nurse-care.jpg",
    alt: "Nurse providing hands-on patient care",
  },
  hospitalEmployer: {
    src: "/images/stock/hospital-employer.jpg",
    alt: "Modern hospital corridor and healthcare facility",
  },
  healthcareTeam: {
    src: "/images/stock/healthcare-team.jpg",
    alt: "Healthcare team collaborating in a clinical setting",
  },
  medicalConsultation: {
    src: "/images/stock/medical-consultation.jpg",
    alt: "Healthcare professional in a clinical environment",
  },
  internationalCareer: {
    src: "/images/stock/international-career.jpg",
    alt: "Professionals in a collaborative meeting",
  },
  partnersInstitutions: {
    src: "/images/stock/partners-institutions.jpg",
    alt: "Partners and institutions collaborating together",
  },
  trainingEducation: {
    src: "/images/stock/training-education.jpg",
    alt: "Healthcare training and education session",
  },
  germanyHealthcare: {
    src: "/images/stock/germany-healthcare.jpg",
    alt: "Healthcare professionals working together",
  },
  healthcareFocus: {
    src: "/images/stock/healthcare-focus.jpg",
    alt: "Clinical healthcare environment focused on nursing",
  },
  recruitmentHandshake: {
    src: "/images/stock/recruitment-handshake.jpg",
    alt: "Professional handshake in a business setting",
  },
  documentsPreparation: {
    src: "/images/stock/documents-preparation.jpg",
    alt: "Professional reviewing documents at a desk",
  },
} as const;

export type SiteImageKey = keyof typeof siteImages;

export function resolveImageSrc(src: string, width: number) {
  if (src.startsWith("/")) {
    return src;
  }

  return `${src}?auto=format&fit=crop&w=${width}&q=80`;
}
