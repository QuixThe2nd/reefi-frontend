import { memo, type ReactElement } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

import { AmountInput } from "../components/AmountInput";
import { Page } from "../components/Page";

const UnlockPageComponent = (): ReactElement => {
  const { balances, amounts, actions } = useGlobalContext();
  const handleSetSend = amounts.setSend;
  return <Page info={["yMGP can be unlocked instantly. Unlocked yMGP earns the underlying rMGP yield, but forfeits the additional yield."]}>
    <AmountInput balance={balances.yMGP[0]} label="Get yMGP" onChange={handleSetSend} token={{ bgColor: "bg-green-600", color: "bg-green-400", symbol: "yMGP" }} value={amounts.send} />
    <button className="h-min w-full rounded-lg bg-green-600 py-2 transition-colors hover:bg-green-700" onClick={actions.unlockYMGP} type="submit">Unlock yMGP</button>
  </Page>;
};
export const UnlockPage = memo(UnlockPageComponent);
