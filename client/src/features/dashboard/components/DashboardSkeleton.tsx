import {Skeleton} from "../../../components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <div className="container">
      <div className="header">
        <div>
          <Skeleton className="skeletonTitle" />
          <Skeleton className="skeletonText" />
        </div>

        <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
          <Skeleton className="skeletonButton" />
          <Skeleton className="skeletonButton" />
          <Skeleton className="skeletonSelect" />
          <Skeleton className="skeletonButton" />
          <Skeleton className="skeletonBadge" />
        </div>
      </div>

      <Skeleton className="skeletonBanner" />

      <div className="grid">
        <div className="panel">
          <Skeleton className="skeletonPanelTitle" />

          <div className="cardsGrid">
            {Array.from({length: 5}).map((_, index) => (
              <div key={index} className="card">
                <Skeleton className="skeletonSensorTop" />
                <Skeleton className="skeletonSensorValue" />
                <Skeleton className="skeletonSensorMeta" />
              </div>
            ))}
          </div>
        </div>

        <div style={{display: "grid", gap: 16}}>
          <div className="panel">
            <Skeleton className="skeletonPanelTitle" />
            <div style={{display: "flex", gap: 10, marginBottom: 12}}>
              <Skeleton className="skeletonChip" />
              <Skeleton className="skeletonChip" />
              <Skeleton className="skeletonChip" />
            </div>
            <div className="card">
              <Skeleton className="skeletonChart" />
            </div>
          </div>

          <div className="panel">
            <Skeleton className="skeletonPanelTitle" />
            <div style={{display: "flex", gap: 10, marginBottom: 12}}>
              <Skeleton className="skeletonChip" />
              <Skeleton className="skeletonChip" />
            </div>
            <div style={{display: "grid", gap: 12}}>
              <div className="card">
                <Skeleton className="skeletonSecurityTop" />
                <Skeleton className="skeletonText" />
              </div>
              <div className="card">
                <Skeleton className="skeletonSecurityTop" />
                <Skeleton className="skeletonText" />
              </div>
            </div>
          </div>

          <div className="panel">
            <Skeleton className="skeletonPanelTitle" />
            <div style={{display: "grid", gap: 10}}>
              <div className="card">
                <Skeleton className="skeletonAlertTop" />
                <Skeleton className="skeletonText" />
              </div>
              <div className="card">
                <Skeleton className="skeletonAlertTop" />
                <Skeleton className="skeletonText" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
