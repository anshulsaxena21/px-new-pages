import React from "react";
import "../styles/iq-robot.css";

export default function IQRobot({ variant = "hero" }) {
  return (
    <div className={"iq-robot iq-robot-" + variant} aria-label="ParcelX IQ animated robot companion">
      {variant === "hero" && (
        <div className="iq-robot-bubble">
          <span className="iq-robot-bubble-tag"><i /> PARCELX IQ</span>
          <b>Hey, I’m IQ!</b>
          <p>Your shipping sidekick.</p>
        </div>
      )}
      <div className="iq-robot-visual">
        <svg viewBox="0 0 260 270" role="img" aria-label="Friendly ParcelX IQ robot mascot">
          <defs>
            <linearGradient id="iqRobotHead" x1="25" y1="35" x2="225" y2="185" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#fff"/>
              <stop offset=".55" stopColor="#f2f4fb"/>
              <stop offset="1" stopColor="#dfe4ef"/>
            </linearGradient>
            <linearGradient id="iqRobotFace" x1="60" y1="75" x2="205" y2="170" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#26344d"/>
              <stop offset="1" stopColor="#101b30"/>
            </linearGradient>
            <linearGradient id="iqRobotOrange" x1="75" y1="175" x2="188" y2="258" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ff9854"/>
              <stop offset=".5" stopColor="#ff741d"/>
              <stop offset="1" stopColor="#e94f00"/>
            </linearGradient>
            <linearGradient id="iqRobotArm" x1="25" y1="150" x2="75" y2="215" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#fff"/>
              <stop offset="1" stopColor="#dfe4ef"/>
            </linearGradient>
            <filter id="iqRobotShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="8"/>
            </filter>
          </defs>
          <ellipse className="iq-robot-ground-shadow" cx="130" cy="246" rx="72" ry="12" fill="#68749a" opacity=".17" filter="url(#iqRobotShadow)"/>
          <ellipse cx="130" cy="245" rx="52" ry="7" fill="#818aa4" opacity=".13"/>
          <path d="M55 112C28 133 28 170 47 192" fill="none" stroke="#b9c2d4" strokeWidth="2" strokeDasharray="4 7" strokeLinecap="round"/>
          <path d="M205 112C232 133 232 170 213 192" fill="none" stroke="#b9c2d4" strokeWidth="2" strokeDasharray="4 7" strokeLinecap="round"/>
          <g className="iq-robot-antenna">
            <path d="M130 42V25" stroke="#8a95aa" strokeWidth="7" strokeLinecap="round"/>
            <path d="M130 42V27" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="130" cy="18" r="12" fill="#ff7b2c" opacity=".16"/>
            <circle cx="130" cy="18" r="7" fill="#ff761f"/>
            <circle cx="128" cy="16" r="2.2" fill="#fff" opacity=".9"/>
          </g>
          <g className="iq-robot-head">
            <rect x="27" y="89" width="29" height="60" rx="13" fill="#d4dae6"/>
            <rect x="33" y="98" width="18" height="42" rx="9" fill="#f7f8fb"/>
            <rect x="204" y="89" width="29" height="60" rx="13" fill="#d4dae6"/>
            <rect x="209" y="98" width="18" height="42" rx="9" fill="#f7f8fb"/>
            <rect x="45" y="45" width="170" height="137" rx="49" fill="#dfe4ed"/>
            <rect x="48" y="39" width="164" height="137" rx="48" fill="url(#iqRobotHead)" stroke="#fff" strokeWidth="3"/>
            <path d="M75 55C96 41 166 41 188 56" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".9"/>
            <rect x="62" y="66" width="136" height="91" rx="31" fill="url(#iqRobotFace)" stroke="#aab4c7" strokeWidth="2"/>
            <path d="M78 80C91 69 166 69 181 81" fill="none" stroke="#fff" strokeWidth="2" opacity=".12"/>
            <g className="iq-robot-eyes">
              <ellipse cx="98" cy="108" rx="10" ry="13" fill="#86e4ef"/>
              <ellipse cx="162" cy="108" rx="10" ry="13" fill="#86e4ef"/>
              <ellipse cx="98" cy="110" rx="4" ry="7" fill="#fff"/>
              <ellipse cx="162" cy="110" rx="4" ry="7" fill="#fff"/>
            </g>
            <path d="M113 132Q130 146 147 132" fill="none" stroke="#ffad76" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="76" cy="132" r="5" fill="#ff8c68" opacity=".65"/>
            <circle cx="184" cy="132" r="5" fill="#ff8c68" opacity=".65"/>
            <path d="M72 70C88 56 169 53 188 71" fill="none" stroke="#fff" strokeWidth="2" opacity=".24"/>
          </g>
          <g className="iq-robot-body">
            <path d="M105 173V190H155V173" fill="none" stroke="#b9c3d4" strokeWidth="12" strokeLinecap="round"/>
            <path d="M74 197C79 179 96 171 116 169H144C164 171 181 179 186 197L195 230C198 242 189 249 178 249H82C71 249 62 242 65 230Z" fill="url(#iqRobotOrange)" stroke="#e85d11" strokeWidth="2"/>
            <path d="M88 190C101 181 159 181 172 190" fill="none" stroke="#ffc092" strokeWidth="4" strokeLinecap="round" opacity=".65"/>
            <rect x="100" y="194" width="60" height="39" rx="12" fill="#fff" opacity=".96"/>
            <rect x="107" y="201" width="46" height="25" rx="7" fill="#202d46"/>
            <path d="M114 219V211M123 219V207M132 219V213" stroke="#78d6e0" strokeWidth="3" strokeLinecap="round"/>
            <path d="M141 215L147 209" stroke="#ff9c5d" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="180" cy="222" r="4" fill="#b9f0d8"/>
            <circle cx="130" cy="242" r="3" fill="#ffd4b8"/>
          </g>
          <g className="iq-robot-arms">
            <path d="M73 191C60 188 51 193 47 206L41 222C39 230 44 237 52 238C59 239 64 234 66 228L76 208" fill="url(#iqRobotArm)" stroke="#c9d1df" strokeWidth="2"/>
            <path d="M187 191C200 188 209 193 213 206L219 222C221 230 216 237 208 238C201 239 196 234 194 228L184 208" fill="url(#iqRobotArm)" stroke="#c9d1df" strokeWidth="2"/>
            <circle cx="49" cy="236" r="7" fill="#ff8a43"/>
            <circle cx="211" cy="236" r="7" fill="#ff8a43"/>
          </g>
        </svg>
      </div>
      {variant === "inline" && (
        <div className="iq-robot-inline-copy">
          <span><i /> YOUR IQ COMPANION</span>
          <b>Meet your shipping sidekick.</b>
          <p>One smarter view of your shipping world.</p>
        </div>
      )}
      <span className="iq-robot-spark iq-robot-spark-one">✦</span>
      <span className="iq-robot-spark iq-robot-spark-two">✧</span>
      <span className="iq-robot-spark iq-robot-spark-three">✦</span>
    </div>
  );
}
