Moralis.Cloud.afterSave("ItemListed", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info("Looking for confirmed tx");

  if (confirmed) {
    logger.info("Found Item");
    const ActiveItem = Moralis.Object.extend("ActiveItem");

    const query = new Moralis.Query(ActiveItem);
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("seller", request.object.get("seller"));
    logger.info(`Marketplace | Query: ${query}`);
    const alreadyListedItem = await query.first();
    if (alreadyListedItem) {
      logger.info(`Deleting already listed ${request.object.get("objectId")}`);
      await alreadyListedItem.destroy();
    }

    const activeItem = new ActiveItem();
    activeItem.set("marketplaceAddress", request.object.get("address"));
    activeItem.set("nftAddress", request.object.get("nftAddress"));
    activeItem.set("price", request.object.get("price"));
    activeItem.set("tokenId", request.object.get("tokenId"));
    activeItem.set("seller", request.object.get("seller"));
    logger.info(
      `Adding Address ${request.object.get(
        "address"
      )} TokenId: ${request.object.get("tokenId")}`
    );
    logger.info("Saving...");
    await activeItem.save();
  }
});

Moralis.Cloud.afterSave("ItemCanceled", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info(`Marketplace | Object ${request.object}`);

  if (confirmed) {
    logger.info("Confirmed...");
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const query = new Moralis.Query(ActiveItem);
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    logger.info(`Marketplace | Query: ${JSON.stringify(query)}}`);
    const canceledItem = await query.first();
    logger.info(`Marketplace | CanceledItem: ${JSON.stringify(canceledItem)}`);
    if (canceledItem) {
      logger.info(
        `Deleting ${request.object.get(
          "tokenId"
        )} at address ${request.object.get("address")} since it was canceled`
      );
    }
    await canceledItem.destroy();
  } else {
    logger.info(`No item found with address ${request.object.get("address")}`);
  }
});

Moralis.Cloud.afterSave("ItemBought", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info(`Marketplace | Object ${request.object}`);
  if (confirmed) {
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const query = new Moralis.Query(ActiveItem);
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    logger.info(`Marketplace | Query: ${JSON.stringify(query)}}`);
    const boughtItem = await query.first();
    if (boughtItem) {
      logger.info(
        `Deleting ${request.object.get(
          "tokenId"
        )} at address ${request.object.get("address")} since it was canceled`
      );
      await boughtItem.destroy();
      logger.info(
        `Deleted Item with Token ID ${request.object.get("tokenId")}`
      );
    } else {
      logger.info(
        `No item found with address ${request.object.get("address")}`
      );
    }
  }
});
