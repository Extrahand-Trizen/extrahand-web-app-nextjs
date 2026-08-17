import { OpenAppBridgePage } from "@/components/open-app/OpenAppBridgePage";
import { buildHomeServicesDeepLink } from "@/lib/openAppBridge";

export default function OpenAppRootPage() {
  return (
    <OpenAppBridgePage
      appDeepLink={buildHomeServicesDeepLink()}
      headline="Opening ExtraHand…"
      fallbackUrl="/services"
    />
  );
}
