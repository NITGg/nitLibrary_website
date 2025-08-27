import { Card, CardContent, CardFooter } from "./card";
import { Skeleton } from "./skeleton";

interface GridCardsSkeletonProps {
  count?: number;
  title?: string;
  description?: string;
}

const GridCardsSkeleton = ({ count = 6, title, description }: GridCardsSkeletonProps) => {
  return (
    <section className="p-container min-h-section flex-center flex-col gap-5 w-full">
      {title && <Skeleton className="h-7 w-48" />}
      {description && <Skeleton className="h-5 w-3/4" />}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 w-full">
        {Array.from({ length: count }).map((_, idx) => (
          <SkeletonCard key={`skeleton-card-${idx}-${count}`} />
        ))}
      </div>
    </section>
  );
};

const SkeletonCard = () => {
  return (
    <Card className="relative min-h-[300px]">
      <CardContent className="flex-center flex-col gap-6 p-6">
        {/* Image skeleton */}
        <Skeleton className="w-3/5 aspect-square rounded-md" />

        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4" />

        {/* Footer skeleton */}
        <CardFooter className="w-full">
          <div className="flex-center gap-3 w-full">
            {/* Price/Button skeleton */}
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default GridCardsSkeleton;
