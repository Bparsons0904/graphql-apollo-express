"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const message = (sequelize, DataTypes) => {
  const Message = sequelize.define("message", {
    text: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Text required for messages."
        },
        len: {
          args: [5, 200],
          msg: "Message length of 5-200 required."
        }
      }
    }
  });

  Message.associate = models => {
    Message.belongsTo(models.User);
  };

  return Message;
};

var _default = message;
exports.default = _default;
//# sourceMappingURL=message.js.map