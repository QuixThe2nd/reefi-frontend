import { InfoCard } from "./InfoCard";
import { ReactElement, ReactNode } from "react";

export const Page = ({ children, info, noTopMargin = false }: Readonly<{ children: ReactNode; info: string | string[]; noTopMargin?: boolean }>): ReactElement => <div className={`${noTopMargin ? "" : "mt-8 lg:mt-12 xl:mt-16 "}flex flex-col items-center w-full`}>
  <div className="w-full max-w-4xl">{children}</div>
  <InfoCard text={info} />
</div>;
