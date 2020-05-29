// Define message model with validation
const message = (sequelize, DataTypes) => {
  const Message = sequelize.define("message", {
    text: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Text required for messages.",
        },
        len: {
          args: [5, 200],
          msg: "Message length of 5-200 required.",
        },
      },
    },
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User);
  };

  return Message;
};

export default message;
