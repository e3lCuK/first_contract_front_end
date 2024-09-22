import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, Cell } from "@ton/ton";
import { toNano } from "@ton/ton";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();

  const [balance, setBalance] = useState<null | number>(0);

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;

    // Используем уже существующий контракт
    const parsedAddress = Address.parse("EQCzea3ilD6VxygHxiSglbcsGPviAfX8J6XmvFbfW_FVSRsY");

    // Загружаем контракт по его адресу (но не создаём новый)
    const contract = new MainContract(parsedAddress, { code: await fetchContractCode(), data: new Cell() });

    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      const { number } = await mainContract.getBalance();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
      setBalance(number);
      await sleep(5000);
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: balance,
    ...contractData,
    sendIncrement: () => {
      return mainContract?.sendIncrement(sender, toNano(0.05), 3);
    },
    sendDeposit: async () => {
      return mainContract?.sendDeposit(sender,toNano(0.5));
    },
    sendWithdrawaRequest: async () => {
      return mainContract?.sendWithdrawalRequest(sender, toNano(0.05), toNano(0.6))
    }
  };
}

// Функция для загрузки кода контракта (Cell)
async function fetchContractCode(): Promise<Cell> {
  // Предположим, что код контракта ты загружаешь из какого-то источника
  // Например, из файла или запроса к серверу
  // Возвращаем Cell с кодом контракта
  return new Cell(); // здесь должен быть правильный код
}
