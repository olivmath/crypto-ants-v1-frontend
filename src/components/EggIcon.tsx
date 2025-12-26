export function EggIcon() {
    return (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            style={{ width: "100%", height: "100%" }}
        >
            <defs>
                <radialGradient id="egg-gradient" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#fff8e7" />
                    <stop offset="100%" stopColor="#f4d03f" />
                </radialGradient>
            </defs>
            <ellipse cx="50" cy="50" rx="35" ry="45" fill="url(#egg-gradient)" stroke="#d4ac0d" strokeWidth="2" />
        </svg>
    );
}