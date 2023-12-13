# Glaze Finance Subgraph

TheGraph exposes a GraphQL endpoint to query the events and entities within the Elastos Smart Chain and Glaze Finance ecosystem.

Currently, there are multiple subgraphs, but additional subgraphs can be added to this repository, following the current architecture.

## Subgraphs

1. **[Blocks]**: Tracks all blocks on the Elastos Smart Chain (ESC).

2. **[Exchange]**: Tracks all Glaze Exchange data with price, volume, liquidity, ...

2. **[Glaze-Staking]**: Tracks all manual and auto Glaze stake deposits and withdraws 

4. **[Pairs]**: Tracks all Glaze Pairs and Tokens.

5. **[SmartChef]**: Tracks all Glaze SmartChef (a.k.a. Sugar Pools) with tokens and rewards.

6. **[Timelock])**: Tracks all Glaze Timelock queued, executed, and cancelled transactions.

## Dependencies

- [Graph CLI](https://github.com/graphprotocol/graph-cli)
    - Required to generate and build local GraphQL dependencies.

```shell
yarn global add @graphprotocol/graph-cli
```

## Deployment

For any of the subgraph: `blocks` as `[subgraph]`

1. Run the `cd subgraphs/[subgraph]` command to move to the subgraph directory.

2. Run the `yarn codegen` command to prepare the TypeScript sources for the GraphQL (generated/*).

3. Run the `yarn build` command to build the subgraph, and check compilation errors before deploying.

4. Run `graph auth --product hosted-service '<ACCESS_TOKEN>'`

5. Deploy via `yarn deploy`.
