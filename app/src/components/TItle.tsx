import { MetLogo } from "../assets/met";

export function Title() {
  return (
    <div className={"fixed top-0 left-0 p-4 w-fit pointer-events-none"}>
      <div
        className={
          "bg-black/90 backdrop-blur-sm w-full max-w-sm p-4 rounded-lg border border-white/10 pointer-events-auto"
        }
      >
        <h1
          className={
            "font-sans border-b border-white/10 w-full pb-2 flex items-baseline gap-4"
          }
        >
          <span>
            <MetLogo className={"size-8"} />
          </span>
          <span className={"-translate-y-[1px] font-normal"}>
            The Medieval Department
          </span>
        </h1>
        <p className={"text-sm pt-2 text-neutral-400"}>
          This embedding plot was built with RezNet50 and Three.js using information from <a
                href={"https://www.metmuseum.org/about-the-met/policies-and-documents/open-access"}
                target={"_blank"}
                rel={"noopener noreferrer"}
                className={"underline text-white"}
            >The Metropolitan Museum of Art's Open Access API</a> as of November 3, 2024.
        </p>

        <p className={'text-sm border-t border-white/10 mt-2 text-neutral-400 pt-2'}>
          Created by <a href={"https://zachkrall.com"} target={"_blank"} rel={"noopener noreferrer"} className={"underline text-white"}>Zach Krall</a>
        </p>
      </div>
    </div>
  );
}
