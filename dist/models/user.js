"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Password hash crypto
const user = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Username required."
        },
        len: {
          args: [5, 20],
          msg: "Username length of 5-20 required."
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42]
      }
    },
    role: {
      type: DataTypes.STRING
    }
  }); // Delete all user messages

  User.associate = models => {
    User.hasMany(models.Message, {
      onDelete: "CASCADE"
    });
  }; // Define user by login value


  User.findByLogin = async login => {
    // Attempt to find user based on username
    let user = await User.findOne({
      where: {
        username: login
      }
    }); // If user not found my username, find by email

    if (!user) {
      user = await User.findOne({
        where: {
          email: login
        }
      });
    }

    return user;
  }; // Create hash of inputted password


  User.beforeCreate(async user => {
    user.password = await user.generatePasswordHash();
  }); // Generate password hash using bcrypt

  User.prototype.generatePasswordHash = async function () {
    const saltRounds = 10;
    return await _bcrypt.default.hash(this.password, saltRounds);
  }; // Validate stored user password with user input


  User.prototype.validatePassword = async function (password) {
    return await _bcrypt.default.compare(password, this.password);
  };

  return User;
};

var _default = user;
exports.default = _default;
//# sourceMappingURL=user.js.map