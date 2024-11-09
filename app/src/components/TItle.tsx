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
          This embedding plot was built with RezNet50 and Three.js using
          information from{" "}
          <a
            href={
              "https://www.metmuseum.org/about-the-met/policies-and-documents/open-access"
            }
            target={"_blank"}
            rel={"noopener noreferrer"}
            className={"underline text-white"}
          >
            The Metropolitan Museum of Art's Open Access API
          </a>{" "}
          as of November 3, 2024.
        </p>

        <p
          className={
            "text-sm border-t border-white/10 mt-2 text-neutral-400 pt-2 flex items-center gap-2"
          }
        >
          <span>
            Created by{" "}
            <a
              href={"https://zachkrall.com"}
              target={"_blank"}
              rel={"noopener noreferrer"}
              className={"underline text-white"}
            >
              Zach Krall
            </a>
          </span>

          <span className={"ml-auto"}>
            <a
              href={"https://github.com/zachkrall/met-museum-medieval"}
              target={"_blank"}
              rel={"noopener noreferrer"}
              className={"text-white opacity-20 hover:opacity-100"}
            >
              <svg viewBox="0 0 24 24" className={"size-4"} aria-hidden={true}>
                <path
                  d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span className={"sr-only"}>GitHub</span>
            </a>
          </span>
        </p>
      </div>
    </div>
  );
}
