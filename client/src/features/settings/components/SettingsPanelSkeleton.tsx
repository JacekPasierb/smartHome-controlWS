import {Skeleton} from "../../../components/ui/Skeleton";

export function SettingsPanelSkeleton() {
  return (
    <div className="panel">
      <Skeleton className="skeletonPanelTitle" />

      <div style={{display: "grid", gap: 14}}>
        <div className="card" style={{display: "grid", gap: 12}}>
          <Skeleton className="skeletonSectionTitle" />
          {Array.from({length: 5}).map((_, index) => (
            <div key={index} style={{display: "grid", gap: 6}}>
              <Skeleton className="skeletonLabel" />
              <Skeleton className="skeletonInput" />
            </div>
          ))}
        </div>

        <div className="card" style={{display: "grid", gap: 12}}>
          <Skeleton className="skeletonSectionTitle" />
          {Array.from({length: 2}).map((_, index) => (
            <div key={index} style={{display: "grid", gap: 6}}>
              <Skeleton className="skeletonLabel" />
              <Skeleton className="skeletonInput" />
            </div>
          ))}
        </div>

        <div style={{display: "flex", gap: 10}}>
          <Skeleton className="skeletonButton" />
          <Skeleton className="skeletonButton" />
        </div>
      </div>
    </div>
  );
}
