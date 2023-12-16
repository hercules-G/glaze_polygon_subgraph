import { AutoGlazeStaking } from "../generated/schema";
import { Deposit, GlazeVault, Withdraw} from "../generated/GlazeVault/GlazeVault";
import { BigInt } from "@graphprotocol/graph-ts"

export function handleDeposit(event: Deposit): void {
    let glazeVaultContract = GlazeVault.bind(event.address);

    let entity = AutoGlazeStaking.load(event.params.sender.toHex())

    if (!entity) {
        entity = new AutoGlazeStaking(event.params.sender.toHex())

        entity.shareAmount = BigInt.fromI32(0)
        entity.stakeAmount = BigInt.fromI32(0)
    }

    entity.shareAmount = entity.shareAmount.plus(event.params.shares)
    entity.stakeAmount = entity.shareAmount.times(glazeVaultContract.getPricePerFullShare()).div(BigInt.fromI32(10).pow(18))

    entity.save()
}
  
export function handleWithdraw(event: Withdraw): void {
    let glazeVaultContract = GlazeVault.bind(event.address);
    let entity = AutoGlazeStaking.load(event.params.sender.toHex())

    if (!entity) {
        entity = new AutoGlazeStaking(event.params.sender.toHex())

        entity.shareAmount = BigInt.fromI32(0)
        entity.stakeAmount = BigInt.fromI32(0)
    }

    entity.shareAmount = entity.shareAmount.minus(event.params.shares)
    entity.stakeAmount = entity.shareAmount.times(glazeVaultContract.getPricePerFullShare()).div(BigInt.fromI32(10).pow(18))

    entity.save()
}
