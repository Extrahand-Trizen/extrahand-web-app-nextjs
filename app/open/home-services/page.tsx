import { OpenAppBridgePage } from "@/components/open-app/OpenAppBridgePage";
import { buildHomeServicesDeepLink } from "@/lib/openAppBridge";

export default function OpenHomeServicesPage() {
  return (
    <OpenAppBridgePage
      appDeepLink={buildHomeServicesDeepLink()}
      headline="Opening Home Services in ExtraHand…"
      fallbackUrl="/services"
    />
  );
}
