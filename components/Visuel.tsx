import { Scene, type TypeScene } from "./Scene";

/** Photo en bichromie si elle existe, sinon paysage dessiné. */
export function Visuel({
  photo, scene, alt = "", className = "", graine = 0, priorite = false,
}: { photo?: string | null; scene: TypeScene; alt?: string; className?: string; graine?: number; priorite?: boolean }) {
  if (photo) {
    return (
      <div className={`bichromie h-full w-full ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt={alt} className="h-full w-full object-cover" loading={priorite ? "eager" : "lazy"} />
      </div>
    );
  }
  return <Scene type={scene} graine={graine} className={className} />;
}
