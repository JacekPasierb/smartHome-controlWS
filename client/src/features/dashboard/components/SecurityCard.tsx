import {
  DoorOpen,
  DoorClosed,
  Shield,
  ShieldAlert,
  Wifi,
  WifiOff,
} from "lucide-react";
import type {Alarm, Door} from "../../../types/home";

type SecurityCardProps = {
  door: Door;
  alarm: Alarm;
};

export function SecurityCard({door, alarm}: SecurityCardProps) {
  return (
    <div className="securityGrid">
      <div className="card securityCard">
        <div className="securityCardTop">
          <div>
            <strong className="securityTitle">{door.name}</strong>
            <div className="securityMeta">
              {door.online ? (
                <>
                  <Wifi size={13} />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <WifiOff size={13} />
                  <span>Offline</span>
                </>
              )}
            </div>
          </div>

          <div
            className={`securityStateBadge ${
              door.state === "open" ? "isOpen" : "isClosed"
            }`}
          >
            {door.state === "open" ? (
              <DoorOpen size={16} />
            ) : (
              <DoorClosed size={16} />
            )}
            <span>{door.state === "open" ? "Open" : "Closed"}</span>
          </div>
        </div>

        <div className="securityLastSeen">
          Last seen: {new Date(door.lastSeen).toLocaleTimeString()}
        </div>
      </div>

      <div
        className={`card securityCard ${
          alarm.triggered ? "securityCardCritical" : ""
        }`}
      >
        <div className="securityCardTop">
          <div>
            <strong className="securityTitle">Alarm</strong>
            <div className="securityMeta">
              {alarm.armed ? (
                <>
                  <Shield size={13} />
                  <span>Armed</span>
                </>
              ) : (
                <>
                  <Shield size={13} />
                  <span>Disarmed</span>
                </>
              )}
            </div>
          </div>

          <div
            className={`securityStateBadge ${
              alarm.triggered
                ? "isCritical"
                : alarm.armed
                ? "isArmed"
                : "isDisarmed"
            }`}
          >
            {alarm.triggered ? <ShieldAlert size={16} /> : <Shield size={16} />}
            <span>
              {alarm.triggered ? "Triggered" : alarm.armed ? "Armed" : "Safe"}
            </span>
          </div>
        </div>

        <div className="securityStatusText">
          {alarm.triggered
            ? "Intrusion detected. Check the door state and security timeline."
            : alarm.armed
            ? "System is armed and monitoring entry points."
            : "System is currently disarmed."}
        </div>
      </div>
    </div>
  );
}
