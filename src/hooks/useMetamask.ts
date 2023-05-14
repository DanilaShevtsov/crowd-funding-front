import  { metamask, hooks } from '../lib/metamask';


export function useMetamask() {

  function connectMetamask() {
    metamask.activate();
  }

  function disconnectMetamask() {
    // metamask.provider.disconnect();
    return true;
  }

  async function signMessage(message: string, account: string): Promise<string> {
    const signature: string = await metamask.provider?.request({ method: 'personal_sign', params: [message, account] }) as string;
    return signature;
  }

  async function getBalance(account: string): Promise<string> {
    const balance: string = await metamask.provider?.request({ method: 'eth_getBalance', params: [account] }) as string;
    return balance;
  }

  async function sendValue(from: string, to: string, value: number): Promise<string> {
    const gasPrice = await metamask.provider?.request({ method: 'eth_gasPrice' });
    console.log(to);
    const request = await metamask.provider?.request(
      { method: 'eth_sendTransaction',
        params: [{
          from: from,
          to: to, 
          gas: (21000).toString(16),
          gasPrice: (Number(gasPrice) * 1).toString(),
          value: value.toString(16), 
          data: "0x",
        }]
      }
    );

    return request as string
  }
  
  return { connectMetamask, disconnectMetamask, hooks, metamask, signMessage, getBalance, sendValue };
}