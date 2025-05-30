import { ReactNode, ReactElement } from "react"
import { InfoCard } from "./InfoCard"

export const Page = ({ children, info }: { children: ReactNode, info: string | string[] }): ReactElement => {
  return <div className="flex flex-col items-center gap-8 mt-8">
    <div className="w-192">{children}</div>
    <InfoCard text={info} />
  </div>
}
