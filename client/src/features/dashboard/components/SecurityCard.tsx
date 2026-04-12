import type {Alarm, Door} from "../../../types/home";

type SecurityCardProps = {
  door: Door;
  alarm: Alarm;
};

export function SecurityCard({door, alarm}: SecurityCardProps) {
  return (
    <div style={{display: "grid", gap: 12}}>
      <div className="card">
        <div
          style={{display: "flex", justifyContent: "space-between", gap: 12}}
        >
          <strong>{door.name}</strong>
          <span>{door.online ? "🟢 online" : "🔴 offline"}</span>
        </div>

        <div style={{marginTop: 6, fontSize: 22, fontWeight: 700}}>
          {door.state === "open" ? "🚪 Open" : "🔒 Closed"}
        </div>

        <div style={{fontSize: 12, opacity: 0.7, marginTop: 6}}>
          lastSeen: {new Date(door.lastSeen).toLocaleTimeString()}
        </div>
      </div>

      <div className="card">
        <div
          style={{display: "flex", justifyContent: "space-between", gap: 12}}
        >
          <strong>Alarm</strong>
          <span>{alarm.armed ? "🛡️ armed" : "🔴 disarmed"}</span>
        </div>

        {alarm.triggered && (
          <div style={{color: "red", marginTop: 8, fontWeight: 700}}>
            🚨 Alarm triggered
          </div>
        )}
      </div>
    </div>
  );
}
