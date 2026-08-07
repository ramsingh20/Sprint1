import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
        M
      </div>

      <div>
        <h2 className="font-semibold leading-none">
          <Link to="/" className="text-lg font-bold">
              <span style={{ color: '#5e9693' }}>Psycho</span>
              <span style={{ color: '#fff' }}>ogist</span>
            </Link>
        </h2>

        <p className="text-xs text-muted-foreground">
          Admin Panel
        </p>
      </div>
    </div>
  );
};

export default Logo;