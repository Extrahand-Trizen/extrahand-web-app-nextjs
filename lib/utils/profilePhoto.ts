import { UserProfile } from "@/types/user";

function normalizeUrl(value?: string | null): string {
   return typeof value === "string" ? value.trim() : "";
}

function getCertificateUrls(user?: UserProfile | null): string[] {
   const skills = Array.isArray(user?.skills?.list) ? user.skills.list : [];

   return skills.flatMap((skill) => {
      const certificates = Array.isArray(skill?.certificates)
         ? skill.certificates
         : [];

      return certificates
         .map((certificate) => normalizeUrl(certificate?.documentUrl))
         .filter(Boolean);
   });
}

function looksLikeCertificateUrl(url: string, certificateUrls: string[]): boolean {
   const normalizedUrl = normalizeUrl(url);
   if (!normalizedUrl) return false;

   const loweredUrl = normalizedUrl.toLowerCase();
   if (loweredUrl.includes("/certificates/") || loweredUrl.includes("\\certificates\\")) {
      return true;
   }

   return certificateUrls.some((certificateUrl) => certificateUrl === normalizedUrl);
}

export function getSafeProfilePhotoUrl(user?: UserProfile | null): string | undefined {
   const photoUrl = normalizeUrl(user?.photoURL);
   if (!photoUrl) return undefined;

   const certificateUrls = getCertificateUrls(user);
   if (looksLikeCertificateUrl(photoUrl, certificateUrls)) {
      return undefined;
   }

   return photoUrl;
}
