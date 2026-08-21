import { cn } from "@/lib/utils";
import { VehicleCard } from "@/components/ui/vehicle-card";
import { DotPattern } from "@/components/ui/dot-pattern";

// Adapted from the shadcn/21st.dev "testimonials-with-marquee" pattern:
// same infinite marquee mechanic (4x-repeated set, pause on hover, edge
// fade), but showing real stock vehicles instead of customer testimonials
// -- there was no real review content to put here, only real car data.
export interface VehiclesMarqueeSectionProps {
  title: string;
  description: string;
  vehicles: Array<{
    car: {
      reference: string;
      brand: string;
      model: string;
      year: number;
      mileage: number;
      price: number;
      fuel: string;
      imageUrl?: string;
    };
    href: string;
  }>;
  className?: string;
}

export function VehiclesMarqueeSection({
  title,
  description,
  vehicles,
  className,
}: VehiclesMarqueeSectionProps) {
  if (!vehicles.length) return null;

  return (
    <section className={cn("relative overflow-hidden bg-background text-foreground", "px-0 py-16 sm:py-24", className)}>
      <DotPattern className="dot-pattern-dark" />
      <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col items-center gap-4 px-4 text-center sm:gap-12">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <h2 className="max-w-[720px] text-3xl font-semibold leading-tight sm:text-4xl">
            {title}
          </h2>
          <p className="max-w-[600px] text-base font-medium text-muted-foreground sm:text-lg">
            {description}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="vehicles-marquee-viewport w-full p-2">
            <div className="vehicles-marquee-track">
              {[...Array(4)].map((_, setIndex) =>
                vehicles.map((vehicle, i) => (
                  <VehicleCard
                    key={`${setIndex}-${i}`}
                    car={vehicle.car}
                    href={vehicle.href}
                  />
                ))
              )}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/4 bg-gradient-to-r from-background sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/4 bg-gradient-to-l from-background sm:block" />
        </div>

        <div className="nv-footer-cta mt-0">
          <a className="nv-stock-button" href="/stock">
            Voir tous nos vehicules
          </a>
        </div>
      </div>
    </section>
  );
}
