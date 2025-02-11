import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface BackgroundProps {
  id?: string;
  src: string;
}

export default function Background({ id, src }: BackgroundProps) {
  const coverURL = id
    ? siteConfig.suicaodex.apiURL + "/covers/" + id + "/" + src + ".256.jpg"
    : src;

  return (
    <>
      {/* <div
        className="fixed top-0 left-0 z-[-2] w-full h-[640px] blur-xl bg-background"
        style={{
          backgroundImage: `url('${coverURL}')`,
          backgroundPosition: "center 35%",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div> */}

      {/* <div className="absolute top-[17.5rem] left-0 z-[-1] w-full min-h-screen bg-background"></div> */}

      <div className="absolute h-[17.5rem] z-[-2] w-auto left-0 right-0 top-0 block">
        <div
          className={cn(
            "absolute h-[17.5rem] w-full",
            "transition-[width] duration-150 ease-in-out",
            "bg-no-repeat bg-cover bg-center-25"
          )}
          style={{ backgroundImage: `url('${coverURL}')` }}
        ></div>
        <div
          className={cn(
            "absolute h-[17.5rem] w-auto inset-0 pointer-events-none",
            "backdrop-blur-none md:backdrop-blur-sm",
            "bg-gradient-to-r from-black/65 to-transparent"
          )}
        ></div>

        <div
          className={cn(
            "md:hidden",
            "absolute h-[17.5rem] w-auto inset-0 pointer-events-none backdrop-blur-[2px]"
          )}
          style={{
            background:
              "linear-gradient(to bottom, hsl(var(--background) / .6) 0%, hsl(var(--background)) 100%)",
          }}
        ></div>
      </div>
    </>
  );
}
