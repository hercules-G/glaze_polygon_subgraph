/* eslint-disable prefer-const */
import { BigDecimal, Address } from "@graphprotocol/graph-ts/index";
import { Pair, Token, Bundle } from "../generated/schema";
import { ZERO_BD, factoryContract, ADDRESS_ZERO, ONE_BD } from "./utils";

let WPLS_ADDRESS = "0xA1077a294dDE1B09bB078844df40758a5D0f9a27";
let USDC_WPLS_PAIR = "0xf392a5dFbc89ED470D8870B5A41519948BB64938"; 

export function getElaPriceInUSD(): BigDecimal {
  // fetch eth prices for each stablecoin
  let usdcPair = Pair.load(USDC_WPLS_PAIR); // usdc is token1
  
  if (usdcPair !== null) {
    return usdcPair.token1Price;
  } else {
    return ZERO_BD;
  }
}

// token where amounts should contribute to tracked volume and liquidity
let WHITELIST: string[] = [
  "0xA1077a294dDE1B09bB078844df40758a5D0f9a27", // WPLS
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // ETH
  "0x15d38573d2feeb82e7ad5187ab8c1d52810b1f07", // USDC
  "0x4C085dE8510D9fad1166b805603fd91E550bb5CE", // GLAZE HUSD HT FilDA

];

// minimum liquidity for price to get tracked
let MINIMUM_LIQUIDITY_THRESHOLD_ELA = BigDecimal.fromString("10");

/**
 * Search through graph to find derived ELA per token.
 * @todo update to be derived ELA (add stablecoin estimates)
 **/
export function findElaPerToken(token: Token): BigDecimal {
  if (token.id == WPLS_ADDRESS) {
    return ONE_BD;
  }
  // loop through whitelist and check if paired with any
  for (let i = 0; i < WHITELIST.length; ++i) {
    let pairAddress = factoryContract.getPair(Address.fromString(token.id), Address.fromString(WHITELIST[i]));
    if (pairAddress.toHex() != ADDRESS_ZERO) {
      let pair = Pair.load(pairAddress.toHex());
      if (pair.token0 == token.id && pair.reserveELA.gt(MINIMUM_LIQUIDITY_THRESHOLD_ELA)) {
        let token1 = Token.load(pair.token1);
        return pair.token1Price.times(token1.derivedELA as BigDecimal); // return token1 per our token * ELA per token 1
      }
      if (pair.token1 == token.id && pair.reserveELA.gt(MINIMUM_LIQUIDITY_THRESHOLD_ELA)) {
        let token0 = Token.load(pair.token0);
        return pair.token0Price.times(token0.derivedELA as BigDecimal); // return token0 per our token * ELA per token 0
      }
    }
  }
  return ZERO_BD; // nothing was found return 0
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD.
 * If both are, return average of two amounts
 * If neither is, return 0
 */
export function getTrackedVolumeUSD(
  bundle: Bundle,
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let price0 = token0.derivedELA.times(bundle.elaPrice);
  let price1 = token1.derivedELA.times(bundle.elaPrice);

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1)).div(BigDecimal.fromString("2"));
  }

  // take full value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0);
  }

  // take full value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1);
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD;
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedLiquidityUSD(
  bundle: Bundle,
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let price0 = token0.derivedELA.times(bundle.elaPrice);
  let price1 = token1.derivedELA.times(bundle.elaPrice);

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1));
  }

  // take double value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).times(BigDecimal.fromString("2"));
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1).times(BigDecimal.fromString("2"));
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD;
}
