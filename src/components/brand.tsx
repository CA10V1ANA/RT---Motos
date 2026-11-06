import Link from "next/link";
import { MetallicText } from "./effects/metallic-text";
export function Brand() {
  return (
    <Link href="/" aria-label="RT Motos — início" className="brand">
      <MetallicText>
        R<span className="brand-t">T</span>
      </MetallicText>
      <span className="brand-name">MOTOS</span>
    </Link>
  );
}
