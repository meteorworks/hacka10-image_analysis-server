/**
 * Score.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  id: {
    primaryKey: false
  },
  attributes: {
    cardId: {
      type: "Integer",
      unique: true,
      primaryKey: true
    }
  }
};

