import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";

function App() {
  const {
    contract_address,
    counter_value,
 //   recent_sender,
 //   owner_address,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawaRequest,
  } = useMainContract();

  const { connected } = useTonConnect()

  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className='Card'>
          <b>Наш контракт Адрес</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
          <b>Наш контракт Баланс</b>
          {contract_balance && (
          <div className='Hint'>{contract_balance}</div>
        )}
        </div>

        <div className='Card'>
          <b>Значение счетчика</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>

        {connected && (
          <a
            onClick={() => {
              sendIncrement();
            }}
          >
            Увеличить на 5
          </a>
        )}
        <br/>
        {connected && (
          <a
            onClick={() => {
              sendDeposit();
            }}
          >
            Внести на наш счет сумму в размере 0.5 ТОН
          </a>
        )}
        <br/>
        {connected && (
          <a
            onClick={() => {
              sendWithdrawaRequest();
            }}
          >
            Вывод 0.6 ТОН
          </a>
        )}

      </div>
    </div>
  );
}

export default App;