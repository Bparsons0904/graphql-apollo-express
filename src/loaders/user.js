// Batch users for query
export const batchUsers = async (keys, models) => {
  // Get all users which match
  const users = await models.User.findAll({
    where: {
      id: {
        $in: keys,
      },
    },
  });

  return keys.map((key) => users.find((user) => user.id === key));
};
