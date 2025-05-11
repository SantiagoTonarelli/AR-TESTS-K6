import { Model, DataTypes, Optional } from 'sequelize';

import sequelize from '../config/database';

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the item.
 *           readOnly: true
 *         name:
 *           type: string
 *           description: The name of the item.
 *         description:
 *           type: string
 *           description: A description of the item.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the item was created.
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the item was last updated.
 *           readOnly: true
 *       example:
 *         id: 1
 *         name: "Sample Item"
 *         description: "This is a sample item."
 *         createdAt: "2023-10-27T07:49:25.000Z"
 *         updatedAt: "2023-10-27T07:49:25.000Z"
 *     CreateItemDTO:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the item.
 *         description:
 *           type: string
 *           nullable: true
 *           description: A description of the item.
 *       example:
 *         name: "New Item"
 *         description: "Description for the new item."
 */
interface ItemAttributes {
  id: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define which attributes are optional during creation
interface ItemCreationAttributes extends Optional<ItemAttributes, 'id'> {}

class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'items',
    underscored: true,
  }
);

// Define a type for item creation that matches the model
export type CreateItemDTO = Omit<ItemAttributes, 'id' | 'createdAt' | 'updatedAt'>;
export { Item };
