import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatPrice, formatKm, carImage } from "@/lib/format";

// Adapted from the shadcn "testimonial-card" pattern (avatar + name/handle
// header, text body below) but repurposed for a vehicle: the photo replaces
// the avatar as the dominant element, price/spec text replaces the quote,
// and a small Avatar is kept as an "Auto BHJ controle" trust badge instead
// of a person's photo -- there is no real customer testimonial content to
// show here, only real stock data.
export interface VehicleCardProps {
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
  className?: string;
}

export function VehicleCard({ car, href, className }: VehicleCardProps) {
  return (
    <a
      href={href}
      className={cn(
        "vehicle-card",
        "flex w-[260px] shrink-0 flex-col overflow-hidden rounded-lg border-t",
        "bg-gradient-to-b from-muted/50 to-muted/10",
        "text-start",
        "hover:from-muted/60 hover:to-muted/20",
        "sm:w-[300px]",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={carImage(car)}
          alt={`${car.brand} ${car.model}`}
          className="h-full w-full object-cover"
        />
        <span className="absolute right-3 top-3 rounded bg-signal px-3 py-1.5 text-sm font-semibold text-white shadow-[0_2px_0_rgba(0,0,0,0.35)]">
          {formatPrice(car.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <h3 className="text-md font-semibold leading-tight text-foreground">
            {car.brand} {car.model}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {car.year} &middot; {formatKm(car.mileage)} &middot; {car.fuel}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-2 border-t border-white/10 pt-3">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-signal text-[11px] font-semibold text-white">
              AB
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Vehicule controle Auto BHJ
          </span>
        </div>
      </div>
    </a>
  );
}
