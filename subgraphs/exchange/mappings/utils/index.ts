/* eslint-disable prefer-const */
import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts";
import { ERC20 } from "../../generated/Factory/ERC20";
import { Factory as FactoryContract } from "../../generated/templates/Pair/Factory";

export let ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export let FACTORY_ADDRESS = "0xaAbe38153b25f0d4b2bDa620f67059B3a45334e5";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

export let factoryContract = FactoryContract.bind(Address.fromString(FACTORY_ADDRESS));

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

export function isNullElaValue(value: string): boolean {
  return value == "0x0000000000000000000000000000000000000000000000000000000000000001";
}

export function fetchTokenSymbol(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress);

  let symbolValue = "unknown";
  let symbolResult = contract.try_symbol();
  if (!symbolResult.reverted) {
    symbolValue = symbolResult.value;
  } 
  return symbolValue;
}

export function fetchTokenName(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress);

  let nameValue = "unknown";
  let nameResult = contract.try_name();
  if (!nameResult.reverted) {
    nameValue = nameResult.value;
  }
  return nameValue;
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress);
  let decimalValue = null;
  let decimalResult = contract.try_decimals();
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value;
  }
  return BigInt.fromI32(decimalValue as i32);
}
